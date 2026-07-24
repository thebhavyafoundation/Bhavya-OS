#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../..");
const SNAPSHOTS_DIR = path.join(ROOT, ".ai/snapshots");
const GRAPH_PATH = path.join(ROOT, "registry/knowledge-graph.json");
const MANIFEST_PATH = path.join(ROOT, ".ai/manifest.yaml");
const DEPS_PATH = path.join(ROOT, ".ai/dependencies.yaml");
const METRICS_PATH = path.join(ROOT, ".ai/state/metrics.json");
const EVENTS_PATH = path.join(ROOT, ".ai/events/event-log.jsonl");
const TASKS_DIR = path.join(ROOT, ".ai/tasks/contracts");

function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf8");
  return createHash("sha256").update(content).digest("hex");
}

function countLines(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.readFileSync(filePath, "utf8").split("\n").filter(Boolean).length;
}

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch { return null; }
}

const graph = loadJSON(GRAPH_PATH);
const metrics = loadJSON(METRICS_PATH);

const taskContracts = fs.existsSync(TASKS_DIR)
  ? fs.readdirSync(TASKS_DIR).filter(f => f.endsWith(".json")).map(f => {
      const c = loadJSON(path.join(TASKS_DIR, f));
      return { id: c?.id || f, status: c?.status || "unknown" };
    })
  : [];

const snapshot = {
  snapshot_version: "1.0",
  generated_at: new Date().toISOString(),
  generator: ".ai/build/generate-snapshot.mjs",

  runtime: {
    version: "3.0.0",
    stable: true,
    package: "@bhavya/runtime",
  },

  hashes: {
    manifest: hashFile(MANIFEST_PATH),
    graph: hashFile(GRAPH_PATH),
    dependencies: hashFile(DEPS_PATH),
  },

  graph: {
    node_count: graph?.nodes?.length ?? 0,
    release_nodes: (graph?.nodes || []).filter(n => n.type === "release").length,
    adr_nodes: (graph?.nodes || []).filter(n => n.type === "adr").length,
    rfc_nodes: (graph?.nodes || []).filter(n => n.type === "rfc").length,
    standard_nodes: (graph?.nodes || []).filter(n => n.type === "standard").length,
  },

  task_contracts: {
    count: taskContracts.length,
    contracts: taskContracts,
  },

  metrics: metrics || { compile_count: 0, validate_count: 0, pass_rate: 0 },

  events: {
    event_count: countLines(EVENTS_PATH),
  },

  release: {
    id: "RUNTIME-014",
    version: "3.0",
    status: "certified",
    label: "Autonomous Execution (Runtime Freeze)",
  },
};

if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

const snapshotPath = path.join(SNAPSHOTS_DIR, "runtime-v3.0.snapshot.json");
fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), "utf8");
console.log(`[snapshot] Written to ${snapshotPath}`);
console.log(`[snapshot] Graph: ${snapshot.graph.node_count} nodes, ${snapshot.task_contracts.count} task contracts`);
