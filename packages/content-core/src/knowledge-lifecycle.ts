import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Knowledge Lifecycle Types ──────────────────────────────

export type KnowledgeState =
  | "draft" // Initial creation
  | "published" // Active, current knowledge
  | "reviewed" // Confirmed still relevant
  | "archived" // No longer active, but preserved
  | "preserved"; // Must never be deleted

export interface KnowledgeLifecycle {
  id: string;
  knowledgeId: string;
  knowledgeType:
    | "document"
    | "lesson"
    | "pattern"
    | "playbook"
    | "decision-context"
    | "evidence";
  title: string;
  state: KnowledgeState;
  previousState?: KnowledgeState;
  lastReviewed?: string;
  lastUpdated: string;
  created: string;
  reviewCycle: "monthly" | "quarterly" | "annually" | "never";
  nextReview?: string;
  reviewHistory: ReviewRecord[];
  archiveReason?: string;
  preservationReason?: string;
  dependencies: string[];
  dependentCount: number;
}

export interface ReviewRecord {
  id: string;
  reviewer: string;
  date: string;
  previousState: KnowledgeState;
  newState: KnowledgeState;
  notes: string;
  reason: string;
}

export interface LifecycleStats {
  total: number;
  byState: Record<KnowledgeState, number>;
  byType: Record<string, number>;
  needsReview: number;
  archivedCount: number;
  preservedCount: number;
}

// ── Knowledge Lifecycle Storage ────────────────────────────

const DATA_DIR = join(__dirname, "..", "data");
const LIFECYCLE_FILE = join(DATA_DIR, "knowledge-lifecycle.json");

function readLifecycleData(): KnowledgeLifecycle[] {
  if (!existsSync(LIFECYCLE_FILE)) {
    return [];
  }
  return JSON.parse(
    readFileSync(LIFECYCLE_FILE, "utf-8"),
  ) as KnowledgeLifecycle[];
}

function writeLifecycleData(data: KnowledgeLifecycle[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(LIFECYCLE_FILE, JSON.stringify(data, null, 2));
}

// ── Knowledge Lifecycle CRUD ───────────────────────────────

export function createLifecycleEntry(
  knowledgeId: string,
  knowledgeType: KnowledgeLifecycle["knowledgeType"],
  title: string,
  reviewCycle: KnowledgeLifecycle["reviewCycle"] = "quarterly",
): KnowledgeLifecycle {
  const entries = readLifecycleData();
  const now = new Date().toISOString();

  const entry: KnowledgeLifecycle = {
    id: `lc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    knowledgeId,
    knowledgeType,
    title,
    state: "draft",
    lastUpdated: now,
    created: now,
    reviewCycle,
    nextReview: computeNextReview(now, reviewCycle),
    reviewHistory: [],
    dependencies: [],
    dependentCount: 0,
  };

  entries.push(entry);
  writeLifecycleData(entries);
  return entry;
}

export function getLifecycleEntries(): KnowledgeLifecycle[] {
  return readLifecycleData();
}

export function getLifecycleEntryById(
  id: string,
): KnowledgeLifecycle | undefined {
  return readLifecycleData().find((e) => e.id === id);
}

export function getLifecycleEntryByKnowledgeId(
  knowledgeId: string,
): KnowledgeLifecycle | undefined {
  return readLifecycleData().find((e) => e.knowledgeId === knowledgeId);
}

// ── State Transitions ─────────────────────────────────────

export function transitionState(
  id: string,
  newState: KnowledgeState,
  reviewer: string,
  reason: string,
  notes: string = "",
): KnowledgeLifecycle {
  const entries = readLifecycleData();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error(`Lifecycle entry not found: ${id}`);
  }

  const entry = entries[index];
  const previousState = entry.state;
  const now = new Date().toISOString();

  // Validate transition
  if (!isValidTransition(previousState, newState)) {
    throw new Error(`Invalid transition: ${previousState} → ${newState}`);
  }

  // Update entry
  entry.state = newState;
  entry.previousState = previousState;
  entry.lastReviewed = now;
  entry.lastUpdated = now;
  entry.nextReview = computeNextReview(now, entry.reviewCycle);

  // Add review record
  entry.reviewHistory.push({
    id: `review-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    reviewer,
    date: now,
    previousState,
    newState,
    notes,
    reason,
  });

  // Handle archive/preserve metadata
  if (newState === "archived") {
    entry.archiveReason = reason;
  } else if (newState === "preserved") {
    entry.preservationReason = reason;
  }

  entries[index] = entry;
  writeLifecycleData(entries);
  return entry;
}

export function publishLifecycleEntry(
  knowledgeId: string,
  reviewer: string,
): KnowledgeLifecycle {
  const entry = getLifecycleEntryByKnowledgeId(knowledgeId);
  if (!entry) {
    throw new Error(`No lifecycle entry for knowledge: ${knowledgeId}`);
  }
  return transitionState(
    entry.id,
    "published",
    reviewer,
    "Initial publication",
  );
}

