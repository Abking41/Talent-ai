import type {
  JobDescription,
  ResumeCandidate,
  MatchAnalysis,
  MatchedSkill,
  ClaimVerificationResult,
  ContradictionAlert
} from '../types/index.ts';

// Tech release dates database for anachronism detection
const TECH_RELEASE_YEARS: { [key: string]: number } = {
  vllm: 2023,
  chatgpt: 2022,
  tensorrtllm: 2023,
  'tensorrt-llm': 2023,
  flashattention: 2022,
  deepseek: 2023,
  llama: 2023,
  llama2: 2023,
  llama3: 2024,
  mistral: 2023,
  langchain: 2022,
  triton: 2021,
  react: 2013,
  kubernetes: 2014,
  docker: 2013,
  pytorch: 2016,
  tensorflow: 2015
};

// Common synonym / semantic equivalents dictionary
const SEMANTIC_EQUIVALENTS: { [key: string]: string[] } = {
  'distributed training': ['fsdp', 'deepspeed', 'megatron', 'horovod', 'multi-gpu', 'distributed data parallel', 'ddp', 'slurm'],
  'vllm': ['tensorrt-llm', 'tgi', 'text generation inference', 'triton', 'deepsparse', 'speculative decoding'],
  'model optimization': ['quantization', 'awq', 'gptq', 'fp8', 'pruning', 'distillation', 'flashattention', 'kernel optimization'],
  'cuda': ['triton', 'gpu programming', 'c++', 'nvml', 'kernel profiling', 'ptx'],
  'microservices architecture': ['distributed systems', 'rest apis', 'grpc', 'event-driven', 'soa', 'service oriented'],
  'aws': ['gcp', 'azure', 'cloud computing', 'cloud architecture'],
  'statistical modeling': ['bayesian', 'regression', 'hypothesis testing', 'causal inference', 'econometrics'],
  'a/b testing': ['experimentation', 'hypothesis testing', 'split testing', 'multi-arm bandit', 'cuped']
};

export function cleanMessyText(raw: string): { cleaned: string; issues: string[]; qualityScore: number } {
  const issues: string[] = [];
  let cleaned = raw;

  // Detect and fix OCR substitutions like PyT0rch -> PyTorch, Kubernet3s -> Kubernetes
  if (/PyT[0o]rch/i.test(cleaned)) {
    issues.push('OCR character replacement in keywords (e.g. PyT0rch)');
    cleaned = cleaned.replace(/PyT0rch/gi, 'PyTorch');
  }
  if (/Kubernet[3e]s/i.test(cleaned)) {
    issues.push('OCR character replacement (Kubernet3s)');
    cleaned = cleaned.replace(/Kubernet3s/gi, 'Kubernetes');
  }
  if (/[?]{2,}/.test(cleaned)) {
    issues.push('Malformed unicode characters / question mark glyphs in place of bullets');
    cleaned = cleaned.replace(/[?]{2,}/g, ' • ');
  }
  if (/\[dot\]|\[at\]/i.test(cleaned)) {
    issues.push('Obfuscated email address extracted and normalized');
    cleaned = cleaned.replace(/\s*\[at\]\s*/gi, '@').replace(/\s*\[dot\]\s*/gi, '.');
  }
  if (/lnfrastructure/i.test(cleaned)) {
    cleaned = cleaned.replace(/lnfrastructure/gi, 'Infrastructure');
  }

  // Calculate quality score
  let qualityScore = 100;
  if (issues.length > 0) {
    qualityScore -= Math.min(issues.length * 9, 30);
  }
  if (raw.length < 150) {
    qualityScore -= 25;
    issues.push('Unusually brief resume text (< 150 characters)');
  }

  return { cleaned, issues, qualityScore: Math.max(qualityScore, 40) };
}

