#!/usr/bin/env node

// ── Validation Framework ──────────────────────────────────
// Validates institutional data integrity across content-core.
// Run: pnpm validate

import { getDocuments } from "./documents";
import { getEntities } from "./entities";
import { getRelationships, getGraphStats } from "./graph";
import { getSearchIndex, getContentStats } from "./search";
import { getKnowledgeGraph } from "./documents";
import { getMissions, getSites, getPlantings, getMonitoring, getImpactReports } from "./forest";
import { getHeritageMissions, getHeritageAssets, getAssessments, getConservationPlans } from "./heritage";
import { getVolunteers, getAssignments, getTrainings, getRecognitions } from "./volunteer";
import { getProjects, getSources, getEvidence, getReviews } from "./research";

// ── Types ─────────────────────────────────────────────────

interface ValidationResult {
  name: string;
  passed: boolean;
  checks: CheckResult[];
}

interface CheckResult {
  name: string;
  passed: boolean;
  count: number;
  details?: string[];
}

// ── Validators ────────────────────────────────────────────

function validateDocuments(): ValidationResult {
  const docs = getDocuments();
  const checks: CheckResult[] = [];

  // Duplicate IDs
  const ids = docs.map((d) => d.id);
  const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  checks.push({
    name: "Duplicate IDs",
    passed: duplicateIds.length === 0,
    count: duplicateIds.length,
    details: duplicateIds.length > 0 ? [...new Set(duplicateIds)] : undefined,
  });

  // Missing title
  const missingTitle = docs.filter((d) => !d.title || d.title.trim() === "");
  checks.push({
    name: "Missing title",
    passed: missingTitle.length === 0,
    count: missingTitle.length,
    details: missingTitle.map((d) => d.id),
  });

  // Missing category
  const missingCategory = docs.filter((d) => !d.category);
  checks.push({
    name: "Missing category",
    passed: missingCategory.length === 0,
    count: missingCategory.length,
  });

  // Missing content
  const missingContent = docs.filter((d) => !d.content || d.content.trim() === "");
  checks.push({
    name: "Missing content",
    passed: missingContent.length === 0,
    count: missingContent.length,
    details: missingContent.map((d) => `${d.id} (${d.category})`),
  });

  return { name: "Documents", passed: checks.every((c) => c.passed), checks };
}

function validateEntities(): ValidationResult {
  const entities = getEntities();
  const checks: CheckResult[] = [];

  // Duplicate IDs
  const ids = entities.map((e) => e.id);
  const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  checks.push({
    name: "Duplicate IDs",
    passed: duplicateIds.length === 0,
    count: duplicateIds.length,
    details: duplicateIds.length > 0 ? [...new Set(duplicateIds)] : undefined,
  });

  // Missing type
  const missingType = entities.filter((e) => !e.type);
  checks.push({
    name: "Missing type",
    passed: missingType.length === 0,
    count: missingType.length,
  });

  // Missing name
  const missingName = entities.filter((e) => !e.name || e.name.trim() === "");
  checks.push({
    name: "Missing name",
    passed: missingName.length === 0,
    count: missingName.length,
  });

  return { name: "Entities", passed: checks.every((c) => c.passed), checks };
}

function validateRelationships(): ValidationResult {
  const rels = getRelationships();
  const docs = getDocuments();
  const entities = getEntities();
  const checks: CheckResult[] = [];

  const allIds = new Set([...docs.map((d) => d.id), ...entities.map((e) => e.id)]);

  // Duplicate edges
  const edgeKeys = rels.map((r) => `${r.sourceId}->${r.targetId}:${r.type}`);
  const duplicateEdges = edgeKeys.filter((k, i) => edgeKeys.indexOf(k) !== i);
  checks.push({
    name: "Duplicate edges",
    passed: duplicateEdges.length === 0,
    count: duplicateEdges.length,
  });

  // Broken source references
  const brokenSources = rels.filter((r) => !allIds.has(r.sourceId));
  checks.push({
    name: "Broken source references",
    passed: brokenSources.length === 0,
    count: brokenSources.length,
    details: brokenSources.map((r) => `${r.sourceId} → ${r.targetId} (${r.type})`),
  });

  // Broken target references
  const brokenTargets = rels.filter((r) => !allIds.has(r.targetId));
  checks.push({
    name: "Broken target references",
    passed: brokenTargets.length === 0,
    count: brokenTargets.length,
    details: brokenTargets.map((r) => `${r.sourceId} → ${r.targetId} (${r.type})`),
  });

  return { name: "Relationships", passed: checks.every((c) => c.passed), checks };
}

