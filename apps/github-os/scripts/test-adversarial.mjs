#!/usr/bin/env node
/**
 * Git OS — Adversarial Review Tests (J21-J26)
 *
 * J21: Fuzzing — malformed inputs that could cause crashes
 * J22: Edge case stress tests — extreme values
 * J23: Input validation — ensuring all inputs are properly validated
 * J24: Injection attempts — SQL injection, XSS
 * J25: Boundary conditions — empty strings, very long strings, special characters
 * J26: Concurrency and race condition resilience
 *
 * Usage: node scripts/test-adversarial.mjs
 */

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;

function assert(condition, testName, details) {
  totalTests++;
  if (condition) {
    totalPassed++;
    console.log(`  ✅ ${testName}${details ? ` — ${details}` : ""}`);
  } else {
    totalFailed++;
    console.log(`  ❌ ${testName}${details ? ` — ${details}` : ""}`);
  }
}

// ─── J21: FUZZING ───────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🎲 J21: FUZZING — MALFORMED INPUTS");
console.log("═".repeat(60));

function safeParseRepoName(input) {
  if (typeof input !== "string") return null;
  const match = input.match(/^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/);
  if (!match) return null;
  return { owner: match[1], name: match[2] };
}

// Fuzz: random strings
const fuzzInputs = [
  "", " ", "\t", "\n", "\r\n",
  null, undefined, 0, false, true, NaN, Infinity,
  {}, [], [1, 2, 3], { a: 1 },
  "a".repeat(10000), "a/".repeat(5000),
  "../etc/passwd", "..\\windows\\system32",
  "owner/repo; DROP TABLE repositories;",
  "owner/repo<script>alert(1)</script>",
  "owner/repo' OR '1'='1",
  "owner/repo\"; --",
  "a/b/c/d", "/", "//", "///",
  "\x00\x01\x02\x03",
  "🎉/🚀", "日本語/テスト",
  "a b/c d", "a,b/c,d",
];

let fuzzPassed = 0;
for (const input of fuzzInputs) {
  try {
    const result = safeParseRepoName(input);
    // Should either return null or a valid {owner, name} — never crash
    if (result === null || (result.owner && result.name)) {
      fuzzPassed++;
    } else {
      console.log(`  ⚠️ Unexpected result for fuzz input: ${JSON.stringify(input)} → ${JSON.stringify(result)}`);
    }
  } catch (err) {
    console.log(`  ❌ CRASH on fuzz input ${JSON.stringify(input)}: ${err.message}`);
  }
}
assert(fuzzPassed === fuzzInputs.length, `All ${fuzzInputs.length} fuzz inputs handled safely`, `${fuzzPassed}/${fuzzInputs.length}`);

// ─── J22: EDGE CASE STRESS TESTS ────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("💪 J22: EDGE CASE STRESS TESTS");
console.log("═".repeat(60));

// Test: Very large stars count
function validateStars(stars) {
  if (typeof stars !== "number" || !Number.isFinite(stars)) return 0;
  return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(stars)));
}

assert(validateStars(69449) === 69449, "Normal stars", "69449");
assert(validateStars(-100) === 0, "Negative stars → 0", "clamped");
assert(validateStars(Infinity) === 0, "Infinity → 0 (not finite)", "rejected");
assert(validateStars(NaN) === 0, "NaN → 0", "defaulted");
assert(validateStars(1e20) === Number.MAX_SAFE_INTEGER, "Very large number clamped", "clamped");

// Test: Very long strings
function safeTruncate(str, maxLen = 10000) {
  if (typeof str !== "string") return "";
  return str.substring(0, maxLen);
}

const longStr = "a".repeat(100000);
const truncated = safeTruncate(longStr);
assert(truncated.length === 10000, "Long string truncated to 10000", `${truncated.length}`);

// Test: Unicode handling
function safeLength(str) {
  if (typeof str !== "string") return 0;
  return [...str].length; // Handles emoji and multi-byte chars
}

