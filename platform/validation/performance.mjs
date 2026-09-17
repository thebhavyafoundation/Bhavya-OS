/**
 * Bhavya OS — Performance Measurement
 * Measure: repository indexing, knowledge graph generation,
 * worker startup, task throughput, average task duration,
 * queue latency, memory consumption, CPU usage, disk usage.
 */

import { performance } from "perf_hooks";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import { EventBus } from "../ai-runtime/event-bus.mjs";
import { WorkerPool } from "../ai-runtime/worker-pool.mjs";
import { ExecutionScheduler, Priority } from "../ai-runtime/scheduler.mjs";
import { EngineeringMemory } from "../ai-runtime/engineering-memory.mjs";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "../..");

let results = {};

function measure(name, fn) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  results[name] = { duration: Math.round(duration), ...result };
  console.log(`  ${name}: ${Math.round(duration)}ms`);
  return result;
}

async function measureAsync(name, fn) {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  results[name] = { duration: Math.round(duration), ...result };
  console.log(`  ${name}: ${Math.round(duration)}ms`);
  return result;
}

console.log("\n⚡ Bhavya OS — Performance Measurement\n");

// ── 1. Repository Indexing ──────────────────────────────────

console.log("1. Repository Indexing");
measure("repo-index-scan", () => {
  const indexPath = join(ROOT, "platform/repo-intelligence/output/repository-index.json");
  if (existsSync(indexPath)) {
    const data = JSON.parse(readFileSync(indexPath, "utf-8"));
    return { files: data.stats?.totalFiles || 0, packages: data.stats?.totalPackages || 0 };
  }
  return { files: 0, packages: 0 };
});
console.log();

// ── 2. Knowledge Graph ──────────────────────────────────────

console.log("2. Knowledge Graph");
measure("knowledge-graph-load", () => {
  const graphsDir = join(ROOT, "knowledge/engineering-graphs");
  if (existsSync(graphsDir)) {
    const files = readdirSync(graphsDir).filter(f => f.endsWith(".json"));
    let totalNodes = 0;
    let totalEdges = 0;
    for (const f of files) {
      try {
        const data = JSON.parse(readFileSync(join(graphsDir, f), "utf-8"));
        totalNodes += (data.nodes || []).length;
        totalEdges += (data.edges || []).length;
      } catch {}
    }
    return { graphs: files.length, nodes: totalNodes, edges: totalEdges };
  }
  return { graphs: 0, nodes: 0, edges: 0 };
});
console.log();

// ── 3. Worker Startup ───────────────────────────────────────

console.log("3. Worker Startup");
measure("worker-pool-startup", () => {
  const bus = new EventBus();
  const pool = new WorkerPool({ eventBus: bus, maxWorkers: 8 });
  for (let i = 0; i < 4; i++) {
    pool.addWorker({ name: `perf-worker-${i}`, type: "test" });
  }
  const stats = pool.getStats();
  pool.stop();
  return { workers: stats.totalWorkers };
});
console.log();

// ── 4. Task Throughput ──────────────────────────────────────

console.log("4. Task Throughput");
measure("task-throughput-100", () => {
  const bus = new EventBus();
  const scheduler = new ExecutionScheduler({
    eventBus: bus,
    persistencePath: `/tmp/perf-scheduler-${Date.now()}.json`,
  });
  const taskCount = 100;
  for (let i = 0; i < taskCount; i++) {
    scheduler.submit({
      name: `Task ${i}`,
      type: "test",
      priority: i % 4 === 0 ? Priority.HIGH : Priority.NORMAL,
    });
  }
  const stats = scheduler.getStats();
  return { tasksSubmitted: taskCount, queueLength: stats.queueLength };
});
console.log();

// ── 5. Memory Consumption ───────────────────────────────────

console.log("5. Memory Consumption");
measure("memory-usage", () => {
  const mem = process.memoryUsage();
  return {
    rss: Math.round(mem.rss / 1024 / 1024) + "MB",
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + "MB",
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + "MB",
    external: Math.round(mem.external / 1024 / 1024) + "MB",
  };
});
console.log();

// ── 6. Disk Usage ───────────────────────────────────────────

console.log("6. Disk Usage");
measure("disk-usage", () => {
  const dirs = {
    "platform/ai-runtime": join(ROOT, "platform/ai-runtime"),
    "platform/agents": join(ROOT, "platform/agents"),
    "platform/repo-intelligence": join(ROOT, "platform/repo-intelligence"),
    "knowledge": join(ROOT, "knowledge"),
    "memory": join(ROOT, "memory"),
  };

  function dirSize(dir) {
    let size = 0;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isFile()) {
          size += statSync(fullPath).size;
        } else if (entry.isDirectory() && entry.name !== "node_modules") {
          size += dirSize(fullPath);
        }
      }
    } catch {}
    return size;
  }

  const sizes = {};
  let total = 0;
  for (const [name, dir] of Object.entries(dirs)) {
    const size = dirSize(dir);
    sizes[name] = Math.round(size / 1024) + "KB";
    total += size;
  }
  sizes.total = Math.round(total / 1024) + "KB";
  return sizes;
});
console.log();

// ── 7. Event Bus Performance ────────────────────────────────

console.log("7. Event Bus Performance");
measure("event-bus-emit-1000", () => {
  const bus = new EventBus();
  let count = 0;
  bus.on("*", () => { count++; });
  for (let i = 0; i < 1000; i++) {
    bus.emit("test.event", { index: i });
  }
  return { eventsEmitted: 1000, delivered: count };
});
console.log();

// ── 8. Engineering Memory Performance ────────────────────────

console.log("8. Engineering Memory Performance");
measure("memory-search-100-entries", () => {
  const bus = new EventBus();
  const mem = new EngineeringMemory({
    eventBus: bus,
    memoryDir: `/tmp/perf-memory-${Date.now()}`,
  });
  for (let i = 0; i < 100; i++) {
    mem.store("completed-work", {
      title: `Task ${i}: Implement feature ${i % 10}`,
      description: `Completed implementation of feature ${i % 10} with ${i} files modified`,
      tags: [`feature-${i % 10}`, i % 2 === 0 ? "frontend" : "backend"],
    });
  }
  const results = mem.search("feature 5");
  return { entriesStored: 100, searchResults: results.length };
});
console.log();

// ── Summary ─────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────┐");
console.log("│  Performance Summary                                    │");
console.log("├─────────────────────────────────────────────────────────┤");
for (const [name, data] of Object.entries(results)) {
  const dur = String(data.duration).padStart(6);
  console.log(`│  ${name.padEnd(35)} ${dur}ms  │`);
}
console.log("└─────────────────────────────────────────────────────────┘\n");