export function verifyClaimsAndContradictions(
  candidate: ResumeCandidate,
  job: JobDescription
): ClaimVerificationResult {
  const contradictions: ContradictionAlert[] = [];
  let authenticityScore = 100;
  const unsupportedSkillsList: string[] = [];

  // 1. Detect Keyword Stuffing (Skills in skills list that NEVER appear in experience or projects)
  const experienceText = candidate.experience
    .map(e => `${e.company} ${e.title} ${e.bullets.join(' ')} ${e.techStack.join(' ')}`)
    .join(' ')
    .toLowerCase();

  const projectsText = candidate.projects
    .map(p => `${p.name} ${p.description} ${p.techStack.join(' ')}`)
    .join(' ')
    .toLowerCase();

  const fullContextText = `${experienceText} ${projectsText}`;

  for (const skill of candidate.allExtractedSkills) {
    const sLower = skill.toLowerCase();
    // Ignore ubiquitous simple words
    if (['python', 'sql', 'git', 'linux'].includes(sLower)) continue;

    const regex = new RegExp(`\\b${escapeRegExp(sLower)}\\b`, 'i');
    const hasEvidence = regex.test(fullContextText);

    if (!hasEvidence) {
      unsupportedSkillsList.push(skill);
    }
  }

  const keywordStuffingRatio = candidate.allExtractedSkills.length > 0
    ? unsupportedSkillsList.length / candidate.allExtractedSkills.length
    : 0;

  const keywordStuffingDetected = unsupportedSkillsList.length >= 6 || keywordStuffingRatio >= 0.45;

  if (keywordStuffingDetected) {
    const penalty = Math.min(Math.round(keywordStuffingRatio * 40) + 15, 45);
    authenticityScore -= penalty;
    contradictions.push({
      type: 'KEYWORD_STUFFING',
      severity: keywordStuffingRatio > 0.6 ? 'high' : 'medium',
      claim: `Candidate lists ${candidate.allExtractedSkills.length} skills in skill section`,
      evidence: `${unsupportedSkillsList.length} skills (${unsupportedSkillsList.slice(0, 5).join(', ')}${unsupportedSkillsList.length > 5 ? '...' : ''}) have zero supporting context or mentions in work experience or projects.`,
      explanation: 'Keyword Stuffing Detected: The candidate appears to pad their resume with high-value buzzwords to game ATS filters without demonstrating actual hands-on application in role descriptions.'
    });
  }

  // 2. Timeline Contradiction Analysis
  // Check graduation dates vs claimed years of experience
  const graduationYears = candidate.education
    .map(e => Number(e.graduationYear))
    .filter(y => !isNaN(y) && y > 1980 && y <= 2030);

  const currentYear = new Date().getFullYear(); // e.g. 2026

  if (graduationYears.length > 0) {
    const latestGradYear = Math.max(...graduationYears);
    const earliestGradYear = Math.min(...graduationYears);
    const yearsSinceLatestGrad = Math.max(0, currentYear - latestGradYear);
    const yearsSinceEarliestGrad = Math.max(0, currentYear - earliestGradYear);

    // If candidate graduated recently (e.g. 2023 or 2024), but claims 6+ years of senior industry experience
    if (yearsSinceLatestGrad <= 3 && candidate.totalYearsExperience > yearsSinceLatestGrad + 3) {
      authenticityScore -= 35;
      contradictions.push({
        type: 'TIMELINE_CONFLICT',
        severity: 'high',
        claim: `Claims ${candidate.totalYearsExperience} years of experience (${candidate.currentTitle})`,
        evidence: `Graduated in ${latestGradYear} (${candidate.education[0]?.degree || 'Degree'} from ${candidate.education[0]?.institution || 'University'}). Only ${yearsSinceLatestGrad} year(s) post-graduation elapsed.`,
        explanation: 'Chronological Impossibility: Candidate claims senior-level multi-year tenure that significantly predates their formal degree completion without verifiable prior apprenticeship.'
      });
    }

    // Check individual experience entries starting way before graduation
    for (const exp of candidate.experience) {
      if (exp.startYear && exp.startYear < earliestGradYear - 2) {
        // Exclude part-time student jobs
        const titleLower = exp.title.toLowerCase();
        if (titleLower.includes('principal') || titleLower.includes('director') || titleLower.includes('senior') || titleLower.includes('lead')) {
          authenticityScore -= 25;
          contradictions.push({
            type: 'INFLATED_TITLE',
            severity: 'high',
            claim: `Held role '${exp.title}' at ${exp.company} starting in ${exp.startYear}`,
            evidence: `Candidate did not graduate until ${earliestGradYear} (${earliestGradYear - exp.startYear} years later).`,
            explanation: 'Executive / Senior Title Inconsistency: It is highly improbable to hold a Principal or Director position years before completing undergraduate education.'
          });
          break;
        }
      }
    }
  }

  // 3. Anachronism Detection (Claiming a technology before it was invented!)
  for (const exp of candidate.experience) {
    if (exp.startYear) {
      const expText = `${exp.title} ${exp.bullets.join(' ')} ${exp.techStack.join(' ')}`.toLowerCase();
      for (const [tech, releaseYear] of Object.entries(TECH_RELEASE_YEARS)) {
        if (exp.startYear < releaseYear - 1 && expText.includes(tech)) {
          authenticityScore -= 20;
          contradictions.push({
            type: 'ANACHRONISM',
            severity: 'high',
            claim: `Claims to have used ${tech.toUpperCase()} at ${exp.company} in ${exp.startYear}`,
            evidence: `${tech.toUpperCase()} was publicly released in ${releaseYear}, which is after the claimed usage start year (${exp.startYear}).`,
            explanation: 'Technological Anachronism: Candidate claims production usage of a tool or library before that software was created.'
          });
          break;
        }
      }
    }
  }

  // 4. Vagueness and inflated metrics check
  const hasOnlyExtravagantUnquantifiedClaims = candidate.experience.some(exp =>
    exp.bullets.some(b =>
      /revolutionized the entire|master of all|1000%|infinite scale/i.test(b)
    )
  );
  if (hasOnlyExtravagantUnquantifiedClaims) {
    authenticityScore -= 10;
    contradictions.push({
      type: 'VAGUE_CLAIM',
      severity: 'medium',
      claim: 'Hyperbolic unverified achievements',
      evidence: 'Bullet points contain unverifiable superlatives without baseline comparative metrics.',
      explanation: 'Stylistic warning: Exaggerated claims lacking architectural specificity or concrete baselines.'
    });
  }

  authenticityScore = Math.max(Math.min(authenticityScore, 100), 10);

  let riskLevel: 'LOW_RISK' | 'MEDIUM_SUSPICION' | 'HIGH_ANOMALY' = 'LOW_RISK';
  if (authenticityScore < 60 || contradictions.some(c => c.severity === 'high')) {
    riskLevel = 'HIGH_ANOMALY';
  } else if (authenticityScore < 80 || contradictions.length > 0) {
    riskLevel = 'MEDIUM_SUSPICION';
  }

  let skepticismSummary = '';
  if (riskLevel === 'LOW_RISK') {
    skepticismSummary = 'Claims appear authentic, chronologically consistent, and substantiated by documented work experience.';
  } else if (riskLevel === 'MEDIUM_SUSPICION') {
    skepticismSummary = 'Moderate concerns detected. Several listed skills lack supporting project evidence, or tenure details require recruiter clarification.';
  } else {
    skepticismSummary = 'High risk / serious anomalies detected. Significant timeline contradictions, anachronisms, or heavy keyword stuffing identified.';
  }

  return {
    authenticityScore,
    riskLevel,
    keywordStuffingDetected,
    keywordStuffingDetails: keywordStuffingDetected
      ? `${unsupportedSkillsList.length} of ${candidate.allExtractedSkills.length} claimed skills (${Math.round(keywordStuffingRatio * 100)}%) lack supporting project evidence.`
      : undefined,
    unsupportedSkillsCount: unsupportedSkillsList.length,
    unsupportedSkillsList,
    timelineContradictions: contradictions.some(c => c.type === 'TIMELINE_CONFLICT'),
    contradictions,
    skepticismSummary
  };
}

