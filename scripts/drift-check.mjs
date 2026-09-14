#!/usr/bin/env node
/**
 * REASONS Canvas Drift Checker — Deterministic validation for design contracts.
 *
 * Validates specs/*-reasons-canvas.md files:
 *   D-S1: Required frontmatter fields (type, status, owner, date, task-id)
 *   D-S2: Valid status value (draft, in-progress, implemented)
 *   D-S3: Required REASONS sections (R, E, A, S, O, N, S)
 *   D-S4: Referenced file paths exist in repository
 *   D-S5: Structure section file paths exist
 *
 * Run: node scripts/drift-check.mjs [--fix] [--verbose]
 *   --fix: auto-update status to 'draft' if invalid
 *   --verbose: show all checked items
 *
 * Exit code: 0 = all pass, 1 = failures found.
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join, relative } from "path";

const ROOT = join(import.meta.dirname, "..");
const SPECS_DIR = join(ROOT, "specs");

const VALID_STATUSES = new Set(["draft", "in-progress", "implemented"]);
const REQUIRED_FRONTMATTER = ["type", "status", "owner", "date", "task-id"];
const REQUIRED_SECTIONS = [
  { pattern: /^## R\s+[-—]\s+Requirements/m, label: "## R - Requirements" },
  { pattern: /^## E\s+[-—]\s+Entities/m, label: "## E - Entities" },
  { pattern: /^## A\s+[-—]\s+Approach/m, label: "## A - Approach" },
  { pattern: /^## S\s+[-—]\s+Structure/m, label: "## S - Structure" },
  { pattern: /^## O\s+[-—]\s+Operations/m, label: "## O - Operations" },
  { pattern: /^## N\s+[-—]\s+Norms/m, label: "## N - Norms" },
  { pattern: /^## S\s+[-—]\s+Safeguards/m, label: "## S - Safeguards" },
];
const TASK_ID_PATTERN = /^TASK-\d+$/;

const isVerbose = process.argv.includes("--verbose");
const isFix = process.argv.includes("--fix");

// ── Helpers ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let warned = 0;

function pass(msg) {
  passed++;
  if (isVerbose) console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  failed++;
  console.log(`  ✗ ${msg}`);
}

function warn(msg) {
  warned++;
  console.log(`  ⚠ ${msg}`);
}

function findCanvasFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findCanvasFiles(fullPath));
    } else if (
      entry.name.endsWith(".md") &&
      entry.name.includes("reasons-canvas")
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)/);
    if (kv) fm[kv[1].trim()] = kv[2].trim();
  }
  return fm;
}

function extractFilePaths(content) {
  const paths = new Set();
  // Match backtick-quoted paths (e.g., `apps/ai-institute/src/lib/runtime-init.ts`)
  const pathRegex = /`([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)`/g;
  let match;
  while ((match = pathRegex.exec(content)) !== null) {
    paths.add(match[1]);
  }
  // Match file layout paths (indented lines with tree characters)
  const layoutRegex = /(?:├|└|│)\s+([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/g;
  while ((match = layoutRegex.exec(content)) !== null) {
    paths.add(match[1]);
  }
  // Match Location fields in Operations sections (e.g., **Location:** `path/to/file`)
  const locationRegex = /\*\*Location:\*\*\s*`([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)`/g;
  while ((match = locationRegex.exec(content)) !== null) {
    paths.add(match[1]);
  }
  return [...paths];
}

function extractStructurePaths(content) {
  const paths = new Set();
  // Find the Structure section (between ## S — Structure and the next ##)
  const structureMatch = content.match(/## S\s+[-—]\s+Structure\n([\s\S]*?)(?=\n## [A-Z]\s+[-—]|\n## Verification|\n---|\n$)/);
  if (!structureMatch) return [...paths];
  const structureContent = structureMatch[1];
  // Extract paths from backticks in Structure section
  const pathRegex = /`([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)`/g;
  let match;
  while ((match = pathRegex.exec(structureContent)) !== null) {
    paths.add(match[1]);
  }
  // Extract paths from tree layout
  const layoutRegex = /(?:├|└|│)\s+([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/g;
  while ((match = layoutRegex.exec(structureContent)) !== null) {
    paths.add(match[1]);
  }
  return [...paths];
}

// ── Main ─────────────────────────────────────────────────────────────────

console.log("=== REASONS Canvas Drift Checker ===\n");

const canvasFiles = findCanvasFiles(SPECS_DIR);

if (canvasFiles.length === 0) {
  console.log("No REASONS Canvas files found in specs/");
  console.log("PASS (no canvases to check)");
  process.exit(0);
}

console.log(`Found ${canvasFiles.length} canvas file(s)\n`);

for (const file of canvasFiles) {
  const relPath = relative(ROOT, file);
  console.log(`--- ${relPath} ---`);

  const content = readFileSync(file, "utf-8");

  // D-S1: Frontmatter
  const fm = parseFrontmatter(content);
  if (!fm) {
    fail("D-S1: Missing or invalid frontmatter — fix: add YAML frontmatter with type, status, owner, date, task-id");
  } else {
    let fmPass = true;
    for (const field of REQUIRED_FRONTMATTER) {
      if (!fm[field]) {
        fail(`D-S1: Missing frontmatter field: ${field} — fix: add '${field}: {value}' to frontmatter`);
        fmPass = false;
      }
    }
    if (fmPass) pass("D-S1: All required frontmatter fields present");
    if (fm.type && fm.type !== "reasons-canvas") {
      warn(`D-S1: Type '${fm.type}' is not 'reasons-canvas' — fix: change to 'type: reasons-canvas'`);
    }

    // D-S2: Valid status
    if (fm.status && !VALID_STATUSES.has(fm.status)) {
      fail(`D-S2: Invalid status '${fm.status}' — fix: change to draft, in-progress, or implemented`);
    } else if (fm.status) {
      pass(`D-S2: Status '${fm.status}' is valid`);
    }

    // D-S6: Task-id format
    if (fm["task-id"] && !TASK_ID_PATTERN.test(fm["task-id"])) {
      fail(`D-S6: Invalid task-id format '${fm["task-id"]}' — fix: use TASK-NNN format (e.g., TASK-001)`);
    } else if (fm["task-id"]) {
      pass(`D-S6: Task-id '${fm["task-id"]}' format is valid`);
    }

    // D-S7: Filename convention (task-id matches filename)
    if (fm["task-id"]) {
      const filename = file.split(/[\\/]/).pop();
      const taskNum = fm["task-id"].replace("TASK-", "");
      if (!filename.includes(taskNum)) {
        warn(`D-S7: Task-id '${fm["task-id"]}' does not match filename '${filename}' — fix: rename to match or update task-id`);
      } else {
        pass(`D-S7: Task-id matches filename`);
      }
    }
  }

  // D-S3: Required sections
  let sectionsPass = true;
  for (const { pattern, label } of REQUIRED_SECTIONS) {
    if (!pattern.test(content)) {
      fail(`D-S3: Missing section: ${label} — fix: add the section with em-dash header (## X — Name)`);
      sectionsPass = false;
    }
  }
  if (sectionsPass) pass("D-S3: All 7 REASONS sections present");

  // D-S4: Referenced file paths
  const paths = extractFilePaths(content);
  let pathsPass = true;
  for (const p of paths) {
    // Skip template placeholders and interface definitions
    if (p.includes("{") || p.includes("Interface") || p.includes("ReturnType")) continue;
    const fullPath = join(ROOT, p);
    if (!existsSync(fullPath)) {
      // Distinguish lifecycle: draft = warn, implemented = stricter
      if (fm && fm.status === "implemented") {
        fail(`D-S4: Referenced path does not exist: ${p} — fix: create the file or update the canvas`);
      } else {
        warn(`D-S4: Referenced path does not exist: ${p} (draft canvas — will become error if implemented)`);
      }
      pathsPass = false;
    } else {
      pass(`D-S4: Path exists: ${p}`);
    }
  }
  if (pathsPass && paths.length > 0) pass("D-S4: All referenced paths exist");
  if (paths.length === 0) pass("D-S4: No file paths to check");

  // D-S5: Structure section file paths
  const structurePaths = extractStructurePaths(content);
  let structurePass = true;
  for (const p of structurePaths) {
    if (p.includes("{")) continue;
    const fullPath = join(ROOT, p);
    if (!existsSync(fullPath)) {
      if (fm && fm.status === "implemented") {
        fail(`D-S5: Structure path does not exist: ${p} — fix: create the file or update the canvas Structure section`);
      } else {
        warn(`D-S5: Structure path does not exist: ${p} (draft canvas — will become error if implemented)`);
      }
      structurePass = false;
    } else {
      pass(`D-S5: Structure path exists: ${p}`);
    }
  }
  if (structurePass && structurePaths.length > 0) pass("D-S5: All Structure section paths exist");
  if (structurePaths.length === 0) pass("D-S5: No Structure paths to check");

  console.log("");
}

// ── Summary ──────────────────────────────────────────────────────────────

console.log("=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Warned: ${warned}`);

if (failed > 0) {
  console.log("\nRESULT: FAIL");
  process.exit(1);
} else {
  console.log("\nRESULT: PASS");
  process.exit(0);
}
