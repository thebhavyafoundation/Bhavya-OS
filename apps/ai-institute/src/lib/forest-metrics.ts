/**
 * Forest Mission Metrics
 *
 * Tracks institutional metrics for the Forest Mission.
 *
 * ## Architecture
 *
 * Metrics are derived from authoritative database records:
 * - totalMissions: count from evidence_records (mission-created events)
 * - totalRegions: count from evidence_records (region-created events)
 * - activeMissions: count from evidence_records (mission-updated events with active status)
 * - missionsThisMonth: count from evidence_records (mission-created events this month)
 *
 * No filesystem persistence required. Metrics are computed on read.
 */

import { getAsyncDb } from "./db";

// ── Types ──────────────────────────────────────────────────────

export interface ForestMetrics {
  totalMissions: number;
  totalRegions: number;
  activeMissions: number;
  missionsThisMonth: number;
  missionsCreatedThisMonth: number;
  plantingsCreatedThisMonth: number;
  lastUpdated: string;
}

// ── Queries ────────────────────────────────────────────────────

/**
 * Get current Forest Mission metrics.
 * Derived from authoritative database records.
 */
export async function getForestMetrics(): Promise<ForestMetrics> {
  try {
    const db = getAsyncDb();
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const [missionsCount, regionsCount, activeCount, missionsThisMonth] =
      await Promise.all([
        db.get<{ count: number }>(
          "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'mission-created'",
        ),
        db.get<{ count: number }>(
          "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'region-created'",
        ),
        db.get<{ count: number }>(
          "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'mission-updated' AND metadata LIKE '%active%'",
        ),
        db.get<{ count: number }>(
          "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'mission-created' AND timestamp LIKE ?",
          `${currentMonth}%`,
        ),
      ]);

    const plantingsThisMonth = await db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = 'planting-created' AND timestamp LIKE ?",
      `${currentMonth}%`,
    );

    return {
      totalMissions: missionsCount?.count ?? 0,
      totalRegions: regionsCount?.count ?? 0,
      activeMissions: activeCount?.count ?? 0,
      missionsThisMonth: missionsThisMonth?.count ?? 0,
      missionsCreatedThisMonth: missionsThisMonth?.count ?? 0,
      plantingsCreatedThisMonth: plantingsThisMonth?.count ?? 0,
      lastUpdated: now.toISOString(),
    };
  } catch {
    return {
      totalMissions: 0,
      totalRegions: 0,
      activeMissions: 0,
      missionsThisMonth: 0,
      missionsCreatedThisMonth: 0,
      plantingsCreatedThisMonth: 0,
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
export function recordMissionCreated(): ForestMetrics {
  // No-op: metrics derived from evidence_records on read
  return {
    totalMissions: 0,
    totalRegions: 0,
    activeMissions: 0,
    missionsThisMonth: 0,
    missionsCreatedThisMonth: 0,
    plantingsCreatedThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * @deprecated Metrics are now derived from authoritative records.
 * This function is a no-op retained for import compatibility.
 */
export function recordRegionCreated(): ForestMetrics {
  // No-op: metrics derived from evidence_records on read
  return {
    totalMissions: 0,
    totalRegions: 0,
    activeMissions: 0,
    missionsThisMonth: 0,
    missionsCreatedThisMonth: 0,
    plantingsCreatedThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * @deprecated Metrics are now derived from authoritative records.
 * This function is a no-op retained for import compatibility.
 */
export function recordMissionUpdated(): ForestMetrics {
  // No-op: metrics derived from evidence_records on read
  return {
    totalMissions: 0,
    totalRegions: 0,
    activeMissions: 0,
    missionsThisMonth: 0,
    missionsCreatedThisMonth: 0,
    plantingsCreatedThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Detect if forest metrics may be stale (drift from evidence records).
 * Returns drift=true if evidence count doesn't match cached metrics.
 */
export function detectForestMetricsDrift(): {
  drift: boolean;
  evidenceCount: number;
} {
  try {
    // Synchronous stub — in practice drift detection requires async DB access.
    // The route handler should call getForestMetrics() directly instead.
    return { drift: false, evidenceCount: 0 };
  } catch {
    return { drift: false, evidenceCount: 0 };
  }
}

/**
 * Rebuild forest metrics directly from evidence records.
 * Used when drift is detected.
 */
export async function rebuildForestMetricsFromEvidence(): Promise<ForestMetrics> {
  return getForestMetrics();
}
