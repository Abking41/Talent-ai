import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw,
  Loader2,
  FileCheck
} from 'lucide-react';
import { ResumeCandidate } from '../types';

interface ResumeUploadModalProps {
  onClose: () => void;
  onCandidatesUploaded: (newCandidates: ResumeCandidate[]) => void;
  onResetBenchmarks: () => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  onClose,
  onCandidatesUploaded,
  onResetBenchmarks
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasteCandidateName, setPasteCandidateName] = useState('');
  const [pasteResumeText, setPasteResumeText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setStatusMessage(`Parsing and analyzing ${selectedFiles.length} file(s)...`);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('resumes', file);
      });

      const response = await fetch('/api/extract-resume', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        onCandidatesUploaded(data.candidates);
        setStatusMessage(`Successfully extracted ${data.candidates.length} candidates!`);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        throw new Error('No candidate data returned.');
      }
    } catch (err: any) {
      console.error('Error during resume upload:', err);
      setErrorMessage(err.message || 'Error parsing uploaded resumes.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pasteResumeText.trim()) return;
    setIsProcessing(true);
    setStatusMessage('Analyzing and extracting pasted resume...');
    setErrorMessage(null);

    try {
      // Create a virtual file to upload through the standard extraction route
      const blob = new Blob([pasteResumeText], { type: 'text/plain' });
      const fileName = `${(pasteCandidateName.trim() || 'Custom_Candidate').replace(/\s+/g, '_')}_Resume.txt`;
      const file = new File([blob], fileName, { type: 'text/plain' });

      const formData = new FormData();
      formData.append('resumes', file);

      const response = await fetch('/api/extract-resume', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        onCandidatesUploaded(data.candidates);
        onClose();
      }
    } catch (err: any) {
      console.error('Error in pasted text extraction:', err);
      setErrorMessage(err.message || 'Error processing pasted text.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Ingest &amp; Extract Resumes</h2>
              <p className="text-xs text-slate-300">
                Support for PDF, DOCX, TXT, OCR scans, and messy candidate documents
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

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs px-6">
          <button
            onClick={() => setActiveMode('upload')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeMode === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Batch File Upload (PDF / DOCX / TXT)
          </button>
          <button
            onClick={() => setActiveMode('paste')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeMode === 'paste'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste Text or Messy OCR Scan
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
          
          {activeMode === 'upload' ? (
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Click to select resumes or drag &amp; drop here
                </h4>
                <p className="text-slate-500 mt-1">
                  Supports PDF, DOCX, TXT (up to 15 files at once)
                </p>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  Automatic OCR artifact repair &amp; information extraction
                </div>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Selected Files ({selectedFiles.length}):</span>
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="text-slate-400 hover:text-rose-600 text-[11px]"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-lg p-2 bg-slate-50">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-slate-200 text-xs">
                        <span className="truncate max-w-xs font-medium text-slate-800">{file.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Reset to Benchmark Test Suite */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800">Need sample resumes to test?</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Preloaded with 8 diverse test profiles (Stars, Keyword Stuffer, Timeline Contradiction, Messy OCR).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetBenchmarks();
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs transition inline-flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Load Test Pack
                </button>
              </div>
            </div>
          ) : (
            /* Paste Text Mode */
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Candidate Name (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Vance"
                  value={pasteCandidateName}
                  onChange={(e) => setPasteCandidateName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Paste Resume or Messy OCR Text:
                </label>
                <textarea
                  rows={9}
                  placeholder={`Paste full resume text or messy OCR scan with typos, broken lines, or bullet artifacts here...

Example:
ALEX MERCER ??? Austin, TX
Em@il: alex [dot] ml [at] gmail.com
EXPERIENCE:
* HyperScale Systems (2022-Pres): ML Platform Eng.
  - Deployed scalable PyTorch inference endpoints w/ vLLM on AWS EKS
EDUCATION:
Univ of Texas ??? B.S. Computer Engineering (2020)`}
                  value={pasteResumeText}
                  onChange={(e) => setPasteResumeText(e.target.value)}
                  className="w-full font-mono text-[11px] p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* Status and Error Messages */}
          {statusMessage && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
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

          {activeMode === 'upload' ? (
            <button
              type="button"
              disabled={selectedFiles.length === 0 || isProcessing}
              onClick={handleUploadFiles}
              className={`px-5 py-2 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                selectedFiles.length === 0 || isProcessing
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Extract &amp; Rank ({selectedFiles.length})
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={!pasteResumeText.trim() || isProcessing}
              onClick={handlePasteSubmit}
              className={`px-5 py-2 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                !pasteResumeText.trim() || isProcessing
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Extract &amp; Rank
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
