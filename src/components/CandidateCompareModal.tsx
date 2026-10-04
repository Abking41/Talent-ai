import React from 'react';
import { RankedResult, JobDescription } from '../types';
import { 
  X, 
  GitCompare, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface CandidateCompareModalProps {
  candidates: RankedResult[];
  job: JobDescription;
  onClose: () => void;
  onRemoveCandidate: (id: string) => void;
}

export const CandidateCompareModal: React.FC<CandidateCompareModalProps> = ({
  candidates,
  job,
  onClose,
  onRemoveCandidate
}) => {
  if (candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Side-by-Side Candidate Comparison</h2>
              <p className="text-xs text-slate-300">
                Evaluating {candidates.length} candidates against: <span className="text-indigo-300 font-semibold">{job.title}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[640px]">
            {candidates.map((res) => {
              const { candidate, analysis, rank } = res;
              const { breakdown, claimVerification } = analysis;

              return (
                <div 
                  key={candidate.id} 
                  className={`border rounded-xl p-4 flex flex-col justify-between ${
                    claimVerification.riskLevel === 'HIGH_ANOMALY'
                      ? 'border-rose-300 bg-rose-50/10'
                      : analysis.overallScore >= 85
                      ? 'border-emerald-300 bg-emerald-50/10'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Identity */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                          Rank #{rank}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
                          {candidate.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{candidate.currentTitle}</p>
                      </div>

                      <button
                        onClick={() => onRemoveCandidate(candidate.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Overall Score Box */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Overall Match</div>
                      <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
                        {analysis.overallScore}%
                      </div>
                      <div className="text-xs font-semibold mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${
                          claimVerification.riskLevel === 'HIGH_ANOMALY'
                            ? 'bg-rose-100 text-rose-800'
                            : analysis.overallScore >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {analysis.fitCategory}
                        </span>
                      </div>
                    </div>

                    {/* Authenticity Engine Highlight */}
                    <div className={`p-3 rounded-lg border text-xs ${
                      claimVerification.riskLevel === 'HIGH_ANOMALY'
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : claimVerification.riskLevel === 'MEDIUM_SUSPICION'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        {claimVerification.riskLevel === 'HIGH_ANOMALY' ? (
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                        ) : claimVerification.riskLevel === 'MEDIUM_SUSPICION' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                        <span>Authenticity: {breakdown.authenticityScore}%</span>
                      </div>
                      <p className="text-[11px] leading-tight">
                        {claimVerification.skepticismSummary}
                      </p>
                    </div>

                    {/* Score Matrix */}
                    <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Skills Fit:</span>
                        <strong className="font-mono text-slate-800">{breakdown.skillMatchScore}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Experience Tenure:</span>
                        <strong className="font-mono text-slate-800">{candidate.totalYearsExperience} yrs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Education Degree:</span>
                        <strong className="text-slate-800 text-right truncate max-w-[150px]">
                          {candidate.education[0]?.degree || 'None'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Claimed Skills Count:</span>
                        <strong className="font-mono text-slate-800">{candidate.allExtractedSkills.length}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Unverified Stuffed Skills:</span>
                        <strong className={`font-mono ${claimVerification.unsupportedSkillsCount > 5 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {claimVerification.unsupportedSkillsCount}
                        </strong>
                      </div>
                    </div>

                    {/* Must-have skills status */}
                    <div className="border-t border-slate-100 pt-3">
                      <div className="text-[11px] font-bold text-slate-600 uppercase mb-2">
                        Must-Have Skills Status:
                      </div>
                      <div className="space-y-1 text-xs">
                        {job.mustHaveSkills.map(skill => {
                          const matched = analysis.matchedMustHave.find(m => m.skill.toLowerCase() === skill.toLowerCase());
                          return (
                            <div key={skill} className="flex items-center justify-between">
                              <span className="text-slate-700 truncate">{skill}</span>
                              {matched ? (
                                matched.verified ? (
                                  <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                  </span>
                                ) : (
                                  <span className="text-amber-600 font-semibold text-[11px]">
                                    ⚠️ Listed only
                                  </span>
                                )
                              ) : (
                                <span className="text-rose-500 font-semibold text-[11px] flex items-center gap-0.5">
                                  <XCircle className="w-3 h-3" /> Missing
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Recruiter Verdict summary */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 italic">
                    "{analysis.explainability.executiveSummary}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
};
