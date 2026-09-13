/**
 * Knowledge Repository — Platform-Neutral Interface
 *
 * Domain behavior for Knowledge Object persistence.
 * Production: Turso/libSQL via async adapter.
 * Local: better-sqlite3 via async adapter (same interface).
 *
 * Replaces filesystem-based knowledge-repository.ts.
 */

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

// ── Repository Interface ─────────────────────────────────────

export interface KnowledgeRepository {
  /** Get a single KO by ID */
  get(id: string): Promise<KnowledgeObject | null>;

  /** List all KOs (summaries only for performance) */
  list(): Promise<KOListSummary[]>;

  /** Create a new KO */
  create(data: Partial<KnowledgeObject>): Promise<KnowledgeObject>;

  /** Update an existing KO (partial update) */
  update(
    id: string,
    patch: Partial<KnowledgeObject>,
  ): Promise<KnowledgeObject | null>;

  /** Delete a KO */
  delete(id: string): Promise<boolean>;
}
