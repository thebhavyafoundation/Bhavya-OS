#!/usr/bin/env node
/**
 * Bhavya OS — Ponytail Pre-Push Review Gate
 *
 * Deterministic local pre-push validation layer. Runs before any push to GitHub.
 * It does NOT invoke an interactive agent (the OpenCode/Ponytail review layer is
 * manual, performed by the agent before push). It runs only deterministic checks
 * and verifies that a local review record exists and is valid for the tree being
 * pushed.
 *
 * Two layers:
 *   1. OpenCode/Ponytail review layer (manual, agent-run before push)
 *   2. This deterministic local validation layer (this script, via .husky/pre-push)
 *
 * Review record location (local-only, never committed):
 *   .git/ponytail/reviews/<tree-id>.md
 *
 * Emergency bypass (never the default, always logged):
 *   BHAVYA_ALLOW_UNREVIEWED_PUSH=1
 *
 * Usage:
 *   node scripts/pre-push-gate.mjs            # run the gate (called by .husky/pre-push)
 *
 * Exit: 0 = push allowed, 1 = push blocked.
 */

import { execFileSync, execSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const ROOT = join(import.meta.dirname, "..");
const GIT_DIR = join(ROOT, ".git");
const REVIEW_DIR = join(GIT_DIR, "ponytail", "reviews");
const BYPASS_ENV = "BHAVYA_ALLOW_UNREVIEWED_PUSH";
const REVIEW_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const LOG_PREFIX = "[ponytail-pre-push]";

// Paths that require ultra review when changed.
const SECURITY_SENSITIVE_PREFIXES = [
  "packages/auth/",
  "packages/database/",
  "packages/providers/src/storage.ts",
  ".github/workflows/opennext-build-verify.yml",
  ".github/workflows/deploy-cloudflare.yml",
  ".github/workflows/deploy.yml",
];

// Security-sensitive substrings (path-agnostic fallback).
const SECURITY_SUBSTRINGS = [
  "supabase", "rls", "signedurl", "getsignedurl", "b2.", "backblaze",
  "turso", "opennext", "deploy", "payment", "stripe", "webgl",
  "safeguard",
];

let failures = 0;

function log(...args) {
  process.stdout.write(LOG_PREFIX + " " + args.join(" ") + "\n");
}

function error(...args) {
  process.stderr.write(LOG_PREFIX + " ERROR: " + args.join(" ") + "\n");
  failures += 1;
}

function warn(...args) {
  process.stdout.write(LOG_PREFIX + " WARNING: " + args.join(" ") + "\n");
}

// Run a shell command; return stdout or null on failure.
function tryRun(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    return null;
  }
}

// Deterministic checks --------------------------------------------------------

function wrapperCheck() {
  log("running: pnpm wrapper:check");
  const out = tryRun("pnpm wrapper:check");
  if (out === null) {
    error("pnpm wrapper:check failed");
    return false;
  }
  if (!/RESULT: PASS/.test(out)) {
    error("pnpm wrapper:check did not report PASS");
    return false;
  }
  return true;
}

function platformContract() {
  log("running: pnpm platform:check");
  const out = tryRun("pnpm platform:check");
  if (out === null) {
    error("pnpm platform:check failed");
    return false;
  }
  return true;
}

function secretScan(changedFiles) {
  log("running: secret scan (changed files)");
  const secretRe = /(sk_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|password\s*[:=]\s*["'][^"']{6,}["']|secret\s*[:=]\s*["'][^"']{6,}["']|api[_-]?key\s*[:=]\s*["'][^"']{8,}["'])/gi;
  let hits = 0;
  for (const f of changedFiles) {
    const abs = join(ROOT, f);
    if (!existsSync(abs)) continue;
    try {
      const content = readFileSync(abs, "utf8");
      for (const m of content.matchAll(secretRe)) {
        const line = (content.split("\n")[m.index] || "");
        if (/no (?:paid|secret|credential)|never (?:store|commit|send)|prohibited|review-only/i.test(line)) continue;
        log("  possible secret in " + f);
        hits += 1;
      }
    } catch (e) {
      // skip unreadable/binary files
    }
  }
  if (hits > 0) {
    error("secret scan found " + hits + " possible secret(s)");
    return false;
  }
  return true;
}

function changedFilesInPushRange() {
  // Determine the range of commits being pushed. Prefer the merge base with
  // origin/master; fall back to the parent commit when no upstream exists
  // (e.g. when run manually outside a real push).
  let range = null;
  const base = tryRun("git merge-base origin/master HEAD");
  if (base) {
    range = base.trim() + "..HEAD";
  } else {
    const parent = tryRun("git rev-parse --verify HEAD~1");
    if (parent) range = parent.trim() + "..HEAD";
    else range = "HEAD";
  }
  const out = tryRun(`git diff --name-only ${range}`);
  if (out === null) return [];
  return out.split("\n").filter(Boolean);
}

