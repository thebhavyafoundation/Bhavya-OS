#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "../..");
const VALIDATION = join(ROOT, "platform", "validation");

console.log("Phase 10: Production Report\n");

// Load all validation results
function loadResult(file) {
  const path = join(VALIDATION, file);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8"));
}

const phase1 = loadResult("phase1-cli-verification.json");
const phase2 = loadResult("phase2-repo-intelligence.json");
const phase3 = loadResult("phase3-knowledge-graphs.json");
const phase4 = loadResult("phase4-ai-runtime.json");
const phase5 = loadResult("phase5-agents.json");
const phase6 = loadResult("phase6-dashboard.json");
const phase7 = loadResult("phase7-performance.json");
const phase8 = loadResult("phase8-documentation.json");
const phase9 = loadResult("phase9-debt.json");

// Load repository index
const repoIndex = JSON.parse(readFileSync(join(ROOT, "platform/repo-intelligence/output/repository-index.json"), "utf-8"));

// ── Calculate Scores ─────────────────────────────────────────

// Platform Readiness Score
const platformChecks = [
  phase1?.passed > 0,
  phase4?.passed === phase4?.results?.length,
  phase5?.issues?.length === 0,
  phase6?.issues?.length <= 1,
];
const platformScore = Math.round((platformChecks.filter(Boolean).length / platformChecks.length) * 100);

// Repository Health Score
const repoHealth = [
  repoIndex.stats.totalFiles > 0,
  repoIndex.stats.totalPackages > 0,
  repoIndex.stats.totalRoutes > 0,
  repoIndex.stats.totalComponents > 0,
  phase2?.issues?.length < 5,
];
const repoScore = Math.round((repoHealth.filter(Boolean).length / repoHealth.length) * 100);

// Engineering Health Score
const engHealth = [
  phase3?.issues?.length === 0,
  phase4?.passed === phase4?.results?.length,
  phase5?.issues?.length === 0,
  phase9?.issues?.length < 3,
];
const engScore = Math.round((engHealth.filter(Boolean).length / engHealth.length) * 100);

// Deployment Readiness
const deployReady = [
  existsSync(join(ROOT, "vercel.json")),
  existsSync(join(ROOT, "turbo.json")),
  existsSync(join(ROOT, "pnpm-workspace.yaml")),
];
const deployScore = Math.round((deployReady.filter(Boolean).length / deployReady.length) * 100);

// Technical Debt Score (lower is better)
const debtScore = Math.max(0, 100 - (phase9?.issues?.length || 0) * 10);

// Overall Score
const overallScore = Math.round((platformScore + repoScore + engScore + deployScore + debtScore) / 5);

// ── Top 20 Issues ────────────────────────────────────────────

const allIssues = [];
if (phase1) {
  phase1.results.filter(r => !r.passed).forEach(r => allIssues.push({ phase: 1, severity: "high", issue: r.name + " failed: " + (r.error || "unknown") }));
}
if (phase2) {
  phase2.issues.forEach(i => allIssues.push({ phase: 2, severity: "medium", issue: i }));
}
if (phase3) {
  phase3.issues.forEach(i => allIssues.push({ phase: 3, severity: "medium", issue: i.graph + ": " + i.issue }));
}
if (phase4) {
  phase4.results.filter(r => !r.passed).forEach(r => allIssues.push({ phase: 4, severity: "high", issue: r.name + " failed: " + r.error }));
}
if (phase5) {
  phase5.issues.forEach(i => allIssues.push({ phase: 5, severity: "medium", issue: i.agent + ": " + i.issue }));
}
if (phase6) {
  phase6.issues.forEach(i => allIssues.push({ phase: 6, severity: "low", issue: i }));
}
if (phase8) {
  phase8.issues.forEach(i => allIssues.push({ phase: 8, severity: "low", issue: typeof i === "string" ? i : i.doc + ": " + i.issue }));
}
if (phase9) {
  phase9.issues.forEach(i => allIssues.push({ phase: 9, severity: "low", issue: i.type + ": " + i.item }));
}

const top20 = allIssues.slice(0, 20);

// ── Generate Report ──────────────────────────────────────────

