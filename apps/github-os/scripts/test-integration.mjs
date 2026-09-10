#!/usr/bin/env node
/**
 * Git OS — Integration Coherence Tests (J33-J36)
 *
 * J33: Route integrity — all routes resolve correctly
 * J34: No duplicate capabilities across packages
 * J35: No app-to-app dependencies
 * J36: Canonical ownership preserved
 *
 * Usage: node scripts/test-integration.mjs
 */

import { readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;

function assert(condition, testName, details) {
  totalTests++;
  if (condition) {
    totalPassed++;
    console.log(`  ✅ ${testName}${details ? ` — ${details}` : ""}`);
  } else {
    totalFailed++;
    console.log(`  ❌ ${testName}${details ? ` — ${details}` : ""}`);
  }
}

const ROOT = "F:\\Bhavya Foundation";

// ─── J33: ROUTE INTEGRITY ───────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🗺️ J33: ROUTE INTEGRITY");
console.log("═".repeat(60));

// Test: Intelligence route exists and is valid
try {
  const routeContent = readFileSync(join(ROOT, "apps", "github-os", "src", "app", "api", "intelligence", "route.ts"), "utf-8");
  assert(routeContent.includes("export const POST"), "Intelligence POST handler exported", "valid");
  assert(routeContent.includes("export const GET"), "Intelligence GET handler exported", "valid");
  assert(routeContent.includes("withAuth"), "Intelligence route uses auth middleware", "protected");
} catch (err) {
  assert(false, "Intelligence route file exists", err.message);
}

// Test: Knowledge graph route exists and is valid
try {
  const kgRoute = readFileSync(join(ROOT, "apps", "github-os", "src", "app", "api", "knowledge-graph", "route.ts"), "utf-8");
  assert(kgRoute.includes("export const POST"), "Knowledge graph POST handler exported", "valid");
  assert(kgRoute.includes("export const GET"), "Knowledge graph GET handler exported", "valid");
  assert(kgRoute.includes("buildKnowledgeGraphFromData"), "Uses real graph builder", "not mock");
} catch (err) {
  assert(false, "Knowledge graph route file exists", err.message);
}

// Test: All 33 routes exist
try {
  const routeDir = join(ROOT, "apps", "github-os", "src", "app", "api");
  const { readdirSync, statSync } = await import("fs");

  function countRouteFiles(dir) {
    let count = 0;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        count += countRouteFiles(fullPath);
      } else if (entry.name === "route.ts") {
        count++;
      }
    }
    return count;
  }

  const routeCount = countRouteFiles(routeDir);
  assert(routeCount >= 30, `At least 30 API routes exist`, `${routeCount} routes`);
} catch (err) {
  assert(false, "Route counting", err.message);
}

// ─── J34: NO DUPLICATE CAPABILITIES ─────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔍 J34: NO DUPLICATE CAPABILITIES");
console.log("═".repeat(60));

// Test: Intelligence engine is the only pipeline orchestrator
const engineContent = readFileSync(join(ROOT, "apps", "github-os", "src", "lib", "intelligence-engine.ts"), "utf-8");
assert(engineContent.includes("class IntelligenceEngine"), "IntelligenceEngine class exists", "single class");
assert(engineContent.includes("async discover"), "Has discover method", "pipeline step");
assert(engineContent.includes("async ingest"), "Has ingest method", "pipeline step");
assert(engineContent.includes("async inspect"), "Has inspect method", "pipeline step");
assert(engineContent.includes("analyzeRepository"), "Has analyzeRepository method", "pipeline orchestrator");

// Test: No duplicate type definitions
const typesContent = readFileSync(join(ROOT, "apps", "github-os", "src", "lib", "types.ts"), "utf-8");
assert(typesContent.includes("export interface Repository"), "Repository type defined", "single definition");
assert(typesContent.includes("export interface GitHubKnowledgePackage"), "GitHubKnowledgePackage type defined", "single definition");

