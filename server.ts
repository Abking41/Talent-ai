import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { GoogleGenAI, Type } from '@google/genai';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';
import { cleanMessyText, evaluateCandidateMatch } from './src/utils/matchingEngine.ts';
import { BENCHMARK_JOBS, BENCHMARK_CANDIDATES } from './src/data/benchmarks.ts';
import type { JobDescription, ResumeCandidate } from './src/types/index.ts';

dotenv.config();

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer in-memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// In-memory candidate storage (allows users to upload and persist candidates in-memory)
let candidateDatabase: ResumeCandidate[] = [...BENCHMARK_CANDIDATES];

// API: Health Check for Cloud Run Deployment & Monitoring
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', app: 'TalentMatch AI', port });
});

// API: Get Benchmark Jobs & Candidates
app.get('/api/benchmarks', (_req: Request, res: Response) => {
  res.json({
    jobs: BENCHMARK_JOBS,
    candidates: candidateDatabase
  });
});

// API: Reset Database to Benchmarks
app.post('/api/reset-candidates', (_req: Request, res: Response) => {
  candidateDatabase = [...BENCHMARK_CANDIDATES];
  res.json({ success: true, count: candidateDatabase.length });
});

// Extract text from uploaded buffer based on file type
async function extractRawTextFromFile(buffer: Buffer, originalname: string, mimetype: string): Promise<string> {
  const ext = path.extname(originalname).toLowerCase();
  
  if (ext === '.pdf' || mimetype === 'application/pdf') {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (e) {
      console.warn('PDF parse fallback:', e);
      return buffer.toString('utf-8');
    }
  } else if (ext === '.docx' || mimetype.includes('wordprocessingml')) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (e) {
      console.warn('Mammoth parse fallback:', e);
      return buffer.toString('utf-8');
    }
  } else {
    // Plain text / markdown / json / csv / etc.
    return buffer.toString('utf-8');
  }
}