function isSecuritySensitive(path) {
  const lower = path.toLowerCase();
  for (const s of SECURITY_SUBSTRINGS) {
    if (lower.includes(s)) return true;
  }
  for (const prefix of SECURITY_SENSITIVE_PREFIXES) {
    if (path.toLowerCase().startsWith(prefix.toLowerCase())) return true;
  }
  return false;
}

function typecheckLintTest(securitySensitive) {
  const changed = changedFilesInPushRange();
  const hasAppCode = changed.some((f) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f));
  if (!hasAppCode && !securitySensitive) {
    log("skipping typecheck/lint/test: no application code changed (documentation/skill-only change)");
    return true;
  }
  log("running relevant typecheck/lint/test");
  const tc = tryRun("pnpm typecheck");
  if (tc === null) {
    error("pnpm typecheck failed");
    return false;
  }
  const lt = tryRun("pnpm lint");
  if (lt === null) {
    error("pnpm lint failed");
    return false;
  }
  const t = tryRun("pnpm test");
  if (t === null) {
    error("pnpm test failed");
    return false;
  }
  return true;
}

// Review record ---------------------------------------------------------------

function treeIdOfPush() {
  const headTree = tryRun("git show -s --format=%T HEAD");
  if (!headTree) return null;
  return headTree.trim();
}

function reviewRecordPath(treeId) {
  return join(REVIEW_DIR, treeId + ".md");
}

function parseReviewRecord(content) {
  const text = String(content).replace(/^\uFEFF/, "");
  const sections = {};
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      current = h[1].trim().toLowerCase();
      sections[current] = sections[current] || {};
      continue;
    }
    const kv = line.match(/^-\s+([^:]+):\s*(.*)$/);
    if (kv && current) {
      sections[current][kv[1].trim().toLowerCase()] = kv[2].trim().replace(/\r$/, "");
    }
  }
  return sections;
}

function reviewRecordValid(treeId, securitySensitive) {
  const path = reviewRecordPath(treeId);
  if (!existsSync(path)) {
    error("no review record for tree " + treeId + " at " + path);
    return false;
  }
  const stat = statSync(path);
  const age = Date.now() - stat.mtimeMs;
  if (age > REVIEW_WINDOW_MS) {
    error("review record is older than the 24-hour review window");
    return false;
  }
  const content = readFileSync(path, "utf8");
  const sections = parseReviewRecord(content);

  const mode = sections["review mode"] && sections["review mode"].value;
  if (!mode) {
    error("review record does not declare a review mode");
    return false;
  }
  if (securitySensitive && mode.toLowerCase() !== "ultra") {
    error("security-sensitive change requires ultra review mode, got: " + mode);
    return false;
  }
  const status = sections["final review status"] && sections["final review status"].value;
  if (!status || !/pass/i.test(status)) {
    error("review record final status is not 'pass'");
    return false;
  }
  const findings = sections["findings"] && sections["findings"].value;
  if (findings && /unresolved|block/i.test(findings)) {
    error("review record reports unresolved blocking finding(s)");
    return false;
  }
  log("review record valid: mode=" + mode + ", status=" + status + (securitySensitive ? ", security-sensitive=ultra" : ""));
  return true;
}

// Main ------------------------------------------------------------------------

function main() {
  const bypass = process.env[BYPASS_ENV] === "1";
  if (bypass) {
    warn("unreviewed push bypass enabled");
    log("bypass: review record check skipped; deterministic checks still run");
  }

  log("Ponytail pre-push gate — upstream " + "09c434ab73ca43761c5d8b0c5d341926c2fba710");

  let checksOk = true;
  checksOk = wrapperCheck() && checksOk;
  checksOk = platformContract() && checksOk;

  const changed = changedFilesInPushRange();
  const securitySensitive = changed.some(isSecuritySensitive);
  if (securitySensitive) {
    log("security-sensitive paths detected: " + changed.filter(isSecuritySensitive).join(", "));
  }

  checksOk = secretScan(changed) && checksOk;
  checksOk = typecheckLintTest(securitySensitive) && checksOk;

  let recordOk = true;
  if (bypass) {
    warn("review record check skipped due to bypass");
    recordOk = true;
  } else {
    const treeId = treeIdOfPush();
    if (!treeId) {
      error("could not determine tree id for push");
      recordOk = false;
    } else {
      recordOk = reviewRecordValid(treeId, securitySensitive);
    }
  }

  if (!checksOk) {
    error("deterministic checks failed; push blocked");
    process.exit(1);
  }
  if (!recordOk) {
    error("review record invalid or missing; push blocked");
    process.exit(1);
  }

  log("all checks passed; push allowed");
  process.exit(0);
}

main();
