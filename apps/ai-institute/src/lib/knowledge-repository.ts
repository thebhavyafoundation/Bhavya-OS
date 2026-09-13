/**
 * Canonical Knowledge Repository
 *
 * Single source of truth for Knowledge Objects.
 *
 * ## Architecture
 *
 * This module delegates to the SqliteKnowledgeRepository (Turso/libSQL
 * in production, better-sqlite3 locally). Functions are async.
 *
 * Both Studio API and Runtime API consume through this abstraction.
 */

import { getKnowledgeRepository } from "./repositories";
import type {
  KnowledgeObject as RepoKO,
  KOListSummary as RepoKOListSummary,
  KOProvenance as RepoKOProvenance,
  KOStatus as RepoKOStatus,
} from "./repositories";

// ── Re-export types (backward compatibility) ─────────────────

export type KOProvenance = RepoKOProvenance;
export type KOStatus = RepoKOStatus;
export type KnowledgeObject = RepoKO;
export type KOListSummary = RepoKOListSummary;

// Re-export sub-types for callers that import them
export type {
  Concept,
  Definition,
  Example,
  Misconception,
  Exercise,
  Reference,
} from "./repositories";

// ── Async API Surface ───────────────────────────────────────

/**
 * Get a single KO by ID.
 */
export async function getKO(id: string): Promise<KnowledgeObject | null> {
  return getKnowledgeRepository().get(id);
}

/**
 * List all KOs (summaries only for performance).
 */
export async function listKOs(): Promise<KOListSummary[]> {
  return getKnowledgeRepository().list();
}

/**
 * Create a new KO.
 */
export async function createKO(
  data: Partial<KnowledgeObject>,
): Promise<KnowledgeObject> {
  return getKnowledgeRepository().create(data);
}

/**
 * Update an existing KO (partial update).
 */
export async function updateKO(
  id: string,
  patch: Partial<KnowledgeObject>,
): Promise<KnowledgeObject | null> {
  return getKnowledgeRepository().update(id, patch);
}

/**
 * Delete a KO.
 */
export async function deleteKO(id: string): Promise<boolean> {
  return getKnowledgeRepository().delete(id);
}
