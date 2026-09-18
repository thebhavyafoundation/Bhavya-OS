/**
 * Bhavya Academy — Canonical Course Data
 *
 * Real curriculum content for the AI Institute.
 * Types defined locally to avoid module resolution issues during development.
 *
 * @module academy-courses
 */

// ───────────────────────────────────────────────────────────────────
// LOCAL TYPES (mirror @bhavya/shared)
// ───────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  description: string;
  domain: string;
  subject: string;
  grade: number;
  level: CourseLevel;
  status: "draft" | "ready" | "published";
  modules: CourseModule[];
  prerequisites: string[];
  estimatedDuration: number;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  /**
   * Curriculum authority. Absent means "bhavya-academy".
   * Mirrors CurriculumSourceId in @bhavya/shared (kept local to avoid
   * module resolution issues — see header note).
   */
  source?: "bhavya-academy" | "external-experience-ai";
}

export type CourseLevel =
  "foundation" | "beginner" | "intermediate" | "advanced" | "expert";

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: CourseModuleLesson[];
}

export interface CourseModuleLesson {
  id: string;
  title: string;
  order: number;
  duration: number;
  /**
   * Curriculum authority. Absent means "bhavya-academy".
   * External lessons are referenced, never stored here.
   */
  source?: "bhavya-academy" | "external-experience-ai";
}

// ───────────────────────────────────────────────────────────────────
// COURSE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

const foundationModules: CourseModule[] = [
  {
    id: "found-mod-1",
    title: "What Is AI?",
    description: "Understand artificial intelligence from the ground up.",
    order: 1,
    lessons: [
      {
        id: "found-1-1",
        title: "The Idea of Intelligence",
        order: 1,
        duration: 25,
      },
      { id: "found-1-2", title: "How Machines Learn", order: 2, duration: 30 },
      { id: "found-1-3", title: "Types of AI Systems", order: 3, duration: 20 },
    ],
  },
  {
    id: "found-mod-2",
    title: "Working with Language Models",
    description: "Learn to communicate effectively with AI systems.",
    order: 2,
    lessons: [
      {
        id: "found-2-1",
        title: "What Is a Language Model?",
        order: 1,
        duration: 25,
      },
      {
        id: "found-2-2",
        title: "Prompt Engineering Basics",
        order: 2,
        duration: 35,
      },
      {
        id: "found-2-3",
        title: "Advanced Prompt Techniques",
        order: 3,
        duration: 30,
      },
    ],
  },
  {
    id: "found-mod-3",
    title: "Building Your First AI App",
    description: "Turn knowledge into a real, working application.",
    order: 3,
    lessons: [
      {
        id: "found-3-1",
        title: "Setting Up Your Environment",
        order: 1,
        duration: 20,
      },
      { id: "found-3-2", title: "Calling an AI API", order: 2, duration: 30 },
      {
        id: "found-3-3",
        title: "Building a Chat Interface",
        order: 3,
        duration: 40,
      },
    ],
  },
];

const pythonModules: CourseModule[] = [
  {
    id: "py-mod-1",
    title: "Python Fundamentals",
    description: "Master the language of AI and data science.",
    order: 1,
    lessons: [
      {
        id: "py-1-1",
        title: "Variables and Data Types",
        order: 1,
        duration: 20,
      },
      {
        id: "py-1-2",
        title: "Control Flow and Functions",
        order: 2,
        duration: 25,
      },
      { id: "py-1-3", title: "Data Structures", order: 3, duration: 30 },
    ],
  },
  {
    id: "py-mod-2",
    title: "Data with Python",
    description: "Load, transform, and understand data.",
    order: 2,
    lessons: [
      { id: "py-2-1", title: "NumPy Arrays", order: 1, duration: 30 },
      { id: "py-2-2", title: "Pandas DataFrames", order: 2, duration: 35 },
      { id: "py-2-3", title: "Data Visualization", order: 3, duration: 25 },
    ],
  },
  {
    id: "py-mod-3",
    title: "Your First ML Model",
    description: "Build a machine learning model from scratch.",
    order: 3,
    lessons: [
      {
        id: "py-3-1",
        title: "What Is Machine Learning?",
        order: 1,
        duration: 20,
      },
      { id: "py-3-2", title: "Training and Testing", order: 2, duration: 30 },
      { id: "py-3-3", title: "Evaluating Performance", order: 3, duration: 25 },
    ],
  },
];