const report = {
  title: "Bhavya OS — Production Readiness Report",
  generatedAt: new Date().toISOString(),
  scores: {
    overall: overallScore,
    platformReadiness: platformScore,
    repositoryHealth: repoScore,
    engineeringHealth: engScore,
    deploymentReadiness: deployScore,
    technicalDebt: debtScore,
  },
  repository: {
    files: repoIndex.stats.totalFiles,
    directories: repoIndex.stats.totalDirs,
    packages: repoIndex.stats.totalPackages,
    routes: repoIndex.stats.totalRoutes,
    components: repoIndex.stats.totalComponents,
    dependencies: repoIndex.stats.totalDependencies,
  },
  validation: {
    phase1_cliVerification: { passed: phase1?.passed || 0, total: phase1?.total || 0 },
    phase2_repoIntelligence: { issues: phase2?.issues?.length || 0 },
    phase3_knowledgeGraphs: { issues: phase3?.issues?.length || 0 },
    phase4_aiRuntime: { passed: phase4?.passed || 0, total: phase4?.results?.length || 0 },
    phase5_agents: { issues: phase5?.issues?.length || 0, agents: phase5?.agentCount || 0 },
    phase6_dashboard: { issues: phase6?.issues?.length || 0 },
    phase7_performance: { totalTime: phase7?.totalDuration || 0, memoryMB: phase7?.memoryUsage?.rss || 0 },
    phase8_documentation: { issues: phase8?.issues?.length || 0 },
    phase9_technicalDebt: { issues: phase9?.issues?.length || 0 },
  },
  top20Issues: top20,
  roadmap: [
    "Fix failing CLI commands (tasks stats, tasks list)",
    "Fix website build timeout",
    "Index missing packages (auth, bar, bdx, bhavya-ai-lab)",
    "Add integration tests for AI runtime",
    "Expand documentation with more examples",
    "Add Lighthouse performance testing",
    "Implement automated quality gate CI",
    "Add dependency vulnerability scanning",
  ],
};

// Write report
writeFileSync(join(VALIDATION, "production-report.json"), JSON.stringify(report, null, 2));
console.log("Production report generated: platform/validation/production-report.json");

// Print summary
console.log("\n" + "=".repeat(60));
console.log("BHAVYA OS — PRODUCTION READINESS REPORT");
console.log("=".repeat(60));
console.log("\nOverall Score: " + overallScore + "/100");
console.log("\nBreakdown:");
console.log("  Platform Readiness:    " + platformScore + "/100");
console.log("  Repository Health:     " + repoScore + "/100");
console.log("  Engineering Health:    " + engScore + "/100");
console.log("  Deployment Readiness:  " + deployScore + "/100");
console.log("  Technical Debt:        " + debtScore + "/100");
console.log("\nRepository:");
console.log("  Files: " + repoIndex.stats.totalFiles.toLocaleString());
console.log("  Packages: " + repoIndex.stats.totalPackages);
console.log("  Routes: " + repoIndex.stats.totalRoutes);
console.log("  Components: " + repoIndex.stats.totalComponents);
console.log("  Dependencies: " + repoIndex.stats.totalDependencies);
console.log("\nValidation:");
console.log("  Phase 1 (CLI): " + (phase1?.passed || 0) + "/" + (phase1?.total || 0) + " passed");
console.log("  Phase 2 (Repo): " + (phase2?.issues?.length || 0) + " issues");
console.log("  Phase 3 (Graphs): " + (phase3?.issues?.length || 0) + " issues");
console.log("  Phase 4 (Runtime): " + (phase4?.passed || 0) + "/" + (phase4?.results?.length || 0) + " passed");
console.log("  Phase 5 (Agents): " + (phase5?.issues?.length || 0) + " issues");
console.log("  Phase 6 (Dashboard): " + (phase6?.issues?.length || 0) + " issues");
console.log("  Phase 7 (Performance): " + (phase7?.totalDuration || 0) + "ms total");
console.log("  Phase 8 (Docs): " + (phase8?.issues?.length || 0) + " issues");
console.log("  Phase 9 (Debt): " + (phase9?.issues?.length || 0) + " issues");
console.log("\nTop Issues:");
for (const issue of top20.slice(0, 10)) {
  console.log("  [" + issue.severity + "] " + issue.issue);
}
console.log("\n" + "=".repeat(60));
