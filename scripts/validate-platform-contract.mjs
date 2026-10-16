#!/usr/bin/env node
/**
 * Bhavya OS — Platform Contract Validation
 *
 * Enforces the permanent operating contract at CI time so that violations are
 * caught before review rather than after deployment.
 *
 * Authority: AGENTS.md (L0 router) and docs/architecture/PLATFORM-TRUTH.md.
 * This script does not create policy; it mechanically enforces the four rules
 * listed below and prints what it checked.
 *
 * Checks
 *   1. permanent-files     AGENTS.md and docs/architecture/PLATFORM-TRUTH.md exist
 *                          and PLATFORM-TRUTH still states the core invariants.
 *   2. no-cloudflare-r2    Cloudflare R2 is prohibited. Rejects R2 usage tokens.
 *   3. b2-client-boundary  Privileged Backblaze B2 variables must never appear in
 *                          a Client Component ("use client"). Server-only boundary.
 *   4. no-paid-config      Flags new paid-service or payment-method configuration.
 *
 * Scope discipline
 *   These are *configuration* checks, not prose checks. Curriculum lesson text
 *   that teaches students about OpenAI is not Bhavya configuration and is not
 *   flagged. Exclusions are declared explicitly and reported in the output so a
 *   reviewer can see exactly what was skipped and why.
 *
 * Usage:   node scripts/validate-platform-contract.mjs
 * Exit:    0 = all checks passed, 1 = at least one check failed
 */

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PERMANENT_FILES = [
  { path: "AGENTS.md", label: "L0 router" },
  { path: "docs/architecture/PLATFORM-TRUTH.md", label: "platform truth" },
];

/** Invariants that must survive any future edit to PLATFORM-TRUTH.md. */
const TRUTH_INVARIANTS = [
  "Cloudflare/OpenNext is the canonical application deployment",
  "Backblaze B2 stores large production assets",
  "Supabase provides authentication",
  "Turso stores production application data",
  "Vercel is optional and preview-only",
  "Cloudflare R2 is prohibited",
  "Paid APIs and payment-method-required services are prohibited",
  "Production actions require human approval",
];

const SKIP_DIRS = [
  "node_modules",
  ".next",
  ".turbo",
  ".git",
  ".open-next",
  ".playwright-mcp",
  "dist",
  "build",
  "_archive",
  "archive",
];

/**
 * The checker necessarily contains the very tokens it looks for. Without this
 * exclusion it flags its own source and can never pass.
 */
const SELF_PATH = "scripts/validate-platform-contract.mjs";

/**
 * Paths excluded from paid-service scanning, with reasons. These are printed in
 * the run output so the exclusions are visible rather than silent.
 */
