// ─── Bhavya Intelligence Network — Orchestration Engine ────────────────────
// Wires all OSIP packages together via events.
// No new infrastructure. Uses @bhavya/events + @bhavya/workflows.

import { EventEmitter } from "events";

// ─── Domain Events ─────────────────────────────────────────────────────────

export type BinEvent =
  | { type: "discovery:started"; source: string; timestamp: string }
  | {
      type: "discovery:completed";
      source: string;
      itemCount: number;
      timestamp: string;
    }
  | {
      type: "discovery:error";
      source: string;
      error: string;
      timestamp: string;
    }
  | { type: "normalization:started"; itemCount: number; timestamp: string }
  | { type: "normalization:completed"; itemCount: number; timestamp: string }
  | { type: "deduplication:started"; itemCount: number; timestamp: string }
  | {
      type: "deduplication:completed";
      before: number;
      after: number;
      duplicates: number;
      timestamp: string;
    }
  | { type: "analysis:started"; itemCount: number; timestamp: string }
  | { type: "analysis:completed"; itemCount: number; timestamp: string }
  | { type: "comparison:started"; items: string[]; timestamp: string }
  | { type: "comparison:completed"; comparisonId: string; timestamp: string }
  | {
      type: "pattern:extracted";
      pattern: string;
      description: string;
      timestamp: string;
    }
  | {
      type: "knowledge:created";
      packageId: string;
      title: string;
      category: string;
      timestamp: string;
    }
  | {
      type: "radar:updated";
      entryId: string;
      quadrant: string;
      ring: string;
      timestamp: string;
    }
  | {
      type: "capability:registered";
      capabilityId: string;
      name: string;
      score: number;
      timestamp: string;
    }
  | {
      type: "recommendation:generated";
      capabilityId: string;
      level: string;
      timestamp: string;
    }
  | {
      type: "approval:requested";
      recommendationId: string;
      title: string;
      timestamp: string;
    }
  | {
      type: "approval:granted";
      recommendationId: string;
      approvedBy: string;
      timestamp: string;
    }
  | {
      type: "approval:denied";
      recommendationId: string;
      deniedBy: string;
      reason: string;
      timestamp: string;
    }
  | {
      type: "task:created";
      taskId: string;
      description: string;
      timestamp: string;
    }
  | { type: "loop:started"; runId: string; timestamp: string }
  | {
      type: "loop:completed";
      runId: string;
      duration: number;
      stats: LoopStats;
      timestamp: string;
    };

export interface LoopStats {
  discovered: number;
  normalized: number;
  deduplicated: number;
  analyzed: number;
  knowledgePackages: number;
  radarUpdates: number;
  capabilities: number;
  recommendations: number;
  errors: number;
}

// ─── Event Bus ─────────────────────────────────────────────────────────────

class BinEventBus {
  private emitter = new EventEmitter();
  private history: BinEvent[] = [];

  emit(event: BinEvent): void {
    this.history.push(event);
    this.emitter.emit(event.type, event);
  }

  on(type: BinEvent["type"], handler: (event: BinEvent) => void): () => void {
    this.emitter.on(type, handler);
    return () => this.emitter.off(type, handler);
  }

  getHistory(type?: BinEvent["type"]): BinEvent[] {
    if (type) return this.history.filter((e) => e.type === type);
    return [...this.history];
  }

  getRecent(count = 50): BinEvent[] {
    return this.history.slice(-count);
  }
}

export const binEvents = new BinEventBus();

// ─── Intelligence Loop State ───────────────────────────────────────────────

export interface LoopRun {
  id: string;
  status: "running" | "completed" | "failed" | "paused";
  startedAt: string;
  completedAt: string | null;
  stats: LoopStats;
  events: BinEvent[];
  error?: string;
}

const runs = new Map<string, LoopRun>();

export function createRun(): LoopRun {
  const id = `run-${Date.now()}`;
  const run: LoopRun = {
    id,
    status: "running",
    startedAt: new Date().toISOString(),
    completedAt: null,
    stats: {
      discovered: 0,
      normalized: 0,
      deduplicated: 0,
      analyzed: 0,
      knowledgePackages: 0,
      radarUpdates: 0,
      capabilities: 0,
      recommendations: 0,
      errors: 0,
    },
    events: [],
  };
  runs.set(id, run);
  return run;
}

