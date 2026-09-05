/**
 * Forest Mission Metrics
 *
 * Tracks institutional metrics for the Forest Mission.
 * Filesystem-based (JSON files in bhavya-ai-lab/metrics/forest.json).
 *
 * ## Source of Truth
 * Metrics are materialized counters (Model B), updated by event handlers.
 * Can be rebuilt from canonical filesystem state via `rebuildForestMetricsFromEvidence()`.
 *
 * ## Consistency Model
 * Metrics and evidence are updated independently. Drift is possible if an event
 * handler fails between recording evidence and updating metrics.
 * The rebuild function provides deterministic reconstruction.
 *
 * ## Metric Definitions (Semantically Honest)
 * - totalMissions: canonical mission files in content/forest/mission-*.json
 * - totalSites: canonical site files in content/forest/site-*.json
 * - totalPlantings: canonical planting files in content/forest/planting-*.json
 * - totalSurveys: canonical survey files in content/forest/survey-*.json
 * - totalMonitoring: canonical monitoring files in content/forest/monitoring-*.json
 * - totalImpactReports: canonical impact files in content/forest/impact-*.json
 * - missionsCreatedThisMonth: mission-created evidence entries in current month
 * - plantingsCreatedThisMonth: planting-created evidence entries in current month
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { DriftDetector } from "@/lib/institutional/drift-detector";

/**
 * Resolve a path relative to workspace root.
 * When running from apps/ai-institute/, process.cwd() is wrong.
 */
function resolveFromWorkspace(...segments: string[]): string {
  // Walk up to find workspace root
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        if (pkg.name === "bhavya-foundation" || pkg.name === "@bhavya/root") {
          return resolve(join(dir, ...segments));
        }
      } catch { /* continue */ }
    }
    dir = join(dir, "..");
  }
  // Fallback: 2 levels up from apps/ai-institute/
  return resolve(join(process.cwd(), "..", "..", ...segments));
}

const METRICS_DIR = process.env.METRICS_DIR || resolveFromWorkspace("bhavya-ai-lab", "metrics");
const FOREST_METRICS_FILE = join(METRICS_DIR, "forest.json");

// ── Types ──────────────────────────────────────────────────────

export interface ForestMetrics {
  totalMissions: number;
  totalSites: number;
  totalPlantings: number;
  totalSurveys: number;
  totalMonitoring: number;
  totalImpactReports: number;
  missionsCreatedThisMonth: number;
  plantingsCreatedThisMonth: number;
  lastUpdated: string;
}

// ── Storage ────────────────────────────────────────────────────

function ensureDir(): void {
  if (!existsSync(METRICS_DIR)) {
    mkdirSync(METRICS_DIR, { recursive: true });
  }
}

function readMetricsFile(): ForestMetrics {
  ensureDir();
  if (!existsSync(FOREST_METRICS_FILE)) {
    return emptyMetrics();
  }
  try {
    const raw = readFileSync(FOREST_METRICS_FILE, "utf-8");
    return JSON.parse(raw) as ForestMetrics;
  } catch {
    return emptyMetrics();
  }
}

