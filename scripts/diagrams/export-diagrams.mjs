#!/usr/bin/env node
/*
 * export-diagrams.mjs — Bhavya diagram export pipeline (MANUAL ONLY).
 *
 * Reads each manifest under content/diagrams/manifests/, extracts the first
 * top-level <svg> from its source_html, and writes a standalone SVG to the
 * manifest's production_svg path under apps/ai-institute/public/diagrams/<group>/.
 *
 * Never run unprompted. Intended for path-filtered CI or a documented local
 * preview command when diagram sources or manifests change. Not part of the
 * ordinary application build.
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  statSync,
  readdirSync,
} from "node:fs";
import { join, dirname } from "node:path";

const ROOT = process.cwd();
const MANIFEST_DIR = join(ROOT, "content", "diagrams", "manifests");
const PUBLIC_DIR = join(ROOT, "apps", "ai-institute", "public", "diagrams");

const errors = [];
let exported = 0;
for (const file of (existsSync(MANIFEST_DIR)
  ? readdirSync(MANIFEST_DIR).filter(
      (f) =>
        f.endsWith(".json") &&
        f !== "manifest.schema.json" &&
        !f.startsWith("_"),
    )
  : []
).sort()) {
  const manifestPath = join(MANIFEST_DIR, file);
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (e) {
    fail(`${file}: invalid JSON (${e.message})`);
    continue;
  }

  const sourceRel = manifest.source_html;
  const targetRel = manifest.production_svg;
  if (!sourceRel || !targetRel) {
    fail(
      `${manifest.diagram_id || file}: missing source_html or production_svg`,
    );
    continue;
  }

  const sourcePath = join(ROOT, sourceRel);
  if (!existsSync(sourcePath)) {
    fail(`${manifest.diagram_id || file}: source_html not found: ${sourceRel}`);
    continue;
  }

  let html;
  try {
    html = readFileSync(sourcePath, "utf8");
  } catch (e) {
    fail(`${manifest.diagram_id || file}: cannot read source (${e.message})`);
    continue;
  }

  // Extract the first top-level <svg ...>...</svg>, skipping comments/scripts/styles.
  const svg = extractFirstSvg(html);
  if (!svg) {
    fail(`${manifest.diagram_id || file}: no <svg> found in source_html`);
    continue;
  }

  const targetPath = join(ROOT, targetRel);
  if (!existsSync(dirname(targetPath))) {
    mkdirSync(dirname(targetPath), { recursive: true });
  }

  try {
    writeFileSync(targetPath, svg);
    exported++;
    const kb = (statSync(targetPath).size / 1024).toFixed(1);
    console.log(
      `[export-diagrams] ${manifest.diagram_id || file} -> ${targetRel} (${kb} KB)`,
    );
  } catch (e) {
    fail(
      `${manifest.diagram_id || file}: cannot write ${targetRel} (${e.message})`,
    );
    continue;
  }
}

console.log(`\n[export-diagrams] exported ${exported} svg(s)`);
if (errors.length > 0) {
  console.error(`\n[export-diagrams] FAILED: ${errors.length} error(s)`);
  process.exit(1);
}
console.log("[export-diagrams] OK");
process.exit(0);

/**
 * Extract the first top-level SVG element from HTML, handling nesting and
 * comments so a nested icon </svg> does not truncate the diagram.
 */
function extractFirstSvg(html) {
  let depth = 0;
  let start = -1;
  let i = 0;
  const len = html.length;
  while (i < len) {
    const ch = html[i];
    if (html.startsWith("<!--", i)) {
      const close = html.indexOf("-->", i + 4);
      if (close === -1) return null;
      i = close + 3;
      continue;
    }
    if (html.startsWith("<script", i) || html.startsWith("<style", i)) {
      const closeTag = html.startsWith("<script", i) ? "</script>" : "</style>";
      const close = html.indexOf(closeTag, i);
      if (close === -1) return null;
      i = close + closeTag.length;
      continue;
    }
    const openMatch = html.slice(i).match(/<svg\b/);
    if (openMatch && (start === -1 || i + openMatch.index === start)) {
      if (depth === 0) start = i + openMatch.index;
      depth++;
      i += openMatch.index + 4;
      continue;
    }
    if (html.startsWith("</svg>", i)) {
      depth--;
      if (depth === 0 && start !== -1) {
        return html.slice(start, i + 6);
      }
      i += 6;
      continue;
    }
    i++;
  }
  return null;
}
