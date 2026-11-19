#!/usr/bin/env node
/*
 * install-design-taste-skill.mjs - restore the pinned design-taste-frontend
 * skill into this repository.
 *
 * WHY A SCRIPT INSTEAD OF A COMMITTED COPY
 * ---------------------------------------
 * Repository policy (scripts/check-skill-wrappers.mjs) states that upstream
 * third-party skill directories must not be committed to this repository. The
 * licence review for this skill is recorded and the wrapper is enabled, but
 * the vendored bytes stay out of Git. That leaves one problem: a fresh
 * checkout of the repository has the wrapper and the provenance record, but
 * not the skill itself.
 *
 * This script closes that gap without touching the commit policy. It:
 *   - fetches exactly one file, from exactly one pinned commit
 *   - runs no upstream script of any kind
 *   - verifies the fetched bytes against a recorded SHA-256 before writing
 *   - writes only inside .opencode/skills/design-taste-frontend/
 *
 * Usage:
 *   node scripts/tools/install-design-taste-skill.mjs            # install
 *   node scripts/tools/install-design-taste-skill.mjs --verify   # check only
 *
 * Exit: 0 = installed or verified, 1 = failure.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const PINNED_COMMIT = "3c7017d636c3a4aad378433ea6d0cfa6c921da4a";
const UPSTREAM_PATH = "skills/taste-skill/SKILL.md";
const RAW_URL = `https://raw.githubusercontent.com/Leonxlnx/taste-skill/${PINNED_COMMIT}/${UPSTREAM_PATH}`;

/**
 * SHA-256 of the upstream file as it is fetched, before normalisation.
 * Recorded from the upstream blob at the pinned commit on 2026-11-12.
 */
const UPSTREAM_SHA256 = "aa194351b246b8b4799099d4ed7b033d29eab6e6e3d58d8d2172978be7b3ec89";

/**
 * SHA-256 of the file after the documented normalisation: line endings
 * normalised to LF, and the single blank line between the YAML frontmatter
 * and the first heading removed (the only difference between the upstream
 * blob and the copy that was originally installed and reviewed).
 */
const NORMALISED_SHA256 = "9ee27ee5c9f3cef91687bfad1ca1e2dbd58c30e4391929f66c8487f7227c34e1";

const ROOT = process.cwd();
const TARGET = join(ROOT, ".opencode", "skills", "design-taste-frontend", "SKILL.md");

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** Normalise to the exact bytes the installed copy is expected to have. */
function normalise(raw) {
  let text = raw.replace(/\r\n/g, "\n");
  // Remove the single blank line directly after the frontmatter block.
  text = text.replace(/^(---\n[\s\S]*?\n---)\n\n/m, "$1\n");
  if (!text.endsWith("\n")) text += "\n";
  return text;
}

async function fetchRaw() {
  const response = await fetch(RAW_URL, {
    headers: { "User-Agent": "bhavya-os-skill-installer" },
  });
  if (!response.ok) {
    throw new Error(`fetch failed: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}

async function main() {
  const verifyOnly = process.argv.includes("--verify");

  let raw;
  try {
    raw = await fetchRaw();
  } catch (error) {
    console.error(`[design-taste] could not fetch the pinned file: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const rawHash = sha256(raw);
  if (rawHash !== UPSTREAM_SHA256) {
    console.error(
      `[design-taste] REFUSING TO INSTALL: upstream hash mismatch.\n` +
        `  expected ${UPSTREAM_SHA256}\n` +
        `  actual   ${rawHash}\n` +
        `  The pinned commit no longer serves the bytes this record was made against.`,
    );
    process.exitCode = 1;
    return;
  }

  const normalised = normalise(raw);
  const normalisedHash = sha256(normalised);
  if (normalisedHash !== NORMALISED_SHA256) {
    console.error(
      `[design-taste] REFUSING TO INSTALL: normalised hash mismatch.\n` +
        `  expected ${NORMALISED_SHA256}\n` +
        `  actual   ${normalisedHash}`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(`[design-taste] upstream hash verified (${PINNED_COMMIT})`);

  if (verifyOnly) {
    if (existsSync(TARGET)) {
      const installed = readFileSync(TARGET, "utf8");
      const installedHash = sha256(installed.replace(/\r\n/g, "\n"));
      if (installedHash === NORMALISED_SHA256) {
        console.log("[design-taste] installed copy matches the pin. OK");
        return;
      }
      console.error("[design-taste] installed copy differs from the pin.");
      process.exitCode = 1;
      return;
    }
    console.error("[design-taste] skill is not installed.");
    process.exitCode = 1;
    return;
  }

  if (!existsSync(dirname(TARGET))) {
    mkdirSync(dirname(TARGET), { recursive: true });
  }
  writeFileSync(TARGET, normalised, "utf8");
  console.log(`[design-taste] installed -> ${TARGET}`);
  console.log(
    "[design-taste] next: node scripts/check-skill-wrappers.mjs   (wrapper gate)",
  );
}

main();