// API: Upload and Extract Resumes
app.post('/api/extract-resume', upload.array('resumes', 15), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const extractedCandidates: ResumeCandidate[] = [];

    for (const file of files) {
      const rawExtracted = await extractRawTextFromFile(file.buffer, file.originalname, file.mimetype);
      const { cleaned, issues, qualityScore } = cleanMessyText(rawExtracted);

      let candidate: ResumeCandidate;

      // Try AI extraction if API key is set
      if (process.env.GEMINI_API_KEY) {
        try {
          const prompt = `You are a high-precision Resume Information Extraction Engine for a top tech recruitment platform.
Extract the structured profile from this resume.
Notice if the resume has OCR artifacts, typo noise, or messy formatting, clean it up intelligently.
Extract all claimed skills accurately, and maintain separation between what is proven in employment vs merely listed in a skills block.

Resume Text:
---
${cleaned}
---`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  currentTitle: { type: Type.STRING },
                  totalYearsExperience: { type: Type.NUMBER },
                  summary: { type: Type.STRING },
                  education: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        degree: { type: Type.STRING },
                        field: { type: Type.STRING },
                        institution: { type: Type.STRING },
                        graduationYear: { type: Type.STRING },
                        gpa: { type: Type.STRING },
                        honors: { type: Type.STRING }
                      },
                      required: ['degree', 'field', 'institution']
                    }
                  },
                  experience: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        company: { type: Type.STRING },
                        title: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        startYear: { type: Type.NUMBER },
                        endYear: { type: Type.STRING },
                        isCurrent: { type: Type.BOOLEAN },
                        bullets: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        techStack: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                      },
                      required: ['company', 'title', 'bullets']
                    }
                  },
                  allExtractedSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  softSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  projects: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        techStack: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                      },
                      required: ['name', 'description']
                    }
                  }
                },
                required: ['name', 'currentTitle', 'totalYearsExperience', 'allExtractedSkills']
              }
            }
          });

          const parsed = JSON.parse(response.text || '{}');
          candidate = {
            id: `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: parsed.name || path.basename(file.originalname, path.extname(file.originalname)),
            email: parsed.email || '',
            phone: parsed.phone || '',
            location: parsed.location || '',
            currentTitle: parsed.currentTitle || 'Software Engineer',
            totalYearsExperience: typeof parsed.totalYearsExperience === 'number' ? parsed.totalYearsExperience : 3.0,
            summary: parsed.summary || 'Extracted candidate profile.',
            education: parsed.education || [],
            experience: parsed.experience || [],
            technicalSkills: {
              'Extracted Skills': parsed.allExtractedSkills || []
            },
            allExtractedSkills: parsed.allExtractedSkills || [],
            softSkills: parsed.softSkills || [],
            projects: parsed.projects || [],
            rawText: cleaned,
            fileName: file.originalname,
            fileType: file.mimetype,
            parsingQuality: {
              score: qualityScore,
              isMessyOcr: issues.length > 0,
              issues
            },
            createdAt: new Date().toISOString()
          };
        } catch (geminiErr) {
          console.warn('Gemini extraction fallback:', geminiErr);
          candidate = fallbackHeuristicExtraction(cleaned, file.originalname, file.mimetype, issues, qualityScore);
        }
      } else {
        candidate = fallbackHeuristicExtraction(cleaned, file.originalname, file.mimetype, issues, qualityScore);
      }

      candidateDatabase.unshift(candidate);
      extractedCandidates.push(candidate);
    }

    res.json({
      success: true,
      candidates: extractedCandidates,
      totalCount: candidateDatabase.length
    });
  } catch (err: any) {
    console.error('Error processing resume upload:', err);
    res.status(500).json({ error: err.message || 'Internal server error while extracting resume.' });
  }
});

// Heuristic fallback parser when AI key is unavailable or during rate limits
function fallbackHeuristicExtraction(
  text: string,
  fileName: string,
  fileType: string,
  issues: string[],
  qualityScore: number
): ResumeCandidate {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const nameCandidate = lines[0]?.replace(/[•|]/g, '').trim() || 'Candidate ' + fileName;
  
  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract common tech skills
  const commonTech = [
    'Python', 'PyTorch', 'TensorFlow', 'CUDA', 'Distributed Training', 'vLLM', 'Kubernetes',
    'Docker', 'C++', 'Go', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'PostgreSQL',
    'AWS', 'GCP', 'SQL', 'DeepSpeed', 'Triton', 'TensorRT', 'Slurm', 'Ray', 'Microservices'
  ];

  const foundSkills = commonTech.filter(tech => {
    const reg = new RegExp(`\\b${tech}\\b`, 'i');
    return reg.test(text);
  });

  return {
    id: `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: nameCandidate.length < 50 ? nameCandidate : 'Applicant',
    email,
    phone,
    location: 'Remote / Unspecified',
    currentTitle: 'Engineer / Candidate',
    totalYearsExperience: 4.0,
    summary: lines.slice(1, 4).join(' ') || 'Candidate resume extracted.',
    education: [
      {
        degree: 'Degree',
        field: 'Computer Science / Engineering',
        institution: 'University',
        graduationYear: 2021
      }
    ],
    experience: [
      {
        company: 'Previous Employer',
        title: 'Software / ML Engineer',
        duration: '2021 - Present',
        startYear: 2021,
        endYear: 'Present',
        isCurrent: true,
        bullets: lines.slice(4, 8),
        techStack: foundSkills.slice(0, 5)
      }
    ],
    technicalSkills: {
      'Identified Skills': foundSkills
    },
    allExtractedSkills: foundSkills.length > 0 ? foundSkills : ['Python', 'SQL', 'Git'],
    softSkills: ['Problem Solving', 'Teamwork'],
    projects: [],
    rawText: text,
    fileName,
    fileType,
    parsingQuality: {
      score: qualityScore,
      isMessyOcr: issues.length > 0,
      issues
    },
    createdAt: new Date().toISOString()
  };
}