export function evaluateCandidateMatch(
  candidate: ResumeCandidate,
  job: JobDescription
): MatchAnalysis {
  // 1. Verify claims & contradictions (Innovation requirement!)
  const claimVerification = verifyClaimsAndContradictions(candidate, job);

  // 2. Skill Matching (Must-have and Nice-to-have)
  const candidateSkillsLower = new Set(candidate.allExtractedSkills.map(s => s.toLowerCase()));
  const candidateFullTextLower = `${candidate.summary} ${candidate.experience.map(e => `${e.title} ${e.bullets.join(' ')} ${e.techStack.join(' ')}`).join(' ')} ${candidate.projects.map(p => `${p.name} ${p.description}`).join(' ')}`.toLowerCase();

  const matchedMustHave: MatchedSkill[] = [];
  const missingMustHave: string[] = [];
  const semanticMatches: Array<{ requested: string; candidateHas: string; rationale: string }> = [];

  for (const skill of job.mustHaveSkills) {
    const sLower = skill.toLowerCase();
    let found = false;
    let evidence = '';
    let source: MatchedSkill['source'] = 'skill_list_only';
    let verified = false;

    // Check if directly in experience
    for (const exp of candidate.experience) {
      const expCombined = `${exp.title} ${exp.bullets.join(' ')} ${exp.techStack.join(' ')}`.toLowerCase();
      if (expCombined.includes(sLower)) {
        found = true;
        source = 'work_experience';
        verified = true;
        const matchingBullet = exp.bullets.find(b => b.toLowerCase().includes(sLower)) || `Used in tech stack at ${exp.company} (${exp.title})`;
        evidence = matchingBullet;
        break;
      }
    }

    // Check projects if not in experience
    if (!found) {
      for (const proj of candidate.projects) {
        const projCombined = `${proj.name} ${proj.description} ${proj.techStack.join(' ')}`.toLowerCase();
        if (projCombined.includes(sLower)) {
          found = true;
          source = 'project';
          verified = true;
          evidence = `Demonstrated in project '${proj.name}': ${proj.description}`;
          break;
        }
      }
    }

    // Check skill list only
    if (!found && candidateSkillsLower.has(sLower)) {
      found = true;
      source = 'skill_list_only';
      verified = false;
      evidence = `Listed in candidate's skills section, but not elaborated in employment bullets.`;
    }

    // Semantic equivalent check
    if (!found) {
      const equivalents = SEMANTIC_EQUIVALENTS[sLower] || [];
      for (const eq of equivalents) {
        if (candidateSkillsLower.has(eq) || candidateFullTextLower.includes(eq)) {
          found = true;
          source = 'semantic_match';
          verified = true;
          evidence = `Candidate has related competency in '${eq.toUpperCase()}', aligning with requirement for '${skill}'.`;
          semanticMatches.push({
            requested: skill,
            candidateHas: eq,
            rationale: `Industry equivalent or core sub-discipline of ${skill}.`
          });
          break;
        }
      }
    }

    if (found) {
      matchedMustHave.push({ skill, evidence, source, verified });
    } else {
      missingMustHave.push(skill);
    }
  }

  // Nice-to-have skills
  const matchedNiceToHave: MatchedSkill[] = [];
  const missingNiceToHave: string[] = [];

  for (const skill of job.niceToHaveSkills) {
    const sLower = skill.toLowerCase();
    let found = false;
    let evidence = '';
    let source: MatchedSkill['source'] = 'skill_list_only';
    let verified = false;

    for (const exp of candidate.experience) {
      const expCombined = `${exp.title} ${exp.bullets.join(' ')} ${exp.techStack.join(' ')}`.toLowerCase();
      if (expCombined.includes(sLower)) {
        found = true;
        source = 'work_experience';
        verified = true;
        evidence = exp.bullets.find(b => b.toLowerCase().includes(sLower)) || `Used at ${exp.company}`;
        break;
      }
    }

    if (!found && candidateSkillsLower.has(sLower)) {
      found = true;
      source = 'skill_list_only';
      verified = false;
      evidence = `Listed in skills section.`;
    }

    if (found) {
      matchedNiceToHave.push({ skill, evidence, source, verified });
    } else {
      missingNiceToHave.push(skill);
    }
  }

  // Calculate Skill Score
  // Discount unverified skills that are only in the skills list
  let mustHaveScoreSum = 0;
  for (const m of matchedMustHave) {
    if (m.source === 'work_experience') mustHaveScoreSum += 1.0;
    else if (m.source === 'project') mustHaveScoreSum += 0.85;
    else if (m.source === 'semantic_match') mustHaveScoreSum += 0.8;
    else mustHaveScoreSum += 0.35; // Heavily discount unverified skill-list-only claims!
  }

  const rawMustHaveScore = job.mustHaveSkills.length > 0
    ? (mustHaveScoreSum / job.mustHaveSkills.length) * 100
    : 100;

  const rawNiceToHaveScore = job.niceToHaveSkills.length > 0
    ? (matchedNiceToHave.length / job.niceToHaveSkills.length) * 100
    : 100;

  const skillMatchScore = Math.round(rawMustHaveScore * 0.75 + rawNiceToHaveScore * 0.25);

  // 3. Experience Fit
  const reqYears = job.minExperienceYears;
  let candYears = candidate.totalYearsExperience;

  // If candidate is a keyword stuffer or timeline contradictor, discount their effective relevant years
  if (claimVerification.timelineContradictions) {
    candYears = Math.min(candYears, 2.0);
  }

  let experienceScore = 100;
  let expVerdict = '';
  const seniorityMatch = candYears >= reqYears;

  if (candYears >= reqYears + 2) {
    experienceScore = 95;
    expVerdict = `Exceeds minimum experience (${candYears.toFixed(1)} yrs vs ${reqYears} yrs req).`;
  } else if (candYears >= reqYears) {
    experienceScore = 100;
    expVerdict = `Optimal experience fit (${candYears.toFixed(1)} yrs vs ${reqYears} yrs req).`;
  } else if (candYears >= reqYears - 1.5) {
    experienceScore = 75;
    expVerdict = `Slightly below target seniority (${candYears.toFixed(1)} yrs vs ${reqYears} yrs req), but within viable range.`;
  } else {
    experienceScore = Math.max(25, Math.round((candYears / reqYears) * 60));
    expVerdict = `Underqualified in tenure (${candYears.toFixed(1)} yrs vs ${reqYears} yrs req).`;
  }

  // 4. Education Fit
  let educationScore = 80;
  let eduMet = false;
  let eduDetails = '';

  const degreeHierarchy: { [key: string]: number } = {
    'any': 1,
    'bachelors': 2,
    'masters': 3,
    'phd': 4
  };

  const reqRank = degreeHierarchy[job.requiredDegree.toLowerCase()] || 2;
  const candidateDegrees = candidate.education.map(e => e.degree.toLowerCase());

  let candHighestRank = 1;
  let candHighestDegreeStr = 'None / Experience';

  for (const e of candidate.education) {
    const dLower = e.degree.toLowerCase();
    if (dLower.includes('phd') || dLower.includes('doctor')) {
      if (candHighestRank < 4) {
        candHighestRank = 4;
        candHighestDegreeStr = `${e.degree} in ${e.field} (${e.institution})`;
      }
    } else if (dLower.includes('master') || dLower.includes('m.s') || dLower.includes('mba')) {
      if (candHighestRank < 3) {
        candHighestRank = 3;
        candHighestDegreeStr = `${e.degree} in ${e.field} (${e.institution})`;
      }
    } else if (dLower.includes('bachelor') || dLower.includes('b.s') || dLower.includes('b.a') || dLower.includes('b.e')) {
      if (candHighestRank < 2) {
        candHighestRank = 2;
        candHighestDegreeStr = `${e.degree} in ${e.field} (${e.institution})`;
      }
    }
  }

  if (candHighestRank >= reqRank) {
    eduMet = true;
    educationScore = 100;
    eduDetails = `Meets or exceeds degree requirement (${candHighestDegreeStr}).`;
  } else {
    eduMet = false;
    educationScore = 60;
    eduDetails = `Holds ${candHighestDegreeStr}, whereas role specifies ${job.requiredDegree}.`;
  }

  // 5. Semantic / Domain fit score
  let semanticFitScore = 85;
  const domainWords = job.domainSummary.toLowerCase().split(/\s+/);
  const matchedDomainCount = domainWords.filter(w => w.length > 4 && candidateFullTextLower.includes(w)).length;
  if (matchedDomainCount > 5) {
    semanticFitScore = 95;
  } else if (matchedDomainCount < 2) {
    semanticFitScore = 60;
  }

  // 6. Overall Weighted Score (Incorporates Innovation / Authenticity penalty!)
  const weights = job.weights || {
    skillMatch: 40,
    experienceFit: 25,
    educationFit: 15,
    claimAuthenticity: 20
  };

  const totalWeight = weights.skillMatch + weights.experienceFit + weights.educationFit + weights.claimAuthenticity;
  
  // Calculate raw weighted score
  let overallScore = Math.round(
    (skillMatchScore * weights.skillMatch +
      experienceScore * weights.experienceFit +
      educationScore * weights.educationFit +
      claimVerification.authenticityScore * weights.claimAuthenticity) / totalWeight
  );

  // Severe anomaly penalty: If high anomaly is confirmed, cap overall score so fraud doesn't outrank genuine talent!
  if (claimVerification.riskLevel === 'HIGH_ANOMALY') {
    overallScore = Math.min(overallScore, 48);
  }

  // Fit Category classification
  let fitCategory: MatchAnalysis['fitCategory'] = 'Good Match';
  if (claimVerification.riskLevel === 'HIGH_ANOMALY') {
    fitCategory = 'High Risk / Unverified';
  } else if (overallScore >= 88) {
    fitCategory = 'Strong Match';
  } else if (overallScore >= 72) {
    fitCategory = 'Good Match';
  } else if (overallScore >= 55) {
    fitCategory = 'Partial Match';
  } else {
    fitCategory = 'Low Fit';
  }

  // 7. Explainability & Insights
  const whyMatchBullets: string[] = [];
  const gapsAndConcernsBullets: string[] = [];

  // Match strengths
  const verifiedMustHave = matchedMustHave.filter(m => m.verified);
  if (verifiedMustHave.length > 0) {
    whyMatchBullets.push(
      `Strong verified competency in core requirements: ${verifiedMustHave.map(m => m.skill).slice(0, 4).join(', ')} backed by tangible role accomplishments.`
    );
  }

  if (candYears >= reqYears) {
    whyMatchBullets.push(
      `Solid seniority alignment with ${candYears.toFixed(1)} years of industry background (target: ${reqYears}+ yrs).`
    );
  }

  if (eduMet) {
    whyMatchBullets.push(`Solid educational credentials: ${candHighestDegreeStr}.`);
  }

  if (semanticMatches.length > 0) {
    whyMatchBullets.push(
      `Valuable transferable skills: ${semanticMatches.map(s => `${s.candidateHas} → ${s.requested}`).join(', ')}.`
    );
  }

  // Gaps & Concerns
  if (missingMustHave.length > 0) {
    gapsAndConcernsBullets.push(
      `Missing ${missingMustHave.length} must-have skill(s): ${missingMustHave.join(', ')}.`
    );
  }

  if (candYears < reqYears) {
    gapsAndConcernsBullets.push(
      `Experience gap: Candidate has ${candYears.toFixed(1)} years versus the requested ${reqYears} years.`
    );
  }

  if (claimVerification.keywordStuffingDetected) {
    gapsAndConcernsBullets.push(
      `Keyword stuffing alert: ${claimVerification.unsupportedSkillsCount} skills listed without project or role context.`
    );
  }

  for (const c of claimVerification.contradictions) {
    gapsAndConcernsBullets.push(`Anomaly (${c.type}): ${c.explanation}`);
  }

  // Executive summary
  let executiveSummary = '';
  if (claimVerification.riskLevel === 'HIGH_ANOMALY') {
    executiveSummary = `Caution advised. While the resume contains keywords matching the ${job.title} role, the Authenticity Engine flagged severe contradictions (${claimVerification.contradictions.map(c => c.type).join(', ')}). Recommended action: deep background verification before proceeding.`;
  } else if (overallScore >= 85) {
    executiveSummary = `Outstanding candidate for ${job.title}. Demonstrates ${candYears.toFixed(1)} years of verified hands-on expertise with ${verifiedMustHave.length} of ${job.mustHaveSkills.length} core technical requirements and high claim integrity. Strongly recommended for technical screen.`;
  } else if (overallScore >= 70) {
    executiveSummary = `Viable candidate with good technical foundation for ${job.title}. Meets primary requirements, with minor gaps in ${missingMustHave.slice(0, 2).join(', ') || 'seniority'}. Good candidate for interview.`;
  } else {
    executiveSummary = `Limited alignment with ${job.title}. Key gaps exist in required core technologies (${missingMustHave.slice(0, 3).join(', ')}) or necessary seniority level.`;
  }

  // Tailored Interview Questions
  const suggestedInterviewQuestions: MatchAnalysis['explainability']['suggestedInterviewQuestions'] = [];

  // If there are contradictions, add verification questions!
  for (const contradiction of claimVerification.contradictions.slice(0, 2)) {
    suggestedInterviewQuestions.push({
      category: 'CLAIM_VERIFICATION',
      question: `Can you walk me through the specific architectural architecture and timeline of your work at ${candidate.experience[0]?.company || 'your last role'} where you used ${contradiction.claim}?`,
      targetClaimOrSkill: contradiction.claim,
      whatToListenFor: 'Listen for precise technical details, team structure, and exact deployment dates to verify authenticity rather than rehearsed buzzwords.'
    });
  }

  // If missing must-have skills
  for (const missing of missingMustHave.slice(0, 2)) {
    suggestedInterviewQuestions.push({
      category: 'SKILL_GAP',
      question: `This role heavily depends on ${missing}. What related systems or paradigms have you used, and how quickly have you ramped up on similar technologies in the past?`,
      targetClaimOrSkill: missing,
      whatToListenFor: 'Look for conceptual understanding of fundamentals and honest acknowledgment of experience boundaries.'
    });
  }

  // Technical depth on top verified skill
  if (verifiedMustHave.length > 0) {
    const topSkill = verifiedMustHave[0].skill;
    suggestedInterviewQuestions.push({
      category: 'TECHNICAL_DEPTH',
      question: `Describe the most difficult production edge case or failure mode you encountered when deploying ${topSkill}, and how you debugged it.`,
      targetClaimOrSkill: topSkill,
      whatToListenFor: 'Look for concrete debugging steps, trade-off evaluations, and deep internal mechanics rather than high-level platitudes.'
    });
  }

  return {
    candidateId: candidate.id,
    overallScore,
    breakdown: {
      skillMatchScore,
      experienceScore,
      educationScore,
      authenticityScore: claimVerification.authenticityScore,
      semanticFitScore
    },
    fitCategory,
    matchedMustHave,
    matchedNiceToHave,
    missingMustHave,
    missingNiceToHave,
    semanticMatches,
    experienceFit: {
      requiredYears: reqYears,
      candidateYears: candYears,
      seniorityMatch,
      verdict: expVerdict
    },
    educationFit: {
      requiredDegree: job.requiredDegree,
      candidateDegree: candHighestDegreeStr,
      met: eduMet,
      details: eduDetails
    },
    claimVerification,
    explainability: {
      executiveSummary,
      whyMatchBullets,
      gapsAndConcernsBullets,
      suggestedInterviewQuestions
    }
  };
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
