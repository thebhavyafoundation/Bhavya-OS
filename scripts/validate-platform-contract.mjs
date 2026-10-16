#!/usr/bin/env node
/**
 * Bhavya OS — Platform Contract Validation
 *
 * Enforces the permanent operating contract at CI time.
 *
 * Authority: AGENTS.md (L0 router) and docs/architecture/PLATFORM-TRUTH.md.
 * This script creates no policy; it mechanically enforces four rules.
 *
 *   1. permanent-files     the two permanent files exist and hold their invariants
 *   2. no-cloudflare-r2    Cloudflare R2 is prohibited
 *   3. b2-client-boundary  privileged B2 credentials never reach a Client Component
 *   4. no-paid-config      no paid-service / payment-method-requiring configuration
 *
 * CLASSIFICATION, NOT DIRECTORY EXCLUSION
 *   These checks classify each file by kind and inspect the *execution context* of
 *   each match. A paid-service identifier appearing inside a curriculum code sample
 *   is teaching material; the same identifier as a real environment read is
 *   configuration and fails. Directory-based exclusion would let prohibited
 *   configuration hide simply by being moved under an excluded folder, so
 *   configuration files are scanned everywhere regardless of where they sit.
 *
 * Usage:
 *   node scripts/validate-platform-contract.mjs                 # scan the repo
 *   node scripts/validate-platform-contract.mjs --root <dir>    # scan a tree (tests)
 *
 * Exit: 0 = pass, 1 = at least one check failed
 */

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, extname, relative } from "node:path";

const args = process.argv.slice(2);
const ROOT_IDX = args.indexOf("--root");
const SCAN_ROOT = ROOT_IDX !== -1 ? args[ROOT_IDX + 1] : null;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PERMANENT_FILES = ["AGENTS.md", "docs/architecture/PLATFORM-TRUTH.md"];

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

/** Directories never worth scanning: tooling output and archives. */
const SKIP_DIRS = new Set([
  "node_modules", ".next", ".turbo", ".git", ".open-next",
  ".playwright-mcp", "dist", "build", "_archive", "archive", "coverage",
]);

/**
 * The only explicit allow-list. Fixtures exist to prove the checker works; they
 * intentionally contain prohibited strings and must not fail the repo scan.
 * There is deliberately NO directory allow-list — that was the bypass.
 */
const ALLOW_LIST = ["scripts/__fixtures__/platform-contract/"];

/** The checker necessarily contains the tokens it searches for. */
const SELF_PATH = "scripts/validate-platform-contract.mjs";

const DOC_EXT = new Set([".md", ".mdx"]);
const CONFIG_EXT = new Set([".json", ".jsonc", ".yml", ".yaml", ".toml", ".ini", ".env"]);
const CONFIG_NAMES = new Set(["wrangler.json", "package.json", "opencode.json", ".env"]);
const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const BINARY_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".pdf",
  ".glb", ".gltf", ".blend", ".zip", ".mp4", ".mp3", ".woff", ".woff2", ".ttf",
]);

// ---------------------------------------------------------------------------
// Paid-service indicators
// ---------------------------------------------------------------------------

const PAID_ENV = [
  "OPENAI_API_KEY", "OPENAI_ORGANIZATION", "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENAI_API_KEY",
  "STRIPE_SECRET_KEY", "STRIPE_PRICE_ID", "COHERE_API_KEY",
  "MISTRAL_API_KEY", "GROQ_API_KEY", "REPLICATE_API_TOKEN",
  "RUNPOD_API_KEY", "TOGETHER_API_KEY",
];

const PAID_DEPS = [
  "openai", "@anthropic-ai/sdk", "@google/generative-ai", "@google/genai",
  "stripe", "@mistralai/mistralai", "groq-sdk", "replicate", "runpod",
];

/**
 * Execution contexts in which a paid identifier is real configuration.
 * A bare mention inside prose or a string literal is not.
 *
 * `config-declaration` is deliberately restricted to config-kind files. In
 * application source, instructional prose such as
 *   "store OPENAI_API_KEY: in the environment"
 * would otherwise match a `NAME:` shape while being nothing but a lesson.
 */
const ENV_CONTEXTS_SOURCE = [
  { re: (v) => new RegExp(`process\\.env(?:\\.${v}|\\[['"\\]\`]*${v}\\b)`, "g"), why: "process.env read" },
  { re: (v) => new RegExp(`\\benv\\.${v}\\b`, "g"), why: "env read" },
  { re: (v) => new RegExp(`secrets\\.${v}\\b`, "g"), why: "workflow secret reference" },
];

