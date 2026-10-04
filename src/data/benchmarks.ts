import type { JobDescription, ResumeCandidate } from '../types/index.ts';

export const BENCHMARK_JOBS: JobDescription[] = [
  {
    id: 'job-senior-ml',
    title: 'Senior Machine Learning & LLM Infrastructure Engineer',
    department: 'AI Platform & Inference Systems',
    seniority: 'Senior',
    employmentType: 'Full-time',
    location: 'San Francisco, CA (Hybrid / Remote)',
    minExperienceYears: 5,
    maxExperienceYears: 9,
    requiredDegree: 'Bachelors',
    mustHaveSkills: ['PyTorch', 'Distributed Training', 'CUDA', 'Python', 'vLLM', 'Model Optimization', 'Kubernetes'],
    niceToHaveSkills: ['Triton', 'TensorRT-LLM', 'DeepSpeed', 'C++', 'Ray', 'Slurm', 'FlashAttention'],
    responsibilities: [
      'Architect and deploy high-throughput, low-latency LLM serving pipelines using vLLM and TensorRT-LLM.',
      'Profile CUDA kernels and optimize memory bandwidth for multi-GPU distributed inference.',
      'Scale distributed training clusters across H100/A100 nodes using PyTorch FSDP and DeepSpeed.',
      'Collaborate with research teams to bring state-of-the-art transformer architectures into production.'
    ],
    domainSummary: 'High-performance AI systems, large-scale deep learning infrastructure, GPU memory optimization, and distributed LLM serving.',
    rawDescription: `We are seeking a Senior Machine Learning Infrastructure Engineer with 5+ years of production experience to lead the scaling of our generative AI foundation model infrastructure. You must have deep hands-on expertise in PyTorch, distributed training (FSDP, Megatron, DeepSpeed), and serving optimizations (vLLM, TensorRT-LLM, custom CUDA kernels). You will optimize model latency, reduce GPU memory footprint, and ensure 99.99% uptime for enterprise inference clusters.`,
    weights: {
      skillMatch: 40,
      experienceFit: 25,
      educationFit: 15,
      claimAuthenticity: 20,
    }
  },
  {
    id: 'job-lead-fullstack',
    title: 'Staff / Lead Full-Stack Cloud Architect',
    department: 'Platform Core Engineering',
    seniority: 'Lead',
    employmentType: 'Full-time',
    location: 'New York, NY / Remote',
    minExperienceYears: 7,
    maxExperienceYears: 12,
    requiredDegree: 'Bachelors',
    mustHaveSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Microservices Architecture'],
    niceToHaveSkills: ['GraphQL', 'Go', 'Kubernetes', 'Redis', 'CI/CD Pipelines', 'Kafka', 'System Observability'],
    responsibilities: [
      'Lead architecture design of our enterprise multi-tenant cloud services serving 10M+ daily active requests.',
      'Mentor 8+ full-stack engineers and drive engineering rigor, code review standards, and automated testing.',
      'Design event-driven data streaming pipelines and robust relational data models.'
    ],
    domainSummary: 'Scalable web platforms, microservices architecture, modern frontend frameworks, cloud infrastructure, and technical team leadership.',
    rawDescription: `Looking for a Staff/Lead Full-Stack Engineer with 7+ years building enterprise SaaS platforms. Expertise in React, TypeScript, Node.js, PostgreSQL, and AWS cloud architecture is required. Must have proven leadership in distributed systems and microservices.`,
    weights: {
      skillMatch: 40,
      experienceFit: 25,
      educationFit: 15,
      claimAuthenticity: 20,
    }
  },
  {
    id: 'job-data-scientist',
    title: 'Senior Data Scientist & Algorithmic Lead',
    department: 'Decision Science & Growth',
    seniority: 'Senior',
    employmentType: 'Full-time',
    location: 'Remote',
    minExperienceYears: 5,
    maxExperienceYears: 8,
    requiredDegree: 'Masters',
    mustHaveSkills: ['Python', 'SQL', 'A/B Testing', 'Machine Learning', 'Statistical Modeling', 'Causal Inference', 'Pandas'],
    niceToHaveSkills: ['Spark', 'Airflow', 'Tableau', 'Scikit-Learn', 'Bayesian Statistics', 'Feature Engineering'],
    responsibilities: [
      'Formulate statistical experiments and design causal inference models for multi-arm bandit testing.',
      'Build end-to-end predictive machine learning models to optimize user conversion and LTV.',
      'Translate complex quantitative findings into high-impact strategic roadmaps for executive leadership.'
    ],
    domainSummary: 'Statistical experimentation, causal inference, predictive modeling, big data pipelines, and business impact analysis.',
    rawDescription: `Senior Data Scientist with Master's degree in quantitative field and 5+ years experience. Deep expertise in A/B testing frameworks, causal inference, predictive ML pipelines, and SQL optimization.`,
    weights: {
      skillMatch: 35,
      experienceFit: 30,
      educationFit: 15,
      claimAuthenticity: 20,
    }
  }
];