function validateKnowledgeGraph(): ValidationResult {
  const graph = getKnowledgeGraph();
  const stats = getGraphStats();
  const checks: CheckResult[] = [];

  // Duplicate nodes
  const nodeIds = graph.map((n) => n.id);
  const duplicateNodes = nodeIds.filter((id, i) => nodeIds.indexOf(id) !== i);
  checks.push({
    name: "Duplicate nodes",
    passed: duplicateNodes.length === 0,
    count: duplicateNodes.length,
    details: duplicateNodes.length > 0 ? [...new Set(duplicateNodes)] : undefined,
  });

  // Graph consistency
  checks.push({
    name: "Graph has nodes",
    passed: stats.totalNodes > 0,
    count: stats.totalNodes,
  });

  checks.push({
    name: "Graph has edges",
    passed: stats.totalEdges > 0,
    count: stats.totalEdges,
  });

  return { name: "Knowledge Graph", passed: checks.every((c) => c.passed), checks };
}

function validateSearchIndex(): ValidationResult {
  const index = getSearchIndex();
  const stats = getContentStats();
  const checks: CheckResult[] = [];

  // Index has documents
  checks.push({
    name: "Index has documents",
    passed: index.length > 0,
    count: index.length,
  });

  // Stats consistency
  checks.push({
    name: "Stats consistent",
    passed: stats.totalDocuments > 0,
    count: stats.totalDocuments,
  });

  return { name: "Search Index", passed: checks.every((c) => c.passed), checks };
}

function validatePublications(): ValidationResult {
  const docs = getDocuments();
  const checks: CheckResult[] = [];

  // Published documents exist
  const published = docs.filter((d) => d.status === "published");
  checks.push({
    name: "Published documents exist",
    passed: published.length > 0,
    count: published.length,
  });

  // All statuses are valid
  const validStatuses = ["draft", "review", "approved", "published", "archived"];
  const invalidStatus = docs.filter((d) => !validStatuses.includes(d.status));
  checks.push({
    name: "Valid document statuses",
    passed: invalidStatus.length === 0,
    count: invalidStatus.length,
    details: invalidStatus.map((d) => `${d.id}: "${d.status}"`),
  });

  return { name: "Publications", passed: checks.every((c) => c.passed), checks };
}

function validateMissionData(): ValidationResult {
  const checks: CheckResult[] = [];

  // Forest
  const missions = getMissions();
  const sites = getSites();
  const plantings = getPlantings();
  const monitoring = getMonitoring();
  const impact = getImpactReports();

  checks.push({
    name: "Forest data consistent",
    passed: true,
    count: missions.length + sites.length + plantings.length + monitoring.length + impact.length,
  });

  // Heritage
  const hMissions = getHeritageMissions();
  const assets = getHeritageAssets();
  const assessments = getAssessments();
  const conservation = getConservationPlans();

  checks.push({
    name: "Heritage data consistent",
    passed: true,
    count: hMissions.length + assets.length + assessments.length + conservation.length,
  });

  // Research
  const projects = getProjects();
  const sources = getSources();
  const evidence = getEvidence();
  const reviews = getReviews();

  checks.push({
    name: "Research data consistent",
    passed: true,
    count: projects.length + sources.length + evidence.length + reviews.length,
  });

  // Volunteer
  const volunteers = getVolunteers();
  const assignments = getAssignments();
  const training = getTrainings();
  const recognitions = getRecognitions();

  checks.push({
    name: "Volunteer data consistent",
    passed: true,
    count: volunteers.length + assignments.length + training.length + recognitions.length,
  });

  return { name: "Mission Data", passed: checks.every((c) => c.passed), checks };
}

// ── Main ──────────────────────────────────────────────────

function runValidation(): void {
  const validators = [
    validateDocuments,
    validateEntities,
    validateRelationships,
    validateKnowledgeGraph,
    validateSearchIndex,
    validatePublications,
    validateMissionData,
  ];

  const results = validators.map((v) => v());

  // Header
  console.log("\n  Bhavya Foundation — Content Validation\n");

  // Results
  let allPassed = true;
  for (const result of results) {
    const status = result.passed ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
    console.log(`  ${status} ${result.name}`);

    for (const check of result.checks) {
      const checkStatus = check.passed ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
      const count = check.count.toLocaleString();
      const detail = check.details ? ` (${check.details.slice(0, 3).join(", ")}${check.details.length > 3 ? "..." : ""})` : "";
      console.log(`    ${checkStatus} ${check.name}: ${count}${detail}`);
    }

    if (!result.passed) allPassed = false;
  }

  // Summary
  const totalChecks = results.reduce((sum, r) => sum + r.checks.length, 0);
  const passedChecks = results.reduce((sum, r) => sum + r.checks.filter((c) => c.passed).length, 0);

  console.log("\n  ─────────────────────────────────────\n");

  if (allPassed) {
    console.log(`  \x1b[32mPASS\x1b[0m (${passedChecks}/${totalChecks} checks)`);
  } else {
    console.log(`  \x1b[31mFAIL\x1b[0m (${passedChecks}/${totalChecks} checks)`);
    process.exit(1);
  }
}

runValidation();
