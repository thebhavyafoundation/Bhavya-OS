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
 * Exits 0 when all certain preview-deploy workflows use the shared group
 * (opennext-preview-shared-worker) with cancel-in-progress: false, and no
 * possible preview-deploy workflows require manual review.
 * Exits 1 otherwise.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const WORKFLOWS_DIR = process.env.WORKFLOWS_DIR ?? join(process.cwd(), ".github/workflows");
const EXPECTED_GROUP = "opennext-preview-shared-worker";

function readText(path) {
  return readFileSync(path, "utf-8");
}

/**
 * Classify a workflow's preview-deploy risk.
 * Returns { certain, possible } booleans.
 *
 * Certain: references wrangler.preview.json or bhavya-foundation-preview.
 * Possible: runs `wrangler deploy` / `opennextjs-cloudflare deploy` as an
 *   actual `run:` step with an explicit preview config (`--config
 *   wrangler.preview.json` or `--env preview`) but without the shared
 *   concurrency group — flagged for manual review.
 *   Comments and explanatory text are ignored.
 *   A deploy command without any preview config defaults to production
 *   wrangler.json (bhavya-foundation), so it is NOT flagged.
 */
function classifyPreviewDeploy(text) {
  const certain = /wrangler\.preview\.json|bhavya-foundation-preview/.test(text);
  if (certain) {
    return { certain: true, possible: false };
  }
  // Only match deploy commands in actual `run:` steps (indented lines
  // starting with whitespace + "run:"), ignoring comments and YAML keys.
  const runDeployRe = /^[ \t]+run:[ \t]*.*(wrangler\s+deploy|opennextjs-cloudflare\s+deploy)/m;
  const hasDeployCommand = runDeployRe.test(text);
  if (!hasDeployCommand) {
    return { certain: false, possible: false };
  }
  // Explicitly targets preview via --config or --env.
  const explicitPreviewConfig = /--config\s+\S*preview\.json/.test(text);
  const explicitPreviewEnv = /--env\s+preview/.test(text);
  if (explicitPreviewConfig || explicitPreviewEnv) {
    return { certain: false, possible: true };
  }
  // Deploy command without preview config → defaults to production.
  return { certain: false, possible: false };
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

  const certainWorkflows = [];
  const possibleWorkflows = [];
  for (const file of files) {
    const path = join(WORKFLOWS_DIR, file);
    const text = readText(path);
    const { certain, possible } = classifyPreviewDeploy(text);
    if (certain) {
      certainWorkflows.push({ file, text });
    } else if (possible) {
      possibleWorkflows.push({ file, text });
    }
  }

  if (certainWorkflows.length === 0 && possibleWorkflows.length === 0) {
    console.error("FAIL: No workflows found that deploy to bhavya-foundation-preview");
    process.exit(1);
  }

  let failed = false;

  for (const w of certainWorkflows) {
    const { group, cancelInProgress } = extractConcurrency(w.text);
    console.log(
      `${w.file}: concurrency.group=${group ?? "MISSING"} cancel-in-progress=${cancelInProgress ?? "MISSING"} (certain preview deploy)`,
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

  for (const w of possibleWorkflows) {
    console.log(
      `${w.file}: POSSIBLE preview deploy (deploy command present, config not pinned to production) — manual review required`,
    );
    console.error(
      `  REVIEW: ${w.file} runs a deploy command without an explicit production config; confirm it cannot target bhavya-foundation-preview or add it to the shared concurrency group "${EXPECTED_GROUP}"`,
    );
    failed = true;
  }

  if (failed) {
    console.error(
      "\nFAIL: Not all preview-deploy workflows use the shared concurrency group, or possible preview-deploy workflows require manual review.",
    );
    process.exit(1);
  }

  console.log(
    `\nPASS: ${certainWorkflows.length} certain preview-deploy workflow(s) all use shared concurrency group "${EXPECTED_GROUP}" with cancel-in-progress: false.`,
  );
  if (possibleWorkflows.length > 0) {
    console.log(
      `NOTE: ${possibleWorkflows.length} possible preview-deploy workflow(s) flagged for manual review (see REVIEW messages above).`,
    );
  }
}

main();
