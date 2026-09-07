/**
 * Institutional Evidence Log — Knowledge Domain
 *
 * Records evidence of institutional Knowledge activities (KO creation,
 * lesson publication, lesson revert). Filesystem-based (JSON files in
 * bhavya-ai-lab/evidence/).
 *
 * ## Architecture
 *
 * Delegates storage to the shared `EvidenceStore` class.
 * This module owns ONLY domain-specific semantics:
 * - Activity type enumeration
 * - Event key generation (thin wrapper over EvidenceStore.eventKey)
 * - Public API surface for Knowledge consumers
 *
 * ## Provenance
 *
 * Each evidence record answers:
 * - WHAT happened: `activityType` + `description`
 * - WHEN: `timestamp`
 * - TO WHAT: `activityId` (the entity that was acted upon)
 * - WHO/WHAT caused it: `metadata.triggeredBy` (optional, set by caller)
 * - WHERE did evidence originate: `metadata.source` (optional, set by caller)
 * - CAN it be verified: Determined by `activityType` (evidence types that
 *   correspond to filesystem artifacts are inherently verifiable)
 * - IS it public: All evidence is currently public via the stats API
 */

import { join, resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { EvidenceStore } from "@/lib/institutional/evidence-store";

// ── Domain Types ──────────────────────────────────────────────

export type ActivityType =
  | "ko-created"
  | "ko-updated"
  | "ko-deleted"
  | "lesson-generated"
  | "lesson-published"
  | "lesson-reverted";

/** Re-export EvidenceRecord as InstitutionalEvidence for backward compatibility */
export type InstitutionalEvidence =
  import("@/lib/institutional/evidence-store").EvidenceRecord;

// ── Store Instance ──────────────────────────────────────────

/**
 * Resolve evidence dir: app-local first, then workspace root fallback.
 */
function resolveEvidenceDir(): string {
  if (process.env.EVIDENCE_DIR) return process.env.EVIDENCE_DIR;
  const appLocal = join(process.cwd(), "bhavya-ai-lab", "evidence");
  if (existsSync(appLocal)) return resolve(appLocal);
  return resolve(join(process.cwd(), "..", "..", "bhavya-ai-lab", "evidence"));
}

const EVIDENCE_DIR = resolveEvidenceDir();

const store = new EvidenceStore({
  dir: EVIDENCE_DIR,
  activityTypes: [
    "ko-created",
    "ko-updated",
    "ko-deleted",
    "lesson-generated",
    "lesson-published",
    "lesson-reverted",
  ],
});

// ── Domain API ───────────────────────────────────────────────

/**
 * Record an evidence entry for a Knowledge activity.
 * Immutable once created. Delegates to shared EvidenceStore.
 *
 * If `idempotencyKey` is provided and a record with that key already exists,
 * the existing record is returned without creating a duplicate.
 */
export function recordEvidence(
  activityType: ActivityType,
  activityId: string,
  description: string,
  metadata: Record<string, unknown> = {},
  idempotencyKey?: string,
): InstitutionalEvidence {
  return store.record(
    activityType,
    activityId,
    description,
    metadata,
    idempotencyKey,
  );
}

/**
 * Generate a deterministic idempotency key for a Knowledge event.
 * Thin wrapper over EvidenceStore.eventKey.
 */
export function koEventKey(koId: string, eventType: ActivityType): string {
  return EvidenceStore.eventKey(koId, eventType);
}

/**
 * List all Knowledge evidence entries, sorted by timestamp (newest first).
 */
export function listEvidence(limit: number = 50): InstitutionalEvidence[] {
  return store.list(limit);
}

/**
 * Get Knowledge evidence entries for a specific activity.
 */
export function getEvidenceByActivity(
  activityId: string,
): InstitutionalEvidence[] {
  return store.list().filter((e) => e.activityId === activityId);
}

/**
 * Get Knowledge evidence entries of a specific type.
 */
export function getEvidenceByType(
  activityType: ActivityType,
): InstitutionalEvidence[] {
  return store.listByType(activityType);
}

/**
 * Get Knowledge evidence count by type.
 */
export function getEvidenceCounts(): Record<ActivityType, number> {
  return store.counts() as Record<ActivityType, number>;
}
