/**
 * Forest Evidence Log — Forest Domain
 *
 * Records evidence of institutional Forest activities (mission creation,
 * site creation, planting, survey, monitoring, impact reporting).
 * Filesystem-based (JSON files in bhavya-ai-lab/evidence/forest/).
 *
 * ## Architecture
 *
 * Delegates storage to the shared `EvidenceStore` class.
 * This module owns ONLY domain-specific semantics:
 * - Activity type enumeration
 * - Event key generation (thin wrapper over EvidenceStore.eventKey)
 * - Public API surface for Forest consumers
 *
 * ## Provenance
 *
 * Each record answers: WHAT (activityType), WHEN (timestamp), TO WHAT (activityId),
 * WHO/WHAT caused (metadata.triggeredBy), WHERE from (metadata.source).
 *
 * ## Concurrency
 *
 * Single-process Next.js. Each call creates a NEW file (never modifies existing).
 * writeFileSync is OS-level atomic for small files.
 */

import { join } from "path";
import { EvidenceStore } from "@/lib/institutional/evidence-store";

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

/** Re-export EvidenceRecord as ForestEvidence for backward compatibility */
export type ForestEvidence = import("@/lib/institutional/evidence-store").EvidenceRecord;

// ── Store Instance ──────────────────────────────────────────

const FOREST_EVIDENCE_DIR =
  process.env.FOREST_EVIDENCE_DIR ||
  join(process.cwd(), "bhavya-ai-lab", "evidence", "forest");

const store = new EvidenceStore({
  dir: FOREST_EVIDENCE_DIR,
  activityTypes: [
    "mission-created",
    "mission-updated",
    "site-created",
    "planting-created",
    "planting-updated",
    "survey-created",
    "monitoring-created",
    "impact-created",
  ],
});

// ── Domain API ───────────────────────────────────────────────

/**
 * Record a Forest evidence entry. Immutable once created.
 * Idempotent if idempotencyKey is provided.
 * Delegates to shared EvidenceStore.
 */
export function recordForestEvidence(
  activityType: ForestActivityType,
  activityId: string,
  description: string,
  metadata: Record<string, unknown> = {},
  idempotencyKey?: string,
): ForestEvidence {
  return store.record(activityType, activityId, description, metadata, idempotencyKey);
}

/**
 * Generate a deterministic idempotency key for a Forest event.
 * Thin wrapper over EvidenceStore.eventKey.
 */
export function forestEventKey(entityId: string, eventType: ForestActivityType): string {
  return EvidenceStore.eventKey(entityId, eventType);
}

/**
 * List all Forest evidence entries, sorted by timestamp (newest first).
 */
export function listForestEvidence(limit: number = 50): ForestEvidence[] {
  return store.list(limit);
}

/**
 * Get Forest evidence entries of a specific type.
 */
export function getForestEvidenceByType(activityType: ForestActivityType): ForestEvidence[] {
  return store.listByType(activityType);
}

/**
 * Get Forest evidence count by type.
 */
export function getForestEvidenceCounts(): Record<ForestActivityType, number> {
  return store.counts() as Record<ForestActivityType, number>;
}
