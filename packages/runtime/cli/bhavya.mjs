#!/usr/bin/env node
/**
 * Bhavya Runtime CLI
 *
 * Unified entry point for all runtime subsystems.
 *
 * Usage:
 *   bhavya runtime compile                    Compile machine files
 *   bhavya runtime validate                   Validate runtime integrity
 *   bhavya runtime watch                      Start persistent daemon
 *   bhavya runtime status                     Show runtime status
 *   bhavya graph build                        Rebuild knowledge graph
 *   bhavya graph query <entity>               Query graph for entity
 *   bhavya context load <domain>              Get files for domain
 *   bhavya task next                          Get next pending task
 *   bhavya task show <id>                     Show task contract
 *   bhavya release current                    Show current release
 *   bhavya memory search <query>              Search memory files
 *   bhavya planner build <goal>               Build execution plan
 *   bhavya execute <task-id> [--dry-run]      Execute a task
 *   bhavya orchestrate <goal>                 Orchestrate multi-agent
 *   bhavya api start [--port 3100]            Start API server
 *   bhavya metrics                            Show runtime metrics
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../../..");
const AI_DIR = path.join(ROOT, ".ai");

// ── Helpers ──────────────────────────────────────────────────────

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8")); }
  catch { return null; }
}

function readYAMLSimple(p) {
  const fullPath = path.join(ROOT, p);
  if (!fs.existsSync(fullPath)) return null;
  const content = fs.readFileSync(fullPath, "utf8");
  const lines = content.split("\n").filter(l => !l.startsWith("#") && l.trim());
  const obj = {};
  let currentKey = null;
  for (const line of lines) {
    if (line.startsWith("---")) continue;
    const m = line.match(/^(\w+):\s*(.*)/);
    if (m) { currentKey = m[1]; obj[currentKey] = m[2].trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1"); }
  }
  return obj;
}

function print(obj) {
  if (typeof obj === "string") { console.log(obj); return; }
  console.log(JSON.stringify(obj, null, 2));
}

// ── Subcommands ──────────────────────────────────────────────────

const commands = {};

function toFileURL(absPath) {
  // Convert Windows path to file:// URL
  const normalized = absPath.replace(/\\/g, "/");
  return `file://${normalized.startsWith("/") ? "" : "/"}${normalized}`;
}

commands["runtime"] = {
  compile: async () => {
    const url = toFileURL(path.join(AI_DIR, "build/compile-runtime.mjs"));
    await import(url);
  },
  validate: async () => {
    const url = toFileURL(path.join(AI_DIR, "build/validate-runtime.mjs"));
    await import(url);
  },
  watch: async () => {
    const url = toFileURL(path.join(ROOT, "packages/runtime/daemon/watch.mjs"));
    await import(url);
  },
  status: async () => {
    const state = readJSON(".ai/state/repository.json");
    const runtime = readJSON(".ai/runtime.json");
    print({
      release: state?.release || runtime?.release || "unknown",
      status: runtime?.status || "unknown",
      task: state?.task || runtime?.task || "none",
      branch: state?.branch || "main",
      dirty: state?.dirty ?? true,
      last_build: state?.last_build || "never",
      last_validation: state?.last_validation || "never",
    });
  },
};

commands["graph"] = {
  build: async () => {
    print("Rebuilding graph via compile-runtime...");
    const { default: compile } = await import(path.join(AI_DIR, "build/compile-runtime.mjs").replace(/\\/g, "/"));
    print("Graph rebuilt.");
  },
  query: async (entityId) => {
    if (!entityId) { print("Usage: bhavya graph query <entity-id>"); return; }
    const graph = readJSON(".ai/graph/graph.json");
    if (!graph) { print("No graph found. Run 'bhavya graph build' first."); return; }
    const node = graph.nodes.find(n => n.id === entityId.toUpperCase());
    if (!node) { print(`Entity ${entityId} not found in graph.`); return; }
    const edges = graph.edges.filter(e => e.source === node.id || e.target === node.id);
    const related = edges.map(e => {
      const otherId = e.source === node.id ? e.target : e.source;
      const other = graph.nodes.find(n => n.id === otherId);
      return { relation: e.type, entity: other?.id || otherId, name: other?.name || "", path: other?.path || "" };
    });
    print({ node, edges: related });
  },
};

commands["context"] = {
  load: async (domain) => {
    if (!domain) { print("Usage: bhavya context load <domain>"); return; }
    const registry = readYAMLSimple(".ai/agents/registry.yaml");
    if (!registry || !registry.agents || !registry.agents[domain]) {
      // Fallback: try context-loader domains
      const loaderPath = path.join(AI_DIR, "context-loader.md");
      if (fs.existsSync(loaderPath)) {
        const content = fs.readFileSync(loaderPath, "utf8");
        // Look for ## domain in the file
        const sectionMatch = content.match(new RegExp(`## ${domain}\\b[\\s\\S]*?\`\`\`([\\s\\S]*?)\`\`\``, "i"));
        if (sectionMatch) {
          const files = sectionMatch[1].trim().split("\n").map(l => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
          print({ domain, files, count: files.length });
          return;
        }
      }
      print(`No context definition found for domain: ${domain}`);
      return;
    }
    const agent = registry.agents[domain];
    print({ domain, loads: agent.loads, max_files: agent.max_files, capabilities: agent.capabilities });
  },
};

commands["task"] = {
  next: async () => {
    const contractsDir = path.join(AI_DIR, "tasks/contracts");
    const graphFile = path.join(AI_DIR, "tasks/graph.json");
    const tasks = [];

    // Load contracts
    if (fs.existsSync(contractsDir)) {
      for (const f of fs.readdirSync(contractsDir).filter(f => f.endsWith(".json"))) {
        const c = readJSON(`.ai/tasks/contracts/${f}`);
        if (c && c.status === "pending") tasks.push(c);
      }
    }

    // Load graph nodes as fallback
    const graph = readJSON(".ai/tasks/graph.json");
    if (graph?.nodes) {
      for (const node of graph.nodes) {
        if (node.status === "pending" && !tasks.find(t => t.id === node.id)) {
          tasks.push({ id: node.id, title: node.title, priority: node.priority, status: node.status });
        }
      }
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    tasks.sort((a, b) => (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1));

    if (tasks.length === 0) { print("No pending tasks."); return; }
    print({ next: tasks[0], remaining: tasks.length - 1 });
  },
  show: async (id) => {
    if (!id) { print("Usage: bhavya task show <id>"); return; }
    const contract = readJSON(`.ai/tasks/contracts/${id}.json`);
    if (contract) { print(contract); return; }
    const graph = readJSON(".ai/tasks/graph.json");
    const node = graph?.nodes?.find(n => n.id === id.toUpperCase());
    if (node) { print(node); return; }
    print(`Task ${id} not found.`);
  },
};

commands["release"] = {
  current: async () => {
    const state = readJSON(".ai/state/repository.json");
    const runtime = readJSON(".ai/runtime.json");
    const releasesDir = path.join(AI_DIR, "releases");
    const rel = state?.release || runtime?.release || "unknown";
    const relFile = path.join(releasesDir, `v${rel}.yaml`);
    if (fs.existsSync(relFile)) {
      const data = readYAMLSimple(`.ai/releases/v${rel}.yaml`);
      print({ release: rel, ...data, name: state?.release_name || runtime?.name });
    } else {
      print({ release: rel, name: state?.release_name || runtime?.name || "", status: runtime?.status });
    }
  },
};

commands["memory"] = {
  search: async (query) => {
    if (!query) { print("Usage: bhavya memory search <query>"); return; }
    const memoryDir = path.join(AI_DIR, "memory");
    if (!fs.existsSync(memoryDir)) { print("No memory directory found."); return; }
    const results = [];
    const q = query.toLowerCase();
    for (const f of fs.readdirSync(memoryDir).filter(f => f.endsWith(".md"))) {
      const content = fs.readFileSync(path.join(memoryDir, f), "utf8").toLowerCase();
      if (content.includes(q)) {
        results.push({ file: f, domain: f.replace(".md", "") });
      }
    }
    print({ query, results, count: results.length });
  },
};

commands["planner"] = {
  build: async (goal) => {
    if (!goal) { print("Usage: bhavya planner build <goal>"); return; }
    const { buildPlan } = await import("./planner.mjs");
    const plan = buildPlan(ROOT, goal);
    print(plan);
  },
};

commands["execute"] = {
  _default: async (taskId, ...args) => {
    if (!taskId) { print("Usage: bhavya execute <task-id> [--dry-run]"); return; }
    const dryRun = args.includes("--dry-run");
    const { executeTask } = await import("./executor.mjs");
    const result = await executeTask(ROOT, taskId, { dryRun });
    print(result);
  },
};

commands["orchestrate"] = {
  _default: async (goal) => {
    if (!goal) { print("Usage: bhavya orchestrate <goal>"); return; }
    const { orchestrate } = await import("./orchestrator.mjs");
    const report = await orchestrate(ROOT, goal);
    print(report);
  },
};

commands["api"] = {
  start: async (...args) => {
    const portIdx = args.indexOf("--port");
    const port = portIdx >= 0 ? parseInt(args[portIdx + 1]) : 3100;
    const { startServer } = await import("./api.mjs");
    await startServer(ROOT, port);
  },
};

commands["metrics"] = {
  _default: async () => {
    const state = readJSON(".ai/state/repository.json");
    const metricsFile = path.join(AI_DIR, "state/metrics.json");
    const metrics = fs.existsSync(metricsFile) ? JSON.parse(fs.readFileSync(metricsFile, "utf8")) : {};
    print({
      daemon_uptime: metrics.uptime || "unknown",
      compile_count: metrics.compile_count || 0,
      validate_count: metrics.validate_count || 0,
      last_compile_ms: metrics.last_compile_ms || null,
      last_validate_ms: metrics.last_validate_ms || null,
      last_build: state?.last_build || "never",
      last_validation: state?.last_validation || "never",
      validation_pass_rate: metrics.validation_pass_rate || "100%",
    });
  },
};

// ── Dispatcher ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Bhavya Runtime CLI v3.0");
    console.log("Usage: bhavya <command> <subcommand> [options]");
    console.log("");
    console.log("Commands:");
    console.log("  runtime compile|validate|watch|status");
    console.log("  graph build|query <entity>");
    console.log("  context load <domain>");
    console.log("  task next|show <id>");
    console.log("  release current");
    console.log("  memory search <query>");
    console.log("  planner build <goal>");
    console.log("  execute <task-id> [--dry-run]");
    console.log("  orchestrate <goal>");
    console.log("  api start [--port 3100]");
    console.log("  metrics");
    return;
  }

  const cmd = args[0];
  const sub = args[1];
  const rest = args.slice(2);

  const handler = commands[cmd];
  if (!handler) {
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
  }

  if (sub && handler[sub]) {
    await handler[sub](...rest);
  } else if (handler._default) {
    await handler._default(sub, ...rest);
  } else if (!sub) {
    // No subcommand, show help for this command
    console.log(`Subcommands for '${cmd}': ${Object.keys(handler).filter(k => !k.startsWith("_")).join(" | ")}`);
  } else {
    console.error(`Unknown subcommand: ${cmd} ${sub}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("CLI Error:", err.message);
  process.exit(1);
});