export function getRun(id: string): LoopRun | undefined {
  return runs.get(id);
}
export function getRecentRuns(count = 10): LoopRun[] {
  return Array.from(runs.values())
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
    .slice(0, count);
}

// ─── Loop Steps ────────────────────────────────────────────────────────────
// Each step emits domain events. The loop is observable and resumable.

export async function runDiscoveryLoop(): Promise<LoopRun> {
  const run = createRun();
  binEvents.emit({
    type: "loop:started",
    runId: run.id,
    timestamp: new Date().toISOString(),
  });

  try {
    // Step 1: Discover
    binEvents.emit({
      type: "discovery:started",
      source: "github",
      timestamp: new Date().toISOString(),
    });
    const githubItems = await discoverGithub();
    binEvents.emit({
      type: "discovery:completed",
      source: "github",
      itemCount: githubItems.length,
      timestamp: new Date().toISOString(),
    });
    run.stats.discovered += githubItems.length;

    binEvents.emit({
      type: "discovery:started",
      source: "mcp_registry",
      timestamp: new Date().toISOString(),
    });
    const mcpItems = await discoverMCP();
    binEvents.emit({
      type: "discovery:completed",
      source: "mcp_registry",
      itemCount: mcpItems.length,
      timestamp: new Date().toISOString(),
    });
    run.stats.discovered += mcpItems.length;

    // Step 2: Normalize
    binEvents.emit({
      type: "normalization:started",
      itemCount: run.stats.discovered,
      timestamp: new Date().toISOString(),
    });
    const allItems = [...githubItems, ...mcpItems];
    const normalized = normalize(allItems);
    run.stats.normalized = normalized.length;
    binEvents.emit({
      type: "normalization:completed",
      itemCount: normalized.length,
      timestamp: new Date().toISOString(),
    });

    // Step 3: Deduplicate
    binEvents.emit({
      type: "deduplication:started",
      itemCount: normalized.length,
      timestamp: new Date().toISOString(),
    });
    const { unique, duplicates } = deduplicate(normalized);
    run.stats.deduplicated = unique.length;
    binEvents.emit({
      type: "deduplication:completed",
      before: normalized.length,
      after: unique.length,
      duplicates,
      timestamp: new Date().toISOString(),
    });

    // Step 4: Analyze
    binEvents.emit({
      type: "analysis:started",
      itemCount: unique.length,
      timestamp: new Date().toISOString(),
    });
    const analyzed = await analyze(unique);
    run.stats.analyzed = analyzed.length;
    binEvents.emit({
      type: "analysis:completed",
      itemCount: analyzed.length,
      timestamp: new Date().toISOString(),
    });

    // Step 5: Generate Knowledge Packages
    for (const item of analyzed) {
      const packageId = `kp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      run.stats.knowledgePackages++;
      binEvents.emit({
        type: "knowledge:created",
        packageId,
        title: item.title,
        category: item.category,
        timestamp: new Date().toISOString(),
      });
    }

    // Step 6: Update Radar
    for (const item of analyzed.slice(0, 5)) {
      run.stats.radarUpdates++;
      binEvents.emit({
        type: "radar:updated",
        entryId: item.id,
        quadrant: "assess",
        ring: "emerging",
        timestamp: new Date().toISOString(),
      });
    }

    // Step 7: Generate Recommendations
    for (const item of analyzed.filter((i) => i.score > 70).slice(0, 3)) {
      run.stats.recommendations++;
      binEvents.emit({
        type: "recommendation:generated",
        capabilityId: item.id,
        level: "pilot",
        timestamp: new Date().toISOString(),
      });
      binEvents.emit({
        type: "approval:requested",
        recommendationId: `rec-${item.id}`,
        title: `Pilot ${item.title}`,
        timestamp: new Date().toISOString(),
      });
    }

    run.status = "completed";
    run.completedAt = new Date().toISOString();
    const duration =
      new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime();
    binEvents.emit({
      type: "loop:completed",
      runId: run.id,
      duration,
      stats: run.stats,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    run.status = "failed";
    run.error = err instanceof Error ? err.message : String(err);
    run.completedAt = new Date().toISOString();
    binEvents.emit({
      type: "discovery:error",
      source: "loop",
      error: run.error,
      timestamp: new Date().toISOString(),
    });
  }

  return run;
}

// ─── Discovery Functions ───────────────────────────────────────────────────

async function discoverGithub(): Promise<DiscoveryItem[]> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const q = `created:>${since.toISOString().split("T")[0]} stars:>50`;
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=20`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "BhavyaOS-BIN/1.0",
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      items: Array<{
        full_name: string;
        description: string;
        html_url: string;
        stargazers_count: number;
        language: string;
        topics: string[];
        created_at: string;
      }>;
    };
    return data.items.map((r) => ({
      id: r.full_name,
      title: r.full_name,
      description: r.description || "",
      url: r.html_url,
      source: "github",
      metadata: {
        stars: r.stargazers_count,
        language: r.language,
        topics: r.topics,
      },
      score: Math.min(100, Math.floor(r.stargazers_count / 100)),
      category: "repository",
    }));
  } catch {
    return [];
  }
}

