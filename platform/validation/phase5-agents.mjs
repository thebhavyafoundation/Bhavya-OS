#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "../..");
const AGENTS_DIR = join(ROOT, "platform", "agents");
const issues = [];

console.log("Phase 5: Agent Validation\n");

const agentDirs = readdirSync(AGENTS_DIR).filter(d => {
  try {
    const s = statSync(join(AGENTS_DIR, d));
    return s.isDirectory() && d !== "node_modules";
  } catch { return false; }
});

console.log("Found " + agentDirs.length + " agents\n");

for (const agentId of agentDirs) {
  const agentDir = join(AGENTS_DIR, agentId);
  console.log("Validating " + agentId + "...");

  // Check role.md
  const rolePath = join(agentDir, "role.md");
  if (!existsSync(rolePath)) {
    issues.push({ agent: agentId, issue: "Missing role.md" });
  } else {
    const content = readFileSync(rolePath, "utf-8");
    if (content.length < 50) {
      issues.push({ agent: agentId, issue: "role.md too short" });
    }
  }

  // Check permissions.json
  const permsPath = join(agentDir, "permissions.json");
  if (!existsSync(permsPath)) {
    issues.push({ agent: agentId, issue: "Missing permissions.json" });
  } else {
    try {
      const perms = JSON.parse(readFileSync(permsPath, "utf-8"));
      if (!perms.permissions || !Array.isArray(perms.permissions)) {
        issues.push({ agent: agentId, issue: "permissions.json invalid format" });
      }
    } catch (e) {
      issues.push({ agent: agentId, issue: "permissions.json parse error" });
    }
  }

  // Check scope.json
  const scopePath = join(agentDir, "scope.json");
  if (!existsSync(scopePath)) {
    issues.push({ agent: agentId, issue: "Missing scope.json" });
  } else {
    try {
      const scope = JSON.parse(readFileSync(scopePath, "utf-8"));
      if (!scope.paths || !Array.isArray(scope.paths)) {
        issues.push({ agent: agentId, issue: "scope.json invalid format" });
      }
    } catch (e) {
      issues.push({ agent: agentId, issue: "scope.json parse error" });
    }
  }

  // Check responsibilities.md
  const respPath = join(agentDir, "responsibilities.md");
  if (!existsSync(respPath)) {
    issues.push({ agent: agentId, issue: "Missing responsibilities.md" });
  } else {
    const content = readFileSync(respPath, "utf-8");
    if (content.length < 30) {
      issues.push({ agent: agentId, issue: "responsibilities.md too short" });
    }
  }

  console.log("  role.md: " + (existsSync(rolePath) ? "OK" : "MISSING"));
  console.log("  permissions.json: " + (existsSync(permsPath) ? "OK" : "MISSING"));
  console.log("  scope.json: " + (existsSync(scopePath) ? "OK" : "MISSING"));
  console.log("  responsibilities.md: " + (existsSync(respPath) ? "OK" : "MISSING"));
}

// Verify agents can be loaded by runtime
console.log("\nVerifying runtime agent loading...");
try {
  const { Runtime } = await import(toFileURL(join(ROOT, "platform/ai-runtime/runtime.mjs")));
  const runtime = new Runtime();
  const agents = runtime.registry.listAgents();
  console.log("  Runtime loaded " + agents.length + " agents");
  if (agents.length !== agentDirs.length) {
    issues.push({ agent: "runtime", issue: "Agent count mismatch: runtime=" + agents.length + " disk=" + agentDirs.length });
  }
} catch (e) {
  issues.push({ agent: "runtime", issue: "Failed to load runtime: " + e.message });
}

console.log("\nIssues: " + issues.length);
for (const issue of issues) {
  console.log("  [" + issue.agent + "] " + issue.issue);
}

function toFileURL(p) { return "file:///" + p.replace(/\\/g, "/"); }

mkdirSync(join(ROOT, "platform", "validation"), { recursive: true });
writeFileSync(join(ROOT, "platform/validation/phase5-agents.json"), JSON.stringify({ agentCount: agentDirs.length, issues, timestamp: new Date().toISOString() }, null, 2));
console.log("\nPhase 5 complete.");
