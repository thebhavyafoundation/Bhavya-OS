/**
 * Evidence Repository — Platform-Neutral Interface
 *
 * Domain behavior for institutional evidence persistence.
 * Append-only audit trail for Knowledge and Forest activities.
 *
 * Production: Turso/libSQL via async adapter.
 * Local: better-sqlite3 via async adapter (same interface).
 *
 * Replaces filesystem-based evidence-store.ts.
 */

import { createHash } from "crypto";

// ── Types ──────────────────────────────────────────────────────

export interface EvidenceRecord {
  id: string;
  activityType: string;
  activityId: string;
  timestamp: string;
  description: string;
  metadata: Record<string, unknown>;
  idempotencyKey?: string;
}

// ── Helpers ──────────────────────────────────────────────────

/**
 * Generate a deterministic idempotency key for an evidence event.
 * Produces a stable hash from the entity ID + event type.
 */
export function eventKey(entityId: string, eventType: string): string {
  return createHash("sha256")
    .update(`${entityId}:${eventType}`)
    .digest("hex")
    .slice(0, 24);
}

// ── Repository Interface ─────────────────────────────────────

export interface EvidenceRepository {
  /**
   * Record an evidence entry. Immutable once created.
   * If idempotencyKey is provided and a record with that key exists,
   * returns the existing record without creating a duplicate.
   */
  record(
    activityType: string,
    activityId: string,
    description: string,
    metadata?: Record<string, unknown>,
    idempotencyKey?: string,
  ): Promise<EvidenceRecord>;

  /** List evidence entries, sorted by timestamp (newest first) */
  list(limit?: number): Promise<EvidenceRecord[]>;

  /** List evidence entries of a specific type */
  listByType(activityType: string): Promise<EvidenceRecord[]>;

  /** Get evidence count by type */
  counts(): Promise<Record<string, number>>;

  /** Count events of a specific type in a given month (YYYY-MM format) */
  countByMonth(month: string): Promise<Record<string, number>>;

  /** Count cumulative events of a specific type */
  countTotal(activityType: string): Promise<number>;

  /** Distinct activity types, newest-first by latest row (for filter UIs) */
  listActivityTypes(limit?: number): Promise<string[]>;

  /** Recent evidence across types, newest first */
  listRecent(limit?: number): Promise<EvidenceRecord[]>;

  /** Filtered query: exact type and/or activity id, newest first */
  query(filter: { activityType?: string; activityId?: string; limit?: number }): Promise<EvidenceRecord[]>;
}
