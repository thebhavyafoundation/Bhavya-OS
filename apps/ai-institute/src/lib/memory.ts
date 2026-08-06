type ConceptMemory = {
  status: "not-started" | "learning" | "practiced" | "mastered";
  score: number;
  timeSpent: number;
  lastAccessed: string;
  notes: string[];
  bookmarks: string[];
  mistakes: { mistake: string; correction: string; date: string }[];
  assessments: { score: number; date: string }[];
};

type Goal = {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  conceptIds: string[];
  completed: boolean;
  createdAt: string;
};

type StudySession = {
  date: string;
  conceptIds: string[];
  timeSpent: number;
  type: "lesson" | "lab" | "assessment" | "project" | "review";
};

type LearnerMemory = {
  version: number;
  createdAt: string;
  updatedAt: string;
  concepts: Record<string, ConceptMemory>;
  goals: Goal[];
  history: StudySession[];
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  preferences: {
    learningStyle: "visual" | "reading" | "hands-on" | "mixed";
    difficulty: "slow" | "normal" | "fast";
    interests: string[];
  };
};

const STORAGE_KEY = "bhavya-ai-university-memory";

function getDefaultMemory(): LearnerMemory {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    concepts: {},
    goals: [],
    history: [],
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: "",
    },
    preferences: {
      learningStyle: "mixed",
      difficulty: "normal",
      interests: [],
    },
  };
}

function getMemory(): LearnerMemory {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return getDefaultMemory();
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultMemory();
    }
    const parsed = JSON.parse(raw) as LearnerMemory;
    if (
      typeof parsed.version !== "number" ||
      typeof parsed.concepts !== "object" ||
      !Array.isArray(parsed.goals) ||
      !Array.isArray(parsed.history)
    ) {
      return getDefaultMemory();
    }
    return parsed;
  } catch {
    return getDefaultMemory();
  }
}

function saveMemory(memory: LearnerMemory): void {
  memory.updatedAt = new Date().toISOString();
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // localStorage unavailable or quota exceeded — fail silently
  }
}

function resetMemory(): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function initializeConcept(conceptId: string): void {
  const memory = getMemory();
  if (memory.concepts[conceptId]) return;
  memory.concepts[conceptId] = {
    status: "not-started",
    score: 0,
    timeSpent: 0,
    lastAccessed: new Date().toISOString(),
    notes: [],
    bookmarks: [],
    mistakes: [],
    assessments: [],
  };
  saveMemory(memory);
}

function updateConceptStatus(
  conceptId: string,
  status: ConceptMemory["status"],
  score?: number,
): void {
  const memory = getMemory();
  if (!memory.concepts[conceptId]) {
    initializeConcept(conceptId);
  }
  memory.concepts[conceptId].status = status;
  memory.concepts[conceptId].lastAccessed = new Date().toISOString();
  if (score !== undefined) {
    memory.concepts[conceptId].score = score;
  }
  saveMemory(memory);
}

function recordTimeSpent(conceptId: string, minutes: number): void {
  const memory = getMemory();
  if (!memory.concepts[conceptId]) {
    initializeConcept(conceptId);
  }
  memory.concepts[conceptId].timeSpent += minutes;
  memory.concepts[conceptId].lastAccessed = new Date().toISOString();
  saveMemory(memory);
}

function addMistake(
  conceptId: string,
  mistake: string,
  correction: string,
): void {
  const memory = getMemory();
  if (!memory.concepts[conceptId]) {
    initializeConcept(conceptId);
  }
  memory.concepts[conceptId].mistakes.push({
    mistake,
    correction,
    date: new Date().toISOString(),
  });
  memory.concepts[conceptId].lastAccessed = new Date().toISOString();
  saveMemory(memory);
}

function addNote(conceptId: string, note: string): void {
  const memory = getMemory();
  if (!memory.concepts[conceptId]) {
    initializeConcept(conceptId);
  }
  memory.concepts[conceptId].notes.push(note);
  memory.concepts[conceptId].lastAccessed = new Date().toISOString();
  saveMemory(memory);
}

function addBookmark(conceptId: string, note?: string): void {
  const memory = getMemory();
  if (!memory.concepts[conceptId]) {
    initializeConcept(conceptId);
  }
  const bookmark = note || conceptId;
  if (!memory.concepts[conceptId].bookmarks.includes(bookmark)) {
    memory.concepts[conceptId].bookmarks.push(bookmark);
  }
  memory.concepts[conceptId].lastAccessed = new Date().toISOString();
  saveMemory(memory);
}

