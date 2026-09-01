/**
 * Knowledge Mission Metrics
 *
 * Tracks institutional metrics for the Knowledge Mission.
 * Filesystem-based (JSON files in bhavya-ai-lab/metrics/).
 *
 * ## Source of Truth
 *
 * Metrics are materialized counters (Model B), NOT derived from evidence.
 * They are updated by event handlers (`recordKoCreated`, `recordLessonPublished`).
 *
 * ## Concurrency Model
 *
 * Single file read-modify-write. Safe for single-process deployment.
 * Concurrent calls to `recordKoCreated()` could theoretically lose an increment
 * if two reads happen before either write completes. In practice, this is
 * extremely unlikely in the single-process Next.js runtime.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

/**
 * Resolve a path relative to workspace root.
 * When running from apps/ai-institute/, process.cwd() is wrong.
 */
function resolveFromWorkspace(...segments: string[]): string {
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        if (pkg.name === "bhavya-foundation" || pkg.name === "@bhavya/root") {
          return resolve(join(dir, ...segments));
        }
      } catch {
        /* continue */
      }
    }
    dir = join(dir, "..");
  }
  return resolve(join(process.cwd(), "..", "..", ...segments));
}

const METRICS_DIR =
  process.env.METRICS_DIR || resolveFromWorkspace("bhavya-ai-lab", "metrics");
const KNOWLEDGE_METRICS_FILE = join(METRICS_DIR, "knowledge.json");

// ── Types ──────────────────────────────────────────────────────

/**
 * Public metric definitions (for documentation):
 *
 * totalKos
 *   = count of canonical KO JSON files currently present in bhavya-ai-lab/knowledge/objects/
 *   = "How many knowledge objects exist right now?"
 *
 * totalLessons
 *   = count of lessons in Studio SQLite (canonical source)
 *   = NOTE: file-based lessons (bhavya-ai-lab/data/lessons/) removed in Wave J
 *
 * totalPublications
 *   = cumulative count of lesson publication events
 *   = "How many times has a lesson been published?"
 *
 * koCreatedThisMonth
 *   = KO creation events during current calendar month
 *   = reset to 0 when month changes
 *   = "How many KOs were created this month?"
 *
 * lessonsPublishedThisMonth
 *   = lesson publication events during current calendar month
 *   = reset to 0 when month changes
 *   = "How many lessons were published this month?"
 */
export interface KnowledgeMetrics {
  totalKos: number;
  totalLessons: number;
  totalPublications: number;
  koCreatedThisMonth: number;
  lessonsPublishedThisMonth: number;
  lastUpdated: string;
}

// ── Storage ────────────────────────────────────────────────────

function ensureDir(): void {
  if (!existsSync(METRICS_DIR)) {
    mkdirSync(METRICS_DIR, { recursive: true });
  }
}

function readMetricsFile(): KnowledgeMetrics {
  ensureDir();
  if (!existsSync(KNOWLEDGE_METRICS_FILE)) {
    return {
      totalKos: 0,
      totalLessons: 0,
      totalPublications: 0,
      koCreatedThisMonth: 0,
      lessonsPublishedThisMonth: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
  try {
    const raw = readFileSync(KNOWLEDGE_METRICS_FILE, "utf-8");
    return JSON.parse(raw) as KnowledgeMetrics;
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

function writeMetricsFile(data: KnowledgeMetrics): void {
  ensureDir();
  writeFileSync(KNOWLEDGE_METRICS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ── Queries ────────────────────────────────────────────────────

/**
 * Get current Knowledge Mission metrics.
 */
export function getKnowledgeMetrics(): KnowledgeMetrics {
  return readMetricsFile();
}

// ── Mutations ──────────────────────────────────────────────────

/**
 * Record a KO creation event.
 * Increments totalKos and koCreatedThisMonth.
 */
export function recordKoCreated(): KnowledgeMetrics {
  const metrics = readMetricsFile();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonth = metrics.lastUpdated
    ? `${new Date(metrics.lastUpdated).getFullYear()}-${String(new Date(metrics.lastUpdated).getMonth() + 1).padStart(2, "0")}`
    : "";

  // Reset monthly counter if month changed
  if (currentMonth !== lastMonth) {
    metrics.koCreatedThisMonth = 0;
  }

  metrics.totalKos += 1;
  metrics.koCreatedThisMonth += 1;
  metrics.lastUpdated = now.toISOString();

  writeMetricsFile(metrics);
  return metrics;
}

/**
 * Record a lesson publication event.
 * Increments totalLessons, totalPublications, and lessonsPublishedThisMonth.
 */
export function recordLessonPublished(): KnowledgeMetrics {
  const metrics = readMetricsFile();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonth = metrics.lastUpdated
    ? `${new Date(metrics.lastUpdated).getFullYear()}-${String(new Date(metrics.lastUpdated).getMonth() + 1).padStart(2, "0")}`
    : "";

  // Reset monthly counter if month changed
  if (currentMonth !== lastMonth) {
    metrics.lessonsPublishedThisMonth = 0;
  }

  metrics.totalLessons += 1;
  metrics.totalPublications += 1;
  metrics.lessonsPublishedThisMonth += 1;
  metrics.lastUpdated = now.toISOString();

  writeMetricsFile(metrics);
  return metrics;
}
