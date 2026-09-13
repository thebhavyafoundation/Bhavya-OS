/**
 * Forest Evidence Log — Forest Domain
 *
 * Records evidence of institutional Forest activities (mission creation,
 * site creation, planting, survey, monitoring, impact reporting).
 *
 * ## Architecture
 *
 * Delegates storage to the shared SqliteEvidenceRepository (Turso/libSQL
 * in production, better-sqlite3 locally).
 *
 * This module owns ONLY domain-specific semantics:
 * - Activity type enumeration
 * - Event key generation
 * - Public API surface for Forest consumers
 */

import { getEvidenceRepository, eventKey as _eventKey } from "./repositories";

// ── Domain Types ──────────────────────────────────────────────

export type ForestActivityType =
  | "mission-created"
  | "mission-updated"
  | "site-created"
  | "planting-created"
  | "planting-updated"
  | "survey-created"
  | "monitoring-created"
  | "impact-created";

/** Re-export EvidenceRecord for backward compatibility */
export type ForestEvidence = import("./repositories").EvidenceRecord;

// ── Domain API ───────────────────────────────────────────────

/**
 * Record a Forest evidence entry. Immutable once created.
 * Idempotent if idempotencyKey is provided.
 */
export async function recordForestEvidence(
  activityType: ForestActivityType,
  activityId: string,
  description: string,
  metadata: Record<string, unknown> = {},
  idempotencyKey?: string,
): Promise<ForestEvidence> {
  return getEvidenceRepository().record(
    activityType,
    activityId,
    description,
    metadata,
    idempotencyKey,
  );
}

/**
 * Generate a deterministic idempotency key for a Forest event.
 */
export function forestEventKey(
  entityId: string,
  eventType: ForestActivityType,
): string {
  return _eventKey(entityId, eventType);
}

/**
 * List all Forest evidence entries, sorted by timestamp (newest first).
 */
export async function listForestEvidence(
  limit: number = 50,
): Promise<ForestEvidence[]> {
  return getEvidenceRepository().list(limit);
}

/**
 * Get Forest evidence entries of a specific type.
 */
export async function getForestEvidenceByType(
  activityType: ForestActivityType,
): Promise<ForestEvidence[]> {
  return getEvidenceRepository().listByType(activityType);
}

/**
 * Get Forest evidence count by type.
 */
export async function getForestEvidenceCounts(): Promise<
  Record<ForestActivityType, number>
> {
  return getEvidenceRepository().counts() as Promise<
    Record<ForestActivityType, number>
  >;
}