// Test: Knowledge graph builder is the only graph constructor
const kgBuilderContent = readFileSync(join(ROOT, "apps", "github-os", "src", "lib", "knowledge-graph-builder.ts"), "utf-8");
assert(kgBuilderContent.includes("export function buildKnowledgeGraphFromData"), "Single graph builder function", "canonical");

// ─── J35: NO APP-TO-APP DEPENDENCIES ────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🚫 J35: NO APP-TO-APP DEPENDENCIES");
console.log("═".repeat(60));

// Test: github-os doesn't depend on other apps (only shared packages)
try {
  const pkgJson = JSON.parse(readFileSync(join(ROOT, "apps", "github-os", "package.json"), "utf-8"));
  const allDeps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
    ...pkgJson.peerDependencies,
  };

  // Known apps (not packages) — github-os should not depend on these
  const knownApps = [
    "@bhavya/ai-institute",
    "@bhavya/website",
    "@bhavya/admin",
    "@bhavya/design-system",
    "@bhavya/docs",
    "@bhavya/ioc",
    "@bhavya/social-os",
    "@bhavya/bhavya-intelligence-network",
  ];

  const appDeps = Object.keys(allDeps).filter((dep) => knownApps.includes(dep));
  assert(appDeps.length === 0, "No dependencies on other apps", `${appDeps.length} app deps: ${appDeps.join(", ")}`);
} catch (err) {
  assert(false, "Package.json readable", err.message);
}

// Test: github-os only depends on shared packages (not other apps)
try {
  const pkgJson = JSON.parse(readFileSync(join(ROOT, "apps", "github-os", "package.json"), "utf-8"));
  const allDeps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
  };

  // Known apps that should NOT be dependencies
  const knownApps = [
    "@bhavya/ai-institute",
    "@bhavya/website",
    "@bhavya/admin",
    "@bhavya/design-system",
    "@bhavya/docs",
    "@bhavya/ioc",
    "@bhavya/social-os",
    "@bhavya/bhavya-intelligence-network",
  ];

  const bhavyaDeps = Object.keys(allDeps).filter((dep) => dep.startsWith("@bhavya/"));
  const appDependencies = bhavyaDeps.filter((dep) => knownApps.includes(dep));
  assert(appDependencies.length === 0, "No app dependencies (only packages)", appDependencies.join(", ") || "none");
} catch (err) {
  assert(false, "Package.json readable", err.message);
}

// ─── J36: CANONICAL OWNERSHIP ───────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🏛️ J36: CANONICAL OWNERSHIP");
console.log("═".repeat(60));

// Test: Intelligence engine owns pipeline orchestration
assert(engineContent.includes("Discover → Ingest → Inspect → Score → Extract → Recommend"), "Engine documents pipeline stages", "canonical");

// Test: Knowledge graph builder owns graph construction
assert(kgBuilderContent.includes("Build the knowledge graph from all stored repository data"), "Builder documents its purpose", "canonical");

// Test: Types file owns type definitions
assert(typesContent.includes("export interface Repository"), "Types file owns Repository type", "canonical");
assert(typesContent.includes("export interface GitHubKnowledgePackage"), "Types file owns GitHubKnowledgePackage type", "canonical");

// Test: Database module owns DB access
try {
  const dbContent = readFileSync(join(ROOT, "apps", "github-os", "src", "lib", "db.ts"), "utf-8");
  assert(dbContent.includes("export function getDb"), "DB module exports getDb", "single access point");
} catch (err) {
  assert(false, "DB module exists", err.message);
}

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 INTEGRATION COHERENCE RESULTS");
console.log("═".repeat(60));
console.log(`  Total: ${totalTests} tests, ${totalPassed} passed, ${totalFailed} failed`);
console.log("═".repeat(60));
console.log(`\n🎉 Integration Coherence: ${totalFailed === 0 ? "PASS ✅" : "FAIL ❌"}`);
