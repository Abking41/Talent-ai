import React, { useState, useEffect, useMemo } from 'react';
import { 
  JobDescription, 
  ResumeCandidate, 
  RankedResult 
} from './types';
import { BENCHMARK_JOBS, BENCHMARK_CANDIDATES } from './data/benchmarks';
import { evaluateCandidateMatch } from './utils/matchingEngine';
import { Header } from './components/Header';
import { FilterToolbar } from './components/FilterToolbar';
import { CandidateCard } from './components/CandidateCard';
import { ScoreDistributionChart } from './components/ScoreDistributionChart';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { CandidateCompareModal } from './components/CandidateCompareModal';
import { JobStudioModal } from './components/JobStudioModal';
import { ResumeUploadModal } from './components/ResumeUploadModal';
import { ExportDossierModal } from './components/ExportDossierModal';
import { 
  ShieldAlert, 
  Sparkles, 
  Award, 
  Info, 
  Upload, 
  FileText, 
  RotateCcw,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState<JobDescription[]>(BENCHMARK_JOBS);
  const [currentJob, setCurrentJob] = useState<JobDescription>(BENCHMARK_JOBS[0]);
  const [candidates, setCandidates] = useState<ResumeCandidate[]>(BENCHMARK_CANDIDATES);
  
  // Modals state
  const [selectedResult, setSelectedResult] = useState<RankedResult | null>(null);
  const [isJobStudioOpen, setIsJobStudioOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>(['cand-elena-rostova', 'cand-marcus-chen-keyword-stuffer']);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [authenticityFilter, setAuthenticityFilter] = useState<'all' | 'clean_only' | 'flagged_only'>('all');
  const [sortBy, setSortBy] = useState<'overall' | 'authenticity' | 'experience' | 'skills'>('overall');

  // Try fetching existing server database if running full-stack
  useEffect(() => {
    fetch('/api/benchmarks')
      .then(res => res.json())
      .then(data => {
        if (data.jobs?.length) setJobs(data.jobs);
        if (data.candidates?.length) setCandidates(data.candidates);
      })
      .catch(err => {
        console.log('Using local benchmark dataset:', err);
      });
  }, []);

  // Compute ranking for all candidates against currentJob
  const rankedAll = useMemo(() => {
    const list: RankedResult[] = candidates.map(cand => {
      const analysis = evaluateCandidateMatch(cand, currentJob);
      return {
        candidate: cand,
        analysis,
        rank: 0
      };
    });

    // Sort by overallScore descending, then authenticityScore
    list.sort((a, b) => {
      if (b.analysis.overallScore !== a.analysis.overallScore) {
        return b.analysis.overallScore - a.analysis.overallScore;
      }
      return b.analysis.breakdown.authenticityScore - a.analysis.breakdown.authenticityScore;
    });

    list.forEach((r, idx) => {
      r.rank = idx + 1;
    });

    return list;
  }, [candidates, currentJob]);

  // Compute filtered & sorted list
  const filteredResults = useMemo(() => {
    return rankedAll
      .filter(item => {
        const { candidate, analysis } = item;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = candidate.name.toLowerCase().includes(q);
          const titleMatch = candidate.currentTitle.toLowerCase().includes(q);
          const skillMatch = candidate.allExtractedSkills.some(s => s.toLowerCase().includes(q));
          const companyMatch = candidate.experience.some(e => e.company.toLowerCase().includes(q));
          if (!nameMatch && !titleMatch && !skillMatch && !companyMatch) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && analysis.fitCategory !== selectedCategory) {
          return false;
        }

        // Min score filter
        if (analysis.overallScore < minScore) {
          return false;
        }

        // Min experience filter
        if (candidate.totalYearsExperience < minExperience) {
          return false;
        }

        // Authenticity filter
        if (authenticityFilter === 'clean_only' && analysis.claimVerification.riskLevel !== 'LOW_RISK') {
          return false;
        }
        if (authenticityFilter === 'flagged_only' && analysis.claimVerification.riskLevel === 'LOW_RISK') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'authenticity') {
          return b.analysis.breakdown.authenticityScore - a.analysis.breakdown.authenticityScore;
        }
        if (sortBy === 'experience') {
          return b.candidate.totalYearsExperience - a.candidate.totalYearsExperience;
        }
        if (sortBy === 'skills') {
          return b.analysis.breakdown.skillMatchScore - a.analysis.breakdown.skillMatchScore;
        }
        // default: overall
        return a.rank - b.rank;
      });
  }, [rankedAll, searchQuery, selectedCategory, minScore, minExperience, authenticityFilter, sortBy]);

  // Count anomaly candidates
  const anomalyCount = useMemo(() => {
    return rankedAll.filter(r => r.analysis.claimVerification.riskLevel !== 'LOW_RISK').length;
  }, [rankedAll]);

  // Candidates for comparison
  const compareCandidates = useMemo(() => {
    return rankedAll.filter(r => compareIds.includes(r.candidate.id));
  }, [rankedAll, compareIds]);

  const handleToggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(prev => prev.filter(cId => cId !== id));
    } else {
      if (compareIds.length >= 3) {
        // limit to 3 candidates
        setCompareIds(prev => [...prev.slice(1), id]);
      } else {
        setCompareIds(prev => [...prev, id]);
      }
    }
  };

  const handleResetBenchmarks = async () => {
    try {
      await fetch('/api/reset-candidates', { method: 'POST' });
    } catch (e) {
      // offline fallback
    }
    setCandidates([...BENCHMARK_CANDIDATES]);
    setJobs([...BENCHMARK_JOBS]);
    setCurrentJob(BENCHMARK_JOBS[0]);
    setCompareIds(['cand-elena-rostova', 'cand-marcus-chen-keyword-stuffer']);
  };

  const handleCandidatesUploaded = (newCandidates: ResumeCandidate[]) => {
    setCandidates(prev => [...newCandidates, ...prev]);
  };

  const handleSaveJob = (updatedJob: JobDescription) => {
    setJobs(prev => {
      const idx = prev.findIndex(j => j.id === updatedJob.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedJob;
        return copy;
      }
      return [updatedJob, ...prev];
    });
    setCurrentJob(updatedJob);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        currentJob={currentJob}
        jobs={jobs}
        onSelectJob={(j) => setCurrentJob(j)}
        onOpenJobStudio={() => setIsJobStudioOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onResetBenchmarks={handleResetBenchmarks}
        candidateCount={candidates.length}
        anomalyCount={anomalyCount}
        selectedCompareCount={compareIds.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* INNOVATION & PROBLEM OVERVIEW BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-full opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-bold uppercase tracking-wider">
                  PS ID: ALG-AI-01
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold inline-flex items-center gap-1">
                  <Award className="w-3 h-3" /> Anti-Keyword Stuffing &amp; Claim Contradiction Engine
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Intelligent Resume Screening &amp; Explainable Matching Platform
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Recruiters receive hundreds of resumes per role. Rather than blindly counting buzzwords, 
                TalentMatch AI parses deep technical evidence, verifies claims against career timelines, 
                penalizes keyword stuffers, and generates transparent, explainable fit breakdowns.
              </p>
            </div>

            {/* Quick Demo Action Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 shrink-0 space-y-2 text-xs">
              <div className="text-[11px] text-indigo-200 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Innovation Highlight
              </div>
              <p className="text-slate-200 text-[11px] max-w-xs leading-normal">
                Compare genuine star <strong className="text-white">Elena Rostova</strong> against keyword stuffer <strong className="text-amber-300">Marcus Chen</strong> and timeline contradictor <strong className="text-rose-300">Sarah Jenkins</strong>!
              </p>
              <button
                onClick={() => {
                  setCompareIds(['cand-elena-rostova', 'cand-marcus-chen-keyword-stuffer', 'cand-sarah-jenkins-contradiction']);
                  setIsCompareOpen(true);
                }}
                className="w-full py-1.5 px-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Launch 3-Way Audit Comparison</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current Job Role Overview Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm">{currentJob.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 text-[11px]">
                {currentJob.seniority}
              </span>
              <span className="text-slate-500">
                • {currentJob.department} • {currentJob.location}
              </span>
            </div>
            <p className="text-slate-600 text-xs line-clamp-1">
              {currentJob.domainSummary}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Scoring Model Weights</div>
              <div className="text-slate-700 font-mono text-[11px]">
                Skills: {currentJob.weights.skillMatch}% | Exp: {currentJob.weights.experienceFit}% | Edu: {currentJob.weights.educationFit}% | Auth: {currentJob.weights.claimAuthenticity}%
              </div>
            </div>
            <button
              onClick={() => setIsJobStudioOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 transition"
            >
              Adjust Weights &amp; Skills
            </button>
          </div>
        </div>

        {/* Talent Analytics & Recharts Score Distribution Visualization */}
        <ScoreDistributionChart
          results={rankedAll}
          job={currentJob}
          onSelectCandidate={(res) => setSelectedResult(res)}
          onFilterCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Search & Filters Toolbar */}
        <FilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          minScore={minScore}
          onMinScoreChange={setMinScore}
          minExperience={minExperience}
          onMinExperienceChange={setMinExperience}
          authenticityFilter={authenticityFilter}
          onAuthenticityFilterChange={setAuthenticityFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onOpenExport={() => setIsExportOpen(true)}
          totalFiltered={filteredResults.length}
          totalCandidates={candidates.length}
        />

        {/* Candidate Cards Grid */}
        {filteredResults.length > 0 ? (
          <div className="space-y-4">
            {filteredResults.map(res => (
              <CandidateCard
                key={res.candidate.id}
                result={res}
                onSelect={(selected) => setSelectedResult(selected)}
                isCompareSelected={compareIds.includes(res.candidate.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No candidates matched your filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try relaxing your minimum score slider, changing the search query, or resetting the filter options.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setMinScore(0);
                setMinExperience(0);
                setAuthenticityFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedResult && (
        <CandidateDetailModal
          result={selectedResult}
          job={currentJob}
          onClose={() => setSelectedResult(null)}
        />
      )}

      {isCompareOpen && (
        <CandidateCompareModal
          candidates={compareCandidates}
          job={currentJob}
          onClose={() => setIsCompareOpen(false)}
          onRemoveCandidate={(id) => setCompareIds(prev => prev.filter(cId => cId !== id))}
        />
      )}

      {isJobStudioOpen && (
        <JobStudioModal
          currentJob={currentJob}
          onSaveJob={handleSaveJob}
          onClose={() => setIsJobStudioOpen(false)}
        />
      )}

      {isUploadOpen && (
        <ResumeUploadModal
          onClose={() => setIsUploadOpen(false)}
          onCandidatesUploaded={handleCandidatesUploaded}
          onResetBenchmarks={handleResetBenchmarks}
        />
      )}

      {isExportOpen && (
        <ExportDossierModal
          results={filteredResults}
          job={currentJob}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