const deepLearningModules: CourseModule[] = [
  {
    id: "dl-mod-1",
    title: "Neural Networks",
    description: "Understand the building blocks of deep learning.",
    order: 1,
    lessons: [
      { id: "dl-1-1", title: "The Perceptron", order: 1, duration: 25 },
      {
        id: "dl-1-2",
        title: "Layers and Activation Functions",
        order: 2,
        duration: 30,
      },
      { id: "dl-1-3", title: "Backpropagation", order: 3, duration: 35 },
    ],
  },
  {
    id: "dl-mod-2",
    title: "Architectures",
    description: "Explore the architectures that power modern AI.",
    order: 2,
    lessons: [
      {
        id: "dl-2-1",
        title: "Convolutional Neural Networks",
        order: 1,
        duration: 30,
      },
      {
        id: "dl-2-2",
        title: "Recurrent Neural Networks",
        order: 2,
        duration: 30,
      },
      { id: "dl-2-3", title: "Transformers", order: 3, duration: 40 },
    ],
  },
  {
    id: "dl-mod-3",
    title: "Building with Deep Learning",
    description: "Apply deep learning to real problems.",
    order: 3,
    lessons: [
      { id: "dl-3-1", title: "Image Classification", order: 1, duration: 35 },
      { id: "dl-3-2", title: "Text Generation", order: 2, duration: 40 },
      { id: "dl-3-3", title: "Transfer Learning", order: 3, duration: 30 },
    ],
  },
];

const llmModules: CourseModule[] = [
  {
    id: "llm-mod-1",
    title: "How LLMs Work",
    description: "Understand the technology behind large language models.",
    order: 1,
    lessons: [
      {
        id: "llm-1-1",
        title: "Tokenization and Embeddings",
        order: 1,
        duration: 30,
      },
      { id: "llm-1-2", title: "Attention Mechanisms", order: 2, duration: 35 },
      { id: "llm-1-3", title: "Training at Scale", order: 3, duration: 25 },
    ],
  },
  {
    id: "llm-mod-2",
    title: "Using LLMs",
    description: "Harness the power of large language models.",
    order: 2,
    lessons: [
      { id: "llm-2-1", title: "API Integration", order: 1, duration: 30 },
      { id: "llm-2-2", title: "Fine-Tuning Basics", order: 2, duration: 35 },
      { id: "llm-2-3", title: "RAG Systems", order: 3, duration: 40 },
    ],
  },
  {
    id: "llm-mod-3",
    title: "Building AI Agents",
    description: "Create autonomous AI systems that can reason and act.",
    order: 3,
    lessons: [
      { id: "llm-3-1", title: "Agent Architecture", order: 1, duration: 30 },
      {
        id: "llm-3-2",
        title: "Tool Use and Function Calling",
        order: 2,
        duration: 35,
      },
      { id: "llm-3-3", title: "Multi-Agent Systems", order: 3, duration: 40 },
    ],
  },
];

const ethicsModules: CourseModule[] = [
  {
    id: "eth-mod-1",
    title: "AI Safety Foundations",
    description: "Understand why AI safety matters and how to practice it.",
    order: 1,
    lessons: [
      { id: "eth-1-1", title: "Alignment and Control", order: 1, duration: 25 },
      { id: "eth-1-2", title: "Bias and Fairness", order: 2, duration: 30 },
      {
        id: "eth-1-3",
        title: "Transparency and Explainability",
        order: 3,
        duration: 25,
      },
    ],
  },
  {
    id: "eth-mod-2",
    title: "Responsible Development",
    description: "Build AI systems that are safe, fair, and accountable.",
    order: 2,
    lessons: [
      { id: "eth-2-1", title: "Ethical Frameworks", order: 1, duration: 25 },
      {
        id: "eth-2-2",
        title: "Testing and Validation",
        order: 2,
        duration: 30,
      },
      { id: "eth-2-3", title: "Governance and Policy", order: 3, duration: 25 },
    ],
  },
];

