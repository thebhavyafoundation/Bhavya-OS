import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import {
  DecisionContext,
  LessonLearned,
  InstitutionalPattern,
  MemoryStats,
} from "./models.js";

const DATA_DIR = join(process.cwd(), "data");
const MEMORY_FILE = join(DATA_DIR, "institutional-memory.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadMemory(): {
  decisions: DecisionContext[];
  lessons: LessonLearned[];
  patterns: InstitutionalPattern[];
} {
  ensureDataDir();
  if (!existsSync(MEMORY_FILE)) {
    return { decisions: [], lessons: [], patterns: [] };
  }
  try {
    return JSON.parse(readFileSync(MEMORY_FILE, "utf-8"));
  } catch {
    return { decisions: [], lessons: [], patterns: [] };
  }
}

function saveMemory(data: {
  decisions: DecisionContext[];
  lessons: LessonLearned[];
  patterns: InstitutionalPattern[];
}): void {
  ensureDataDir();
  writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

// ── Decision Context ───────────────────────────────────────

export function getDecisionContexts(): DecisionContext[] {
  return loadMemory().decisions;
}

export function getDecisionContextById(id: string): DecisionContext | undefined {
  return loadMemory().decisions.find((d) => d.id === id);
}

export function getDecisionContextsByType(type: DecisionContext["decisionType"]): DecisionContext[] {
  return loadMemory().decisions.filter((d) => d.decisionType === type);
}

export function createDecisionContext(context: Omit<DecisionContext, "created" | "updated">): DecisionContext {
  const memory = loadMemory();
  const newContext: DecisionContext = {
    ...context,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  memory.decisions.push(newContext);
  saveMemory(memory);
  return newContext;
}

export function updateDecisionContext(id: string, updates: Partial<DecisionContext>): DecisionContext | null {
  const memory = loadMemory();
  const index = memory.decisions.findIndex((d) => d.id === id);
  if (index === -1) return null;
  memory.decisions[index] = { ...memory.decisions[index], ...updates, updated: new Date().toISOString() };
  saveMemory(memory);
  return memory.decisions[index];
}

export function addLessonToDecision(decisionId: string, lesson: string): DecisionContext | null {
  const memory = loadMemory();
  const index = memory.decisions.findIndex((d) => d.id === decisionId);
  if (index === -1) return null;
  const decision = memory.decisions[index];
  memory.decisions[index] = {
    ...decision,
    lessonsLearned: [...(decision.lessonsLearned || []), lesson],
    updated: new Date().toISOString(),
  };
  saveMemory(memory);
  return memory.decisions[index];
}

// ── Lessons Learned ────────────────────────────────────────

export function getLessons(): LessonLearned[] {
  return loadMemory().lessons;
}

export function getLessonById(id: string): LessonLearned | undefined {
  return loadMemory().lessons.find((l) => l.id === id);
}

export function getLessonsByCategory(category: LessonLearned["category"]): LessonLearned[] {
  return loadMemory().lessons.filter((l) => l.category === category);
}

export function getLessonsBySource(sourceType: LessonLearned["sourceType"]): LessonLearned[] {
  return loadMemory().lessons.filter((l) => l.sourceType === sourceType);
}

export function createLesson(lesson: Omit<LessonLearned, "created" | "updated">): LessonLearned {
  const memory = loadMemory();
  const newLesson: LessonLearned = {
    ...lesson,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  memory.lessons.push(newLesson);
  saveMemory(memory);
  return newLesson;
}

export function updateLesson(id: string, updates: Partial<LessonLearned>): LessonLearned | null {
  const memory = loadMemory();
  const index = memory.lessons.findIndex((l) => l.id === id);
  if (index === -1) return null;
  memory.lessons[index] = { ...memory.lessons[index], ...updates, updated: new Date().toISOString() };
  saveMemory(memory);
  return memory.lessons[index];
}

// ── Institutional Patterns ─────────────────────────────────

export function getPatterns(): InstitutionalPattern[] {
  return loadMemory().patterns;
}

export function getPatternById(id: string): InstitutionalPattern | undefined {
  return loadMemory().patterns.find((p) => p.id === id);
}

export function getPatternsByType(patternType: InstitutionalPattern["patternType"]): InstitutionalPattern[] {
  return loadMemory().patterns.filter((p) => p.patternType === patternType);
}

export function getHighConfidencePatterns(minConfidence: number = 0.7): InstitutionalPattern[] {
  return loadMemory().patterns.filter((p) => p.confidence >= minConfidence);
}

export function createPattern(pattern: Omit<InstitutionalPattern, "created" | "updated">): InstitutionalPattern {
  const memory = loadMemory();
  const newPattern: InstitutionalPattern = {
    ...pattern,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  memory.patterns.push(newPattern);
  saveMemory(memory);
  return newPattern;
}

export function updatePattern(id: string, updates: Partial<InstitutionalPattern>): InstitutionalPattern | null {
  const memory = loadMemory();
  const index = memory.patterns.findIndex((p) => p.id === id);
  if (index === -1) return null;
  memory.patterns[index] = { ...memory.patterns[index], ...updates, updated: new Date().toISOString() };
  saveMemory(memory);
  return memory.patterns[index];
}

// ── Statistics ─────────────────────────────────────────────

export function getMemoryStats(): MemoryStats {
  const memory = loadMemory();

  const lessonsByCategory: Record<string, number> = {};
  for (const lesson of memory.lessons) {
    lessonsByCategory[lesson.category] = (lessonsByCategory[lesson.category] || 0) + 1;
  }

  const patternsByType: Record<string, number> = {};
  for (const pattern of memory.patterns) {
    patternsByType[pattern.patternType] = (patternsByType[pattern.patternType] || 0) + 1;
  }

  return {
    totalDecisions: memory.decisions.length,
    totalLessons: memory.lessons.length,
    totalPatterns: memory.patterns.length,
    decisionsWithContext: memory.decisions.filter((d) => d.rationale).length,
    lessonsByCategory,
    patternsByType,
  };
}

// ── Learning Queries ───────────────────────────────────────

export function getSuccessfulPatterns(): InstitutionalPattern[] {
  return loadMemory().patterns.filter((p) => p.successRate >= 0.7);
}

export function getLessonsByConfidence(minConfidence: number = 0.7): LessonLearned[] {
  return loadMemory().lessons.filter((l) => l.confidence >= minConfidence);
}

export function getDecisionsWithFullContext(): DecisionContext[] {
  return loadMemory().decisions.filter(
    (d) => d.rationale && d.alternativesConsidered.length > 0 && d.risksIdentified.length > 0
  );
}
