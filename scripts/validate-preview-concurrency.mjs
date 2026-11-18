#!/usr/bin/env node
/**
 * validate-preview-concurrency.mjs
 *
 * Static validation that every GitHub Actions workflow capable of deploying
 * to the canonical preview worker (bhavya-foundation-preview) uses the same
 * shared concurrency group, so that deployments from different PRs are
 * serialized and cannot overwrite each other on the shared worker.
 *
 * A per-PR concurrency group (e.g. opennext-preview-<pr-number>) is
 * insufficient: each PR gets its own group, so concurrent PR deployments can
 * race on the shared preview worker.
 *
 * Usage:
 *   node scripts/validate-preview-concurrency.mjs
 *
 * Exits 0 when all preview-deploy workflows use the shared group
 * (opennext-preview-shared-worker) with cancel-in-progress: false.
 * Exits 1 otherwise.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const WORKFLOWS_DIR = join(process.cwd(), ".github/workflows");
const EXPECTED_GROUP = "opennext-preview-shared-worker";

function readText(path) {
  return readFileSync(path, "utf-8");
}

/**
 * Determine whether a workflow file deploys to the preview worker.
 * A workflow deploys to preview if it references wrangler.preview.json or
 * the bhavya-foundation-preview worker name in a deploy/run step.
 */
function deploysToPreview(text) {
  return /wrangler\.preview\.json|bhavya-foundation-preview/.test(text);
}

/**
 * Extract the concurrency group from workflow text.
 * Reads the concurrency block line by line, tolerating comment lines
 * between "concurrency:" and the "group:"/"cancel-in-progress:" keys.
 */
function extractConcurrency(text) {
  const lines = text.split("\n");
  let inConcurrency = false;
  let group = null;
  let cancelInProgress = null;

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Detect the start of a top-level concurrency key (no leading whitespace).
    if (/^concurrency:(\s|$)/.test(line)) {
      inConcurrency = true;
      continue;
    }

    // Stop at the next top-level key (a non-blank, non-comment line at column 0).
    if (inConcurrency && /^[A-Za-z]/.test(line) && !/^\s/.test(raw)) {
      break;
    }

    if (!inConcurrency) continue;

    // Skip blank lines and comments.
    if (!line || line.startsWith("#")) continue;

    const groupMatch = line.match(/^(\s+)group:\s*([^\s#]+)/);
    if (groupMatch) {
      group = groupMatch[2].trim();
      continue;
    }

    const cancelMatch = line.match(/^(\s+)cancel-in-progress:\s*(true|false)/);
    if (cancelMatch) {
      cancelInProgress = cancelMatch[2].trim();
      continue;
    }
  }

  return { group, cancelInProgress };
}

function main() {
  if (!existsSync(WORKFLOWS_DIR)) {
    console.error("FAIL: .github/workflows directory not found");
    process.exit(1);
  }

  const files = readdirSync(WORKFLOWS_DIR).filter(
    (f) => f.endsWith(".yml") || f.endsWith(".yaml"),
  );

  const previewWorkflows = [];
  for (const file of files) {
    const path = join(WORKFLOWS_DIR, file);
    const text = readText(path);
    if (!deploysToPreview(text)) continue;
    previewWorkflows.push({ file, text });
  }

  if (previewWorkflows.length === 0) {
    console.error("FAIL: No workflows found that deploy to bhavya-foundation-preview");
    process.exit(1);
  }

  let failed = false;

  for (const w of previewWorkflows) {
    const { group, cancelInProgress } = extractConcurrency(w.text);
    console.log(
      `${w.file}: concurrency.group=${group ?? "MISSING"} cancel-in-progress=${cancelInProgress ?? "MISSING"}`,
    );

    if (group !== EXPECTED_GROUP) {
      console.error(
        `  FAIL: concurrency group is "${group ?? "MISSING"}", expected "${EXPECTED_GROUP}"`,
      );
      failed = true;
    }
    if (cancelInProgress !== "false") {
      console.error(
        `  FAIL: cancel-in-progress is "${cancelInProgress ?? "MISSING"}", expected "false" (must not interrupt an in-progress deployment of the shared worker)`,
      );
      failed = true;
    }
  }

  if (failed) {
    console.error(
      "\nFAIL: Not all preview-deploy workflows use the shared concurrency group.",
    );
    process.exit(1);
  }

  console.log(
    `\nPASS: ${previewWorkflows.length} preview-deploy workflow(s) all use shared concurrency group "${EXPECTED_GROUP}" with cancel-in-progress: false.`,
  );
}

main();
