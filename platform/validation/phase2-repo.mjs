#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "../..");
const INPUT = join(ROOT, "platform", "repo-intelligence", "output");
const issues = [];

console.log("Phase 2: Repository Intelligence Validation\n");

const repoIndex = JSON.parse(readFileSync(join(INPUT, "repository-index.json"), "utf-8"));
const depGraph = JSON.parse(readFileSync(join(INPUT, "dependency-graph.json"), "utf-8"));
const routeMap = JSON.parse(readFileSync(join(INPUT, "route-map.json"), "utf-8"));
const componentRegistry = JSON.parse(readFileSync(join(INPUT, "component-registry.json"), "utf-8"));

console.log("Index Stats:");
console.log("  Files:", repoIndex.stats.totalFiles);
console.log("  Directories:", repoIndex.stats.totalDirs);
console.log("  Packages:", repoIndex.stats.totalPackages);
console.log("  Routes:", repoIndex.stats.totalRoutes);
console.log("  Components:", repoIndex.stats.totalComponents);
console.log("  Dependencies:", repoIndex.stats.totalDependencies);

// Verify Packages
console.log("\nVerifying Packages...");
const actualApps = existsSync(join(ROOT, "apps")) ? readdirSync(join(ROOT, "apps")) : [];
const actualPkgs = existsSync(join(ROOT, "packages")) ? readdirSync(join(ROOT, "packages")) : [];
const indexedApps = repoIndex.packages.filter(p => p.type === "app").map(p => p.path.split("/")[1]);
const indexedPkgs = repoIndex.packages.filter(p => p.type === "package").map(p => p.path.split("/")[1]);

for (const app of actualApps) {
  if (!indexedApps.includes(app)) issues.push("Missing indexed app: " + app);
}
for (const pkg of actualPkgs) {
  if (!indexedPkgs.includes(pkg)) issues.push("Missing indexed package: " + pkg);
}
for (const app of indexedApps) {
  if (!actualApps.includes(app)) issues.push("Extra indexed app: " + app);
}
for (const pkg of indexedPkgs) {
  if (!actualPkgs.includes(pkg)) issues.push("Extra indexed package: " + pkg);
}

console.log("  Actual apps:", actualApps.length, "Indexed:", indexedApps.length);
console.log("  Actual packages:", actualPkgs.length, "Indexed:", indexedPkgs.length);

// Verify Dependencies
console.log("\nVerifying Dependencies...");
const workspaceEdges = depGraph.edges.filter(e => e.type === "workspace");
const npmEdges = depGraph.edges.filter(e => e.type === "npm");
console.log("  Workspace deps:", workspaceEdges.length);
console.log("  npm deps:", npmEdges.length);

// Check for broken workspace references
for (const edge of workspaceEdges) {
  if (!repoIndex.packages.find(p => p.name === edge.to)) {
    issues.push("Broken workspace ref: " + edge.from + " -> " + edge.to);
  }
}

// Verify Components
console.log("\nVerifying Components...");
const componentsByPackage = {};
for (const c of componentRegistry) {
  const pkg = c.package || "unknown";
  componentsByPackage[pkg] = (componentsByPackage[pkg] || 0) + 1;
}
console.log("  Components by package:");
for (const [pkg, count] of Object.entries(componentsByPackage)) {
  console.log("    " + pkg + ": " + count);
}

// Verify Routes
console.log("\nVerifying Routes...");
const routesByApp = {};
for (const r of routeMap) {
  routesByApp[r.app] = (routesByApp[r.app] || 0) + 1;
}
console.log("  Routes by app:");
for (const [app, count] of Object.entries(routesByApp)) {
  console.log("    " + app + ": " + count);
}

// Summary
console.log("\nDiscrepancies found:", issues.length);
for (const issue of issues) {
  console.log("  - " + issue);
}

const result = {
  timestamp: new Date().toISOString(),
  stats: repoIndex.stats,
  packages: { actualApps: actualApps.length, actualPkgs: actualPkgs.length, indexedApps: indexedApps.length, indexedPkgs: indexedPkgs.length },
  dependencies: { workspace: workspaceEdges.length, npm: npmEdges.length },
  components: componentsByPackage,
  routes: routesByApp,
  issues,
};
const { writeFileSync, mkdirSync } = await import("fs");
mkdirSync(join(ROOT, "platform", "validation"), { recursive: true });
writeFileSync(join(ROOT, "platform", "validation", "phase2-repo-intelligence.json"), JSON.stringify(result, null, 2));
console.log("\nPhase 2 complete.");
