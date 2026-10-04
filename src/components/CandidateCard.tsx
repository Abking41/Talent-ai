import React from 'react';
import { RankedResult } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  GraduationCap, 
  ChevronRight, 
  Sparkles,
  FileSearch,
  CheckSquare,
  Square
} from 'lucide-react';

interface CandidateCardProps {
  result: RankedResult;
  onSelect: (result: RankedResult) => void;
  isCompareSelected: boolean;
  onToggleCompare: (id: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  result,
  onSelect,
  isCompareSelected,
  onToggleCompare
}) => {
  const { candidate, analysis, rank } = result;
  const { breakdown, fitCategory, claimVerification, matchedMustHave, missingMustHave } = analysis;

  // Determine badge styling based on overall score and authenticity
  let scoreBadgeColor = 'bg-indigo-600 text-white';
  let cardBorderColor = 'border-slate-200 hover:border-indigo-300';
  
  if (claimVerification.riskLevel === 'HIGH_ANOMALY') {
    scoreBadgeColor = 'bg-rose-600 text-white';
    cardBorderColor = 'border-rose-200 bg-rose-50/20 hover:border-rose-300';
  } else if (analysis.overallScore >= 85) {
    scoreBadgeColor = 'bg-emerald-600 text-white';
    cardBorderColor = 'border-emerald-200 hover:border-emerald-300';
  } else if (analysis.overallScore < 60) {
    scoreBadgeColor = 'bg-slate-700 text-white';
  }

  return (
    <div 
      className={`rounded-xl border ${cardBorderColor} bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200 relative group`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3.5">
        <div className="flex items-start gap-3">
          {/* Rank Badge */}
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
              #{rank}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 
                onClick={() => onSelect(result)}
                className="font-bold text-slate-900 text-base hover:text-indigo-600 cursor-pointer transition"
              >
                {candidate.name}
              </h3>

              {/* Fit category badge */}
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                claimVerification.riskLevel === 'HIGH_ANOMALY'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : analysis.overallScore >= 85
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : analysis.overallScore >= 70
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {fitCategory}
              </span>

              {/* OCR Quality Notice if applicable */}
              {candidate.parsingQuality.isMessyOcr && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200" title="Scanned or noisy OCR resume repaired by parser">
                  OCR Repaired
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-0.5">
              {candidate.currentTitle} • <span className="font-semibold text-slate-700">{candidate.totalYearsExperience} yrs exp</span> • {candidate.location}
            </p>
          </div>
        </div>

        {/* Overall Score Badge & Compare Checkbox */}
        <div className="flex items-center gap-3 self-end sm:self-start">
          {/* Compare toggle */}
          <button
            onClick={() => onToggleCompare(candidate.id)}
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition ${
              isCompareSelected
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isCompareSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Big Score Widget */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Overall Fit</div>
              <div className="text-xl font-bold font-mono text-slate-900 leading-none">
                {analysis.overallScore}%
              </div>
            </div>
            <div className={`w-3 h-8 rounded-full ${scoreBadgeColor}`} />
          </div>
        </div>
      </div>

      {/* INNOVATION: Authenticity & Claim Verification Alert Bar */}
      <div className={`mb-3.5 p-2.5 rounded-lg text-xs border ${
        claimVerification.riskLevel === 'HIGH_ANOMALY'
          ? 'bg-rose-50 border-rose-200 text-rose-900'
          : claimVerification.riskLevel === 'MEDIUM_SUSPICION'
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-emerald-50/70 border-emerald-200/70 text-emerald-900'
      }`}>
        <div className="flex items-start gap-2">
          {claimVerification.riskLevel === 'HIGH_ANOMALY' ? (
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          ) : claimVerification.riskLevel === 'MEDIUM_SUSPICION' ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-semibold">
                {claimVerification.riskLevel === 'HIGH_ANOMALY'
                  ? 'Contradiction / Anomaly Warning'
                  : claimVerification.riskLevel === 'MEDIUM_SUSPICION'
                  ? 'Claim Verification Notice'
                  : 'Claim Authenticity: Verified'}
              </span>
              <span className="font-mono text-[11px] font-bold">
                Authenticity: {breakdown.authenticityScore}%
              </span>
            </div>

            <p className="text-[11px] mt-0.5 text-slate-700 leading-relaxed">
              {claimVerification.skepticismSummary}
            </p>

            {/* Keyword stuffing warning details */}
            {claimVerification.keywordStuffingDetected && (
              <div className="mt-1 text-[11px] text-amber-800 font-medium">
                ⚠️ Keyword Stuffer: {claimVerification.keywordStuffingDetails}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Fit Score Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 text-xs">
        <div>
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Skill Match</span>
            <span className="font-mono font-semibold text-slate-800">{breakdown.skillMatchScore}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all" 
              style={{ width: `${breakdown.skillMatchScore}%` }} 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Experience Fit</span>
            <span className="font-mono font-semibold text-slate-800">{breakdown.experienceScore}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all" 
              style={{ width: `${breakdown.experienceScore}%` }} 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Education Fit</span>
            <span className="font-mono font-semibold text-slate-800">{breakdown.educationScore}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all" 
              style={{ width: `${breakdown.educationScore}%` }} 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Integrity Index</span>
            <span className={`font-mono font-semibold ${
              breakdown.authenticityScore < 70 ? 'text-rose-600' : 'text-emerald-700'
            }`}>
              {breakdown.authenticityScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                breakdown.authenticityScore < 70 ? 'bg-rose-500' : 'bg-emerald-500'
              }`} 
              style={{ width: `${breakdown.authenticityScore}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Matched vs Missing Skills Badges */}
      <div className="space-y-1.5 mb-4 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Matched Must-Haves:
          </span>
          {matchedMustHave.length > 0 ? (
            matchedMustHave.slice(0, 5).map(m => (
              <span 
                key={m.skill}
                className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  m.verified 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
                title={m.evidence}
              >
                {m.skill} {!m.verified && '⚠️ (unverified)'}
              </span>
            ))
          ) : (
            <span className="text-slate-400 italic text-[11px]">None found</span>
          )}
          {matchedMustHave.length > 5 && (
            <span className="text-[11px] text-slate-500 font-medium">
              +{matchedMustHave.length - 5} more
            </span>
          )}
        </div>

        {missingMustHave.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-500" /> Missing:
            </span>
            {missingMustHave.slice(0, 4).map(s => (
              <span 
                key={s}
                className="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium"
              >
                {s}
              </span>
            ))}
            {missingMustHave.length > 4 && (
              <span className="text-[11px] text-slate-400">+{missingMustHave.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Executive Snippet & Detailed View Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <p className="text-slate-500 line-clamp-1 italic pr-2 text-[11px]">
          "{analysis.explainability.executiveSummary}"
        </p>

        <button
          onClick={() => onSelect(result)}
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition whitespace-nowrap ml-auto"
        >
          <span>Deep Audit &amp; Explanation</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