const PAID_SCAN_EXCLUSIONS = [
  {
    pattern: /^registry\//,
    reason: "generated model/provider catalog (pnpm registry:generate), not service configuration",
  },
  {
    pattern: /^config\/skills\//,
    reason: "stale, non-authoritative skill index (AGENTS.md §8)",
  },
  { pattern: /^scripts\/_archive\//, reason: "archived scripts" },
  {
    pattern: /(^|\/)src\/data\//,
    reason: "curriculum/assessment content — teaching material, not configuration",
  },
  { pattern: /^content\//, reason: "authored content, not configuration" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function gitFiles() {
  try {
    const out = execFileSync("git", ["ls-files", "-z"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    return out.split("\0").filter(Boolean);
  } catch {
    return [];
  }
}

function isExcludedPath(rel) {
  const norm = rel.replace(/\\/g, "/");
  return SKIP_DIRS.some((d) => norm.includes(`/${d}/`) || norm.startsWith(`${d}/`));
}

function readSafe(rel) {
  try {
    const st = statSync(rel);
    if (!st.isFile() || st.size > 2 * 1024 * 1024) return null;
    return readFileSync(rel, "utf8");
  } catch {
    return null;
  }
}

const results = [];
function record(check, ok, lines) {
  results.push({ check, ok, lines });
  // Print as we go so each check's findings sit under its own heading.
  for (const l of lines) console.log(l);
  console.log(`  => ${ok ? "PASS" : "FAIL"}  ${check}\n`);
}

function section(title) {
  console.log(`\n${title}`);
}

// ---------------------------------------------------------------------------
// Check 1 — permanent files exist and remain authoritative
// ---------------------------------------------------------------------------

function checkPermanentFiles() {
  const lines = [];
  let ok = true;

  for (const f of PERMANENT_FILES) {
    if (!existsSync(f.path)) {
      lines.push(`  MISSING  ${f.path}  (${f.label})`);
      ok = false;
      continue;
    }
    const body = readSafe(f.path);
    if (!body || body.trim().length === 0) {
      lines.push(`  EMPTY    ${f.path}`);
      ok = false;
      continue;
    }
    lines.push(`  ok       ${f.path}  (${f.label}, ${body.trim().split("\n").length} lines)`);
  }

  const truthPath = "docs/architecture/PLATFORM-TRUTH.md";
  if (existsSync(truthPath)) {
    const body = readSafe(truthPath) ?? "";
    const missing = TRUTH_INVARIANTS.filter((i) => !body.includes(i));
    if (missing.length) {
      lines.push(`  TRUTH-DRIFT  ${missing.length} invariant(s) missing:`);
      for (const m of missing) lines.push(`             - ${m}`);
      ok = false;
    } else {
      lines.push(`  ok       all ${TRUTH_INVARIANTS.length} platform invariants present`);
    }
  }

  record("permanent-files", ok, lines);
}

// ---------------------------------------------------------------------------
// Check 2 — Cloudflare R2 is prohibited
// ---------------------------------------------------------------------------

/**
 * Usage tokens only. The literal words "Cloudflare R2 is prohibited" in
 * AGENTS.md / PLATFORM-TRUTH.md must not trip this check, so we match concrete
 * configuration and SDK signatures rather than the word "R2".
 */
const R2_TOKENS = [
  { re: /r2_buckets/, why: "Wrangler R2 binding type" },
  // Matches `type: "r2"`, `"type": "r2"` and `'type': 'r2'` (JSON, YAML, TOML, object literals).
  { re: /["']?type["']?\s*:\s*["']r2["']/i, why: "Wrangler R2 binding" },
  { re: /\bR2_(BUCKET|BUCKET_NAME|ACCESS_KEY_ID|SECRET_ACCESS_KEY|ENDPOINT|ACCOUNT_ID|S3)\b/, why: "R2 environment variable" },
  { re: /\bCLOUDFLARE_R2_[A-Z_]+\b/, why: "R2 environment variable" },
  { re: /\.r2\.dev\b/, why: "R2 public hostname" },
  { re: /r2\.cloudflarestorage\.com/, why: "R2 S3 endpoint" },
  { re: /@cloudflare\/r2/, why: "R2 SDK import" },
];

const NEGATION = /\b(prohibit|prohibited|never|not\b|no\b|must not|do not|reject|forbid|illegal|without)\b/i;

function checkNoR2(files) {
  const lines = [];
  const violations = [];

  for (const rel of files) {
    if (isExcludedPath(rel) || rel.replace(/\\/g, "/") === SELF_PATH) continue;
    const ext = extname(rel).toLowerCase();
    const isDoc = [".md", ".mdx"].includes(ext);
    const isCode = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".jsonc", ".yml", ".yaml", ".toml"].includes(ext);
    if (!isDoc && !isCode) continue;

    const body = readSafe(rel);
    if (!body) continue;

    body.split(/\r?\n/).forEach((line, idx) => {
      for (const t of R2_TOKENS) {
        if (!t.re.test(line)) continue;
        // Prose that documents the prohibition is allowed; usage is not.
        if (isDoc && NEGATION.test(line)) continue;
        violations.push({ file: rel, line: idx + 1, text: line.trim(), why: t.why });
      }
    });
  }

  if (violations.length === 0) {
    lines.push(`  ok  no Cloudflare R2 usage tokens in ${files.length} tracked files`);
  } else {
    for (const v of violations.slice(0, 40)) {
      lines.push(`  R2  ${v.file}:${v.line}  [${v.why}]`);
      lines.push(`      ${v.text.slice(0, 120)}`);
    }
    if (violations.length > 40) lines.push(`      ...and ${violations.length - 40} more`);
  }

  record("no-cloudflare-r2", violations.length === 0, lines);
}

// ---------------------------------------------------------------------------
// Check 3 — privileged B2 variables must not reach Client Components
// ---------------------------------------------------------------------------

/** Privileged: these grant object access. Public: bucket/endpoint/region only. */
const B2_PRIVILEGED = [
  "B2_ACCESS_KEY_ID",
  "B2_SECRET_ACCESS_KEY",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "B2_APPLICATION_KEY",
  "B2_MASTER_KEY",
];

const B2_ANY = /\bB2_[A-Z0-9_]+\b/;

function checkB2ClientBoundary(files) {
  const lines = [];
  const violations = [];
  let clientCount = 0;

  for (const rel of files) {
    if (isExcludedPath(rel)) continue;
    if (![".tsx", ".jsx"].includes(extname(rel).toLowerCase())) continue;

    const body = readSafe(rel);
    if (!body) continue;

    const hasDirective = /^\s*(["'])use client\1\s*;?/m.test(body);
    if (!hasDirective) continue;
    clientCount++;

    body.split(/\r?\n/).forEach((line, idx) => {
      const priv = B2_PRIVILEGED.filter((v) => line.includes(v));
      // NEXT_PUBLIC_ exposure of any B2 variable is also a violation.
      const publicB2 = /NEXT_PUBLIC_[A-Z0-9_]*B2[A-Z0-9_]*/.test(line);
      if (priv.length === 0 && !publicB2) return;
      violations.push({ file: rel, line: idx + 1, text: line.trim(), names: priv });
    });
  }

  if (violations.length === 0) {
    lines.push(`  ok  ${clientCount} Client Component(s) scanned, no privileged B2 variable referenced`);
    lines.push(`      guarded: ${B2_PRIVILEGED.join(", ")}`);
    if (B2_ANY.test("")) lines.push("");
  } else {
    for (const v of violations.slice(0, 40)) {
      lines.push(`  B2-CLIENT  ${v.file}:${v.line}`);
      lines.push(`      ${v.text.slice(0, 120)}`);
      lines.push(`      privileged variable(s): ${v.names.join(", ")}`);
    }
    if (violations.length > 40) lines.push(`      ...and ${violations.length - 40} more`);
  }

  record("b2-client-boundary", violations.length === 0, lines);
}

// ---------------------------------------------------------------------------
// Check 4 — paid-service configuration
// ---------------------------------------------------------------------------

const PAID_ENV = [
  "OPENAI_API_KEY",
  "OPENAI_ORGANIZATION",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "GOOGLE_GENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_ID",
  "COHERE_API_KEY",
  "MISTRAL_API_KEY",
  "GROQ_API_KEY",
  "REPLICATE_API_TOKEN",
  "RUNPOD_API_KEY",
  "TOGETHER_API_KEY",
];

/** npm dependencies that imply a paid, billable integration. */
const PAID_DEPS = [
  "openai",
  "@anthropic-ai/sdk",
  "@google/generative-ai",
  "@google/genai",
  "stripe",
  "@mistralai/mistralai",
  "groq-sdk",
  "replicate",
  "runpod",
];

const CONFIG_EXTS = [".json", ".jsonc", ".yml", ".yaml", ".toml"];
const SOURCE_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
const CONFIG_NAMES = new Set(["package.json", "wrangler.json", "opencode.json"]);

function checkNoPaidConfig(files) {
  const lines = [];
  const violations = [];
  const exclusions = PAID_SCAN_EXCLUSIONS.filter((e) =>
    files.some((f) => e.pattern.test(f.replace(/\\/g, "/"))),
  );

  const isExcluded = (rel) => {
    const norm = rel.replace(/\\/g, "/");
    return PAID_SCAN_EXCLUSIONS.some((e) => e.pattern.test(norm));
  };

  for (const rel of files) {
    if (isExcludedPath(rel) || isExcluded(rel)) continue;
    const base = rel.replace(/\\/g, "/").split("/").pop();
    const ext = extname(rel).toLowerCase();
    const isConfig = CONFIG_NAMES.has(base) || CONFIG_EXTS.includes(ext);
    const isSource = SOURCE_EXTS.includes(ext);
    if (!isConfig && !isSource) continue;

    const body = readSafe(rel);
    if (!body) continue;

    body.split(/\r?\n/).forEach((line, idx) => {
      // In source, only an actual environment read is configuration.
      if (isSource && !isConfig) {
        const hit = PAID_ENV.find((v) =>
          new RegExp(`process\\.env\\.${v}\\b|env\\.${v}\\b`).test(line),
        );
        if (!hit) return;
        violations.push({ file: rel, line: idx + 1, text: line.trim(), what: `environment read of ${hit}` });
        return;
      }

      const envHit = PAID_ENV.find((v) => line.includes(v));
      if (envHit) {
        violations.push({ file: rel, line: idx + 1, text: line.trim(), what: `paid service variable ${envHit}` });
        return;
      }
      const depHit = PAID_DEPS.find((d) =>
        new RegExp(`["']${d.replace(/[/@]/g, (c) => `\\${c}`)}["']`).test(line),
      );
      if (depHit) {
        violations.push({ file: rel, line: idx + 1, text: line.trim(), what: `paid dependency "${depHit}"` });
      }
    });
  }

  if (violations.length === 0) {
    lines.push("  ok  no paid-service configuration detected");
    lines.push(`      watched env vars: ${PAID_ENV.length}; watched deps: ${PAID_DEPS.length}`);
    lines.push("      NOT flagged: S3_*/AWS_* (Backblaze B2 is S3-compatible and is not a paid service)");
    for (const e of exclusions) {
      lines.push(`      excluded ${e.pattern} — ${e.reason}`);
    }
  } else {
    for (const v of violations.slice(0, 40)) {
      lines.push(`  PAID  ${v.file}:${v.line}  [${v.what}]`);
      lines.push(`      ${v.text.slice(0, 120)}`);
    }
    if (violations.length > 40) lines.push(`      ...and ${violations.length - 40} more`);
  }

  record("no-paid-config", violations.length === 0, lines);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("Bhavya OS — Platform Contract Validation");
console.log("Authority: AGENTS.md + docs/architecture/PLATFORM-TRUTH.md");

const files = gitFiles();
if (files.length === 0) {
  console.error("  ERROR: no tracked files found (git ls-files returned nothing)");
  process.exit(1);
}
console.log(`Scanning ${files.length} tracked files.`);

section("[1/4] permanent-files");
checkPermanentFiles();

section("[2/4] no-cloudflare-r2");
checkNoR2(files);

section("[3/4] b2-client-boundary");
checkB2ClientBoundary(files);

section("[4/4] no-paid-config");
checkNoPaidConfig(files);

let failed = 0;
for (const r of results) if (!r.ok) failed++;

console.log("");
if (failed === 0) {
  console.log(`RESULT: PASS (${results.length}/${results.length} checks)`);
  process.exit(0);
} else {
  console.log(`RESULT: FAIL (${failed}/${results.length} checks failed)`);
  console.log("See docs/architecture/PLATFORM-TRUTH.md for the rule each check enforces.");
  process.exit(1);
}