const ENV_CONTEXTS_CONFIG = [
  ...ENV_CONTEXTS_SOURCE,
  { re: (v) => new RegExp(`['"\`]?\\b${v}\\b['"\`]?\\s*[:=]`, "g"), why: "config declaration" },
];

const DEP_CONTEXTS = [
  { re: (d) => new RegExp(`(?:from|require\\()\\s*['"]${d.replace(/[/@]/g, "\\$&")}['"]`, "g"), why: "module import" },
];

// ---------------------------------------------------------------------------
// R2 indicators — configuration signatures, never the bare word "R2"
// ---------------------------------------------------------------------------

const R2_TOKENS = [
  { re: /r2_buckets/, why: "Wrangler R2 binding type" },
  { re: /["']?type["']?\s*:\s*["']r2["']/i, why: "Wrangler R2 binding" },
  { re: /\bR2_(BUCKET|BUCKET_NAME|ACCESS_KEY_ID|SECRET_ACCESS_KEY|ENDPOINT|ACCOUNT_ID|S3)\b/, why: "R2 environment variable" },
  { re: /\bCLOUDFLARE_R2_[A-Z_]+\b/, why: "R2 environment variable" },
  { re: /\.r2\.dev\b/, why: "R2 public hostname" },
  { re: /r2\.cloudflarestorage\.com/, why: "R2 S3 endpoint" },
  { re: /@cloudflare\/r2/, why: "R2 SDK import" },
];

const NEGATION =
  /\b(prohibit|prohibited|never|not|no\b|must not|do not|reject|forbid|illegal|without|ban|banned)\b/i;

// ---------------------------------------------------------------------------
// B2 indicators
// ---------------------------------------------------------------------------

const B2_PRIVILEGED = [
  "B2_ACCESS_KEY_ID", "B2_SECRET_ACCESS_KEY", "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY", "B2_APPLICATION_KEY", "B2_MASTER_KEY",
];

const CLIENT_DIRECTIVE = /^\s*(["'])use client\1\s*;?/m;
const SERVER_ONLY = /import\s+["']server-only["']/;

// ---------------------------------------------------------------------------
// Discovery / IO
// ---------------------------------------------------------------------------

function gitFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    })
      .split("\0")
      .filter(Boolean);
  } catch {
    return [];
  }
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

function classify(rel) {
  const norm = rel.replace(/\\/g, "/");
  if (ALLOW_LIST.some((a) => norm.includes(a))) return "allow";
  const parts = norm.split("/");
  if (parts.some((p) => SKIP_DIRS.has(p))) return "skip";
  if (norm === SELF_PATH) return "skip";
  const ext = extname(norm).toLowerCase();
  const base = parts[parts.length - 1];
  if (BINARY_EXT.has(ext)) return "binary";
  if (DOC_EXT.has(ext)) return "doc";
  if (CONFIG_NAMES.has(base) || base.startsWith(".env")) return "config";
  if (CONFIG_EXT.has(ext)) return "config";
  if (SOURCE_EXT.has(ext)) return "source";
  return "other";
}

function readSafe(abs, rel) {
  try {
    const st = statSync(abs);
    if (!st.isFile() || st.size > 4 * 1024 * 1024) return null;
    return readFileSync(abs, "utf8");
  } catch {
    void rel;
    return null;
  }
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

const results = [];
const warnings = [];
function record(check, ok, lines) {
  results.push({ check, ok });
  for (const l of lines) console.log(l);
  console.log(`  => ${ok ? "PASS" : "FAIL"}  ${check}\n`);
}

/** Advisory findings, grouped by file so a long tail stays readable. */
function warn(rel, line, msg) {
  warnings.push({ rel, line, msg });
}

function checkPermanentFiles() {
  if (SCAN_ROOT) return; // repo-level check, not applicable to fixture trees
  const lines = [];
  let ok = true;
  for (const f of PERMANENT_FILES) {
    if (!existsSync(f)) {
      lines.push(`  MISSING  ${f}`);
      ok = false;
      continue;
    }
    const body = readSafe(f, f);
    if (!body || !body.trim()) {
      lines.push(`  EMPTY    ${f}`);
      ok = false;
      continue;
    }
    lines.push(`  ok       ${f}  (${body.trim().split("\n").length} lines)`);
  }
  if (ok) {
    const truth = readSafe("docs/architecture/PLATFORM-TRUTH.md", "") ?? "";
    const missing = TRUTH_INVARIANTS.filter((i) => !truth.includes(i));
    if (missing.length) {
      lines.push(`  TRUTH-DRIFT ${missing.length} invariant(s) missing:`);
      for (const m of missing) lines.push(`             - ${m}`);
      ok = false;
    } else {
      lines.push(`  ok       all ${TRUTH_INVARIANTS.length} platform invariants present`);
    }
  }
  record("permanent-files", ok, lines);
}

function checkNoR2(entries) {
  const lines = [];
  const found = [];
  for (const { rel, abs, kind } of entries) {
    if (kind !== "doc" && kind !== "config" && kind !== "source") continue;
    const body = readSafe(abs, rel);
    if (!body) continue;
    body.split(/\r?\n/).forEach((line, idx) => {
      for (const t of R2_TOKENS) {
        if (!t.re.test(line)) continue;
        // Prose documenting the prohibition is allowed; configuration is not.
        if (kind === "doc" && NEGATION.test(line)) continue;
        found.push({ rel, line: idx + 1, text: line.trim(), why: t.why });
      }
    });
  }
  if (!found.length) {
    lines.push(`  ok  no Cloudflare R2 configuration in ${entries.length} scanned files`);
  } else {
    for (const v of found.slice(0, 40)) {
      lines.push(`  R2  ${v.rel}:${v.line}  [${v.why}]  (${v.text.slice(0, 90)})`);
    }
    if (found.length > 40) lines.push(`      ...and ${found.length - 40} more`);
  }
  record("no-cloudflare-r2", found.length === 0, lines);
}

function checkB2ClientBoundary(entries) {
  const lines = [];
  const violations = [];
  let clients = 0;

  for (const { rel, abs, kind } of entries) {
    if (kind !== "source") continue;
    const body = readSafe(abs, rel);
    if (!body) continue;
    const isClient = CLIENT_DIRECTIVE.test(body);
    const isServerOnly = SERVER_ONLY.test(body);
    if (isClient) clients++;

    body.split(/\r?\n/).forEach((line, idx) => {
      // Static privileged names, including destructuring from process.env.
      const priv = B2_PRIVILEGED.filter((v) => new RegExp(`\\b${v}\\b`).test(line));
      const destructured = /\{[^}]*\bB2_[A-Z0-9_]+\b[^}]*\}\s*=\s*process\.env/.test(line);
      const publicB2 = /\bNEXT_PUBLIC_[A-Z0-9_]*B2[A-Z0-9_]*/.test(line);
      // Dynamic access: process.env[expr] where expr is not a literal.
      const dynamic = /process\.env\[\s*(?!["'`])/.test(line);

      if (isClient) {
        if (priv.length || destructured || publicB2) {
          violations.push({ rel, line: idx + 1, text: line.trim(), names: priv, why: "privileged B2 in Client Component" });
        } else if (dynamic) {
          violations.push({ rel, line: idx + 1, text: line.trim(), names: ["<dynamic>"], why: "dynamic process.env access in Client Component" });
        }
      } else if (priv.length && !isServerOnly) {
        warn(rel, idx + 1, "privileged B2 referenced without an explicit \"server-only\" import — verify this module can never be bundled for the browser");
      }
    });
  }

  if (!violations.length) {
    lines.push(`  ok  ${clients} Client Component(s) scanned; no privileged B2 reached the browser`);
    lines.push(`      guarded: ${B2_PRIVILEGED.join(", ")}`);
    if (warnings.length) {
      const byFile = new Map();
      for (const w of warnings) byFile.set(w.rel, (byFile.get(w.rel) ?? 0) + 1);
      lines.push(`      advisory: ${warnings.length} privileged-B2 reference(s) in ${byFile.size} server module(s) without an explicit "server-only" import:`);
      for (const [f, n] of [...byFile].sort((a, b) => b[1] - a[1])) {
        lines.push(`        ${f}  (${n} reference${n === 1 ? "" : "s"})`);
      }
      lines.push(`      these are not failures; adding \`import "server-only"\` would harden them`);
    }
  } else {
    for (const v of violations.slice(0, 40)) {
      lines.push(`  B2-CLIENT  ${v.rel}:${v.line}  [${v.why}]`);
      lines.push(`      ${v.text.slice(0, 110)}`);
      if (v.names.length) lines.push(`      ${v.names.join(", ")}`);
    }
    if (violations.length > 40) lines.push(`      ...and ${violations.length - 40} more`);
  }
  record("b2-client-boundary", violations.length === 0, lines);
}

function checkNoPaidConfig(entries) {
  const lines = [];
  const found = [];

  for (const { rel, abs, kind } of entries) {
    if (kind !== "config" && kind !== "source") continue;
    const body = readSafe(abs, rel);
    if (!body) continue;
    const base = rel.replace(/\\/g, "/").split("/").pop();
    const isPackageJson = base === "package.json";
    const isEnvFile = base.startsWith(".env");
    const contexts = kind === "config" ? ENV_CONTEXTS_CONFIG : ENV_CONTEXTS_SOURCE;

    const linesArr = body.split(/\r?\n/);
    linesArr.forEach((line, idx) => {
      // Environment-variable execution contexts.
      for (const v of PAID_ENV) {
        for (const ctx of contexts) {
          if (ctx.re(v).test(line)) {
            // In a .env file the declaration form is `NAME=value`.
            if (isEnvFile && new RegExp(`^\\s*${v}\\s*=`).test(line)) {
              found.push({ rel, line: idx + 1, text: line.trim(), what: `paid service variable ${v} in .env` });
              return;
            }
            found.push({ rel, line: idx + 1, text: line.trim(), what: `paid service variable ${v} (${ctx.why})` });
            return;
          }
        }
      }
      // Dependency execution contexts only: an import, or a package.json entry.
      for (const d of PAID_DEPS) {
        const importHit = DEP_CONTEXTS.some((c) => c.re(d).test(line));
        const pkgHit =
          isPackageJson &&
          new RegExp(`["']${d.replace(/[/@]/g, "\\$&")}["']\\s*:\\s*["'][^"']+["']`).test(line);
        if (importHit || pkgHit) {
          found.push({ rel, line: idx + 1, text: line.trim(), what: `paid dependency "${d}" (${importHit ? "import" : "package.json"})` });
          return;
        }
      }
    });
  }

  if (!found.length) {
    lines.push("  ok  no paid-service configuration detected");
    lines.push(`      env indicators: ${PAID_ENV.length} · dependency indicators: ${PAID_DEPS.length}`);
    lines.push("      allowed by design: S3_*/AWS_* (Backblaze B2 is S3-compatible, not a paid service)");
    lines.push("      allowed by design: paid identifiers inside prose and string literals (teaching material)");
    lines.push(`      allow-listed: ${ALLOW_LIST.join(", ")} (fixtures that must contain violations)`);
  } else {
    for (const v of found.slice(0, 40)) {
      lines.push(`  PAID  ${v.rel}:${v.line}  [${v.what}]`);
      lines.push(`      ${v.text.slice(0, 110)}`);
    }
    if (found.length > 40) lines.push(`      ...and ${found.length - 40} more`);
  }
  record("no-paid-config", found.length === 0, lines);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("Bhavya OS — Platform Contract Validation");
console.log("Authority: AGENTS.md + docs/architecture/PLATFORM-TRUTH.md");

let entries;
if (SCAN_ROOT) {
  console.log(`Scanning tree: ${SCAN_ROOT}`);
  entries = walk(SCAN_ROOT).map((abs) => ({
    abs,
    rel: relative(SCAN_ROOT, abs).replace(/\\/g, "/"),
    kind: classify(relative(SCAN_ROOT, abs)),
  }));
} else {
  const files = gitFiles();
  if (!files.length) {
    console.error("  ERROR: no tracked files (git ls-files returned nothing)");
    process.exit(1);
  }
  console.log(`Scanning ${files.length} tracked files.`);
  entries = files.map((rel) => ({ abs: rel, rel, kind: classify(rel) }));
}

checkPermanentFiles();
checkNoR2(entries);
checkB2ClientBoundary(entries);
checkNoPaidConfig(entries);

const failed = results.filter((r) => !r.ok).length;
console.log("");
if (failed === 0) {
  console.log(`RESULT: PASS (${results.length}/${results.length} checks)${warnings.length ? ` — ${warnings.length} warning(s)` : ""}`);
  process.exit(0);
}
console.log(`RESULT: FAIL (${failed}/${results.length} checks failed)`);
console.log("See docs/architecture/PLATFORM-TRUTH.md for the rule each check enforces.");
process.exit(1);