const mathematicsForAiModules: CourseModule[] = [
  {
    id: "math-mod-1",
    title: "Linear Algebra & Vectors",
    description:
      "Master the language of high-dimensional spaces that powers every AI model.",
    order: 1,
    lessons: [
      {
        id: "math-1-1",
        title: "Vectors and Vector Spaces",
        order: 1,
        duration: 30,
      },
      {
        id: "math-1-2",
        title: "Matrices and Transformations",
        order: 2,
        duration: 35,
      },
      {
        id: "math-1-3",
        title: "Eigenvalues and Decomposition",
        order: 3,
        duration: 30,
      },
    ],
  },
  {
    id: "math-mod-2",
    title: "Calculus & Optimization",
    description:
      "Learn how calculus drives learning through gradients and optimization.",
    order: 2,
    lessons: [
      {
        id: "math-2-1",
        title: "Derivatives and Gradients",
        order: 1,
        duration: 30,
      },
      {
        id: "math-2-2",
        title: "Multivariable Calculus",
        order: 2,
        duration: 35,
      },
      {
        id: "math-2-3",
        title: "Optimization and Gradient Descent",
        order: 3,
        duration: 35,
      },
    ],
  },
  {
    id: "math-mod-3",
    title: "Probability, Statistics & Information",
    description:
      "Understand uncertainty, inference, and the information-theoretic foundations of intelligence.",
    order: 3,
    lessons: [
      { id: "math-3-1", title: "Probability Theory", order: 1, duration: 30 },
      {
        id: "math-3-2",
        title: "Statistics and Inference",
        order: 2,
        duration: 35,
      },
      { id: "math-3-3", title: "Information Theory", order: 3, duration: 30 },
    ],
  },
];

const machineLearningModules: CourseModule[] = [
  {
    id: "ml-mod-1",
    title: "Supervised Learning",
    description:
      "Teach machines to learn from labeled data and evaluate their performance.",
    order: 1,
    lessons: [
      {
        id: "ml-1-1",
        title: "Linear and Logistic Regression",
        order: 1,
        duration: 30,
      },
      {
        id: "ml-1-2",
        title: "Decision Trees and k-NN",
        order: 2,
        duration: 35,
      },
      {
        id: "ml-1-3",
        title: "Model Evaluation and Validation",
        order: 3,
        duration: 30,
      },
    ],
  },
  {
    id: "ml-mod-2",
    title: "Unsupervised & Feature Engineering",
    description:
      "Discover hidden patterns and craft features that unlock model performance.",
    order: 2,
    lessons: [
      {
        id: "ml-2-1",
        title: "Clustering and Dimensionality Reduction",
        order: 1,
        duration: 35,
      },
      {
        id: "ml-2-2",
        title: "Feature Engineering Techniques",
        order: 2,
        duration: 30,
      },
      {
        id: "ml-2-3",
        title: "Data Preprocessing at Scale",
        order: 3,
        duration: 30,
      },
    ],
  },
  {
    id: "ml-mod-3",
    title: "Ensemble & Production ML",
    description:
      "Combine models and ship machine learning systems to production.",
    order: 3,
    lessons: [
      { id: "ml-3-1", title: "Ensemble Methods", order: 1, duration: 35 },
      { id: "ml-3-2", title: "Hyperparameter Tuning", order: 2, duration: 30 },
      {
        id: "ml-3-3",
        title: "ML Pipelines and Production",
        order: 3,
        duration: 35,
      },
    ],
  },
];

