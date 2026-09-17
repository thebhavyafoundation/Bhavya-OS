/**
 * Knowledge Mission Metrics
 *
 * Tracks institutional metrics for the Knowledge Mission.
 *
 * ## Architecture
 *
 * Metrics are derived from authoritative database records:
 * - totalKos: count from knowledge_objects table
 * - totalLessons: count from studio_lessons table
 * - totalPublications: count from evidence_records (lesson-published events)
 * - koCreatedThisMonth: count from evidence_records (ko-created events this month)
 * - lessonsPublishedThisMonth: count from evidence_records (lesson-published events this month)
 *
 * No filesystem persistence required. Metrics are computed on read.
 */

import { getAsyncDb } from "./db";

// ── Types ──────────────────────────────────────────────────────

export interface KnowledgeMetrics {
  totalKos: number;
  totalLessons: number;
  totalPublications: number;
  koCreatedThisMonth: number;
  lessonsPublishedThisMonth: number;
  lastUpdated: string;
}

// ── Queries ────────────────────────────────────────────────────

/**
 * Get current Knowledge Mission metrics.
 * Derived from authoritative database records.
 */
export async function getKnowledgeMetrics(): Promise<KnowledgeMetrics> {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Each query resolves independently: a missing optional table (e.g.
  // studio_lessons on a fresh migrated DB) yields 0 for that metric
  // instead of zeroing every metric via a shared catch block.
  async function count(sql: string, ...params: string[]): Promise<number> {
    try {
      const row = await getAsyncDb().get<{ count: number }>(sql, ...params);
      return row?.count ?? 0;
    } catch {
      return 0;
    }
  }

  const [
    totalKos,
    totalLessons,
    totalPublications,
    koCreatedThisMonth,
    lessonsPublishedThisMonth,
  ] = await Promise.all([
    count("SELECT COUNT(*) as count FROM knowledge_objects"),
    count("SELECT COUNT(*) as count FROM studio_lessons"),
    count(
      "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'lesson-published'",
    ),
    count(
      "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'ko-created' AND timestamp LIKE ?",
      `${currentMonth}%`,
    ),
    count(
      "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'lesson-published' AND timestamp LIKE ?",
      `${currentMonth}%`,
    ),
  ]);

  return {
    totalKos,
    totalLessons,
    totalPublications,
    koCreatedThisMonth,
    lessonsPublishedThisMonth,
    lastUpdated: now.toISOString(),
  };
}

// ── Mutation Stubs (kept for backward compatibility) ──────────
// These functions are no longer needed — metrics are derived from records.
// They exist only so callers that import them don't break at import time.

/**
 * @deprecated Metrics are now derived from authoritative records.
 * This function is a no-op retained for import compatibility.
 */
export function recordKoCreated(): KnowledgeMetrics {
  // No-op: metrics derived from evidence_records on read
  return {
    totalKos: 0,
    totalLessons: 0,
    totalPublications: 0,
    koCreatedThisMonth: 0,
    lessonsPublishedThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * @deprecated Metrics are now derived from authoritative records.
 * This function is a no-op retained for import compatibility.
 */
export function recordLessonPublished(): KnowledgeMetrics {
  // No-op: metrics derived from evidence_records on read
  return {
    totalKos: 0,
    totalLessons: 0,
    totalPublications: 0,
    koCreatedThisMonth: 0,
    lessonsPublishedThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  };
}