// API: Analyze Match for Candidate against Job Description
app.post('/api/analyze-match', async (req: Request, res: Response) => {
  try {
    const { candidate, job } = req.body as { candidate: ResumeCandidate; job: JobDescription };
    if (!candidate || !job) {
      return res.status(400).json({ error: 'Candidate and JobDescription are required.' });
    }

    // Always run deterministic engine first
    const baseAnalysis = evaluateCandidateMatch(candidate, job);

    // If Gemini API is available, enrich with deep reasoning & customized probing questions
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are the Lead Technical Recruiter and Claim Verification Specialist at an elite tech recruitment firm.
Analyze this candidate against the job description with strict scrutiny against keyword stuffing and contradictory claims.

JOB DESCRIPTION:
Role: ${job.title} (${job.seniority})
Required Years: ${job.minExperienceYears}+
Must-Have Skills: ${job.mustHaveSkills.join(', ')}
Nice-To-Have Skills: ${job.niceToHaveSkills.join(', ')}
Required Degree: ${job.requiredDegree}
Context: ${job.rawDescription}

CANDIDATE PROFILE:
Name: ${candidate.name}
Current Title: ${candidate.currentTitle}
Claimed Years: ${candidate.totalYearsExperience}
Education: ${JSON.stringify(candidate.education)}
Experience: ${JSON.stringify(candidate.experience.map(e => ({ company: e.company, title: e.title, duration: e.duration, bullets: e.bullets })))}
Claimed Skills Section: ${candidate.allExtractedSkills.join(', ')}

BASE VERIFICATION FINDINGS:
- Authenticity Score: ${baseAnalysis.claimVerification.authenticityScore}
- Keyword Stuffing Alert: ${baseAnalysis.claimVerification.keywordStuffingDetected}
- Contradictions: ${JSON.stringify(baseAnalysis.claimVerification.contradictions)}

YOUR TASK:
Provide an expert recruiter assessment with:
1. Executive Summary (2-3 sentences: verdict, key reason)
2. Why Match Bullets (2-3 specific points with actual resume evidence)
3. Gaps & Concerns Bullets (include any keyword stuffing or timeline contradictions if present)
4. 3 Probing Interview Questions: Tailored directly to this candidate to test suspicious claims or verify technical depth.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                executiveSummary: { type: Type.STRING },
                whyMatchBullets: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                gapsAndConcernsBullets: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                suggestedInterviewQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      question: { type: Type.STRING },
                      targetClaimOrSkill: { type: Type.STRING },
                      whatToListenFor: { type: Type.STRING }
                    },
                    required: ['category', 'question', 'targetClaimOrSkill', 'whatToListenFor']
                  }
                }
              },
              required: ['executiveSummary', 'whyMatchBullets', 'gapsAndConcernsBullets', 'suggestedInterviewQuestions']
            }
          }
        });

        const geminiResult = JSON.parse(response.text || '{}');
        if (geminiResult.executiveSummary) {
          baseAnalysis.explainability.executiveSummary = geminiResult.executiveSummary;
        }
        if (geminiResult.whyMatchBullets?.length) {
          baseAnalysis.explainability.whyMatchBullets = geminiResult.whyMatchBullets;
        }
        if (geminiResult.gapsAndConcernsBullets?.length) {
          baseAnalysis.explainability.gapsAndConcernsBullets = geminiResult.gapsAndConcernsBullets;
        }
        if (geminiResult.suggestedInterviewQuestions?.length) {
          baseAnalysis.explainability.suggestedInterviewQuestions = geminiResult.suggestedInterviewQuestions as any;
        }
      } catch (geminiErr) {
        console.warn('Gemini match enrichment fallback:', geminiErr);
      }
    }

    res.json(baseAnalysis);
  } catch (err: any) {
    console.error('Error in analyze-match:', err);
    res.status(500).json({ error: err.message || 'Internal server error while analyzing match.' });
  }
});

// API: Batch Rank Candidates against Job Description
app.post('/api/batch-rank', async (req: Request, res: Response) => {
  try {
    const { candidates, job } = req.body as { candidates: ResumeCandidate[]; job: JobDescription };
    if (!candidates || !job) {
      return res.status(400).json({ error: 'candidates and job are required.' });
    }

    const results = candidates.map(candidate => {
      const analysis = evaluateCandidateMatch(candidate, job);
      return {
        candidate,
        analysis,
        rank: 0
      };
    });

    // Sort by overallScore descending, then by authenticityScore descending
    results.sort((a, b) => {
      if (b.analysis.overallScore !== a.analysis.overallScore) {
        return b.analysis.overallScore - a.analysis.overallScore;
      }
      return b.analysis.breakdown.authenticityScore - a.analysis.breakdown.authenticityScore;
    });

    // Assign rank 1-based
    results.forEach((r, idx) => {
      r.rank = idx + 1;
    });

    res.json({
      success: true,
      jobId: job.id,
      totalRanked: results.length,
      results
    });
  } catch (err: any) {
    console.error('Error in batch-rank:', err);
    res.status(500).json({ error: err.message || 'Error running batch ranking.' });
  }
});

// Mount Vite or serve static files
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  if (process.env.NODE_ENV === 'production' && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`TalentMatch AI server running on http://0.0.0.0:${port}`);
  });
}

startServer();
