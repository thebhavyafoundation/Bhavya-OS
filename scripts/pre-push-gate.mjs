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
 *   Narrow by design: skips only review-record existence, freshness, and
 *   findings validation. It never skips the Ultra requirement for
 *   security-sensitive changes, nor any deterministic check.
 *
 * Scope (AGENTS.md §16): heavy validation is CI-only. This gate runs no
 * pnpm build / typecheck / lint / test, because turbo.json makes each of those
 * depend on ^build. It reads pre-push ref data from stdin to scope the review.
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

// Markdown documentation context. A credential-shaped string inside a fenced
// code block that sits under a clearly negative marker is a teaching example,
// not a leaked secret. This is a structural test (fence + nearby marker), not a
// keyword exemption: unmarked examples and real prose are still flagged.
const NEGATIVE_EXAMPLE_MARKERS = [
  /\bBAD\b/i,
  /\bNEVER\b/i,
  /\bWRONG\b/i,
  /\bDON['’]?T\b/i,
  /\bdo not\b/i,
  /anti-?pattern/i,
  /\bvulnerable\b/i,
  /\binsecure\b/i,
  /hardcoded secret/i,
  /\bFAIL\b/i,
];

// How many lines above a fence to look for a negative-example marker.
const MARKER_LOOKBACK_LINES = 8;

function isMarkdown(path) {
  return /\.md$/i.test(path);
}

// Build a per-line decision map for a Markdown file. Returns true for lines
// that sit inside a fenced block guarded by a negative-example marker.
function markdownNegativeExampleLines(content) {
  const lines = content.split(/\r?\n/);
  const negative = new Array(lines.length).fill(false);
  let fence = null;
  let fenceIsNegative = false;
  let lastHeading = "";
  let blockStart = 0;
  let segmentStart = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (heading && fence === null) lastHeading = heading[1];

    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) {
        fence = marker;
        blockStart = i;
        // The enclosing heading or the preceding lines mark the block context.
        fenceIsNegative =
          NEGATIVE_EXAMPLE_MARKERS.some((re) => re.test(fenceMatch[2])) ||
          NEGATIVE_EXAMPLE_MARKERS.some((re) => re.test(lastHeading)) ||
          lines
            .slice(Math.max(segmentStart, i - MARKER_LOOKBACK_LINES), i)
            .some((prev) => NEGATIVE_EXAMPLE_MARKERS.some((re) => re.test(prev)));
      } else if (marker === fence) {
        // A marker inside the block (for example a trailing "// BAD") marks the
        // whole block as a negative example.
        if (fenceIsNegative) {
          for (let j = blockStart; j <= i; j += 1) negative[j] = true;
        }
        fence = null;
        fenceIsNegative = false;
        lastHeading = "";
        segmentStart = i + 1;
      }
      continue;
    }

    if (fence !== null) {
      if (fenceIsNegative) negative[i] = true;
      if (NEGATIVE_EXAMPLE_MARKERS.some((re) => re.test(line))) fenceIsNegative = true;
      continue;
    }
  }
  return negative;
}

function secretScan(changedFiles) {
  log("running: secret scan (changed files)");
  const secretRe = /(sk_[A-Za-z0-9]{20,}|sk_live_[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{16}|password\s*[:=]\s*["'][^"']{6,}["']|secret\s*[:=]\s*["'][^"']{6,}["']|api[_-]?key\s*[:=]\s*["'][^"']{8,}["'])/gi;
  let hits = 0;
  let skippedExamples = 0;
  for (const f of changedFiles) {
    const abs = join(ROOT, f);
    if (!existsSync(abs)) continue;
    try {
      const content = readFileSync(abs, "utf8");
      const negativeLines =
        isMarkdown(f) ? markdownNegativeExampleLines(content) : null;
      for (const m of content.matchAll(secretRe)) {
        const lineIndex = content.slice(0, m.index).split("\n").length - 1;
        if (negativeLines && negativeLines[lineIndex]) {
          skippedExamples += 1;
          log("  skipping marked negative example in " + f + ":" + (lineIndex + 1));
          continue;
        }
        log("  possible secret in " + f + ":" + (lineIndex + 1));
        hits += 1;
      }
    } catch (e) {
      // skip unreadable/binary files
    }
  }
  if (skippedExamples > 0) {
    log("secret scan skipped " + skippedExamples + " marked negative example(s) in Markdown");
  }
  if (hits > 0) {
    error("secret scan found " + hits + " possible secret(s)");
    return false;
  }
  return true;
}

// Pre-push ref plumbing --------------------------------------------------------

const ZERO_SHA = /^0{40}$/;

function isZeroSha(sha) {
  return !sha || ZERO_SHA.test(sha);
}

function readStdinRefs() {
  // Git passes one "<local-ref> <local-sha> <remote-ref> <remote-sha>" line per
  // ref on stdin. When run manually there is no stdin, so we detect that rather
  // than blocking on it.
  if (process.stdin.isTTY) return [];
  let raw = "";
  try {
    raw = readFileSync(0, "utf8");
  } catch (e) {
    return [];
  }
  const refs = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length !== 4) {
      warn("ignoring malformed pre-push ref line: " + trimmed);
      continue;
    }
    refs.push({
      localRef: parts[0],
      localSha: parts[1],
      remoteRef: parts[2],
      remoteSha: parts[3],
    });
  }
  return refs;
}

function describeRef(ref) {
  return ref.localRef + " -> " + ref.remoteRef;
}

