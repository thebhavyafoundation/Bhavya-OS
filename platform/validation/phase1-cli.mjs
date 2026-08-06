#!/usr/bin/env node
/**
 * Bhavya OS — Platform Validator
 * Tests every CLI command and records results.
 */

import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = "F:\\Bhavya Foundation";
const OUTPUT = join(ROOT, "platform", "validation");
mkdirSync(OUTPUT, { recursive: true });

const results = [];

function runCommand(name, command, timeout = 30000) {
  const start = Date.now();
  let output = "";
  let exitCode = 0;
  let error = null;

  try {
    output = execSync(command, {
      cwd: ROOT,
      encoding: "utf-8",
      timeout,
      shell: "powershell.exe",
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (e) {
    exitCode = e.status || 1;
    error = e.stderr || e.message;
    output = e.stdout || "";
  }

  const duration = Date.now() - start;
  const result = {
    name,
    command,
    exitCode,
    duration,
    output: output.slice(0, 500),
    error: error ? error.slice(0, 500) : null,
    passed: exitCode === 0,
    timestamp: new Date().toISOString(),
  };

  results.push(result);
  console.log(`${result.passed ? "✅" : "❌"} ${name} (${duration}ms)`);
  return result;
}

console.log("🔍 Phase 1: Platform Verification\n");
console.log("Testing CLI Commands...\n");

// ── CLI Commands ─────────────────────────────────────────────

runCommand("bhavya (help)", "node packages/runtime/cli/bhavya.mjs");
runCommand("bhavya runtime status", "node packages/runtime/cli/bhavya.mjs runtime status");
runCommand("bhavya platform status", "node packages/runtime/cli/bhavya.mjs platform status");
runCommand("bhavya metrics", "node packages/runtime/cli/bhavya.mjs metrics");
runCommand("bhavya tasks stats", "node packages/runtime/cli/bhavya.mjs tasks stats");
runCommand("bhavya tasks list", "node packages/runtime/cli/bhavya.mjs tasks list");
runCommand("bhavya memory stats", "node packages/runtime/cli/bhavya.mjs memory stats");

// ── Indexer ──────────────────────────────────────────────────

console.log("\nTesting Repository Intelligence...");
runCommand("repo-intelligence index", "node platform/repo-intelligence/index.mjs", 60000);

// ── Knowledge Graphs ─────────────────────────────────────────

console.log("\nTesting Knowledge Graph Generation...");
runCommand("knowledge-graph generate", "node platform/repo-intelligence/knowledge-graph.mjs", 60000);

// ── Dashboard ────────────────────────────────────────────────

console.log("\nTesting Dashboard Generation...");
runCommand("dashboard generate", "node platform/dashboard/generate.mjs", 30000);

// ── Agent Registry ───────────────────────────────────────────

console.log("\nTesting Agent Registry...");
runCommand("agent-registry generate", "node platform/agents/generate.mjs", 30000);

// ── Repository Memory ────────────────────────────────────────

console.log("\nTesting Repository Memory...");
runCommand("repository-memory init", "node platform/repo-intelligence/repository-memory.mjs init");
runCommand("repository-memory stats", "node platform/repo-intelligence/repository-memory.mjs stats");

// ── Build Verification ───────────────────────────────────────

console.log("\nTesting Build...");
runCommand("website build", "pnpm --filter @bhavya/website build", 120000);

// ── Write Results ────────────────────────────────────────────

console.log("\n📝 Writing validation results...");

const summary = {
  total: results.length,
  passed: results.filter(r => r.passed).length,
  failed: results.filter(r => !r.passed).length,
  avgDuration: Math.round(results.reduce((a, r) => a + r.duration, 0) / results.length),
  results,
};

writeFileSync(join(OUTPUT, "phase1-cli-verification.json"), JSON.stringify(summary, null, 2));
console.log("✅ phase1-cli-verification.json");

console.log(`\n🎉 Phase 1 Complete: ${summary.passed}/${summary.total} passed`);
