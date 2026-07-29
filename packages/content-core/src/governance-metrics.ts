import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import {
  getGovernanceStats,
  getOperationalHealth,
} from "./governance.js";
import {
  getActionItemStats,
} from "./action-items.js";

// ── Snapshot Metrics ───────────────────────────────────────

export interface SnapshotMetrics {
  timestamp: string;
  governance: {
    totalMeetings: number;
    totalResolutions: number;
    totalPolicies: number;
    openResolutions: number;
    pendingReviews: number;
  };
  operational: {
    implementationRate: number;
    policyComplianceRate: number;
    actionCompletionRate: number;
    avgDaysToResolution: number;
    avgDaysToComplete: number;
  };
  actionItems: {
    total: number;
    overdue: number;
    dueSoon: number;
  };
}

// ── Trend Metrics ──────────────────────────────────────────

export interface TrendMetric {
  name: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  direction: "up" | "down" | "stable";
  unit: string;
}

export interface TrendMetrics {
  timestamp: string;
  metrics: TrendMetric[];
}

// ── Historical Data ────────────────────────────────────────

const DATA_DIR = join(process.cwd(), "data");
const SNAPSHOTS_FILE = join(DATA_DIR, "governance-snapshots.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadSnapshots(): SnapshotMetrics[] {
  ensureDataDir();
  if (!existsSync(SNAPSHOTS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(SNAPSHOTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveSnapshots(snapshots: SnapshotMetrics[]): void {
  ensureDataDir();
  writeFileSync(SNAPSHOTS_FILE, JSON.stringify(snapshots, null, 2));
}

// ── Capture Snapshot ───────────────────────────────────────

export function captureSnapshot(): SnapshotMetrics {
  const governance = getGovernanceStats();
  const operational = getOperationalHealth();
  const actionStats = getActionItemStats();

  const snapshot: SnapshotMetrics = {
    timestamp: new Date().toISOString(),
    governance: {
      totalMeetings: governance.totalMeetings,
      totalResolutions: governance.totalResolutions,
      totalPolicies: governance.totalPolicies,
      openResolutions: operational.openResolutions,
      pendingReviews: governance.pendingReviews,
    },
    operational: {
      implementationRate: operational.implementationRate,
      policyComplianceRate: operational.policyComplianceRate,
      actionCompletionRate: actionStats.completionRate,
      avgDaysToResolution: operational.avgTimeToResolution,
      avgDaysToComplete: actionStats.avgDaysToComplete,
    },
    actionItems: {
      total: actionStats.total,
      overdue: actionStats.overdue,
      dueSoon: 0, // Would need to calculate
    },
  };

  const snapshots = loadSnapshots();
  snapshots.push(snapshot);

  // Keep last 365 days
  if (snapshots.length > 365) {
    snapshots.splice(0, snapshots.length - 365);
  }

  saveSnapshots(snapshots);
  return snapshot;
}

// ── Get Trends ─────────────────────────────────────────────

export function getTrendMetrics(): TrendMetrics {
  const snapshots = loadSnapshots();

  if (snapshots.length < 2) {
    return {
      timestamp: new Date().toISOString(),
      metrics: [],
    };
  }

  const current = snapshots[snapshots.length - 1];
  const previous = snapshots[snapshots.length - 2];

  const metrics: TrendMetric[] = [
    {
      name: "Implementation Rate",
      current: current.operational.implementationRate,
      previous: previous.operational.implementationRate,
      change: current.operational.implementationRate - previous.operational.implementationRate,
      changePercent: previous.operational.implementationRate > 0
        ? Math.round(((current.operational.implementationRate - previous.operational.implementationRate) / previous.operational.implementationRate) * 100)
        : 0,
      direction: current.operational.implementationRate > previous.operational.implementationRate
        ? "up"
        : current.operational.implementationRate < previous.operational.implementationRate
        ? "down"
        : "stable",
      unit: "%",
    },
    {
      name: "Policy Compliance",
      current: current.operational.policyComplianceRate,
      previous: previous.operational.policyComplianceRate,
      change: current.operational.policyComplianceRate - previous.operational.policyComplianceRate,
      changePercent: previous.operational.policyComplianceRate > 0
        ? Math.round(((current.operational.policyComplianceRate - previous.operational.policyComplianceRate) / previous.operational.policyComplianceRate) * 100)
        : 0,
      direction: current.operational.policyComplianceRate > previous.operational.policyComplianceRate
        ? "up"
        : current.operational.policyComplianceRate < previous.operational.policyComplianceRate
        ? "down"
        : "stable",
      unit: "%",
    },
    {
      name: "Action Completion",
      current: current.operational.actionCompletionRate,
      previous: previous.operational.actionCompletionRate,
      change: current.operational.actionCompletionRate - previous.operational.actionCompletionRate,
      changePercent: previous.operational.actionCompletionRate > 0
        ? Math.round(((current.operational.actionCompletionRate - previous.operational.actionCompletionRate) / previous.operational.actionCompletionRate) * 100)
        : 0,
      direction: current.operational.actionCompletionRate > previous.operational.actionCompletionRate
        ? "up"
        : current.operational.actionCompletionRate < previous.operational.actionCompletionRate
        ? "down"
        : "stable",
      unit: "%",
    },
    {
      name: "Avg Days to Resolution",
      current: current.operational.avgDaysToResolution,
      previous: previous.operational.avgDaysToResolution,
      change: current.operational.avgDaysToResolution - previous.operational.avgDaysToResolution,
      changePercent: previous.operational.avgDaysToResolution > 0
        ? Math.round(((current.operational.avgDaysToResolution - previous.operational.avgDaysToResolution) / previous.operational.avgDaysToResolution) * 100)
        : 0,
      direction: current.operational.avgDaysToResolution < previous.operational.avgDaysToResolution
        ? "up" // Lower is better
        : current.operational.avgDaysToResolution > previous.operational.avgDaysToResolution
        ? "down"
        : "stable",
      unit: "days",
    },
    {
      name: "Open Resolutions",
      current: current.governance.openResolutions,
      previous: previous.governance.openResolutions,
      change: current.governance.openResolutions - previous.governance.openResolutions,
      changePercent: previous.governance.openResolutions > 0
        ? Math.round(((current.governance.openResolutions - previous.governance.openResolutions) / previous.governance.openResolutions) * 100)
        : 0,
      direction: current.governance.openResolutions < previous.governance.openResolutions
        ? "up" // Lower is better
        : current.governance.openResolutions > previous.governance.openResolutions
        ? "down"
        : "stable",
      unit: "",
    },
  ];

  return {
    timestamp: new Date().toISOString(),
    metrics,
  };
}

// ── Get Snapshot History ───────────────────────────────────

export function getSnapshotHistory(): SnapshotMetrics[] {
  return loadSnapshots();
}

export function getLatestSnapshot(): SnapshotMetrics | null {
  const snapshots = loadSnapshots();
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
}
