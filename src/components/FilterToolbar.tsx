import React from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowUpDown, 
  Download,
  CheckCircle2,
  X
} from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  minScore: number;
  onMinScoreChange: (score: number) => void;
  minExperience: number;
  onMinExperienceChange: (exp: number) => void;
  authenticityFilter: 'all' | 'clean_only' | 'flagged_only';
  onAuthenticityFilterChange: (val: 'all' | 'clean_only' | 'flagged_only') => void;
  sortBy: 'overall' | 'authenticity' | 'experience' | 'skills';
  onSortByChange: (sort: 'overall' | 'authenticity' | 'experience' | 'skills') => void;
  onOpenExport: () => void;
  totalFiltered: number;
  totalCandidates: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  minScore,
  onMinScoreChange,
  minExperience,
  onMinExperienceChange,
  authenticityFilter,
  onAuthenticityFilterChange,
  sortBy,
  onSortByChange,
  onOpenExport,
  totalFiltered,
  totalCandidates
}) => {
  const categories = [
    { id: 'all', label: 'All Candidates' },
    { id: 'Strong Match', label: 'Strong Matches' },
    { id: 'Good Match', label: 'Good Matches' },
    { id: 'Partial Match', label: 'Partial' },
    { id: 'High Risk / Unverified', label: '🚨 High Risk / Anomalies' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3.5 mb-6">
      {/* Top Search & Key Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidate name, skill (e.g. PyTorch, CUDA), current company, or title..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Export Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs"
            >
              <option value="overall">Match Score (High to Low)</option>
              <option value="authenticity">Authenticity (Least Suspicious)</option>
              <option value="experience">Experience (Years)</option>
              <option value="skills">Technical Skill Fit</option>
            </select>
          </div>

          <button
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Export candidate ranking report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Advanced Sliders */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {categories.map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Authenticity Engine Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => onAuthenticityFilterChange('all')}
            className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition ${
              authenticityFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Pools
          </button>
          <button
            onClick={() => onAuthenticityFilterChange('clean_only')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] transition ${
              authenticityFilter === 'clean_only'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
            title="Show only candidates with no keyword stuffing or timeline contradictions"
          >
            <ShieldCheck className="w-3 h-3" />
            Clean Only
          </button>
          <button
            onClick={() => onAuthenticityFilterChange('flagged_only')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] transition ${
              authenticityFilter === 'flagged_only'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
            title="Inspect candidates flagged with suspicious claims"
          >
            <ShieldAlert className="w-3 h-3" />
            Flagged Only
          </button>
        </div>
      </div>

      {/* Sliders for Min Score and Min Experience */}
      <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Min Match Score:</span>
          <input
            type="range"
            min={0}
            max={90}
            step={5}
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
          <span className="font-semibold text-indigo-700 font-mono w-9">{minScore}%</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Min Experience:</span>
          <input
            type="range"
            min={0}
            max={8}
            step={1}
            value={minExperience}
            onChange={(e) => onMinExperienceChange(Number(e.target.value))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
          <span className="font-semibold text-indigo-700 font-mono w-9">{minExperience}+ yrs</span>
        </div>

        <div className="ml-auto text-[11px] text-slate-400">
          Showing <span className="font-semibold text-slate-700">{totalFiltered}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalCandidates}</span> candidates
        </div>
      </div>
    </div>
  );
};