export const BENCHMARK_CANDIDATES: ResumeCandidate[] = [
  {
    id: 'cand-elena-rostova',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova.ml@gmail.com',
    phone: '+1 (415) 892-4112',
    location: 'San Francisco, CA',
    currentTitle: 'Senior Machine Learning Systems Engineer',
    totalYearsExperience: 6.5,
    summary: 'Senior ML Systems Engineer specializing in distributed training, CUDA kernel optimization, and high-throughput LLM inference architectures. 6+ years building foundation model serving platforms handling 2B+ daily tokens.',
    education: [
      {
        degree: 'Ph.D.',
        field: 'Computer Science (High-Performance Computing & ML)',
        institution: 'University of California, Berkeley',
        graduationYear: 2020,
        honors: 'Dissertation on Asynchronous Distributed Gradient Optimization'
      },
      {
        degree: 'B.S.',
        field: 'Electrical Engineering & Computer Science',
        institution: 'University of Washington',
        graduationYear: 2016,
        gpa: '3.92'
      }
    ],
    experience: [
      {
        company: 'Apex AI Foundation',
        title: 'Senior ML Systems Engineer',
        duration: '2022 - Present (2.5 years)',
        startYear: 2022,
        endYear: 'Present',
        isCurrent: true,
        bullets: [
          'Architected low-latency vLLM inference engine serving 70B parameter LLMs across 32 H100 GPUs, cutting p99 time-to-first-token by 42%.',
          'Authored custom Triton and CUDA FlashAttention kernels for custom sparse rotary embeddings, saving 28% GPU VRAM.',
          'Configured PyTorch FSDP & DeepSpeed ZeRO-3 pipelines for multi-node distributed pre-training with 98.4% linear scaling efficiency on Slurm/Kubernetes.',
          'Mentored 4 junior ML engineers and published 2 papers in NeurIPS Workshops on model compression and FP8 quantization.'
        ],
        techStack: ['PyTorch', 'vLLM', 'CUDA', 'Triton', 'DeepSpeed', 'Kubernetes', 'Python', 'C++']
      },
      {
        company: 'ScaleInference Technologies',
        title: 'Machine Learning Infrastructure Engineer',
        duration: '2020 - 2022 (2 years)',
        startYear: 2020,
        endYear: 2022,
        isCurrent: false,
        bullets: [
          'Maintained distributed training clusters running PyTorch and Horovod across 128 nodes.',
          'Built automated telemetry and GPU thermal/memory profiling tools using NVIDIA NVML and Prometheus.',
          'Reduced model deployment turnaround time from 3 days to 45 minutes using containerized Docker/Kubernetes workflows.'
        ],
        techStack: ['PyTorch', 'Python', 'Docker', 'Kubernetes', 'TensorRT', 'Slurm']
      }
    ],
    technicalSkills: {
      'Core Frameworks': ['PyTorch', 'DeepSpeed', 'vLLM', 'TensorRT-LLM', 'Triton'],
      'Languages': ['Python', 'C++', 'CUDA', 'Bash'],
      'Infrastructure & Systems': ['Kubernetes', 'Docker', 'Slurm', 'Ray', 'Linux Kernel', 'NVLink / InfiniBand'],
      'Model Techniques': ['Distributed Training', 'Model Optimization', 'Quantization (AWQ/GPTQ)', 'FSDP']
    },
    allExtractedSkills: ['PyTorch', 'Distributed Training', 'CUDA', 'Python', 'vLLM', 'Model Optimization', 'Kubernetes', 'Triton', 'TensorRT-LLM', 'DeepSpeed', 'C++', 'Ray', 'Slurm', 'FlashAttention'],
    softSkills: ['Technical Leadership', 'Cross-functional Research Collaboration', 'Engineering Mentorship'],
    projects: [
      {
        name: 'FlashInfer-Lite (Open Source)',
        description: 'Open source CUDA library optimizing continuous batching for speculative decoding.',
        techStack: ['CUDA', 'C++', 'PyTorch', 'Python'],
        metrics: '1.8k GitHub stars, integrated into 3 major inference servers'
      }
    ],
    rawText: `Dr. Elena Rostova
Email: elena.rostova.ml@gmail.com | Phone: +1 (415) 892-4112 | San Francisco, CA
SUMMARY: Senior ML Systems Engineer with 6+ years experience in distributed training and LLM inference.
EXPERIENCE:
Apex AI Foundation (2022 - Present) - Senior ML Systems Engineer
- Architected low-latency vLLM inference engine serving 70B parameter LLMs across 32 H100 GPUs, cutting p99 TTFT by 42%.
- Authored custom Triton and CUDA kernels for rotary embeddings, saving 28% GPU VRAM.
- PyTorch FSDP & DeepSpeed ZeRO-3 pipelines with 98.4% linear scaling efficiency on Kubernetes.
ScaleInference Technologies (2020 - 2022) - ML Infrastructure Engineer
- Maintained distributed training clusters running PyTorch across 128 nodes.
EDUCATION:
Ph.D. Computer Science (UC Berkeley, 2020)
B.S. EECS (Univ of Washington, 2016)`,
    fileName: 'Elena_Rostova_Resume_2026.pdf',
    fileType: 'application/pdf',
    parsingQuality: {
      score: 98,
      isMessyOcr: false,
      issues: []
    }
  },
  {
    id: 'cand-marcus-chen-keyword-stuffer',
    name: 'Marcus Chen',
    email: 'marcus.chen.dev99@outlook.com',
    phone: '+1 (650) 412-9901',
    location: 'San Jose, CA',
    currentTitle: 'Junior Web Developer / AI Enthusiast',
    totalYearsExperience: 1.5,
    summary: 'Master AI Architect and visionary developer with comprehensive mastery of PyTorch, Distributed Training, CUDA, vLLM, TensorRT-LLM, Slurm, Slurm Clusters, Quantum AI, Kubernetes, Slurm, Slurm, Megatron, Rust, DeepSpeed, Slurm.',
    education: [
      {
        degree: 'B.A.',
        field: 'Communications & Web Design',
        institution: 'State Polytechnic College',
        graduationYear: 2024
      }
    ],
    experience: [
      {
        company: 'PixelCraft Agency',
        title: 'Junior Frontend Developer',
        duration: 'Nov 2024 - Present (6 months)',
        startYear: 2024,
        endYear: 'Present',
        isCurrent: true,
        bullets: [
          'Created WordPress themes and modified HTML/CSS layouts for local dental clinics and bakeries.',
          'Researched AI tools online and prompted ChatGPT to write marketing blog posts.',
          'Experimented with downloading Python scripts from GitHub onto personal laptop.'
        ],
        techStack: ['HTML', 'CSS', 'WordPress', 'JavaScript']
      },
      {
        company: 'Campus Computer Lab',
        title: 'Student IT Assistant',
        duration: '2023 - 2024 (1 year part-time)',
        startYear: 2023,
        endYear: 2024,
        isCurrent: false,
        bullets: [
          'Assisted students with printer jams and campus WiFi login credentials.',
          'Cataloged software licenses in Excel spreadsheet.'
        ],
        techStack: ['Windows', 'Excel', 'Google Docs']
      }
    ],
    technicalSkills: {
      'Claimed Buzzwords (Padded)': [
        'PyTorch', 'Distributed Training', 'CUDA', 'Python', 'vLLM', 'Model Optimization',
        'Kubernetes', 'Triton', 'TensorRT-LLM', 'DeepSpeed', 'C++', 'Ray', 'Slurm', 'FlashAttention',
        'Blockchain', 'Quantum Computing', 'Zero-Knowledge Proofs', 'Megatron-LM', 'Slurm Cluster Management',
        'FSDP', 'Transformer Engines', 'Slurm Slurm Slurm'
      ]
    },
    allExtractedSkills: [
      'PyTorch', 'Distributed Training', 'CUDA', 'Python', 'vLLM', 'Model Optimization',
      'Kubernetes', 'Triton', 'TensorRT-LLM', 'DeepSpeed', 'C++', 'Ray', 'Slurm', 'FlashAttention',
      'HTML', 'CSS', 'WordPress', 'JavaScript'
    ],
    softSkills: ['Fast Learner', 'Passionate About AI'],
    projects: [
      {
        name: 'AI Chatbot Tutorial',
        description: 'Followed a 15-minute YouTube tutorial to call the OpenAI API with a 10-line Python script.',
        techStack: ['Python', 'OpenAI API']
      }
    ],
    rawText: `Marcus Chen
Junior Web Developer / AI Enthusiast
CORE EXPERTISE & SKILLS:
PyTorch, Distributed Training, CUDA, Python, vLLM, Model Optimization, Kubernetes, Triton, TensorRT-LLM, DeepSpeed, C++, Ray, Slurm, FlashAttention, Slurm, Megatron, Quantum AI, Neural Networks, Docker, Kubernetes, AWS, Cloud.
EXPERIENCE:
PixelCraft Agency (Nov 2024 - Present): Junior Frontend Developer
- Designed WordPress themes, fixed HTML/CSS for local dental clinics.
- Prompted ChatGPT for marketing content.
Campus Computer Lab (2023 - 2024): IT Helpdesk
- Cleared paper jams, helped students with campus WiFi.
EDUCATION:
B.A. Communications (2024)`,
    fileName: 'Marcus_Chen_Resume_AI_Expert.pdf',
    fileType: 'application/pdf',
    parsingQuality: {
      score: 92,
      isMessyOcr: false,
      issues: ['Keyword wall detected without context']
    }
  },
  {
    id: 'cand-sarah-jenkins-contradiction',
    name: 'Sarah Jenkins',
    email: 'sarah.j.cloudml@gmail.com',
    phone: '+1 (206) 555-0199',
    location: 'Seattle, WA',
    currentTitle: 'Principal Enterprise AI & Deep Learning Director',
    totalYearsExperience: 7.0, // Claimed 7 yrs, but graduated in 2023!
    summary: 'Seasoned AI Executive and Principal Architect with 7+ years of senior hands-on industry leadership architecting distributed PyTorch, vLLM, and CUDA infrastructure across Fortune 50 enterprises.',
    education: [
      {
        degree: 'B.S.',
        field: 'Information Systems',
        institution: 'Pacific Northwest University',
        graduationYear: 2023 // Contradiction: Graduated May 2023, claiming 7 years of senior director experience!
      }
    ],
    experience: [
      {
        company: 'OmniGlobal Cloud Systems',
        title: 'Principal AI Infrastructure Director & Chief Architect',
        duration: '2020 - Present (5 years claimed, but was full-time student)',
        startYear: 2020,
        endYear: 'Present',
        isCurrent: true,
        bullets: [
          'Claimed to lead a department of 45 senior AI researchers and manage a $30M annual compute budget for distributed training.',
          'Oversaw deployment of vLLM (Note: vLLM was not released until mid-2023, but candidate claims to have run it in 2020).',
          'Designed PyTorch distributed clusters across multi-datacenter topology.'
        ],
        techStack: ['PyTorch', 'vLLM', 'Distributed Training', 'Kubernetes', 'CUDA']
      },
      {
        company: 'Vanguard Analytics',
        title: 'Senior Machine Learning Specialist',
        duration: '2017 - 2020 (3 years)',
        startYear: 2017,
        endYear: 2020,
        isCurrent: false,
        bullets: [
          'Claimed to train large foundation models in 2017 before attending university as a full-time undergraduate.'
        ],
        techStack: ['Python', 'TensorFlow', 'PyTorch']
      }
    ],
    technicalSkills: {
      'Technologies': ['PyTorch', 'Distributed Training', 'CUDA', 'Python', 'vLLM', 'Model Optimization', 'Kubernetes']
    },
    allExtractedSkills: ['PyTorch', 'Distributed Training', 'CUDA', 'Python', 'vLLM', 'Model Optimization', 'Kubernetes'],
    softSkills: ['Executive Management', 'Strategic Roadmapping'],
    projects: [],
    rawText: `Sarah Jenkins
Principal Enterprise AI & Deep Learning Director
Seattle, WA
EXECUTIVE PROFILE: 7+ years of senior executive AI experience managing $30M infrastructure budgets.
EXPERIENCE:
OmniGlobal Cloud Systems (2020 - Present): Principal AI Director
- Led 45 senior research scientists across enterprise GPU clusters.
- Spearheaded vLLM infrastructure across data centers starting in 2020.
Vanguard Analytics (2017 - 2020): Senior ML Specialist
- Built foundation models and deep learning pipelines.
EDUCATION:
Pacific Northwest University — B.S. Information Systems (Graduated: May 2023)`,
    fileName: 'Sarah_Jenkins_Executive_Director.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    parsingQuality: {
      score: 95,
      isMessyOcr: false,
      issues: ['Timeline conflict: Claims 7 years senior role prior to college graduation']
    }
  },
  {
    id: 'cand-alex-mercer-messy-ocr',
    name: 'Alex Mercer',
    email: 'alex_mercer.ai@protonmail.com',
    phone: '+1 (512) 773-2009',
    location: 'Austin, TX',
    currentTitle: 'ML Infrastructure & Platform Engineer',
    totalYearsExperience: 5.5,
    summary: 'Experienced ML platform engineer with 5.5 years focusing on PyTorch training pipelines, model quantization, and Kubernetes cluster orchestration. Proven track record deploying inference endpoints for high-throughput speech and NLP models.',
    education: [
      {
        degree: 'B.S.',
        field: 'Computer Engineering',
        institution: 'University of Texas at Austin',
        graduationYear: 2020,
        gpa: '3.81'
      }
    ],
    experience: [
      {
        company: 'HyperScale Systems',
        title: 'ML Platform Engineer',
        duration: '2022 - Present (3 years)',
        startYear: 2022,
        endYear: 'Present',
        isCurrent: true,
        bullets: [
          'Deployed scalable PyTorch inference endpoints using vLLM and Triton on AWS EKS (Kubernetes), reducing latency by 35%.',
          'Implemented automated pipeline for model quantization (FP8, INT4) and distributed evaluation across GPU nodes.',
          'Authored custom monitoring hooks for GPU memory spikes, CUDA out-of-memory errors, and network bottleneck detection.',
          'Wrote production Python and C++ extensions to accelerate data loading bottlenecks by 4x.'
        ],
        techStack: ['PyTorch', 'vLLM', 'CUDA', 'Python', 'Kubernetes', 'Docker', 'Triton', 'C++']
      },
      {
        company: 'Austin Data Labs',
        title: 'Associate Software & Data Engineer',
        duration: '2020 - 2022 (2.5 years)',
        startYear: 2020,
        endYear: 2022,
        isCurrent: false,
        bullets: [
          'Built ETL pipelines ingesting 15TB daily sensor logs using Python and Spark.',
          'Containerized ML training scripts with Docker and scheduled jobs on Kubernetes.'
        ],
        techStack: ['Python', 'Docker', 'Kubernetes', 'PyTorch', 'PostgreSQL']
      }
    ],
    technicalSkills: {
      'ML Frameworks': ['PyTorch', 'vLLM', 'Triton', 'Model Optimization', 'HuggingFace'],
      'Programming': ['Python', 'C++', 'CUDA', 'SQL'],
      'Infra': ['Kubernetes', 'Docker', 'AWS EKS', 'Linux', 'Distributed Training']
    },
    allExtractedSkills: ['PyTorch', 'Distributed Training', 'CUDA', 'Python', 'vLLM', 'Model Optimization', 'Kubernetes', 'Triton', 'C++', 'Docker'],
    softSkills: ['Troubleshooting', 'System Reliability', 'Agile Delivery'],
    projects: [
      {
        name: 'AutoQuant-PyTorch',
        description: 'Toolkit for automated post-training quantization on PyTorch models.',
        techStack: ['Python', 'PyTorch', 'CUDA']
      }
    ],
    rawText: `================ SCANNED OCR DOCUMENT (PAGE 1) ================
ALEX MERCER ??? Austin, TX
Em@il: alex_mercer [dot] ai [at] protonmail.com | Tel: +1-(512)-773-2009
=== PROF1LE ===
ML lnfrastructure & Platform Engineer w/ 5.5 yrs exp in PyT0rch training,
vLLM, CUDA optlmization, and Kubernet3s cluster orchestration.
=== W0RK HIST0RY ===
* HyperScale Systems (2022-Pres): ML Platform Eng.
  - Deployed scalabl3 PyTorch inference endpoints w/ vLLM & Triton on AWS EKS (Kubernetes)
  - lmplemented automated pipeline for model quantization (FP8, INT4) & distributed evaluatlon.
  - Authored custom monltoring hooks for CUDA out-of-memory errors & memory spikes.
  - Wrote productlon Python and C++ extenslons to accel data loading bottlenecks.
* Austin Data Labs (2020-2022): Assoc Software & Data Eng.
  - Built ETL pipelines ingesting 15TB daily logs w/ Python & Spark.
  - Scheduled containerized training jobs on Kubernetes.
=== EDUCATI0N ===
Univ of Texas at Austin ??? B.S. Computer Engineering (2020) GPA 3.81`,
    fileName: 'Alex_Mercer_Scanned_OCR_Scan004.pdf',
    fileType: 'application/pdf',
    parsingQuality: {
      score: 82,
      isMessyOcr: true,
      issues: [
        'OCR character substitution noise (PyT0rch, lnfrastructure, scalabl3)',
        'Obfuscated email formatting ([dot] and [at])',
        'Malformed unicode question marks replacing delimiter bullets'
      ]
    }
  },
  {
    id: 'cand-dr-arthur-pendelton',
    name: 'Dr. Arthur Pendelton',
    email: 'arthur.pendelton@cmu.edu',
    phone: '+1 (412) 268-3011',
    location: 'Pittsburgh, PA',
    currentTitle: 'Postdoctoral Research Scientist in Deep Learning',
    totalYearsExperience: 6.0,
    summary: 'Deep learning researcher with 6 years experience publishing peer-reviewed papers on neural network architecture, convergence bounds, and theoretical PyTorch modeling. Exceptional mathematical depth, looking for transition to production infrastructure.',
    education: [
      {
        degree: 'Ph.D.',
        field: 'Computer Science (Machine Learning Theory)',
        institution: 'Carnegie Mellon University (CMU)',
        graduationYear: 2023,
        gpa: '3.98',
        honors: 'Best Student Paper Award at ICML'
      },
      {
        degree: 'B.S.',
        field: 'Mathematics & Computer Science',
        institution: 'University of Michigan',
        graduationYear: 2018
      }
    ],
    experience: [
      {
        company: 'Carnegie Mellon University AI Institute',
        title: 'Postdoctoral Research Scientist',
        duration: '2023 - Present (1.5 years)',
        startYear: 2023,
        endYear: 'Present',
        isCurrent: true,
        bullets: [
          'Formulated new optimization algorithms for non-convex loss landscapes in PyTorch.',
          'Conducted distributed experiments on university academic compute cluster.',
          'Authored 6 papers accepted at NeurIPS, ICML, and ICLR on transformer representations.'
        ],
        techStack: ['PyTorch', 'Python', 'Mathematical Modeling', 'Slurm']
      },
      {
        company: 'CMU Machine Learning Department',
        title: 'Graduate Research Assistant',
        duration: '2019 - 2023 (4.5 years)',
        startYear: 2019,
        endYear: 2023,
        isCurrent: false,
        bullets: [
          'Taught graduate-level Deep Learning (10-701) and assisted 120+ master and doctoral students.',
          'Built prototype PyTorch implementations of attention mechanisms.'
        ],
        techStack: ['PyTorch', 'Python', 'Jupyter', 'LaTeX']
      }
    ],
    technicalSkills: {
      'Research & Modeling': ['PyTorch', 'Python', 'Statistical Modeling', 'Machine Learning', 'Model Optimization', 'Slurm'],
      'Theory': ['Optimization Theory', 'Convergence Bounds', 'Linear Algebra']
    },
    allExtractedSkills: ['PyTorch', 'Python', 'Model Optimization', 'Slurm', 'Mathematical Modeling'],
    softSkills: ['Academic Writing', 'Scientific Rigor', 'Presentation'],
    projects: [
      {
        name: 'TheoNet PyTorch',
        description: 'Theoretical diagnostics package for neural weight spectral norm analysis.',
        techStack: ['PyTorch', 'Python']
      }
    ],
    rawText: `Dr. Arthur Pendelton
Email: arthur.pendelton@cmu.edu | Pittsburgh, PA
ACADEMIC RECORD:
Ph.D. Computer Science (Carnegie Mellon University, 2023)
B.S. Mathematics & CS (University of Michigan, 2018)
RESEARCH EXPERIENCE:
CMU AI Institute (2023 - Present): Postdoctoral Researcher
- PyTorch algorithmic research on deep transformer architectures.
- Published 6 conference papers in NeurIPS/ICML.
- Distributed experiments on Slurm clusters.
CMU ML Dept (2019 - 2023): Graduate Researcher & TA
SKILLS: PyTorch, Python, Model Optimization, Mathematical Theory, Slurm.`,
    fileName: 'Arthur_Pendelton_CV_Academic.pdf',
    fileType: 'application/pdf',
    parsingQuality: {
      score: 97,
      isMessyOcr: false,
      issues: []
    }
  },
  {
    id: 'cand-david-kalu',
    name: 'David Kalu',
    email: 'david.kalu.tech@gmail.com',
    phone: '+1 (312) 440-1928',
    location: 'Chicago, IL',
    currentTitle: 'Mid-Level Machine Learning Engineer',
    totalYearsExperience: 3.5,
    summary: 'Dedicated Machine Learning Engineer with 3.5 years of industry experience fine-tuning open-weights LLMs, building retrieval-augmented generation (RAG) pipelines, and deploying containerized models via FastAPI and Docker.',
    education: [
      {
        degree: 'B.S.',
        field: 'Computer Science',
        institution: 'University of Illinois Urbana-Champaign (UIUC)',
        graduationYear: 2021,
        gpa: '3.75'
      }
    ],
    experience: [
      {
        company: 'Apex Data Insights',
        title: 'Machine Learning Engineer',
        duration: '2022 - Present (2.5 years)',
        startYear: 2022,
        endYear: 'Present',
        isCurrent: true,
        bullets: [
          'Trained and fine-tuned LLaMA-3 models using PyTorch and HuggingFace PEFT/LoRA.',
          'Built FastAPI microservices packaging models in Docker, deployed to AWS ECS.',
          'Integrated vLLM on a single A10G instance to serve embeddings and completions.'
        ],
        techStack: ['PyTorch', 'Python', 'vLLM', 'Docker', 'FastAPI', 'AWS', 'HuggingFace']
      },
      {
        company: 'Midwest Software Labs',
        title: 'Junior Software Engineer',
        duration: '2021 - 2022 (1 year)',
        startYear: 2021,
        endYear: 2022,
        isCurrent: false,
        bullets: [
          'Developed backend REST APIs in Python and maintained PostgreSQL queries.'
        ],
        techStack: ['Python', 'PostgreSQL', 'Git', 'Linux']
      }
    ],
    technicalSkills: {
      'Frameworks': ['PyTorch', 'vLLM', 'HuggingFace', 'FastAPI'],
      'Languages': ['Python', 'SQL', 'Bash'],
      'Infra': ['Docker', 'AWS ECS', 'Linux']
    },
    allExtractedSkills: ['PyTorch', 'Python', 'vLLM', 'Docker', 'FastAPI', 'Model Optimization', 'PostgreSQL'],
    softSkills: ['Team Player', 'Curiosity', 'Clear Documentation'],
    projects: [
      {
        name: 'DocuChat-RAG',
        description: 'End-to-end question answering tool over local legal documents.',
        techStack: ['Python', 'PyTorch', 'vLLM']
      }
    ],
    rawText: `David Kalu | Chicago, IL
david.kalu.tech@gmail.com
EXPERIENCE:
Apex Data Insights (2022 - Present): ML Engineer (2.5 yrs)
- Fine-tuned LLaMA models with PyTorch and Hugging Face LoRA.
- Integrated vLLM on single GPU instance to serve models.
- Containerized workflows using Docker.
Midwest Software Labs (2021 - 2022): Junior SWE (1 yr)
- Python REST APIs and PostgreSQL.
EDUCATION:
B.S. Computer Science (UIUC, 2021)`,
    fileName: 'David_Kalu_Resume.pdf',
    fileType: 'application/pdf',
    parsingQuality: {
      score: 96,
      isMessyOcr: false,
      issues: []
    }
  },
  {
    id: 'cand-priya-sharma',
    name: 'Priya Sharma',
    email: 'priya.sharma.swe@devmail.io',
    phone: '+1 (408) 321-8840',
    location: 'Sunnyvale, CA',
    currentTitle: 'Senior Full-Stack Engineer',
    totalYearsExperience: 6.0,
    summary: 'Senior Full-Stack Engineer with 6 years experience designing scalable React/TypeScript micro-frontends and robust Node.js/PostgreSQL backends. Recently integrated LLM APIs for AI-assisted workflows.',
    education: [
      {
        degree: 'B.S.',
        field: 'Computer Science',
        institution: 'San Jose State University',
        graduationYear: 2019
      }
    ],
    experience: [
      {
        company: 'CloudFlow SaaS',
        title: 'Senior Full-Stack Engineer',
        duration: '2021 - Present (4 years)',
        startYear: 2021,
        endYear: 'Present',
        isCurrent: true,
        bullets: [
          'Architected responsive enterprise React 19 / TypeScript application supporting 40,000 concurrent business users.',
          'Built high-performance Node.js microservices with PostgreSQL, Redis caching, and Docker containerization on AWS.',
          'Integrated OpenAI and Anthropic API pipelines with streaming responses and client-side markdown rendering.'
        ],
        techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Microservices Architecture', 'Redis']
      }
    ],
    technicalSkills: {
      'Frontend': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'],
      'Backend': ['Node.js', 'PostgreSQL', 'Microservices Architecture', 'Redis', 'Express'],
      'Cloud': ['AWS', 'Docker', 'CI/CD']
    },
    allExtractedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Microservices Architecture', 'Redis'],
    softSkills: ['Cross-functional Collaboration', 'Code Review Quality'],
    projects: [],
    rawText: `Priya Sharma | Sunnyvale, CA
Senior Full-Stack Engineer with 6 years building React, TypeScript, Node.js, and PostgreSQL apps.
CloudFlow SaaS (2021-Present): Senior Full-Stack Engineer
- Built React & TypeScript enterprise web application for 40k users.
- Built Node.js microservices with PostgreSQL on AWS.
- Containerized workloads using Docker.
EDUCATION:
B.S. Computer Science (SJSU, 2019)`,
    fileName: 'Priya_Sharma_Resume.pdf',
    fileType: 'application/pdf',
    parsingQuality: {
      score: 95,
      isMessyOcr: false,
      issues: []
    }
  }
];
