import React from 'react';
import { JobDescription } from '../types';
import { 
  Briefcase, 
  Upload, 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  Award, 
  FileText,
  GitCompare
} from 'lucide-react';

interface HeaderProps {
  currentJob: JobDescription;
  jobs: JobDescription[];
  onSelectJob: (job: JobDescription) => void;
  onOpenJobStudio: () => void;
  onOpenUpload: () => void;
  onOpenCompare: () => void;
  onResetBenchmarks: () => void;
  candidateCount: number;
  anomalyCount: number;
  selectedCompareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentJob,
  jobs,
  onSelectJob,
  onOpenJobStudio,
  onOpenUpload,
  onOpenCompare,
  onResetBenchmarks,
  candidateCount,
  anomalyCount,
  selectedCompareCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">TalentMatch AI</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold">
                  ALG-AI-01
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Award className="w-3 h-3" /> Anti-Keyword Stuffing Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Explainable Resume Scoring &amp; Contradiction Verification System
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200/80 text-xs">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Pool:</span>
              <span className="font-semibold text-slate-800">{candidateCount} resumes</span>
            </div>
            <div className="w-px h-3.5 bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-slate-500">Contradictions Flagged:</span>
              <span className="font-semibold text-amber-700">{anomalyCount} candidates</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCompareCount >= 2
                  ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Compare candidates side-by-side"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare</span>
              {selectedCompareCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {selectedCompareCount}
                </span>
              )}
            </button>

            {/* Reset to benchmark dataset */}
            <button
              onClick={onResetBenchmarks}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs transition"
              title="Reset candidates to 8 diverse benchmark test profiles"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-medium transition shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Upload Resumes</span>
            </button>

            {/* Job Description Studio Button */}
            <button
              onClick={onOpenJobStudio}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Role &amp; Weights</span>
              <span className="sm:hidden">Role</span>
            </button>
          </div>
        </div>

        {/* Current Job Role Switcher Bar */}
        <div className="py-2 flex items-center justify-between border-t border-slate-100 text-xs overflow-x-auto gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Target Role:
            </span>
            <select
              value={currentJob.id}
              onChange={(e) => {
                const found = jobs.find(j => j.id === e.target.value);
                if (found) onSelectJob(found);
              }}
              className="font-semibold text-slate-800 bg-transparent hover:bg-slate-100/80 px-2 py-1 rounded cursor-pointer border border-transparent hover:border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate max-w-[280px] sm:max-w-md"
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.seniority} • {job.minExperienceYears}+ yrs)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-slate-500 text-[11px]">
            <span className="hidden sm:inline">
              Must-Have: <strong className="text-slate-700">{currentJob.mustHaveSkills.length} skills</strong>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden md:inline">
              Min Exp: <strong className="text-slate-700">{currentJob.minExperienceYears} yrs</strong>
            </span>
            <button 
              onClick={onOpenJobStudio}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2"
            >
              Edit Criteria
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
