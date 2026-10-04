import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  ReferenceLine, 
  CartesianGrid 
} from 'recharts';
import { RankedResult, JobDescription } from '../types';
import { 
  BarChart3, 
  ScatterChart as ScatterIcon, 
  Sparkles, 
  ShieldAlert, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ScoreDistributionChartProps {
  results: RankedResult[];
  job: JobDescription;
  onSelectCandidate?: (result: RankedResult) => void;
  onFilterCategory?: (category: string) => void;
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
  results,
  job,
  onSelectCandidate,
  onFilterCategory
}) => {
  const [viewMode, setViewMode] = useState<'histogram' | 'quadrant'>('histogram');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 1. Calculate Score Distribution Buckets (Histogram)
  const buckets = [
    {
      range: '90-100%',
      label: 'Top Tier (90-100%)',
      shortLabel: '90-100%',
      category: 'Strong Match',
      min: 90,
      max: 100,
      color: '#059669', // Emerald 600
      count: 0,
      candidates: [] as RankedResult[]
    },
    {
      range: '75-89%',
      label: 'Solid Match (75-89%)',
      shortLabel: '75-89%',
      category: 'Good Match',
      min: 75,
      max: 89,
      color: '#4f46e5', // Indigo 600
      count: 0,
      candidates: [] as RankedResult[]
    },
    {
      range: '60-74%',
      label: 'Viable / Partial (60-74%)',
      shortLabel: '60-74%',
      category: 'Partial Match',
      min: 60,
      max: 74,
      color: '#0284c7', // Sky 600
      count: 0,
      candidates: [] as RankedResult[]
    },
    {
      range: '45-59%',
      label: 'Borderline (45-59%)',
      shortLabel: '45-59%',
      category: 'Low Fit',
      min: 45,
      max: 59,
      color: '#d97706', // Amber 600
      count: 0,
      candidates: [] as RankedResult[]
    },
    {
      range: '<45%',
      label: 'High Risk / Low (<45%)',
      shortLabel: '<45%',
      category: 'High Risk / Unverified',
      min: 0,
      max: 44,
      color: '#e11d48', // Rose 600
      count: 0,
      candidates: [] as RankedResult[]
    }
  ];

  results.forEach(res => {
    const score = res.analysis.overallScore;
    for (const b of buckets) {
      if (score >= b.min && score <= b.max) {
        b.count += 1;
        b.candidates.push(res);
        break;
      }
    }
  });

  // 2. Metrics summary
  const total = results.length;
  const scores = results.map(r => r.analysis.overallScore).sort((a, b) => a - b);
  const avgScore = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
  const medianScore = total > 0 ? scores[Math.floor(total / 2)] : 0;
  const topScore = total > 0 ? scores[scores.length - 1] : 0;
  const topTierCount = buckets[0].count;
  const topTierPercent = total > 0 ? Math.round((topTierCount / total) * 100) : 0;
  const flaggedCount = results.filter(r => r.analysis.claimVerification.riskLevel !== 'LOW_RISK').length;

  // 3. Scatter Data: Technical Skills vs Authenticity
  const scatterData = results.map(res => ({
    name: res.candidate.name,
    title: res.candidate.currentTitle,
    overallScore: res.analysis.overallScore,
    skillScore: res.analysis.breakdown.skillMatchScore,
    authenticityScore: res.analysis.breakdown.authenticityScore,
    riskLevel: res.analysis.claimVerification.riskLevel,
    result: res,
    fill: res.analysis.claimVerification.riskLevel === 'HIGH_ANOMALY' 
      ? '#e11d48' 
      : res.analysis.overallScore >= 85 
      ? '#059669' 
      : '#4f46e5'
  }));

  // Custom Tooltip for Histogram
  const CustomHistogramTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5">
            <span className="font-bold">{data.label}</span>
            <span className="font-mono text-emerald-400 font-bold">{data.count} candidate(s)</span>
          </div>
          {data.candidates.length > 0 ? (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Candidates in this bracket:</span>
              {data.candidates.map((c: RankedResult) => (
                <div key={c.candidate.id} className="flex items-center justify-between text-[11px] gap-2">
                  <span className="truncate text-slate-200 font-medium">#{c.rank} {c.candidate.name}</span>
                  <span className={`font-mono text-[10px] px-1 rounded ${
                    c.analysis.claimVerification.riskLevel === 'HIGH_ANOMALY' ? 'bg-rose-900/60 text-rose-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {c.analysis.overallScore}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">No candidates in this tier</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Scatter
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs space-y-1 z-50">
          <div className="font-bold text-sm text-white flex items-center justify-between gap-2">
            <span>{pt.name}</span>
            <span className="font-mono text-indigo-300 font-bold">{pt.overallScore}% Fit</span>
          </div>
          <p className="text-[11px] text-slate-400">{pt.title}</p>
          <div className="pt-2 border-t border-slate-700 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Technical Skill Fit:</span>
              <strong className="font-mono text-indigo-300">{pt.skillScore}%</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Authenticity Score:</span>
              <strong className={`font-mono ${pt.authenticityScore < 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {pt.authenticityScore}%
              </strong>
            </div>
          </div>
          {pt.riskLevel === 'HIGH_ANOMALY' && (
            <div className="mt-1 pt-1 border-t border-rose-900 text-[10px] text-rose-400 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Flagged for Contradictions / Keyword Stuffing
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-6 space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            {viewMode === 'histogram' ? (
              <BarChart3 className="w-4 h-4" />
            ) : (
              <ScatterIcon className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Applicant Pool Score Distribution &amp; Talent Analytics
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Recharts AI
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Visualizing how {total} candidate(s) score against <strong className="text-slate-700">{job.title}</strong>
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Collapse Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('histogram')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                viewMode === 'histogram'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Score Tiers</span>
            </button>
            <button
              onClick={() => setViewMode('quadrant')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                viewMode === 'quadrant'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Skill Match vs Authenticity Quadrant"
            >
              <ScatterIcon className="w-3 h-3" />
              <span>Skill vs Authenticity Matrix</span>
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title={isCollapsed ? 'Expand chart' : 'Collapse chart'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Top Match Score</span>
              <span className="font-mono text-base font-bold text-emerald-600">{topScore}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Pool Median Score</span>
              <span className="font-mono text-base font-bold text-slate-900">{medianScore}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Pool Average</span>
              <span className="font-mono text-base font-bold text-slate-900">{avgScore}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Strong Match Pool</span>
              <span className="font-mono text-base font-bold text-indigo-600">
                {topTierCount} ({topTierPercent}%)
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 block">Flagged Anomalies</span>
              <span className="font-mono text-base font-bold text-rose-600">{flaggedCount} candidates</span>
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="pt-2">
            {viewMode === 'histogram' ? (
              <div className="space-y-3">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={buckets}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="shortLabel" 
                        tickLine={false} 
                        axisLine={{ stroke: '#e2e8f0' }} 
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                      />
                      <YAxis 
                        allowDecimals={false} 
                        tickLine={false} 
                        axisLine={{ stroke: '#e2e8f0' }} 
                        tick={{ fill: '#64748b', fontSize: 11 }}
                      />
                      <Tooltip content={<CustomHistogramTooltip />} />
                      <Bar 
                        dataKey="count" 
                        radius={[6, 6, 0, 0]} 
                        className="cursor-pointer"
                        onClick={(data: any) => {
                          if (data && onFilterCategory && data.category) {
                            onFilterCategory(data.category);
                          }
                        }}
                      >
                        {buckets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Interactive Legend Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                  {buckets.map(b => (
                    <button
                      key={b.range}
                      onClick={() => onFilterCategory && onFilterCategory(b.category)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-[11px]"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                      <span className="font-semibold text-slate-700">{b.shortLabel}:</span>
                      <span className="font-mono text-slate-900 font-bold">{b.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Scatter Quadrant Matrix: Technical Skill Fit (X) vs Authenticity Score (Y) */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                    <strong>Top Right:</strong> High Skill &amp; High Authenticity (Genuine Stars)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                    <strong>Bottom Right:</strong> High Claimed Skills but Low Authenticity (Keyword Stuffers / Fraud Risk)
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 15, right: 20, bottom: 15, left: -10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        type="number" 
                        dataKey="skillScore" 
                        name="Skill Fit" 
                        domain={[0, 100]} 
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        label={{ value: 'Technical Skill Match (%) →', position: 'bottom', offset: -5, fontSize: 11, fill: '#475569' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="authenticityScore" 
                        name="Authenticity" 
                        domain={[0, 100]} 
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        label={{ value: 'Authenticity & Claim Integrity (%) →', angle: -90, position: 'left', offset: 15, fontSize: 11, fill: '#475569' }}
                      />
                      <ZAxis range={[100, 100]} />
                      <Tooltip content={<CustomScatterTooltip />} />
                      
                      {/* Quadrant Guide Lines */}
                      <ReferenceLine x={70} stroke="#cbd5e1" strokeDasharray="4 4" />
                      <ReferenceLine y={70} stroke="#cbd5e1" strokeDasharray="4 4" />

                      <Scatter 
                        data={scatterData} 
                        className="cursor-pointer"
                        onClick={(entry: any) => {
                          if (entry && onSelectCandidate && entry.result) {
                            onSelectCandidate(entry.result);
                          }
                        }}
                      >
                        {scatterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="#ffffff" strokeWidth={2} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
