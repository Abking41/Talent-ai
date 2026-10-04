import React, { useState } from 'react';
import { RankedResult, JobDescription } from '../types';
import { X, Download, Copy, Check, FileText } from 'lucide-react';

interface ExportDossierModalProps {
  results: RankedResult[];
  job: JobDescription;
  onClose: () => void;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  results,
  job,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');

  const generateMarkdown = () => {
    let md = `# TalentMatch AI — Candidate Evaluation Dossier\n\n`;
    md += `**Target Role:** ${job.title} (${job.seniority})\n`;
    md += `**Department:** ${job.department}\n`;
    md += `**Required Experience:** ${job.minExperienceYears}+ years\n`;
    md += `**Required Degree:** ${job.requiredDegree}\n`;
    md += `**Must-Have Skills:** ${job.mustHaveSkills.join(', ')}\n`;
    md += `**Scoring Weights:** Skills: ${job.weights.skillMatch}%, Experience: ${job.weights.experienceFit}%, Education: ${job.weights.educationFit}%, Authenticity Penalty: ${job.weights.claimAuthenticity}%\n\n`;
    md += `---\n\n`;
    md += `## Candidate Rankings Summary (${results.length} evaluated)\n\n`;

    results.forEach(res => {
      const { candidate, analysis, rank } = res;
      md += `### #${rank}. ${candidate.name} — ${analysis.overallScore}% Overall Match (${analysis.fitCategory})\n`;
      md += `- **Current Role:** ${candidate.currentTitle} (${candidate.totalYearsExperience} yrs exp, ${candidate.location})\n`;
      md += `- **Integrity / Authenticity Score:** ${analysis.breakdown.authenticityScore}% (${analysis.claimVerification.riskLevel})\n`;
      if (analysis.claimVerification.keywordStuffingDetected) {
        md += `  - ⚠️ *Keyword Stuffing Detected:* ${analysis.claimVerification.keywordStuffingDetails}\n`;
      }
      if (analysis.claimVerification.contradictions.length > 0) {
        analysis.claimVerification.contradictions.forEach(c => {
          md += `  - 🚨 *${c.type}:* ${c.explanation}\n`;
        });
      }
      md += `- **Technical Skill Fit:** ${analysis.breakdown.skillMatchScore}%\n`;
      md += `- **Matched Core Skills:** ${analysis.matchedMustHave.map(m => `${m.skill}${m.verified ? '' : ' (unverified)'}`).join(', ') || 'None'}\n`;
      if (analysis.missingMustHave.length > 0) {
        md += `- **Missing Core Skills:** ${analysis.missingMustHave.join(', ')}\n`;
      }
      md += `- **Executive Verdict:** ${analysis.explainability.executiveSummary}\n\n`;
    });

    return md;
  };

  const generateJson = () => {
    return JSON.stringify(
      {
        job,
        exportedAt: new Date().toISOString(),
        totalCandidates: results.length,
        rankings: results
      },
      null,
      2
    );
  };

  const content = format === 'markdown' ? generateMarkdown() : generateJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `TalentMatch_${job.title.replace(/\s+/g, '_')}_Dossier.${format === 'markdown' ? 'md' : 'json'}`;
    const blob = new Blob([content], { type: format === 'markdown' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export Recruiter Dossier</h2>
              <p className="text-xs text-slate-300">
                Shareable shortlist report including claim authenticity audit &amp; explainability
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

        {/* Format Selector Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Format:</span>
            <div className="flex bg-slate-200 p-0.5 rounded-lg">
              <button
                onClick={() => setFormat('markdown')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  format === 'markdown'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Markdown (.md)
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  format === 'json'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                JSON (.json)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" /> Download File
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-900 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
