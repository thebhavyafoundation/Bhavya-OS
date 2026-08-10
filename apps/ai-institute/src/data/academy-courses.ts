/**
 * Bhavya Academy — Canonical Course Data
 *
 * Real curriculum content for the AI Institute.
 * Types defined locally to avoid module resolution issues during development.
 *
 * @module academy-courses
 */

// ═══════════════════════════════════════════════════════════════════
// LOCAL TYPES (mirror @bhavya/shared)
// ═══════════════════════════════════════════════════════════════════

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
}

export type CourseLevel =
  | "foundation"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

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
}

// ═══════════════════════════════════════════════════════════════════
// COURSE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

const foundationModules: CourseModule[] = [
  {
    id: "found-mod-1",
    title: "What Is AI?",
    description: "Understand artificial intelligence from the ground up.",
    order: 1,
    lessons: [
      { id: "found-1-1", title: "The Idea of Intelligence", order: 1, duration: 25 },
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
      { id: "found-2-1", title: "What Is a Language Model?", order: 1, duration: 25 },
      { id: "found-2-2", title: "Prompt Engineering Basics", order: 2, duration: 35 },
      { id: "found-2-3", title: "Advanced Prompt Techniques", order: 3, duration: 30 },
    ],
  },
  {
    id: "found-mod-3",
    title: "Building Your First AI App",
    description: "Turn knowledge into a real, working application.",
    order: 3,
    lessons: [
      { id: "found-3-1", title: "Setting Up Your Environment", order: 1, duration: 20 },
      { id: "found-3-2", title: "Calling an AI API", order: 2, duration: 30 },
      { id: "found-3-3", title: "Building a Chat Interface", order: 3, duration: 40 },
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
      { id: "py-1-1", title: "Variables and Data Types", order: 1, duration: 20 },
      { id: "py-1-2", title: "Control Flow and Functions", order: 2, duration: 25 },
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
      { id: "py-3-1", title: "What Is Machine Learning?", order: 1, duration: 20 },
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
      { id: "dl-1-2", title: "Layers and Activation Functions", order: 2, duration: 30 },
      { id: "dl-1-3", title: "Backpropagation", order: 3, duration: 35 },
    ],
  },
  {
    id: "dl-mod-2",
    title: "Architectures",
    description: "Explore the architectures that power modern AI.",
    order: 2,
    lessons: [
      { id: "dl-2-1", title: "Convolutional Neural Networks", order: 1, duration: 30 },
      { id: "dl-2-2", title: "Recurrent Neural Networks", order: 2, duration: 30 },
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
      { id: "llm-1-1", title: "Tokenization and Embeddings", order: 1, duration: 30 },
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
      { id: "llm-3-2", title: "Tool Use and Function Calling", order: 2, duration: 35 },
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
      { id: "eth-1-3", title: "Transparency and Explainability", order: 3, duration: 25 },
    ],
  },
  {
    id: "eth-mod-2",
    title: "Responsible Development",
    description: "Build AI systems that are safe, fair, and accountable.",
    order: 2,
    lessons: [
      { id: "eth-2-1", title: "Ethical Frameworks", order: 1, duration: 25 },
      { id: "eth-2-2", title: "Testing and Validation", order: 2, duration: 30 },
      { id: "eth-2-3", title: "Governance and Policy", order: 3, duration: 25 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// EXPORTED COURSES
// ═══════════════════════════════════════════════════════════════════

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
];

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

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
  lessonId: string
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
  lessonId: string
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
  lessonId: string
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
  return course?.modules.reduce((sum: number, m) => sum + m.lessons.length, 0) ?? 0;
}
