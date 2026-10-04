export interface SkillRequirement {
  name: string;
  weight?: number; // 1 to 5
  category?: string;
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff / Principal' | 'Executive';
  employmentType: 'Full-time' | 'Contract' | 'Remote' | 'Hybrid';
  location: string;
  minExperienceYears: number;
  maxExperienceYears?: number;
  requiredDegree: 'Any' | 'Bachelors' | 'Masters' | 'PhD';
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  domainSummary: string;
  rawDescription: string;
  weights: {
    skillMatch: number; // e.g. 40%
    experienceFit: number; // e.g. 25%
    educationFit: number; // e.g. 15%
    claimAuthenticity: number; // e.g. 20% (Innovation bonus penalty)
  };
}

export interface EducationEntry {
  degree: string;
  field: string;
  institution: string;
  graduationYear?: number | string;
  gpa?: string;
  honors?: string;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  duration: string;
  startYear?: number;
  endYear?: number | string;
  isCurrent?: boolean;
  bullets: string[];
  techStack: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  techStack: string[];
  metrics?: string;
}

export interface ResumeCandidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  currentTitle: string;
  totalYearsExperience: number;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  technicalSkills: {
    [category: string]: string[];
  };
  allExtractedSkills: string[];
  softSkills: string[];
  projects: ProjectEntry[];
  rawText: string;
  fileName: string;
  fileType: string;
  parsingQuality: {
    score: number; // 0-100
    isMessyOcr: boolean;
    issues: string[];
  };
  createdAt?: string;
}

export interface ContradictionAlert {
  type: 'TIMELINE_CONFLICT' | 'KEYWORD_STUFFING' | 'INFLATED_TITLE' | 'ANACHRONISM' | 'VAGUE_CLAIM' | 'UNSUPPORTED_METRIC';
  severity: 'low' | 'medium' | 'high';
  claim: string;
  evidence: string;
  explanation: string;
}

export interface ClaimVerificationResult {
  authenticityScore: number; // 0 - 100
  riskLevel: 'LOW_RISK' | 'MEDIUM_SUSPICION' | 'HIGH_ANOMALY';
  keywordStuffingDetected: boolean;
  keywordStuffingDetails?: string;
  unsupportedSkillsCount: number;
  unsupportedSkillsList: string[]; // skills claimed in list but never supported in actual job bullets
  timelineContradictions: boolean;
  contradictions: ContradictionAlert[];
  skepticismSummary: string;
}

export interface MatchedSkill {
  skill: string;
  evidence: string;
  source: 'work_experience' | 'project' | 'skill_list_only' | 'semantic_match';
  verified: boolean;
  weight?: number;
}

export interface MatchAnalysis {
  candidateId: string;
  overallScore: number; // 0 - 100
  breakdown: {
    skillMatchScore: number;
    experienceScore: number;
    educationScore: number;
    authenticityScore: number;
    semanticFitScore: number;
  };
  fitCategory: 'Strong Match' | 'Good Match' | 'Partial Match' | 'High Risk / Unverified' | 'Low Fit';
  matchedMustHave: MatchedSkill[];
  matchedNiceToHave: MatchedSkill[];
  missingMustHave: string[];
  missingNiceToHave: string[];
  semanticMatches: Array<{
    requested: string;
    candidateHas: string;
    rationale: string;
  }>;
  experienceFit: {
    requiredYears: number;
    candidateYears: number;
    seniorityMatch: boolean;
    verdict: string;
  };
  educationFit: {
    requiredDegree: string;
    candidateDegree: string;
    met: boolean;
    details: string;
  };
  claimVerification: ClaimVerificationResult;
  explainability: {
    executiveSummary: string;
    whyMatchBullets: string[];
    gapsAndConcernsBullets: string[];
    suggestedInterviewQuestions: Array<{
      category: 'CLAIM_VERIFICATION' | 'TECHNICAL_DEPTH' | 'SKILL_GAP' | 'SYSTEM_DESIGN';
      question: string;
      targetClaimOrSkill: string;
      whatToListenFor: string;
    }>;
  };
}

export interface RankedResult {
  candidate: ResumeCandidate;
  analysis: MatchAnalysis;
  rank: number;
}