function removeBookmark(conceptId: string): void {
  const memory = getMemory();
  if (!memory.concepts[conceptId]) return;
  memory.concepts[conceptId].bookmarks = [];
  memory.concepts[conceptId].lastAccessed = new Date().toISOString();
  saveMemory(memory);
}

function recordAssessment(conceptId: string, score: number): void {
  const memory = getMemory();
  if (!memory.concepts[conceptId]) {
    initializeConcept(conceptId);
  }
  memory.concepts[conceptId].assessments.push({
    score,
    date: new Date().toISOString(),
  });
  memory.concepts[conceptId].score = score;
  memory.concepts[conceptId].lastAccessed = new Date().toISOString();
  saveMemory(memory);
}

function addGoal(
  title: string,
  description: string,
  targetDate: string,
  conceptIds: string[],
): Goal {
  const memory = getMemory();
  const goal: Goal = {
    id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    description,
    targetDate,
    conceptIds,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  memory.goals.push(goal);
  saveMemory(memory);
  return goal;
}

function completeGoal(goalId: string): void {
  const memory = getMemory();
  const goal = memory.goals.find((g) => g.id === goalId);
  if (goal) {
    goal.completed = true;
    saveMemory(memory);
  }
}

function recordSession(
  conceptIds: string[],
  timeSpent: number,
  type: StudySession["type"],
): void {
  const memory = getMemory();
  memory.history.push({
    date: new Date().toISOString(),
    conceptIds,
    timeSpent,
    type,
  });
  for (const id of conceptIds) {
    if (!memory.concepts[id]) {
      initializeConcept(id);
    }
    memory.concepts[id].timeSpent += timeSpent;
    memory.concepts[id].lastAccessed = new Date().toISOString();
  }
  saveMemory(memory);
  updateStreak();
}

function updateStreak(): void {
  const memory = getMemory();
  const dates = new Set<string>();
  for (const session of memory.history) {
    dates.add(session.date.slice(0, 10));
  }
  const sorted = Array.from(dates).sort().reverse();
  if (sorted.length === 0) {
    memory.streak = { current: 0, longest: 0, lastActiveDate: "" };
    saveMemory(memory);
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  let current = 0;
  const checkDate = new Date(today);
  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    if (dates.has(dateStr)) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  memory.streak.current = current;
  memory.streak.lastActiveDate = sorted[0];
  if (current > memory.streak.longest) {
    memory.streak.longest = current;
  }
  saveMemory(memory);
}

function getMasteredCount(): number {
  const memory = getMemory();
  return Object.values(memory.concepts).filter((c) => c.status === "mastered")
    .length;
}

function getLearningCount(): number {
  const memory = getMemory();
  return Object.values(memory.concepts).filter((c) => c.status === "learning")
    .length;
}

function getWeakConcepts(threshold: number = 50): string[] {
  const memory = getMemory();
  return Object.entries(memory.concepts)
    .filter(([, c]) => c.score < threshold && c.score > 0)
    .sort((a, b) => a[1].score - b[1].score)
    .map(([id]) => id);
}

function getStrongConcepts(threshold: number = 80): string[] {
  const memory = getMemory();
  return Object.entries(memory.concepts)
    .filter(([, c]) => c.score >= threshold)
    .sort((a, b) => b[1].score - a[1].score)
    .map(([id]) => id);
}

function getTotalTimeSpent(): number {
  const memory = getMemory();
  return Object.values(memory.concepts).reduce(
    (sum, c) => sum + c.timeSpent,
    0,
  );
}

function getRecommendedNext(): string[] {
  const memory = getMemory();
  return Object.entries(memory.concepts)
    .filter(([, c]) => c.status === "learning")
    .sort((a, b) => a[1].score - b[1].score)
    .map(([id]) => id);
}

function exportMemory(): string {
  const memory = getMemory();
  return JSON.stringify(memory, null, 2);
}

function importMemory(data: string): void {
  const parsed = JSON.parse(data) as LearnerMemory;
  if (
    typeof parsed.version !== "number" ||
    typeof parsed.concepts !== "object" ||
    !Array.isArray(parsed.goals) ||
    !Array.isArray(parsed.history)
  ) {
    throw new Error("Invalid memory data format");
  }
  saveMemory(parsed);
}
