#!/usr/bin/env node
import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "../..");
const results = [];

console.log("Phase 7: Performance Measurement\n");

function measure(name, fn) {
  const start = Date.now();
  let result;
  try {
    result = fn();
  } catch (e) {
    result = { error: e.message };
  }
  const duration = Date.now() - start;
  results.push({ name, duration, result });
  console.log(name + ": " + duration + "ms");
  return { duration, result };
}

// Measure indexing time
console.log("--- Indexing ---");
measure("Repository Index", () => {
  execSync("node platform/repo-intelligence/index.mjs", { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
});

// Measure graph generation
console.log("\n--- Graph Generation ---");
measure("Knowledge Graph", () => {
  execSync("node platform/repo-intelligence/knowledge-graph.mjs", { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
});

// Measure dashboard generation
console.log("\n--- Dashboard ---");
measure("Dashboard Generate", () => {
  execSync("node platform/dashboard/generate.mjs", { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
});

// Measure agent registry
console.log("\n--- Agent Registry ---");
measure("Agent Registry", () => {
  execSync("node platform/agents/generate.mjs", { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
});

// Measure CLI latency
console.log("\n--- CLI Latency ---");
measure("bhavya help", () => {
  execSync("node packages/runtime/cli/bhavya.mjs", { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
});
measure("bhavya platform status", () => {
  execSync("node packages/runtime/cli/bhavya.mjs platform status", { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
});
measure("bhavya metrics", () => {
  execSync("node packages/runtime/cli/bhavya.mjs metrics", { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
});

// Measure memory usage
console.log("\n--- Memory Usage ---");
const memBefore = process.memoryUsage();
console.log("RSS: " + Math.round(memBefore.rss / 1024 / 1024) + "MB");
console.log("Heap Used: " + Math.round(memBefore.heapUsed / 1024 / 1024) + "MB");
console.log("Heap Total: " + Math.round(memBefore.heapTotal / 1024 / 1024) + "MB");

// Summary
console.log("\n--- Summary ---");
const totalDuration = results.reduce((a, r) => a + r.duration, 0);
console.log("Total time: " + totalDuration + "ms");
console.log("Average: " + Math.round(totalDuration / results.length) + "ms");

mkdirSync(join(ROOT, "platform", "validation"), { recursive: true });
writeFileSync(join(ROOT, "platform/validation/phase7-performance.json"), JSON.stringify({
  results,
  memoryUsage: {
    rss: Math.round(memBefore.rss / 1024 / 1024),
    heapUsed: Math.round(memBefore.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memBefore.heapTotal / 1024 / 1024),
  },
  totalDuration,
  timestamp: new Date().toISOString(),
}, null, 2));
console.log("\nPhase 7 complete.");