const transformersModules: CourseModule[] = [
  {
    id: "trans-mod-1",
    title: "Attention Foundations",
    description:
      "Understand the attention mechanism that underpins every modern language model.",
    order: 1,
    lessons: [
      {
        id: "trans-1-1",
        title: "The Attention Mechanism",
        order: 1,
        duration: 30,
      },
      {
        id: "trans-1-2",
        title: "Self-Attention in Depth",
        order: 2,
        duration: 35,
      },
      {
        id: "trans-1-3",
        title: "Scaled Dot-Product Attention",
        order: 3,
        duration: 30,
      },
    ],
  },
  {
    id: "trans-mod-2",
    title: "Transformer Architecture",
    description:
      "Build a complete understanding of the transformer block from the inside out.",
    order: 2,
    lessons: [
      {
        id: "trans-2-1",
        title: "Multi-Head Attention",
        order: 1,
        duration: 35,
      },
      {
        id: "trans-2-2",
        title: "Positional Encoding and Normalization",
        order: 2,
        duration: 30,
      },
      {
        id: "trans-2-3",
        title: "Encoder-Decoder Architecture",
        order: 3,
        duration: 35,
      },
    ],
  },
  {
    id: "trans-mod-3",
    title: "Modern Transformers",
    description:
      "Explore the models that reshaped AI — from BERT and GPT to vision transformers.",
    order: 3,
    lessons: [
      {
        id: "trans-3-1",
        title: "BERT and Encoder Models",
        order: 1,
        duration: 35,
      },
      {
        id: "trans-3-2",
        title: "GPT and Decoder Models",
        order: 2,
        duration: 35,
      },
      { id: "trans-3-3", title: "Vision Transformers", order: 3, duration: 30 },
    ],
  },
];

const llmEngineeringModules: CourseModule[] = [
  {
    id: "llme-mod-1",
    title: "Prompt Engineering & RAG",
    description:
      "Steer language models with precision and ground them with retrieval.",
    order: 1,
    lessons: [
      {
        id: "llme-1-1",
        title: "Advanced Prompt Engineering",
        order: 1,
        duration: 30,
      },
      {
        id: "llme-1-2",
        title: "RAG Systems Architecture",
        order: 2,
        duration: 35,
      },
      {
        id: "llme-1-3",
        title: "Vector Databases and Retrieval",
        order: 3,
        duration: 35,
      },
    ],
  },
  {
    id: "llme-mod-2",
    title: "Fine-Tuning & Evaluation",
    description: "Adapt models to your domain and measure what matters.",
    order: 2,
    lessons: [
      {
        id: "llme-2-1",
        title: "Fine-Tuning Strategies",
        order: 1,
        duration: 35,
      },
      {
        id: "llme-2-2",
        title: "Instruction Tuning and RLHF",
        order: 2,
        duration: 35,
      },
      {
        id: "llme-2-3",
        title: "Evaluation and Benchmarking",
        order: 3,
        duration: 30,
      },
    ],
  },
  {
    id: "llme-mod-3",
    title: "Production Deployment",
    description:
      "Take LLM systems from prototype to reliable production at scale.",
    order: 3,
    lessons: [
      {
        id: "llme-3-1",
        title: "LLM Inference Optimization",
        order: 1,
        duration: 35,
      },
      {
        id: "llme-3-2",
        title: "Safety and Guardrails",
        order: 2,
        duration: 30,
      },
      { id: "llme-3-3", title: "Deploying at Scale", order: 3, duration: 35 },
    ],
  },
];

