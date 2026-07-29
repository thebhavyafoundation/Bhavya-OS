import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface MetricSnapshot {
  timestamp: string;
  documents: {
    total: number;
    published: number;
    draft: number;
  };
  entities: {
    total: number;
  };
  relationships: {
    total: number;
  };
  knowledge: {
    nodes: number;
    density: number;
  };
  missions: {
    forest: number;
    heritage: number;
    research: number;
    volunteers: number;
  };
}

export interface MetricTrend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  direction: "up" | "down" | "stable";
}

const DATA_DIR = join(process.cwd(), "data");
const METRICS_FILE = join(DATA_DIR, "metrics-history.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadHistory(): MetricSnapshot[] {
  ensureDataDir();
  if (!existsSync(METRICS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(METRICS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveHistory(snapshots: MetricSnapshot[]): void {
  ensureDataDir();
  writeFileSync(METRICS_FILE, JSON.stringify(snapshots, null, 2));
}

export function recordSnapshot(snapshot: MetricSnapshot): void {
  const history = loadHistory();
  history.push(snapshot);
  // Keep last 90 days of snapshots
  if (history.length > 90) {
    history.splice(0, history.length - 90);
  }
  saveHistory(history);
}

export function getHistory(): MetricSnapshot[] {
  return loadHistory();
}

export function getLatestSnapshot(): MetricSnapshot | null {
  const history = loadHistory();
  return history.length > 0 ? history[history.length - 1] : null;
}

export function calculateTrends(): MetricTrend[] {
  const history = loadHistory();
  if (history.length < 2) {
    return [];
  }

  const current = history[history.length - 1];
  const previous = history[history.length - 2];

  const metrics: Array<{ key: string; label: string; getValue: (s: MetricSnapshot) => number }> = [
    { key: "documents.total", label: "Total Documents", getValue: (s) => s.documents.total },
    { key: "documents.published", label: "Published Documents", getValue: (s) => s.documents.published },
    { key: "entities.total", label: "Entities", getValue: (s) => s.entities.total },
    { key: "relationships.total", label: "Relationships", getValue: (s) => s.relationships.total },
    { key: "knowledge.nodes", label: "Knowledge Nodes", getValue: (s) => s.knowledge.nodes },
    { key: "knowledge.density", label: "Graph Density", getValue: (s) => s.knowledge.density },
    { key: "missions.forest", label: "Forest Missions", getValue: (s) => s.missions.forest },
    { key: "missions.volunteers", label: "Volunteers", getValue: (s) => s.missions.volunteers },
  ];

  return metrics.map(({ key, label, getValue }) => {
    const currentVal = getValue(current);
    const previousVal = getValue(previous);
    const change = currentVal - previousVal;
    const changePercent = previousVal > 0 ? Math.round((change / previousVal) * 100) : 0;

    return {
      metric: label,
      current: currentVal,
      previous: previousVal,
      change,
      changePercent,
      direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
    };
  });
}