export function reviewKnowledge(
  id: string,
  reviewer: string,
  stillRelevant: boolean,
  notes: string,
): KnowledgeLifecycle {
  const entry = getLifecycleEntryById(id);
  if (!entry) {
    throw new Error(`Lifecycle entry not found: ${id}`);
  }

  if (stillRelevant) {
    return transitionState(
      id,
      "reviewed",
      reviewer,
      "Confirmed still relevant",
      notes,
    );
  } else {
    return transitionState(
      id,
      "archived",
      reviewer,
      "No longer relevant",
      notes,
    );
  }
}

export function archiveKnowledge(
  id: string,
  reviewer: string,
  reason: string,
): KnowledgeLifecycle {
  return transitionState(id, "archived", reviewer, reason);
}

export function preserveKnowledge(
  id: string,
  reviewer: string,
  reason: string,
): KnowledgeLifecycle {
  return transitionState(id, "preserved", reviewer, reason);
}

// ── Review Management ──────────────────────────────────────

export function getEntriesNeedingReview(): KnowledgeLifecycle[] {
  const now = new Date();
  return readLifecycleData().filter((entry) => {
    if (entry.state === "archived" || entry.state === "preserved") {
      return false;
    }
    if (!entry.nextReview) {
      return false;
    }
    return new Date(entry.nextReview) <= now;
  });
}

export function getReviewStats(): {
  total: number;
  needsReview: number;
  overdue: number;
  upcomingMonth: number;
} {
  const entries = readLifecycleData().filter(
    (e) => e.state !== "archived" && e.state !== "preserved",
  );
  const now = new Date();
  const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const needsReview = entries.filter(
    (e) => e.nextReview && new Date(e.nextReview) <= now,
  );
  const overdue = needsReview.filter(
    (e) => e.nextReview && new Date(e.nextReview) < now,
  );
  const upcomingMonth = entries.filter(
    (e) =>
      e.nextReview &&
      new Date(e.nextReview) > now &&
      new Date(e.nextReview) <= monthFromNow,
  );

  return {
    total: entries.length,
    needsReview: needsReview.length,
    overdue: overdue.length,
    upcomingMonth: upcomingMonth.length,
  };
}

// ── Lifecycle Statistics ───────────────────────────────────

export function getLifecycleStats(): LifecycleStats {
  const entries = readLifecycleData();

  const byState: Record<KnowledgeState, number> = {
    draft: 0,
    published: 0,
    reviewed: 0,
    archived: 0,
    preserved: 0,
  };

  const byType: Record<string, number> = {};

  entries.forEach((entry) => {
    byState[entry.state]++;
    byType[entry.knowledgeType] = (byType[entry.knowledgeType] || 0) + 1;
  });

  const now = new Date();
  const needsReview = entries.filter(
    (e) =>
      e.state !== "archived" &&
      e.state !== "preserved" &&
      e.nextReview &&
      new Date(e.nextReview) <= now,
  ).length;

  return {
    total: entries.length,
    byState,
    byType,
    needsReview,
    archivedCount: byState.archived,
    preservedCount: byState.preserved,
  };
}

// ── Dependency Tracking ────────────────────────────────────

export function addDependency(entryId: string, dependencyId: string): void {
  const entries = readLifecycleData();
  const index = entries.findIndex((e) => e.id === entryId);
  if (index === -1) {
    throw new Error(`Lifecycle entry not found: ${entryId}`);
  }

  if (!entries[index].dependencies.includes(dependencyId)) {
    entries[index].dependencies.push(dependencyId);
    entries[index].lastUpdated = new Date().toISOString();
    writeLifecycleData(entries);
  }
}

export function removeDependency(entryId: string, dependencyId: string): void {
  const entries = readLifecycleData();
  const index = entries.findIndex((e) => e.id === entryId);
  if (index === -1) {
    throw new Error(`Lifecycle entry not found: ${entryId}`);
  }

  entries[index].dependencies = entries[index].dependencies.filter(
    (d) => d !== dependencyId,
  );
  entries[index].lastUpdated = new Date().toISOString();
  writeLifecycleData(entries);
}

// ── Helper Functions ───────────────────────────────────────

function isValidTransition(from: KnowledgeState, to: KnowledgeState): boolean {
  const validTransitions: Record<KnowledgeState, KnowledgeState[]> = {
    draft: ["published"],
    published: ["reviewed", "archived"],
    reviewed: ["published", "archived"],
    archived: ["preserved", "published"],
    preserved: [], // Cannot transition out of preserved
  };
  return validTransitions[from].includes(to);
}

function computeNextReview(
  from: string,
  cycle: KnowledgeLifecycle["reviewCycle"],
): string {
  const date = new Date(from);
  switch (cycle) {
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "annually":
      date.setFullYear(date.getFullYear() + 1);
      break;
    case "never":
      return ""; // No review scheduled
  }
  return date.toISOString();
}
