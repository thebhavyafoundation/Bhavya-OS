/**
 * Canonical Knowledge Repository
 *
 * Single source of truth for Knowledge Objects.
 * Filesystem-based (JSON files in bhavya-ai-lab/knowledge/objects/).
 *
 * Both Studio API and Runtime API consume through this abstraction.
 * No SQLite knowledge table — filesystem is canonical.
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  unlinkSync,
  mkdirSync,
} from "fs";
import { join, resolve } from "path";

/**
 * Resolve KO_DIR: app-local first, then workspace root fallback.
 *
 * bhavya-ai-lab/knowledge/objects/ resolves to app-local if it exists,
 * otherwise falls back to repository root.
 */
function resolveKoDir(): string {
  if (process.env.KO_DIR) return process.env.KO_DIR;
  const appLocal = join(process.cwd(), "bhavya-ai-lab", "knowledge", "objects");
  if (existsSync(appLocal)) return appLocal;
  return join(
    process.cwd(),
    "..",
    "..",
    "bhavya-ai-lab",
    "knowledge",
    "objects",
  );
}

const KO_DIR = resolve(resolveKoDir());

// ── Types ──────────────────────────────────────────────────────

export type KOProvenance = "institutional" | "test-seed" | "imported";
export type KOStatus = "draft" | "published";

export interface KnowledgeObject {
  id: string;
  domain: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
  concepts: Concept[];
  definitions: Definition[];
  examples: Example[];
  misconceptions: Misconception[];
  exercises: Exercise[];
  references: Reference[];
  prerequisites: string[];
  related: string[];
  metadata: Record<string, unknown>;
  provenance: KOProvenance;
  status: KOStatus;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface Concept {
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Definition {
  term: string;
  definition: string;
}

export interface Example {
  title: string;
  description: string;
  localContext?: string;
}

export interface Misconception {
  belief: string;
  correction: string;
}

export interface Exercise {
  prompt: string;
  type: "mcq" | "short-answer" | "reflection" | "project";
  solution?: string;
}

export interface Reference {
  title: string;
  url?: string;
  type: "book" | "video" | "article" | "local";
}

export interface KOListSummary {
  id: string;
  title: string;
  domain: string;
  provenance: KOProvenance;
  status: KOStatus;
}

// ── Repository ─────────────────────────────────────────────────

function ensureDir(): void {
  if (!existsSync(KO_DIR)) {
    mkdirSync(KO_DIR, { recursive: true });
  }
}

function readJSON(filePath: string): KnowledgeObject | null {
  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as KnowledgeObject;
  } catch {
    return null;
  }
}

function writeJSON(filePath: string, data: KnowledgeObject): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Get a single KO by ID.
 */
export function getKO(id: string): KnowledgeObject | null {
  ensureDir();
  const filePath = join(KO_DIR, `${id}.json`);
  return readJSON(filePath);
}

/**
 * List all KOs (summaries only for performance).
 */
export function listKOs(): KOListSummary[] {
  ensureDir();
  try {
    const files = readdirSync(KO_DIR).filter((f) => f.endsWith(".json"));
    return files
      .map((f) => {
        const ko = readJSON(join(KO_DIR, f));
        return ko
          ? {
              id: ko.id,
              title: ko.title,
              domain: ko.domain,
              provenance: ko.provenance || "institutional",
              status: ko.status || "draft",
            }
          : null;
      })
      .filter((item): item is KOListSummary => item !== null);
  } catch {
    return [];
  }
}

/**
 * Create a new KO.
 */
export function createKO(data: Partial<KnowledgeObject>): KnowledgeObject {
  ensureDir();
  const id =
    data.id || `ko-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const ko: KnowledgeObject = {
    id,
    domain: data.domain || "",
    title: data.title || "Untitled",
    description: data.description || "",
    grade: data.grade || 9,
    subject: data.subject || "AI",
    concepts: data.concepts || [],
    definitions: data.definitions || [],
    examples: data.examples || [],
    misconceptions: data.misconceptions || [],
    exercises: data.exercises || [],
    references: data.references || [],
    prerequisites: data.prerequisites || [],
    related: data.related || [],
    metadata: data.metadata || {},
    provenance: data.provenance || "institutional",
    status: data.status || "draft",
    createdAt: now,
    updatedAt: now,
    version: data.version || "0.1.0",
  };

  const filePath = join(KO_DIR, `${id}.json`);
  writeJSON(filePath, ko);
  return ko;
}

/**
 * Update an existing KO (partial update).
 */
export function updateKO(
  id: string,
  patch: Partial<KnowledgeObject>,
): KnowledgeObject | null {
  ensureDir();
  const existing = getKO(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: KnowledgeObject = {
    ...existing,
    ...patch,
    id: existing.id, // ID cannot change
    createdAt: existing.createdAt, // createdAt cannot change
    updatedAt: now,
  };

  const filePath = join(KO_DIR, `${id}.json`);
  writeJSON(filePath, updated);
  return updated;
}

/**
 * Delete a KO.
 */
export function deleteKO(id: string): boolean {
  ensureDir();
  const filePath = join(KO_DIR, `${id}.json`);
  if (!existsSync(filePath)) return false;
  try {
    unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
}