async function discoverMCP(): Promise<DiscoveryItem[]> {
  try {
    const url =
      "https://api.github.com/search/repositories?q=mcp+server+model+context+protocol&sort=stars&order=desc&per_page=15";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "BhavyaOS-BIN/1.0",
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      items: Array<{
        full_name: string;
        description: string;
        html_url: string;
        stargazers_count: number;
      }>;
    };
    return data.items.map((r) => ({
      id: r.full_name,
      title: r.full_name,
      description: r.description || "",
      url: r.html_url,
      source: "mcp_registry",
      metadata: { stars: r.stargazers_count },
      score: Math.min(100, Math.floor(r.stargazers_count / 50)),
      category: "mcp_server",
    }));
  } catch {
    return [];
  }
}

// ─── Pipeline Functions ────────────────────────────────────────────────────

interface DiscoveryItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  metadata: Record<string, unknown>;
  score: number;
  category: string;
}

function normalize(items: DiscoveryItem[]): DiscoveryItem[] {
  return items.map((item) => ({
    ...item,
    title: item.title.split("/").pop() || item.title,
    description: item.description.slice(0, 500),
  }));
}

function deduplicate(items: DiscoveryItem[]): {
  unique: DiscoveryItem[];
  duplicates: number;
} {
  const seen = new Set<string>();
  const unique: DiscoveryItem[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      unique.push(item);
    }
  }
  return { unique, duplicates: items.length - unique.length };
}

async function analyze(items: DiscoveryItem[]): Promise<DiscoveryItem[]> {
  return items.map((item) => ({
    ...item,
    score: Math.min(
      100,
      item.score +
        (item.metadata.stars
          ? Math.floor(Number(item.metadata.stars) / 1000)
          : 0),
    ),
  }));
}

// ─── Pending Approvals ─────────────────────────────────────────────────────

export interface PendingApproval {
  id: string;
  title: string;
  description: string;
  capabilityId: string;
  requestedAt: string;
  status: "pending" | "approved" | "denied";
}

const approvals: PendingApproval[] = [];

export function getPendingApprovals(): PendingApproval[] {
  return approvals.filter((a) => a.status === "pending");
}

export function approve(id: string, approvedBy: string): void {
  const approval = approvals.find((a) => a.id === id);
  if (approval) {
    approval.status = "approved";
    binEvents.emit({
      type: "approval:granted",
      recommendationId: id,
      approvedBy,
      timestamp: new Date().toISOString(),
    });
  }
}

export function deny(id: string, deniedBy: string, reason: string): void {
  const approval = approvals.find((a) => a.id === id);
  if (approval) {
    approval.status = "denied";
    binEvents.emit({
      type: "approval:denied",
      recommendationId: id,
      deniedBy,
      reason,
      timestamp: new Date().toISOString(),
    });
  }
}