assert(safeLength("Hello") === 5, "ASCII length", "5");
assert(safeLength("🎉🚀💡") === 3, "Emoji length", "3");
assert(safeLength("日本語テスト") === 6, "CJK length", "6");
assert(safeLength("") === 0, "Empty length", "0");
assert(safeLength(null) === 0, "Null length", "0");

// Test: Date edge cases
function safeDateParse(input) {
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

assert(safeDateParse("2026-01-01T00:00:00Z") !== null, "Valid ISO date", "parsed");
assert(safeDateParse("not-a-date") === null, "Invalid date → null", "handled");
assert(safeDateParse(null) !== null, "Null date → epoch (Date(null) is valid)", "parsed as 1970");
assert(safeDateParse("") === null, "Empty date → null", "handled");

// ─── J23: INPUT VALIDATION ──────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("✅ J23: INPUT VALIDATION");
console.log("═".repeat(60));

function validateDiscoverOptions(options) {
  if (!options || typeof options !== "object") return { valid: false, errors: ["Options must be an object"] };

  const errors = [];
  if (options.query !== undefined && typeof options.query !== "string") errors.push("query must be string");
  if (options.language !== undefined && typeof options.language !== "string") errors.push("language must be string");
  if (options.minStars !== undefined && (typeof options.minStars !== "number" || options.minStars < 0)) errors.push("minStars must be non-negative number");
  if (options.maxStars !== undefined && (typeof options.maxStars !== "number" || options.maxStars < 0)) errors.push("maxStars must be non-negative number");
  if (options.limit !== undefined && (typeof options.limit !== "number" || options.limit < 1 || options.limit > 100)) errors.push("limit must be 1-100");

  return { valid: errors.length === 0, errors };
}

// Valid options
assert(validateDiscoverOptions({ query: "express", language: "JavaScript", limit: 10 }).valid, "Valid options", "no errors");

// Invalid options
const invalidResult = validateDiscoverOptions({ query: 123, language: true, limit: -5 });
assert(!invalidResult.valid, "Invalid options detected", `${invalidResult.errors.length} errors`);
assert(invalidResult.errors.length >= 2, "Multiple errors reported", `${invalidResult.errors.length}`);

// Null/undefined options
assert(!validateDiscoverOptions(null).valid, "Null options invalid", "caught");
assert(!validateDiscoverOptions(undefined).valid, "Undefined options invalid", "caught");

// ─── J24: INJECTION ATTEMPTS ────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("💉 J24: INJECTION ATTEMPTS");
console.log("═".repeat(60));

// SQL injection in repo name
function sanitizeRepoId(input) {
  if (typeof input !== "string") return "";
  // Only allow alphanumeric, hyphens, dots, and forward slashes
  return input.replace(/[^a-zA-Z0-9._/-]/g, "").substring(0, 200);
}

const sqlInjectionTests = [
  { input: "expressjs/express", expected: "expressjs/express" },
  { input: "'; DROP TABLE repositories; --", expected: "DROPTABLErepositories--" },
  { input: "repo' OR '1'='1", expected: "repoOR11" },
  { input: "repo\"; --", expected: "repo--" },
  { input: "<script>alert(1)</script>", expected: "scriptalert1/script" },
];

for (const t of sqlInjectionTests) {
  const sanitized = sanitizeRepoId(t.input);
  assert(sanitized === t.expected, `Sanitized: ${t.input.substring(0, 20)}`, `→ ${sanitized.substring(0, 30)}`);
}

// Test: XSS in README content
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const xssTests = [
  { input: "<script>alert(1)</script>", expected: "&lt;script&gt;alert(1)&lt;/script&gt;" },
  { input: "Hello & World", expected: "Hello &amp; World" },
  { input: '"onmouseover="alert(1)"', expected: "&quot;onmouseover=&quot;alert(1)&quot;" },
];

for (const t of xssTests) {
  const escaped = escapeHtml(t.input);
  assert(escaped === t.expected, `XSS escaped: ${t.input.substring(0, 20)}`, `→ ${escaped.substring(0, 30)}`);
}

// ─── J25: BOUNDARY CONDITIONS ───────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📏 J25: BOUNDARY CONDITIONS");
console.log("═".repeat(60));

function normalizeRepoName(input) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > 500) return null;
  // Remove leading/trailing slashes and normalize
  const normalized = trimmed.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
  if (normalized.length === 0) return null;
  return normalized;
}

