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
  try {
    const db = getAsyncDb();
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const [
      kosCount,
      lessonsCount,
      publicationsCount,
      koThisMonth,
      lessonsThisMonth,
    ] = await Promise.all([
      db.get<{ count: number }>(
        "SELECT COUNT(*) as count FROM knowledge_objects",
      ),
      db.get<{ count: number }>("SELECT COUNT(*) as count FROM studio_lessons"),
      db.get<{ count: number }>(
        "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'lesson-published'",
      ),
      db.get<{ count: number }>(
        "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'ko-created' AND timestamp LIKE ?",
        `${currentMonth}%`,
      ),
      db.get<{ count: number }>(
        "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'lesson-published' AND timestamp LIKE ?",
        `${currentMonth}%`,
      ),
    ]);

    return {
      totalKos: kosCount?.count ?? 0,
      totalLessons: lessonsCount?.count ?? 0,
      totalPublications: publicationsCount?.count ?? 0,
      koCreatedThisMonth: koThisMonth?.count ?? 0,
      lessonsPublishedThisMonth: lessonsThisMonth?.count ?? 0,
      lastUpdated: now.toISOString(),
    };
  } catch {
    return {
      totalKos: 0,
      totalLessons: 0,
      totalPublications: 0,
      koCreatedThisMonth: 0,
      lessonsPublishedThisMonth: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
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
