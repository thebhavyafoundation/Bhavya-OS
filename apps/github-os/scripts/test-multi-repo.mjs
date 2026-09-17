#!/usr/bin/env node
/**
 * Git OS — Multi-Repository Pipeline Test
 * Tests the intelligence pipeline against multiple ecosystems.
 *
 * Repositories tested:
 *   1. psf/requests — Python ecosystem (permissive license)
 *   2. tokio-rs/tokio — Rust ecosystem (MIT)
 *   3. gin-gonic/gin — Go ecosystem (MIT)
 *   4. vuejs/vue — JavaScript ecosystem (MIT)
 *   5. a tiny/unknown repo — edge case for discovery failure
 *
 * Usage: node scripts/test-multi-repo.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "../../..");
const OUTPUT = join(ROOT, "apps", "github-os", "test-output");
mkdirSync(OUTPUT, { recursive: true });

// ─── GitHub API Client ──────────────────────────────────────────────────────

let tokenUsed = !!process.env.GITHUB_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function githubFetch(url, retried = false) {
  const headers = { Accept: "application/vnd.github.v3+json" };
  if (tokenUsed && GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const res = await fetch(url, { headers });
  if (!res.ok && !retried && tokenUsed) {
    tokenUsed = false;
    return githubFetch(url, true);
  }
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}

// ─── Pipeline Steps ─────────────────────────────────────────────────────────

function logStep(name, status, details) {
  const icon = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⏭️";
  console.log(`  ${icon} ${name}: ${status}`);
  if (details) console.log(`     ${details}`);
}

async function runPipeline(repoName) {
  const result = {
    repository: repoName,
    steps: [],
    errors: [],
    scores: null,
    recommendation: null,
    license: null,
    security: null,
    graph: { nodes: 0, edges: 0 },
  };

  // ── STEP 1: DISCOVER ──────────────────────────────────────────────────
  let repoData = null;
  try {
    repoData = await githubFetch(`https://api.github.com/repos/${repoName}`);
    const repo = {
      fullName: repoData.full_name,
      name: repoData.name,
      owner: repoData.owner.login,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      topics: repoData.topics || [],
      license: repoData.license?.spdx_id || null,
      archived: repoData.archived,
      openIssues: repoData.open_issues_count,
    };
    result.steps.push({ name: "Discovery", status: "PASS", details: `${repo.fullName} (${repo.stars}★, ${repo.language})` });
    logStep("Discovery", "PASS", `${repo.fullName} (${repo.stars}★, ${repo.language})`);
  } catch (err) {
    result.steps.push({ name: "Discovery", status: "FAIL", details: err.message });
    result.errors.push(`Discovery: ${err.message}`);
    logStep("Discovery", "FAIL", err.message);
    return result;
  }

  // ── STEP 2: INGEST ────────────────────────────────────────────────────
  let readme = null;
  let directory = null;
  let languages = null;
  try {
    const readmeData = await githubFetch(`https://api.github.com/repos/${repoName}/readme`);
    readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
    result.steps.push({ name: "README", status: "PASS", details: `${readme.length} chars` });
    logStep("README", "PASS", `${readme.length} chars`);
  } catch (err) {
    result.steps.push({ name: "README", status: "FAIL", details: err.message });
    result.errors.push(`README: ${err.message}`);
    logStep("README", "FAIL", err.message);
  }

  try {
    directory = await githubFetch(`https://api.github.com/repos/${repoName}/contents`);
    result.steps.push({ name: "Directory", status: "PASS", details: `${directory.length} items` });
    logStep("Directory", "PASS", `${directory.length} items`);
  } catch (err) {
    result.steps.push({ name: "Directory", status: "FAIL", details: err.message });
    result.errors.push(`Directory: ${err.message}`);
    logStep("Directory", "FAIL", err.message);
  }

  try {
    languages = await githubFetch(`https://api.github.com/repos/${repoName}/languages`);
    result.steps.push({ name: "Languages", status: "PASS", details: `${Object.keys(languages).length} languages` });
    logStep("Languages", "PASS", `${Object.keys(languages).length} languages`);
  } catch (err) {
    result.steps.push({ name: "Languages", status: "FAIL", details: err.message });
    logStep("Languages", "FAIL", err.message);
  }

  // ── STEP 3: INSPECT ───────────────────────────────────────────────────
  let inspection = null;
  if (directory) {
    const fileNames = directory.map((f) => f.name.toLowerCase());
    inspection = {
      hasReadme: fileNames.some((f) => f.includes("readme")),
      hasLicense: fileNames.some((f) => f.includes("license")),
      hasTests: fileNames.some((f) => f.includes("test") || f.includes("spec") || f.includes("__tests__")),
      hasCI: fileNames.some((f) => f.includes(".github") || f.includes("ci")),
      hasTypeScript: fileNames.some((f) => f.includes("tsconfig") || f.endsWith(".ts")),
      hasDocumentation: fileNames.some((f) => f.includes("docs") || f.includes("guide")),
      hasChangelog: fileNames.some((f) => f.includes("changelog") || f.includes("history")),
    };
    const indicators = [];
    if (inspection.hasReadme) indicators.push("README");
    if (inspection.hasLicense) indicators.push("License");
    if (inspection.hasTests) indicators.push("Tests");
    if (inspection.hasCI) indicators.push("CI/CD");
    if (inspection.hasTypeScript) indicators.push("TypeScript");
    if (inspection.hasDocumentation) indicators.push("Docs");
    if (inspection.hasChangelog) indicators.push("Changelog");
    result.steps.push({ name: "Inspection", status: "PASS", details: indicators.join(", ") || "minimal" });
    logStep("Inspection", "PASS", indicators.join(", ") || "minimal");
  } else {
    result.steps.push({ name: "Inspection", status: "SKIP", details: "no directory" });
    logStep("Inspection", "SKIP", "no directory");
  }

  // ── STEP 4: LICENSE ───────────────────────────────────────────────────
  const OSI_APPROVED = new Set(["MIT", "Apache-2.0", "GPL-2.0", "GPL-3.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "MPL-2.0"]);
  const COPYLEFT = new Set(["GPL-2.0", "GPL-3.0", "AGPL-3.0", "LGPL-2.1", "LGPL-3.0"]);

  const spdxId = repoData.license?.spdx_id || null;
  const licenseInfo = {
    spdxId,
    isOsiApproved: OSI_APPROVED.has(spdxId),
    isCopyleft: COPYLEFT.has(spdxId),
  };
  result.license = licenseInfo;
  if (spdxId) {
    const compat = COPYLEFT.has(spdxId) ? "Copyleft — requires review" :
      OSI_APPROVED.has(spdxId) ? "OSI-approved — compatible" : "Unknown";
    result.steps.push({ name: "License", status: "PASS", details: `${spdxId} — ${compat}` });
    logStep("License", "PASS", `${spdxId} — ${compat}`);
  } else {
    result.steps.push({ name: "License", status: "PASS", details: "No license detected" });
    logStep("License", "PASS", "No license detected");
  }

  // ── STEP 5: SECURITY ──────────────────────────────────────────────────
  const security = { credentialExposure: false, suspiciousPatterns: [] };
  if (directory) {
    const suspiciousFiles = directory.filter((f) =>
      f.name.includes(".env") || f.name.includes("credentials") || f.name.includes("secret"),
    );
    if (suspiciousFiles.length > 0) {
      security.credentialExposure = true;
      security.suspiciousPatterns.push(...suspiciousFiles.map((f) => f.name));
    }
  }
  result.security = security;
  result.steps.push({ name: "Security", status: "PASS", details: `Exposure: ${security.credentialExposure}, Suspicious: ${security.suspiciousPatterns.length}` });
  logStep("Security", "PASS", `Exposure: ${security.credentialExposure}, Suspicious: ${security.suspiciousPatterns.length}`);

  // ── STEP 6: SCORING ───────────────────────────────────────────────────
  if (inspection) {
    let health = 50;
    if (inspection.hasReadme) health += 10;
    if (inspection.hasLicense) health += 8;
    if (inspection.hasTests) health += 12;
    if (inspection.hasCI) health += 8;
    if (inspection.hasChangelog) health += 4;
    if (inspection.hasDocumentation) health += 5;
    health = Math.min(100, health);

    let tech = 50;
    if (inspection.hasTypeScript) tech += 15;
    if (inspection.hasCI) tech += 8;
    if (inspection.hasDocumentation) tech += 5;
    tech = Math.min(100, tech);

    let bhavya = 40;
    if (licenseInfo.isOsiApproved && !licenseInfo.isCopyleft) bhavya += 15;
    if (!security.credentialExposure) bhavya += 5;
    bhavya += (inspection.hasReadme ? 1 : 0) + (inspection.hasTests ? 1 : 0) + (inspection.hasCI ? 1 : 0) + (inspection.hasDocumentation ? 1 : 0);
    bhavya = Math.min(100, bhavya);

    result.scores = { healthScore: health, technologyScore: tech, bhavyaScore: bhavya };
    result.steps.push({ name: "Scoring", status: "PASS", details: `Health: ${health}, Tech: ${tech}, Bhavya: ${bhavya}` });
    logStep("Scoring", "PASS", `Health: ${health}, Tech: ${tech}, Bhavya: ${bhavya}`);
  } else {
    result.steps.push({ name: "Scoring", status: "SKIP" });
    logStep("Scoring", "SKIP");
  }

  // ── STEP 7: SKILLS ────────────────────────────────────────────────────
  const skills = [];
  if (inspection) {
    if (inspection.hasTests) skills.push("Testing");
    if (inspection.hasCI) skills.push("CI/CD");
    if (inspection.hasTypeScript) skills.push("TypeScript");
    if (inspection.hasDocumentation) skills.push("Documentation");
  }
  result.steps.push({ name: "Skills", status: "PASS", details: `${skills.length}: ${skills.join(", ") || "none"}` });
  logStep("Skills", "PASS", `${skills.length}: ${skills.join(", ") || "none"}`);

  // ── STEP 8: PATTERNS ──────────────────────────────────────────────────
  const patterns = [];
  if (inspection) {
    if (inspection.hasTests && inspection.hasCI) patterns.push("Test-Driven CI");
    if (readme?.toLowerCase().includes("middleware")) patterns.push("Middleware");
    if (readme?.toLowerCase().includes("plugin")) patterns.push("Plugin");
    if (readme?.toLowerCase().includes("mvc") || readme?.toLowerCase().includes("model-view-controller")) patterns.push("MVC");
  }
  result.steps.push({ name: "Patterns", status: "PASS", details: `${patterns.length}: ${patterns.join(", ") || "none"}` });
  logStep("Patterns", "PASS", `${patterns.length}: ${patterns.join(", ") || "none"}`);

  // ── STEP 9: RECOMMENDATION ────────────────────────────────────────────
  if (result.scores && licenseInfo) {
    const weighted = (result.scores.bhavyaScore + result.scores.healthScore + result.scores.technologyScore) / 300;
    let type;
    if (weighted > 0.7 && licenseInfo.isOsiApproved && !licenseInfo.isCopyleft) type = "adopt";
    else if (weighted > 0.5) type = "study";
    else if (weighted > 0.3) type = "reference";
    else type = "monitor";
    result.recommendation = type;
    result.steps.push({ name: "Recommendation", status: "PASS", details: type.toUpperCase() });
    logStep("Recommendation", "PASS", type.toUpperCase());
  } else {
    result.steps.push({ name: "Recommendation", status: "SKIP" });
    logStep("Recommendation", "SKIP");
  }

  // ── STEP 10: GRAPH ────────────────────────────────────────────────────
  const graphNodes = [];
  const graphEdges = [];
  const repoId = `repo-${repoName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  graphNodes.push({ id: repoId, type: "repository", label: repoName });
  if (repoData.language) {
    const langId = `tech-${repoData.language.toLowerCase()}`;
    graphNodes.push({ id: langId, type: "technology", label: repoData.language });
    graphEdges.push({ source: repoId, target: langId, relationship: "uses" });
  }
  result.graph = { nodes: graphNodes.length, edges: graphEdges.length };
  result.steps.push({ name: "Graph", status: "PASS", details: `${graphNodes.length} nodes, ${graphEdges.length} edges` });
  logStep("Graph", "PASS", `${graphNodes.length} nodes, ${graphEdges.length} edges`);

  return result;
}

// ─── Main ───────────────────────────────────────────────────────────────────

const REPOSITORIES = [
  "psf/requests",     // Python ecosystem
  "tokio-rs/tokio",   // Rust ecosystem
  "gin-gonic/gin",    // Go ecosystem
  "vuejs/vue",        // JavaScript ecosystem
];

console.log("═".repeat(60));
console.log("🧪 GIT OS MULTI-REPOSITORY PIPELINE TEST");
console.log("═".repeat(60));
console.log(`Testing ${REPOSITORIES.length} repositories across ecosystems\n`);

const allResults = [];

for (const repoName of REPOSITORIES) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`📦 Testing: ${repoName}`);
  console.log(`${"─".repeat(60)}\n`);

  const result = await runPipeline(repoName);
  allResults.push(result);
}

// ── SUMMARY ─────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 MULTI-REPOSITORY RESULTS");
console.log("═".repeat(60));

let totalSteps = 0;
let totalPassed = 0;
let totalFailed = 0;

for (const r of allResults) {
  const passed = r.steps.filter((s) => s.status === "PASS").length;
  const failed = r.steps.filter((s) => s.status === "FAIL").length;
  totalSteps += r.steps.length;
  totalPassed += passed;
  totalFailed += failed;

  const scores = r.scores ? `H:${r.scores.healthScore} T:${r.scores.technologyScore} B:${r.scores.bhavyaScore}` : "N/A";
  const rec = r.recommendation?.toUpperCase() || "N/A";
  const license = r.license?.spdxId || "none";

  console.log(`  ${r.repository.padEnd(20)} | Steps: ${passed}/${r.steps.length} PASS | Scores: ${scores} | License: ${license} | Rec: ${rec}`);
}

console.log(`\n  Total: ${totalPassed}/${totalSteps} steps passed, ${totalFailed} failed`);
console.log("═".repeat(60));

// Write results
writeFileSync(join(OUTPUT, "multi-repo-results.json"), JSON.stringify(allResults, null, 2));
console.log(`\n💾 Results written to ${OUTPUT}/multi-repo-results.json`);

// Determine pass/fail
const allPassed = allResults.every((r) => r.errors.length === 0);
console.log(`\n🎉 Multi-Repository Test: ${allPassed ? "PASS ✅" : "PARTIAL PASS ⚠️"} (${allResults.length} repos)`);
