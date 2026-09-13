/**
 * Institutional Evidence Log — Knowledge Domain
 *
 * Records evidence of institutional Knowledge activities (KO creation,
 * lesson publication, lesson revert).
 *
 * ## Architecture
 *
 * Delegates storage to the shared SqliteEvidenceRepository (Turso/libSQL
 * in production, better-sqlite3 locally).
 *
 * This module owns ONLY domain-specific semantics:
 * - Activity type enumeration
 * - Event key generation
 * - Public API surface for Knowledge consumers
 */

import { getEvidenceRepository, eventKey as _eventKey } from "./repositories";

// ── Domain Types ──────────────────────────────────────────────

export type ActivityType =
  | "ko-created"
  | "ko-updated"
  | "ko-deleted"
  | "lesson-generated"
  | "lesson-published"
  | "lesson-reverted";

/** Re-export EvidenceRecord for backward compatibility */
export type InstitutionalEvidence = import("./repositories").EvidenceRecord;

// ── Domain API ───────────────────────────────────────────────

/**
 * Record an evidence entry for a Knowledge activity.
 * Immutable once created. Idempotent if idempotencyKey is provided.
 */
export async function recordEvidence(
  activityType: ActivityType,
  activityId: string,
  description: string,
  metadata: Record<string, unknown> = {},
  idempotencyKey?: string,
): Promise<InstitutionalEvidence> {
  return getEvidenceRepository().record(
    activityType,
    activityId,
    description,
    metadata,
    idempotencyKey,
  );
}

/**
 * Generate a deterministic idempotency key for a Knowledge event.
 */
export function koEventKey(koId: string, eventType: ActivityType): string {
  return _eventKey(koId, eventType);
}

/**
 * List all Knowledge evidence entries, sorted by timestamp (newest first).
 */
export async function listEvidence(
  limit: number = 50,
): Promise<InstitutionalEvidence[]> {
  return getEvidenceRepository().list(limit);
}

/**
 * Get Knowledge evidence entries for a specific activity.
 */
export async function getEvidenceByActivity(
  activityId: string,
): Promise<InstitutionalEvidence[]> {
  const all = await getEvidenceRepository().list(500);
  return all.filter((e) => e.activityId === activityId);
}

/**
 * Get Knowledge evidence entries of a specific type.
 */
export async function getEvidenceByType(
  activityType: ActivityType,
): Promise<InstitutionalEvidence[]> {
  return getEvidenceRepository().listByType(activityType);
}

/**
 * Get Knowledge evidence count by type.
 */
export async function getEvidenceCounts(): Promise<
  Record<ActivityType, number>
> {
  return getEvidenceRepository().counts() as Promise<
    Record<ActivityType, number>
  >;
}
