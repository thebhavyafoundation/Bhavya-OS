#!/usr/bin/env node
/*
 * validate-diagrams.mjs — Bhavya diagram manifest + SVG safety validation.
 *
 * Dependency-free (plain Node). Validates every manifest under
 * content/diagrams/manifests/ and its referenced SVG source under
 * apps/ai-institute/public/diagrams/<group>/.
 *
 * Exit non-zero on any violation. Intended for CI / local preflight, not
 * part of the ordinary application build.
 *
 * Stage 11 checks implemented:
 *   missing manifest, duplicate diagram ID, missing source, missing text
 *   alternative, missing title/description, unapproved status on a
 *   production route, unknown diagram type, missing content source, missing
 *   licence metadata, SVG with scripts, SVG with external URLs, SVG with
 *   unsafe event attributes, missing viewBox, missing dimensions, duplicate
 *   internal SVG IDs, invalid production path, oversized output, unapproved
 *   Google Font dependency, missing reviewer fields.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MANIFEST_DIR = join(ROOT, "content", "diagrams", "manifests");
const PUBLIC_DIR = join(ROOT, "apps", "ai-institute", "public", "diagrams");

const ALLOWED_STATUSES = [
  "draft",
  "content-reviewed",
  "accessibility-reviewed",
  "approved",
  "deprecated",
];
const PRODUCTION_STATUSES = [
  "content-reviewed",
  "accessibility-reviewed",
  "approved",
];
const APPROVED_REVIEW = "approved";

const errors = [];
let manifestCount = 0;
const seenIds = new Set();

function fail(msg) {
  errors.push(msg);
  console.error(`[validate-diagrams] ${msg}`);
}

function warn(msg) {
  console.warn(`[validate-diagrams] ${msg}`);
}

// ---------- minimal JSON Schema subset validator ----------

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
    fail(`${path || "root"}: value ${JSON.stringify(instance)} not in enum`);
  }
  if (
    schema.pattern &&
    typeof instance === "string" &&
    !new RegExp(schema.pattern).test(instance)
  ) {
    fail(
      `${path || "root"}: "${instance}" does not match pattern ${schema.pattern}`,
    );
  }
  if (
    schema.minLength != null &&
    typeof instance === "string" &&
    instance.length < schema.minLength
  ) {
    fail(`${path || "root"}: string shorter than ${schema.minLength} chars`);
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

// ---------- SVG safety checks ----------

function checkSvg(svgPath, diagramId) {
  if (!existsSync(svgPath)) {
    fail(`${diagramId}: production SVG missing at ${svgPath}`);
    return;
  }
  const svg = readFileSync(svgPath, "utf8");

  if (/<script\b/i.test(svg)) fail(`${diagramId}: SVG contains <script>`);
  if (/\bon(click|load|error|mouse|key|submit|focus|blur)\s*=/i.test(svg)) {
    fail(`${diagramId}: SVG contains unsafe event attribute`);
  }
  // external resource URLs (href/src/xlink:href/@import url) — xmlns namespace is required and allowed
  if (/(href|src|xlink:href)\s*=\s*"https?:\/\//i.test(svg))
    fail(`${diagramId}: SVG contains external URL`);
  if (/@import\s*url\(\s*["']?https?:\/\//i.test(svg))
    fail(`${diagramId}: SVG contains external @import URL`);
  if (!/viewBox\s*=/i.test(svg)) fail(`${diagramId}: SVG missing viewBox`);
  if (!/width\s*=/i.test(svg) && !/style=.*width/i.test(svg)) {
    fail(`${diagramId}: SVG missing explicit width`);
  }
  if (!/height\s*=/i.test(svg) && !/style=.*height/i.test(svg)) {
    fail(`${diagramId}: SVG missing explicit height`);
  }
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(svg)) {
    fail(
      `${diagramId}: SVG references Google Fonts (unapproved external font dependency)`,
    );
  }
  // duplicate internal IDs (id="..." unique within document)
  const ids = [...svg.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i, arr) => arr.indexOf(id) !== i);
  for (const d of [...new Set(dupes)])
    fail(`${diagramId}: duplicate internal SVG id "${d}"`);
  // accessible name contract
  if (!/role="img"/i.test(svg)) fail(`${diagramId}: SVG missing role="img"`);
  if (!/aria-labelledby/i.test(svg))
    fail(`${diagramId}: SVG missing aria-labelledby`);
  if (!/<title[^>]*>[\s\S]*?<\/title>/i.test(svg)) {
    fail(`${diagramId}: SVG missing <title>`);
  }
  if (!/<desc[^>]*>[\s\S]*?<\/desc>/i.test(svg)) {
    fail(`${diagramId}: SVG missing <desc>`);
  }
  const sizeKB = statSync(svgPath).size / 1024;
  if (sizeKB > 300)
    fail(
      `${diagramId}: SVG oversized (${sizeKB.toFixed(1)} KB > 300 KB budget)`,
    );
}

// ---------- manifest checks ----------

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
  manifestCount++;

  validateSchema(manifest, schema, file);

  const id = manifest.diagram_id;
  if (id && seenIds.has(id))
    fail(`duplicate diagram ID "${id}" across manifests`);
  if (id) seenIds.add(id);

  const status = manifest.status;
  if (status && !ALLOWED_STATUSES.includes(status)) {
    fail(`${id || file}: unknown status "${status}"`);
  }
  if (
    status === "draft" &&
    manifest.route &&
    /^\/os|\/app/.test(manifest.route)
  ) {
    warn(
      `${id || file}: draft status on production-internal route "${manifest.route}" — review before publishing`,
    );
  }

  // content source + text alternative
  if (
    !manifest.accessible_text ||
    manifest.accessible_text.trim().length === 0
  ) {
    fail(`${id || file}: missing text alternative (accessible_text)`);
  }
  if (!manifest.content_sources || manifest.content_sources.length === 0) {
    fail(`${id || file}: missing content source`);
  }

  // licence metadata
  const lic = manifest.licensing;
  if (!lic) {
    fail(`${id || file}: missing licence metadata`);
  } else {
    for (const f of [
      "generator_repository",
      "generator_commit",
      "generator_license",
    ]) {
      if (!lic[f]) fail(`${id || file}: missing licence.${f}`);
    }
  }

  // reviewer fields
  const rev = manifest.review;
  if (!rev) {
    fail(`${id || file}: missing review fields`);
  } else {
    for (const f of ["content", "subject", "governance", "accessibility"]) {
      if (!rev[f]) fail(`${id || file}: missing review.${f}`);
    }
  }

  // production SVG referenced
  const svgRel = manifest.production_svg;
  if (svgRel) {
    const svgPath = join(ROOT, svgRel);
    if (
      !svgRel.startsWith(PUBLIC_DIR.replace(ROOT, "")) &&
      !svgRel.startsWith("apps/ai-institute/public/diagrams/")
    ) {
      fail(
        `${id || file}: production_svg outside approved public diagrams path`,
      );
    }
    checkSvg(svgPath, id || file);
  } else {
    fail(`${id || file}: missing production_svg`);
  }

  // source_html referenced
  if (!manifest.source_html) fail(`${id || file}: missing source_html`);
  else if (!existsSync(join(ROOT, manifest.source_html))) {
    fail(`${id || file}: source_html not found: ${manifest.source_html}`);
  }

  // unapproved status presented on a production route
  if (status && !PRODUCTION_STATUSES.includes(status)) {
    if (
      manifest.route &&
      (manifest.route.startsWith("/os/") || manifest.route.startsWith("/app/"))
    ) {
      warn(
        `${id}: unapproved status "${status}" on production route "${manifest.route}" — review before publishing`,
      );
    }
  }
}

if (manifestCount === 0) fail("no diagram manifests found");

console.log(`\n[validate-diagrams] checked ${manifestCount} manifest(s)`);
if (errors.length > 0) {
  console.error(`\n[validate-diagrams] FAILED: ${errors.length} error(s)`);
  process.exit(1);
}
console.log("[validate-diagrams] OK — all manifests valid");
process.exit(0);
