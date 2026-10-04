import React, { useState } from 'react';
import { RankedResult, JobDescription } from '../types';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  HelpCircle, 
  Award, 
  ExternalLink,
  Search,
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';

interface CandidateDetailModalProps {
  result: RankedResult | null;
  job: JobDescription;
  onClose: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  result,
  job,
  onClose
}) => {
  if (!result) return null;

  const [activeTab, setActiveTab] = useState<'match' | 'authenticity' | 'experience' | 'interview_prep' | 'raw_resume'>('match');
  const { candidate, analysis, rank } = result;
  const { breakdown, claimVerification, matchedMustHave, matchedNiceToHave, missingMustHave, missingNiceToHave, semanticMatches, explainability } = analysis;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center font-mono text-lg font-bold shadow-md">
              #{rank}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight text-white">{candidate.name}</h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  claimVerification.riskLevel === 'HIGH_ANOMALY'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : analysis.overallScore >= 85
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                }`}>
                  {analysis.fitCategory}
                </span>

                {claimVerification.keywordStuffingDetected && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Keyword Stuffer Detected
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 mt-1">
                {candidate.currentTitle} • {candidate.totalYearsExperience} yrs exp • {candidate.location || 'Remote'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Targeting: <span className="text-indigo-300 font-medium">{job.title}</span> ({job.seniority})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Overall Match</div>
              <div className="text-2xl font-bold font-mono text-white">
                {analysis.overallScore}%
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('match')}
            className={`py-3 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'match'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why This Match (Explainability)</span>
          </button>

          <button
            onClick={() => setActiveTab('authenticity')}
            className={`py-3 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'authenticity'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${
              claimVerification.riskLevel === 'HIGH_ANOMALY' ? 'text-rose-500' : 'text-amber-500'
            }`} />
            <span>Claim Authenticity &amp; Contradictions ({claimVerification.authenticityScore}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('interview_prep')}
            className={`py-3 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'interview_prep'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Probing Interview Questions ({explainability.suggestedInterviewQuestions?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`py-3 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience &amp; Education</span>
          </button>

          <button
            onClick={() => setActiveTab('raw_resume')}
            className={`py-3 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'raw_resume'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Raw Resume &amp; OCR Quality</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: WHY THIS MATCH (EXPLAINABILITY) */}
          {activeTab === 'match' && (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" /> Recruiter Executive Verdict
                </h4>
                <p className="text-sm text-indigo-950 font-medium leading-relaxed">
                  {explainability.executiveSummary}
                </p>
              </div>

              {/* Multi-Dimensional Score Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Score Dimensions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="text-[11px] text-slate-500">Skill Match Fit</div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                      {breakdown.skillMatchScore}%
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.skillMatchScore}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="text-[11px] text-slate-500">Experience Fit</div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                      {breakdown.experienceScore}%
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.experienceScore}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="text-[11px] text-slate-500">Education Alignment</div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                      {breakdown.educationScore}%
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.educationScore}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="text-[11px] text-slate-500">Claim Authenticity</div>
                    <div className={`text-lg font-bold font-mono mt-0.5 ${
                      breakdown.authenticityScore < 70 ? 'text-rose-600' : 'text-emerald-700'
                    }`}>
                      {breakdown.authenticityScore}%
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${breakdown.authenticityScore < 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${breakdown.authenticityScore}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Concerns Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Why This Candidate Matches
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {explainability.whyMatchBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Key Gaps &amp; Risk Areas
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {explainability.gapsAndConcernsBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed Skill Evidence Matrix */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Must-Have Skills Evidence Matrix ({matchedMustHave.length} of {job.mustHaveSkills.length} Found)
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">Required Skill</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Source &amp; Evidence Citation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matchedMustHave.map(m => (
                        <tr key={m.skill} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{m.skill}</td>
                          <td className="py-2.5 px-3">
                            {m.verified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200" title="Listed in skills section only without work bullet context">
                                ⚠️ Listed Only
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                            {m.evidence}
                          </td>
                        </tr>
                      ))}

                      {missingMustHave.map(s => (
                        <tr key={s} className="bg-rose-50/30">
                          <td className="py-2.5 px-3 font-semibold text-slate-700">{s}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <XCircle className="w-3 h-3" /> Missing
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 italic">
                            No evidence or semantic equivalent found in candidate profile.
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Semantic equivalents if any */}
              {semanticMatches.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Semantic / Industry Equivalents Recognized
                  </h4>
                  <div className="space-y-1.5">
                    {semanticMatches.map((sm, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-700">
                        <span className="font-semibold text-indigo-700">Requested: {sm.requested}</span>
                        <span className="text-slate-400">↔</span>
                        <span className="font-medium text-slate-900">Candidate has: {sm.candidateHas}</span>
                        <span className="text-slate-500 text-[11px]">({sm.rationale})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLAIM AUTHENTICITY & CONTRADICTIONS (INNOVATION FOCUS!) */}
          {activeTab === 'authenticity' && (
            <div className="space-y-6">
              {/* Authenticity Overview Banner */}
              <div className={`p-4 rounded-xl border ${
                claimVerification.riskLevel === 'HIGH_ANOMALY'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : claimVerification.riskLevel === 'MEDIUM_SUSPICION'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    {claimVerification.riskLevel === 'HIGH_ANOMALY' ? (
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                    ) : claimVerification.riskLevel === 'MEDIUM_SUSPICION' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm">
                        Authenticity Audit: {claimVerification.riskLevel.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-slate-700 mt-0.5">
                        {claimVerification.skepticismSummary}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Integrity Index</div>
                    <div className="text-2xl font-bold font-mono">
                      {claimVerification.authenticityScore} / 100
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyword Stuffing Analysis Card */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>1. Keyword Stuffing &amp; Density Engine</span>
                    {claimVerification.keywordStuffingDetected ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-200">
                        Keyword Stuffer Detected
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                        Natural Skill Density
                      </span>
                    )}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Traditional ATS algorithms blindly reward candidates who dump walls of keywords into their resume. 
                  Our engine compares skills listed in the "Skills" section against actual project and employment bullet points to identify unverified buzzword stuffing.
                </p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500">Total Claimed Skills in Resume:</span>{' '}
                    <strong className="text-slate-800">{candidate.allExtractedSkills.length}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Skills with Zero Evidence in Roles:</span>{' '}
                    <strong className={`font-mono ${claimVerification.unsupportedSkillsCount > 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {claimVerification.unsupportedSkillsCount}
                    </strong>
                  </div>
                </div>

                {claimVerification.unsupportedSkillsList.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Skills Listed Without Work Experience Evidence ({claimVerification.unsupportedSkillsList.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {claimVerification.unsupportedSkillsList.map(skill => (
                        <span 
                          key={skill}
                          className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Contradictions & Anachronisms */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>2. Chronological &amp; Timeline Contradiction Analysis</span>
                  {claimVerification.contradictions.length > 0 ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-200">
                      {claimVerification.contradictions.length} Anomalies Flagged
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                      No Timeline Conflicts
                    </span>
                  )}
                </h4>

                {claimVerification.contradictions.length > 0 ? (
                  <div className="space-y-3">
                    {claimVerification.contradictions.map((contra, idx) => (
                      <div key={idx} className="bg-rose-50/50 border border-rose-200 rounded-lg p-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            {contra.type.replace('_', ' ')} ({contra.severity.toUpperCase()} SEVERITY)
                          </span>
                        </div>
                        <div className="text-slate-800">
                          <strong>Claim:</strong> <span className="font-mono text-[11px]">{contra.claim}</span>
                        </div>
                        <div className="text-slate-800">
                          <strong>Evidence of Discrepancy:</strong> <span className="font-mono text-[11px] text-rose-800">{contra.evidence}</span>
                        </div>
                        <p className="text-slate-600 pt-1 text-[11px] border-t border-rose-100">
                          {contra.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    ✓ All employment start/end dates align with degree graduation years ({candidate.education[0]?.graduationYear || 'Degree'}). No anachronisms or chronological impossibilities found.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROBING INTERVIEW QUESTIONS */}
          {activeTab === 'interview_prep' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Recruiter Phone Screen Cheatsheet
                </h4>
                <p className="text-xs text-indigo-950">
                  These custom questions are engineered to verify suspected contradictory claims, test technical depth on key required systems, and probe boundary limits without bias.
                </p>
              </div>

              <div className="space-y-3">
                {explainability.suggestedInterviewQuestions?.map((q, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        q.category === 'CLAIM_VERIFICATION'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : q.category === 'SKILL_GAP'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {q.category.replace('_', ' ')}: {q.targetClaimOrSkill}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Q{idx + 1}</span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      "{q.question}"
                    </p>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600">
                      <strong className="text-slate-800">What to listen for:</strong> {q.whatToListenFor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE & EDUCATION */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {/* Experience entries */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Work History Chronology
                </h4>
                <div className="space-y-4">
                  {candidate.experience.map((exp, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">{exp.title}</h5>
                          <p className="text-xs text-slate-600 font-medium">{exp.company}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {exp.duration}
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>

                      {exp.techStack?.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1 items-center border-t border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Stack:</span>
                          {exp.techStack.map(t => (
                            <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education entries */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" /> Formal Education
                </h4>
                <div className="space-y-3">
                  {candidate.education.map((edu, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">
                          {edu.degree} in {edu.field}
                        </h5>
                        <p className="text-xs text-slate-600">{edu.institution}</p>
                        {edu.honors && (
                          <p className="text-xs text-indigo-600 font-medium mt-0.5">{edu.honors}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold text-slate-700">
                          Class of {edu.graduationYear}
                        </span>
                        {edu.gpa && (
                          <div className="text-[11px] text-slate-400">GPA: {edu.gpa}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RAW RESUME & OCR QUALITY */}
          {activeTab === 'raw_resume' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Source Document: {candidate.fileName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Parsed Quality Score: <strong className="font-mono text-slate-800">{candidate.parsingQuality.score}/100</strong>
                    {candidate.parsingQuality.isMessyOcr ? ' (Messy OCR Document with Character Normalization)' : ' (Clean Direct Extraction)'}
                  </p>
                </div>
              </div>

              {candidate.parsingQuality.issues.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
                  <strong>OCR Normalization Report:</strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {candidate.parsingQuality.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-96 whitespace-pre-wrap leading-relaxed">
                {candidate.rawText}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Candidate ID: <span className="font-mono">{candidate.id}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