const aiAgentsModules: CourseModule[] = [
  {
    id: "agent-mod-1",
    title: "Agent Foundations",
    description: "Design autonomous agents with tools, memory, and context.",
    order: 1,
    lessons: [
      {
        id: "agent-1-1",
        title: "Agent Architecture and Design",
        order: 1,
        duration: 35,
      },
      {
        id: "agent-1-2",
        title: "Tool Use and Function Calling",
        order: 2,
        duration: 35,
      },
      {
        id: "agent-1-3",
        title: "Memory and Context Management",
        order: 3,
        duration: 30,
      },
    ],
  },
  {
    id: "agent-mod-2",
    title: "Planning & Reasoning",
    description: "Give agents the ability to plan, reason, and self-correct.",
    order: 2,
    lessons: [
      {
        id: "agent-2-1",
        title: "Chain-of-Thought Reasoning",
        order: 1,
        duration: 35,
      },
      {
        id: "agent-2-2",
        title: "Planning and Task Decomposition",
        order: 2,
        duration: 35,
      },
      {
        id: "agent-2-3",
        title: "Reflection and Self-Correction",
        order: 3,
        duration: 30,
      },
    ],
  },
  {
    id: "agent-mod-3",
    title: "Multi-Agent Systems & Safety",
    description:
      "Orchestrate teams of agents and ensure they remain safe and aligned.",
    order: 3,
    lessons: [
      {
        id: "agent-3-1",
        title: "Multi-Agent Collaboration",
        order: 1,
        duration: 35,
      },
      {
        id: "agent-3-2",
        title: "Agent Communication Protocols",
        order: 2,
        duration: 30,
      },
      {
        id: "agent-3-3",
        title: "Safety and Alignment for Agents",
        order: 3,
        duration: 35,
      },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────
// EXPORTED COURSES
// ───────────────────────────────────────────────────────────────────

export const courses: Course[] = [
  {
    id: "ai-foundations",
    title: "AI Foundations",
    description:
      "Your first step into artificial intelligence. Learn what AI is, how language models work, and build your first AI-powered application. No prior experience required.",
    domain: "Artificial Intelligence",
    subject: "AI Fundamentals",
    grade: 9,
    level: "foundation",
    status: "published",
    modules: foundationModules,
    prerequisites: [],
    estimatedDuration: 240,
    tags: ["beginner", "ai", "llm", "prompt-engineering"],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 30,
      certificationAvailable: true,
    },
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "python-for-ai",
    title: "Python for AI",
    description:
      "Master Python as the language of AI and data science. From fundamentals to your first machine learning model.",
    domain: "Programming",
    subject: "Python",
    grade: 10,
    level: "beginner",
    status: "published",
    modules: pythonModules,
    prerequisites: ["ai-foundations"],
    estimatedDuration: 300,
    tags: ["python", "data-science", "machine-learning"],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 25,
      certificationAvailable: true,
    },
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    description:
      "Understand neural networks from the perceptron to transformers. Build real models for images, text, and beyond.",
    domain: "Artificial Intelligence",
    subject: "Deep Learning",
    grade: 11,
    level: "intermediate",
    status: "published",
    modules: deepLearningModules,
    prerequisites: ["python-for-ai"],
    estimatedDuration: 360,
    tags: ["neural-networks", "cnn", "rnn", "transformers"],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 20,
      certificationAvailable: true,
    },
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "llm-mastery",
    title: "LLM Mastery",
    description:
      "Go from understanding to building. Master large language models, RAG systems, and autonomous AI agents.",
    domain: "Artificial Intelligence",
    subject: "Language Models",
    grade: 12,
    level: "advanced",
    status: "published",
    modules: llmModules,
    prerequisites: ["deep-learning"],
    estimatedDuration: 420,
    tags: ["llm", "rag", "agents", "fine-tuning"],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 15,
      certificationAvailable: true,
    },
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "ai-safety",
    title: "AI Safety & Ethics",
    description:
      "Learn to build AI systems that are safe, fair, and accountable. Covers alignment, bias, transparency, and governance.",
    domain: "AI Ethics",
    subject: "Safety",
    grade: 10,
    level: "beginner",
    status: "published",
    modules: ethicsModules,
    prerequisites: ["ai-foundations"],
    estimatedDuration: 180,
    tags: ["safety", "ethics", "alignment", "bias"],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 30,
      certificationAvailable: true,
    },
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "mathematics-for-ai",
    title: "Mathematics for AI",
    description:
      "The mathematical foundations of intelligence. Master linear algebra, calculus, probability, statistics, and information theory — the language every AI system is built upon.",
    domain: "Artificial Intelligence",
    subject: "Mathematics for AI",
    grade: 10,
    level: "intermediate",
    status: "published",
    modules: mathematicsForAiModules,
    prerequisites: ["python-for-ai"],
    estimatedDuration: 290,
    tags: [
      "mathematics",
      "linear-algebra",
      "calculus",
      "probability",
      "statistics",
    ],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 25,
      certificationAvailable: true,
    },
    createdAt: "2026-08-29T00:00:00Z",
    updatedAt: "2026-08-29T00:00:00Z",
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description:
      "Teach machines to learn from data. From supervised and unsupervised learning to feature engineering and ensemble methods — build models that generalize.",
    domain: "Artificial Intelligence",
    subject: "Machine Learning",
    grade: 11,
    level: "intermediate",
    status: "published",
    modules: machineLearningModules,
    prerequisites: ["mathematics-for-ai"],
    estimatedDuration: 290,
    tags: [
      "machine-learning",
      "supervised-learning",
      "unsupervised-learning",
      "feature-engineering",
      "ensemble",
    ],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 20,
      certificationAvailable: true,
    },
    createdAt: "2026-08-29T00:00:00Z",
    updatedAt: "2026-08-29T00:00:00Z",
  },
  {
    id: "transformers",
    title: "Transformers",
    description:
      "The architecture that changed everything. Dive deep into attention, self-attention, multi-head attention, BERT, GPT, and vision transformers.",
    domain: "Artificial Intelligence",
    subject: "Transformers",
    grade: 11,
    level: "advanced",
    status: "published",
    modules: transformersModules,
    prerequisites: ["deep-learning"],
    estimatedDuration: 295,
    tags: ["transformers", "attention", "bert", "gpt", "vision-transformers"],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 20,
      certificationAvailable: true,
    },
    createdAt: "2026-08-29T00:00:00Z",
    updatedAt: "2026-08-29T00:00:00Z",
  },
  {
    id: "llm-engineering",
    title: "LLM Engineering",
    description:
      "Build with large language models. Master prompt engineering, RAG systems, fine-tuning, evaluation, and production deployment at scale.",
    domain: "Artificial Intelligence",
    subject: "LLM Engineering",
    grade: 12,
    level: "advanced",
    status: "published",
    modules: llmEngineeringModules,
    prerequisites: ["transformers"],
    estimatedDuration: 300,
    tags: ["llm", "prompt-engineering", "rag", "fine-tuning", "deployment"],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 15,
      certificationAvailable: true,
    },
    createdAt: "2026-08-29T00:00:00Z",
    updatedAt: "2026-08-29T00:00:00Z",
  },
  {
    id: "ai-agents",
    title: "AI Agents",
    description:
      "Autonomous systems that reason and act. Design agent architectures, tool use, planning and reasoning, multi-agent systems, and safety and alignment.",
    domain: "Artificial Intelligence",
    subject: "AI Agents",
    grade: 12,
    level: "expert",
    status: "published",
    modules: aiAgentsModules,
    prerequisites: ["llm-engineering"],
    estimatedDuration: 300,
    tags: ["agents", "tool-use", "planning", "multi-agent", "safety"],
    metadata: {
      instructor: "Bhavya AI Faculty",
      cohortSize: 12,
      certificationAvailable: true,
    },
    createdAt: "2026-08-29T00:00:00Z",
    updatedAt: "2026-08-29T00:00:00Z",
  },
];

