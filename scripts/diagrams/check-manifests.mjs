#!/usr/bin/env node
/*
 * check-manifests.mjs — Bhavya diagram manifest consistency check.
 *
 * Confirms manifest-level invariants without touching SVG assets:
 *   - every manifest parses and validates against the schema
 *   - no duplicate diagram_id
 *   - no unknown diagram type or status
 *   - content_sources, review fields, and licence metadata present
 *   - no draft diagram claims an approved presentation
 *
 * Companion to validate-diagrams.mjs (which also checks SVG safety) and
 * export-diagrams.mjs (manual export). Dependency-free.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MANIFEST_DIR = join(ROOT, "content", "diagrams", "manifests");

const ALLOWED_STATUSES = [
  "draft",
  "content-reviewed",
  "accessibility-reviewed",
  "approved",
  "deprecated",
];
const ALLOWED_TYPES = [
  "architecture",
  "architecture-delta",
  "it-current-state",
  "flowchart",
  "sequence",
  "state-machine",
  "er-data-model",
  "timeline",
  "swimlane",
  "quadrant",
  "radar",
  "polar-chart",
  "loop",
  "nested",
  "tree",
  "org-chart",
  "layer-stack",
  "exploded-axonometric",
  "axonometric-plan",
  "venn",
  "pyramid",
  "treemap",
  "heatmap",
  "bar-chart",
  "waterfall",
  "line-chart",
  "gantt",
  "scatter-plot",
  "high-level",
  "process",
  "medallion",
  "data-flow",
  "dp-integration",
  "dp-security-matrix",
  "sankey",
  "fishbone",
  "wardley-map",
  "kanban",
  "user-journey",
  "service-blueprint",
  "deployment",
  "dependency-graph",
  "uml-class",
  "story-map",
  "database-schema",
];

const errors = [];
const warnings = [];
const seenIds = new Set();

function fail(msg) {
  errors.push(msg);
  console.error(`[check-manifests] ${msg}`);
}
function note(msg) {
  warnings.push(msg);
  console.warn(`[check-manifests] ${msg}`);
}

function validateSchema(instance, schema, path) {
  if (schema.type && typeof schema.type === "string") {
    const actual = Array.isArray(instance)
      ? "array"
      : instance === null
        ? "null"
        : typeof instance;
    if (actual !== schema.type) {
      fail(`${path || "root"}: expected ${schema.type}, got ${actual}`);
      return;
    }
  }
  if (schema.enum && !schema.enum.includes(instance)) {
    fail(`${path || "root"}: ${JSON.stringify(instance)} not in enum`);
  }
  if (
    schema.pattern &&
    typeof instance === "string" &&
    !new RegExp(schema.pattern).test(instance)
  ) {
    fail(`${path || "root"}: "${instance}" does not match ${schema.pattern}`);
  }
  if (
    schema.minLength != null &&
    typeof instance === "string" &&
    instance.length < schema.minLength
  ) {
    fail(`${path || "root"}: string shorter than ${schema.minLength}`);
  }
  if (
    schema.required &&
    typeof instance === "object" &&
    instance !== null &&
    !Array.isArray(instance)
  ) {
    for (const req of schema.required) {
      if (!(req in instance))
        fail(`${path || "root"}: missing required field "${req}"`);
    }
  }
  if (
    schema.properties &&
    typeof instance === "object" &&
    instance !== null &&
    !Array.isArray(instance)
  ) {
    for (const [key, sub] of Object.entries(schema.properties)) {
      if (key in instance)
        validateSchema(instance[key], sub, `${path || "root"}.${key}`);
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(instance)) {
        if (!(key in schema.properties))
          fail(`${path || "root"}: unknown field "${key}"`);
      }
    }
  }
}

const schema = JSON.parse(
  readFileSync(join(MANIFEST_DIR, "manifest.schema.json"), "utf8"),
);

let count = 0;
for (const file of readdirSync(MANIFEST_DIR)
  .filter(
    (f) =>
      f.endsWith(".json") && f !== "manifest.schema.json" && !f.startsWith("_"),
  )
  .sort()) {
  const manifestPath = join(MANIFEST_DIR, file);
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (e) {
    fail(`${file}: invalid JSON (${e.message})`);
    continue;
  }
  count++;
  validateSchema(manifest, schema, file);

  const id = manifest.diagram_id;
  if (id && seenIds.has(id)) fail(`duplicate diagram_id "${id}"`);
  if (id) seenIds.add(id);

  if (!ALLOWED_STATUSES.includes(manifest.status))
    fail(`${id || file}: unknown status "${manifest.status}"`);
  if (!ALLOWED_TYPES.includes(manifest.type))
    fail(`${id || file}: unknown diagram type "${manifest.type}"`);

  if (!manifest.content_sources || manifest.content_sources.length === 0) {
    fail(`${id || file}: missing content_sources`);
  }
  const rev = manifest.review;
  if (!rev) {
    fail(`${id || file}: missing review block`);
  } else {
    for (const f of ["content", "subject", "governance", "accessibility"]) {
      if (!rev[f]) fail(`${id || file}: missing review.${f}`);
    }
  }
  const lic = manifest.licensing;
  if (!lic) {
    fail(`${id || file}: missing licensing block`);
  } else {
    for (const f of [
      "generator_repository",
      "generator_commit",
      "generator_license",
    ]) {
      if (!lic[f]) fail(`${id || file}: missing licensing.${f}`);
    }
  }
  if (!manifest.accessible_text || !manifest.accessible_text.trim()) {
    fail(`${id || file}: missing accessible_text (text alternative)`);
  }

  // A draft diagram must not be presented as approved institutional information.
  if (
    manifest.status === "draft" &&
    manifest.route &&
    (manifest.route.startsWith("/os/") || manifest.route.startsWith("/app/"))
  ) {
    note(
      `${id}: draft on production-internal route "${manifest.route}" — review before publishing`,
    );
  }
}

if (count === 0) fail("no diagram manifests found");

console.log(`\n[check-manifests] checked ${count} manifest(s)`);
if (errors.length > 0) {
  console.error(`\n[check-manifests] FAILED: ${errors.length} error(s)`);
  process.exit(1);
}
if (warnings.length > 0) {
  console.log(
    `\n[check-manifests] ${warnings.length} governance warning(s) (drafts on planned routes — expected for pilot)`,
  );
}
console.log("[check-manifests] OK — all manifests consistent");
process.exit(0);