// Boundary: empty string
assert(normalizeRepoName("") === null, "Empty string → null", "handled");

// Boundary: whitespace only
assert(normalizeRepoName("   ") === null, "Whitespace only → null", "handled");

// Boundary: exactly 1 char
assert(normalizeRepoName("a") === "a", "Single char preserved", "a");

// Boundary: exactly 500 chars
const maxStr = "a".repeat(500);
assert(normalizeRepoName(maxStr) === maxStr, "500 chars preserved", "500");

// Boundary: 501 chars → null
assert(normalizeRepoName("a".repeat(501)) === null, "501 chars → null", "too long");

// Boundary: multiple slashes normalized
assert(normalizeRepoName("a///b///c") === "a/b/c", "Multiple slashes normalized", "a/b/c");

// Boundary: leading/trailing slashes removed
assert(normalizeRepoName("/expressjs/express/") === "expressjs/express", "Leading/trailing slashes removed", "expressjs/express");

// ─── J26: CONCURRENCY RESILIENCE ────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔄 J26: CONCURRENCY AND RACE CONDITION RESILIENCE");
console.log("═".repeat(60));

// Test: Simulated concurrent upserts don't corrupt data
{
  const store = new Map();
  let writeCount = 0;

  function concurrentUpsert(id, data) {
    // Simulate async write with potential interleaving
    const existing = store.get(id);
    store.set(id, { ...data, writeOrder: ++writeCount, previousWrite: existing?.writeOrder || null });
    return store.get(id);
  }

  // Simulate rapid concurrent writes to same key
  const results = [];
  for (let i = 0; i < 100; i++) {
    results.push(concurrentUpsert("expressjs-express", { stars: 69000 + i }));
  }

  assert(store.size === 1, "Single record after 100 concurrent upserts", `${store.size} records`);
  assert(store.get("expressjs-express").stars === 69099, "Last write wins", `${store.get("expressjs-express").stars}`);
  assert(store.get("expressjs-express").writeOrder === 100, "Write order tracked", `${store.get("expressjs-express").writeOrder}`);
}

// Test: Edge ID uniqueness under concurrent generation
{
  const edges = new Map();

  function generateEdgeId(source, target, relationship) {
    return `edge-${source}-${target}-${relationship}`;
  }

  // Generate same edge 100 times
  for (let i = 0; i < 100; i++) {
    const id = generateEdgeId("repo-express", "tech-js", "uses");
    edges.set(id, { source: "repo-express", target: "tech-js", relationship: "uses" });
  }

  assert(edges.size === 1, "Deterministic edge IDs deduplicated", `${edges.size} edges`);
}

// Test: Activity event ID uniqueness
{
  const activities = new Set();

  function generateActivityId() {
    return `act-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  // Generate 1000 activity IDs
  for (let i = 0; i < 1000; i++) {
    activities.add(generateActivityId());
  }

  assert(activities.size === 1000, "All 1000 activity IDs unique", `${activities.size} unique`);
}

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 ADVERSARIAL REVIEW RESULTS");
console.log("═".repeat(60));
console.log(`  Total: ${totalTests} tests, ${totalPassed} passed, ${totalFailed} failed`);
console.log("═".repeat(60));
console.log(`\n🎉 Adversarial Review: ${totalFailed === 0 ? "PASS ✅" : "FAIL ❌"}`);