function writeMetricsFile(data: ForestMetrics): void {
  ensureDir();
  writeFileSync(FOREST_METRICS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function emptyMetrics(): ForestMetrics {
  return {
    totalMissions: 0,
    totalSites: 0,
    totalPlantings: 0,
    totalSurveys: 0,
    totalMonitoring: 0,
    totalImpactReports: 0,
    missionsCreatedThisMonth: 0,
    plantingsCreatedThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  };
}

// ── Queries ────────────────────────────────────────────────────

export function getForestMetrics(): ForestMetrics {
  return readMetricsFile();
}

// ── Mutations ──────────────────────────────────────────────────

/**
 * Record a mission creation event.
 */
export function recordMissionCreated(): ForestMetrics {
  const metrics = readMetricsFile();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonth = metrics.lastUpdated
    ? `${new Date(metrics.lastUpdated).getFullYear()}-${String(new Date(metrics.lastUpdated).getMonth() + 1).padStart(2, "0")}`
    : "";

  if (currentMonth !== lastMonth) {
    metrics.missionsCreatedThisMonth = 0;
  }

  metrics.totalMissions += 1;
  metrics.missionsCreatedThisMonth += 1;
  metrics.lastUpdated = now.toISOString();

  writeMetricsFile(metrics);
  return metrics;
}

/**
 * Record a planting creation event.
 */
export function recordPlantingCreated(): ForestMetrics {
  const metrics = readMetricsFile();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonth = metrics.lastUpdated
    ? `${new Date(metrics.lastUpdated).getFullYear()}-${String(new Date(metrics.lastUpdated).getMonth() + 1).padStart(2, "0")}`
    : "";

  if (currentMonth !== lastMonth) {
    metrics.plantingsCreatedThisMonth = 0;
  }

  metrics.totalPlantings += 1;
  metrics.plantingsCreatedThisMonth += 1;
  metrics.lastUpdated = now.toISOString();

  writeMetricsFile(metrics);
  return metrics;
}

// ── Replay / Rebuild ─────────────────────────────────────────

const FOREST_DIR = process.env.FOREST_DIR || resolveFromWorkspace("content", "forest");
const FOREST_EVIDENCE_DIR =
  process.env.FOREST_EVIDENCE_DIR ||
  resolveFromWorkspace("bhavya-ai-lab", "evidence", "forest");

// Shared DriftDetector for Forest file counting
const forestDetector = new DriftDetector({ canonicalDir: FOREST_DIR });

function countForestFiles(prefix: string): number {
  return forestDetector.countFiles(prefix);
}

/**
 * Rebuild Forest metrics deterministically from filesystem state + evidence log.
 *
 * 1. Count actual files (authoritative for totals)
 * 2. Replay evidence log for monthly counters
 * 3. Write rebuilt metrics
 */
export function rebuildForestMetricsFromEvidence(): ForestMetrics {
  const totalMissions = countForestFiles("mission-");
  const totalSites = countForestFiles("site-");
  const totalPlantings = countForestFiles("planting-");
  const totalSurveys = countForestFiles("survey-");
  const totalMonitoring = countForestFiles("monitoring-");
  const totalImpactReports = countForestFiles("impact-");

  let missionsCreatedThisMonth = 0;
  let plantingsCreatedThisMonth = 0;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    if (existsSync(FOREST_EVIDENCE_DIR)) {
      const files = readdirSync(FOREST_EVIDENCE_DIR).filter((f) => f.endsWith(".json"));
      for (const f of files) {
        try {
          const raw = readFileSync(join(FOREST_EVIDENCE_DIR, f), "utf-8");
          const entry = JSON.parse(raw) as { activityType: string; timestamp: string };

          const entryMonth = entry.timestamp.slice(0, 7);
          if (entryMonth === currentMonth) {
            if (entry.activityType === "mission-created") missionsCreatedThisMonth += 1;
            if (entry.activityType === "planting-created") plantingsCreatedThisMonth += 1;
          }
        } catch { /* skip corrupted */ }
      }
    }
  } catch { /* directory may not exist */ }

  const rebuilt: ForestMetrics = {
    totalMissions,
    totalSites,
    totalPlantings,
    totalSurveys,
    totalMonitoring,
    totalImpactReports,
    missionsCreatedThisMonth,
    plantingsCreatedThisMonth,
    lastUpdated: new Date().toISOString(),
  };

  writeMetricsFile(rebuilt);
  return rebuilt;
}

/**
 * Detect drift between materialized metrics and filesystem state.
 * Uses the shared DriftDetector for canonical file counting.
 */
export function detectForestMetricsDrift(): {
  drift: boolean;
  current: ForestMetrics;
  canonical: {
    missions: number;
    sites: number;
    plantings: number;
    surveys: number;
    monitoring: number;
    impactReports: number;
  };
} {
  const current = readMetricsFile();

  const results = forestDetector.detect([
    { name: "missions", prefix: "mission-", materialized: current.totalMissions },
    { name: "sites", prefix: "site-", materialized: current.totalSites },
    { name: "plantings", prefix: "planting-", materialized: current.totalPlantings },
    { name: "surveys", prefix: "survey-", materialized: current.totalSurveys },
    { name: "monitoring", prefix: "monitoring-", materialized: current.totalMonitoring },
    { name: "impactReports", prefix: "impact-", materialized: current.totalImpactReports },
  ]);

  const canonical = {
    missions: results.find((r) => r.name === "missions")!.canonical,
    sites: results.find((r) => r.name === "sites")!.canonical,
    plantings: results.find((r) => r.name === "plantings")!.canonical,
    surveys: results.find((r) => r.name === "surveys")!.canonical,
    monitoring: results.find((r) => r.name === "monitoring")!.canonical,
    impactReports: results.find((r) => r.name === "impactReports")!.canonical,
  };

  return { drift: forestDetector.hasDrift(results), current, canonical };
}