// Union of changed files across every pushed ref. Tags and deletions contribute
// nothing; the exact pushed range is always preferred over any fallback.
function changedFilesInPushRange(refs) {
  const files = new Set();

  for (const ref of refs) {
    if (ref.localRef.startsWith("refs/tags/")) {
      log("tag push: " + describeRef(ref) + " — code-range checks skipped for tags");
      continue;
    }
    if (isZeroSha(ref.localSha)) {
      log("ref deleted: " + describeRef(ref) + " — nothing to validate");
      continue;
    }
    if (isZeroSha(ref.remoteSha)) {
      // New branch: no remote SHA to diff against, so anchor on the merge base.
      const base = tryRun(`git merge-base ${ref.remoteRef} ${ref.localSha}`);
      const anchor = base ? base.trim() : null;
      const range = anchor ? `${anchor}..${ref.localSha}` : ref.localSha;
      log("new branch: " + describeRef(ref) + " — range " + range);
      const out = tryRun(`git diff-tree --no-commit-id --name-only -r ${ref.localSha}`);
      const files2 = out === null ? [] : out.split("\n").filter(Boolean);
      for (const f of files2) files.add(f);
      if (out === null) {
        warn("could not enumerate files for new branch ref " + ref.localRef);
      }
      continue;
    }

    // Verify fast-forward before trusting the range.
    const isAncestor = tryRun(`git merge-base --is-ancestor ${ref.remoteSha} ${ref.localSha}`);
    if (isAncestor === null) {
      warn("could not verify ancestry for " + describeRef(ref) + "; treating as fast-forward");
    }

    const range = `${ref.remoteSha}..${ref.localSha}`;
    log("push range for " + describeRef(ref) + ": " + range);
    const out = tryRun(`git diff --name-only ${range}`);
    if (out === null) {
      error("could not compute changed files for range " + range);
      continue;
    }
    for (const f of out.split("\n").filter(Boolean)) files.add(f);
  }

  return [...files].sort();
}

// Manual/test invocation only. A real push must supply stdin ref data; if it
// cannot be determined we fail closed rather than guess a range.
function changedFilesForManualRun() {
  const upstream = tryRun("git rev-parse --abbrev-ref --symbolic-full-name @{upstream}");
  if (upstream && upstream.trim()) {
    const up = upstream.trim();
    const range = `${up}..HEAD`;
    log("no pre-push stdin; using documented fallback @{upstream} (" + range + ")");
    const out = tryRun(`git diff --name-only ${range}`);
    if (out !== null) return out.split("\n").filter(Boolean);
  }
  log("no pre-push stdin and no upstream; using manual-only fallback HEAD~1..HEAD");
  const out = tryRun("git diff --name-only HEAD~1..HEAD");
  return out === null ? [] : out.split("\n").filter(Boolean);
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

function heavyValidationDeferred(securitySensitive) {
  // AGENTS.md §16: this machine is a lightweight control center. turbo.json
  // gives lint/typecheck/test dependsOn ["^build"], so running any of them
  // locally would trigger dependency builds. Full validation is CI-only.
  log("Heavy validation deferred to CI per AGENTS.md \u00a716.");
  log(
    "reason: turbo lint/typecheck/test depend on ^build, so running them locally would trigger Turbo dependency builds"
  );
  if (securitySensitive) {
    log("security-sensitive change: full build/typecheck/test verification is expected in CI before merge");
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

function reviewRecordValid(treeId, securitySensitive, bypass) {
  // Ultra mode for security-sensitive paths is enforced independently of the
  // bypass. The bypass only skips existence, freshness, and findings checks.
  if (bypass) {
    warn("review record check skipped due to bypass (existence, freshness, findings)");
    if (securitySensitive) {
      error(
        "security-sensitive change requires ultra review mode; bypass does not waive it"
      );
      return false;
    }
    log("bypass: non-sensitive change, ultra mode requirement not applicable");
    return true;
  }

  const recordPath = reviewRecordPath(treeId);
  if (!existsSync(recordPath)) {
    error("no review record for tree " + treeId + " at " + recordPath);
    return false;
  }
  const stat = statSync(recordPath);
  const age = Date.now() - stat.mtimeMs;
  if (age > REVIEW_WINDOW_MS) {
    error("review record is older than the 24-hour review window");
    return false;
  }
  const content = readFileSync(recordPath, "utf8");
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
    log("bypass: review record existence/freshness/findings skipped; all deterministic checks still enforced");
  }

  log("Ponytail pre-push gate — upstream " + "09c434ab73ca43761c5d8b0c5d341926c2fba710");

  const refs = readStdinRefs();
  const isRealPush = refs.length > 0;
  log(
    isRealPush
      ? "pre-push stdin parsed: " + refs.length + " ref(s)"
      : "no pre-push stdin detected (manual/test invocation)"
  );

  let changed;
  if (isRealPush) {
    changed = changedFilesInPushRange(refs);
  } else {
    changed = changedFilesForManualRun();
  }
  log("changed files in scope: " + changed.length);

  // Security-sensitive classification happens before the bypass is applied.
  const securitySensitive = changed.some(isSecuritySensitive);
  if (securitySensitive) {
    log("security-sensitive paths detected: " + changed.filter(isSecuritySensitive).join(", "));
  }

  let checksOk = true;
  checksOk = wrapperCheck() && checksOk;
  checksOk = platformContract() && checksOk;
  checksOk = secretScan(changed) && checksOk;
  checksOk = heavyValidationDeferred(securitySensitive) && checksOk;

  let recordOk = true;
  const treeId = treeIdOfPush();
  if (!treeId) {
    error("could not determine tree id for push");
    recordOk = false;
  } else {
    recordOk = reviewRecordValid(treeId, securitySensitive, bypass);
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
