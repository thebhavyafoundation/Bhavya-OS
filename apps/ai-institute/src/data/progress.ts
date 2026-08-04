// Student progress state — localStorage based for Slice 1 MVP

export interface StudentProgress {
  enrolled: boolean;
  assessmentCompleted: boolean;
  assessmentScore: number;
  currentLessonIndex: number;
  lessonsCompleted: string[];
  labTasksCompleted: string[];
  labScore: number;
  knowledgeCheckAnswers: Record<string, string | number>;
  knowledgeCheckScore: number;
  projectSubmitted: boolean;
  projectScore: number;
  badgeEarned: boolean;
  reflectionEntries: { lessonId: string; content: string; date: string }[];
  streak: number;
  lastActiveDate: string;
}

const STORAGE_KEY = "ai-institute-progress";

export function getProgress(): StudentProgress {
  if (typeof window === "undefined") {
    return defaultProgress();
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultProgress();
}

export function saveProgress(progress: StudentProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

function defaultProgress(): StudentProgress {
  return {
    enrolled: false,
    assessmentCompleted: false,
    assessmentScore: 0,
    currentLessonIndex: 0,
    lessonsCompleted: [],
    labTasksCompleted: [],
    labScore: 0,
    knowledgeCheckAnswers: {},
    knowledgeCheckScore: 0,
    projectSubmitted: false,
    projectScore: 0,
    badgeEarned: false,
    reflectionEntries: [],
    streak: 0,
    lastActiveDate: "",
  };
}

// Assessment questions for AI Readiness
export const assessmentQuestions = [
  {
    id: "prog",
    question: "Which of these is a variable in JavaScript?",
    options: ["let x = 5", "print(x)", "run program", "5 = x"],
    correct: 0,
    category: "programming",
  },
  {
    id: "logic",
    question: "If all cats are animals, and Whiskers is a cat, then:",
    options: [
      "Whiskers might be an animal",
      "Whiskers is an animal",
      "Whiskers is a dog",
      "Cannot determine",
    ],
    correct: 1,
    category: "logic",
  },
  {
    id: "math",
    question: "What is 2 raised to the power of 3?",
    options: ["6", "8", "9", "16"],
    correct: 1,
    category: "mathematics",
  },
  {
    id: "ai-1",
    question: "What does LLM stand for?",
    options: [
      "Large Language Model",
      "Learning Logic Machine",
      "Linear Language Manager",
      "Limited Learning Model",
    ],
    correct: 0,
    category: "ai_familiarity",
  },
  {
    id: "ai-2",
    question: "Which company created ChatGPT?",
    options: ["Google", "Meta", "OpenAI", "Microsoft"],
    correct: 2,
    category: "ai_familiarity",
  },
  {
    id: "goals",
    question: "What is your primary goal for learning AI?",
    options: [
      "Get a job in AI",
      "Build my own tools",
      "Understand the technology",
      "All of the above",
    ],
    correct: 3,
    category: "goals",
  },
  {
    id: "time",
    question: "How many hours per week can you dedicate to learning?",
    options: ["1-3 hours", "4-7 hours", "8-12 hours", "12+ hours"],
    correct: -1,
    category: "time",
  },
  {
    id: "lang",
    question: "Which programming languages do you know?",
    options: ["None", "JavaScript/TypeScript", "Python", "Both JS and Python"],
    correct: -1,
    category: "language",
  },
];

export function calculateAssessmentScore(answers: Record<string, number>): {
  score: number;
  level: string;
  recommendation: string;
  pace: string;
} {
  let correct = 0;
  let total = 0;

  for (const q of assessmentQuestions) {
    if (q.correct >= 0) {
      total++;
      if (answers[q.id] === q.correct) {
        correct++;
      }
    }
  }

  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (score >= 80) {
    return {
      score,
      level: "Intermediate",
      recommendation:
        "You're ready for a faster pace. Consider skipping some basics.",
      pace: "2-3 lessons per week",
    };
  } else if (score >= 50) {
    return {
      score,
      level: "Beginner",
      recommendation: "Good foundation. Follow the standard path.",
      pace: "1-2 lessons per week",
    };
  } else {
    return {
      score,
      level: "Starting Fresh",
      recommendation: "No worries! Everyone starts somewhere. Take it slow.",
      pace: "1 lesson per week",
    };
  }
}
