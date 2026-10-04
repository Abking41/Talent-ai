import React, { useState } from 'react';
import { JobDescription } from '../types';
import { 
  X, 
  Sliders, 
  Plus, 
  Trash2, 
  Check, 
  Briefcase, 
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { BENCHMARK_JOBS } from '../data/benchmarks';

interface JobStudioModalProps {
  currentJob: JobDescription;
  onSaveJob: (updatedJob: JobDescription) => void;
  onClose: () => void;
}

export const JobStudioModal: React.FC<JobStudioModalProps> = ({
  currentJob,
  onSaveJob,
  onClose
}) => {
  const [job, setJob] = useState<JobDescription>({ ...currentJob });
  const [newMustHave, setNewMustHave] = useState('');
  const [newNiceToHave, setNewNiceToHave] = useState('');

  const handleAddMustHave = () => {
    if (!newMustHave.trim()) return;
    if (!job.mustHaveSkills.includes(newMustHave.trim())) {
      setJob({
        ...job,
        mustHaveSkills: [...job.mustHaveSkills, newMustHave.trim()]
      });
    }
    setNewMustHave('');
  };

  const handleRemoveMustHave = (skill: string) => {
    setJob({
      ...job,
      mustHaveSkills: job.mustHaveSkills.filter(s => s !== skill)
    });
  };

  const handleAddNiceToHave = () => {
    if (!newNiceToHave.trim()) return;
    if (!job.niceToHaveSkills.includes(newNiceToHave.trim())) {
      setJob({
        ...job,
        niceToHaveSkills: [...job.niceToHaveSkills, newNiceToHave.trim()]
      });
    }
    setNewNiceToHave('');
  };

  const handleRemoveNiceToHave = (skill: string) => {
    setJob({
      ...job,
      niceToHaveSkills: job.niceToHaveSkills.filter(s => s !== skill)
    });
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = BENCHMARK_JOBS.find(j => j.id === presetId);
    if (preset) {
      setJob({ ...preset });
    }
  };

  const handleSave = () => {
    onSaveJob(job);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Job Description &amp; Scoring Studio</h2>
              <p className="text-xs text-slate-300">
                Configure job requirements, must-have skills, and multi-factor ranking weights
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

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Preset Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-2">
              Select Preset Role:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {BENCHMARK_JOBS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  type="button"
                  className={`p-2.5 rounded-xl border text-left transition ${
                    job.id === preset.id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="font-semibold truncate">{preset.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{preset.minExperienceYears}+ yrs • {preset.mustHaveSkills.length} skills</div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
              <input
                type="text"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Seniority Level</label>
              <select
                value={job.seniority}
                onChange={(e) => setJob({ ...job, seniority: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Architect</option>
                <option value="Staff / Principal">Staff / Principal</option>
                <option value="Executive">Executive / Director</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Min Experience (Years)</label>
              <input
                type="number"
                min={0}
                max={20}
                value={job.minExperienceYears}
                onChange={(e) => setJob({ ...job, minExperienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Minimum Education</label>
              <select
                value={job.requiredDegree}
                onChange={(e) => setJob({ ...job, requiredDegree: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Any">Any / No Degree Required</option>
                <option value="Bachelors">Bachelors Degree</option>
                <option value="Masters">Masters Degree</option>
                <option value="PhD">Ph.D. / Doctorate</option>
              </select>
            </div>
          </div>

          {/* Must-Have Skills Tagging */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">
                Must-Have Skills (Strict Criteria):
              </label>
              <span className="text-[11px] text-slate-400">{job.mustHaveSkills.length} defined</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[44px] items-center mb-2">
              {job.mustHaveSkills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2.5 py-1 rounded-md text-slate-800 font-medium shadow-xs"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveMustHave(skill)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add must-have skill (e.g. PyTorch, CUDA, React)..."
                value={newMustHave}
                onChange={(e) => setNewMustHave(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMustHave();
                  }
                }}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMustHave}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Nice-To-Have Skills Tagging */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">
                Nice-To-Have Skills (Bonus Points):
              </label>
              <span className="text-[11px] text-slate-400">{job.niceToHaveSkills.length} defined</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[44px] items-center mb-2">
              {job.niceToHaveSkills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2.5 py-1 rounded-md text-slate-800 font-medium shadow-xs"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveNiceToHave(skill)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add nice-to-have skill (e.g. Triton, GraphQL)..."
                value={newNiceToHave}
                onChange={(e) => setNewNiceToHave(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNiceToHave();
                  }
                }}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddNiceToHave}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Scoring Weights Customization */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Multi-Factor Ranking Weights
            </h4>
            <p className="text-[11px] text-slate-500">
              Customize how candidates are evaluated. The Claim Authenticity factor heavily discounts keyword stuffers and contradictory timelines.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Technical Skill Match Weight</span>
                  <strong className="font-mono text-indigo-700">{job.weights.skillMatch}%</strong>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={job.weights.skillMatch}
                  onChange={(e) => setJob({
                    ...job,
                    weights: { ...job.weights, skillMatch: Number(e.target.value) }
                  })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Experience Tenure Weight</span>
                  <strong className="font-mono text-indigo-700">{job.weights.experienceFit}%</strong>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={job.weights.experienceFit}
                  onChange={(e) => setJob({
                    ...job,
                    weights: { ...job.weights, experienceFit: Number(e.target.value) }
                  })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Education Alignment Weight</span>
                  <strong className="font-mono text-indigo-700">{job.weights.educationFit}%</strong>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={job.weights.educationFit}
                  onChange={(e) => setJob({
                    ...job,
                    weights: { ...job.weights, educationFit: Number(e.target.value) }
                  })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Claim Authenticity Penalty Weight</span>
                  <strong className="font-mono text-rose-600">{job.weights.claimAuthenticity}%</strong>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  value={job.weights.claimAuthenticity}
                  onChange={(e) => setJob({
                    ...job,
                    weights: { ...job.weights, claimAuthenticity: Number(e.target.value) }
                  })}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save &amp; Re-Rank Candidates
          </button>
        </div>
      </div>
    </div>
  );
};