// ───────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────────

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getCoursesByLevel(level: CourseLevel): Course[] {
  return courses.filter((c) => c.level === level);
}

export function getCourseModules(courseId: string): CourseModule[] {
  const course = getCourseById(courseId);
  return course?.modules ?? [];
}

export function getLessonById(
  courseId: string,
  lessonId: string,
): { course: Course; module: CourseModule; lessonIndex: number } | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  for (const mod of course.modules) {
    const idx = mod.lessons.findIndex((l) => l.id === lessonId);
    if (idx !== -1) return { course, module: mod, lessonIndex: idx };
  }
  return undefined;
}

export function getNextLesson(
  courseId: string,
  lessonId: string,
): { courseId: string; lessonId: string } | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx === -1 || idx === allLessons.length - 1) return undefined;

  return { courseId, lessonId: allLessons[idx + 1].id };
}

export function getPreviousLesson(
  courseId: string,
  lessonId: string,
): { courseId: string; lessonId: string } | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return undefined;

  return { courseId, lessonId: allLessons[idx - 1].id };
}

export function getTotalLessons(courseId: string): number {
  const course = getCourseById(courseId);
  return (
    course?.modules.reduce((sum: number, m) => sum + m.lessons.length, 0) ?? 0
  );
}

// ─── Server-backed loaders live apart ────────────────────────────────────────
// The async SQLite-backed loaders (`getTotalLessonsAsync`, `getFirstLessonId`,
// `loadPublishedCourses`, `loadPublishedCourseById`) live in
// `@/lib/studio/courses` (server-only, next to `db.ts`).
// They are intentionally NOT defined here: this module is imported by client
// components, and the browser must never include the native/database layer.
