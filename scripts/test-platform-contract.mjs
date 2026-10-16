#!/usr/bin/env node
/**
 * Bhavya OS — Platform Contract Checker Tests
 *
 * Proves the checker distinguishes educational prose from executable
 * configuration, and that prohibited configuration cannot hide by being placed
 * under a directory that happens to look excludable.
 *
 * Deny-case fixtures are generated at runtime in a temporary directory and are
 * never committed, so this repository never contains prohibited configuration
 * even as test data.
 *
 * Usage: node scripts/test-platform-contract.mjs
 * Exit:  0 = all tests passed, 1 = at least one test failed
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const VALIDATOR = join(HERE, "validate-platform-contract.mjs");

/** Run the checker against a generated tree. */
function runChecker(files) {
  const root = mkdtempSync(join(tmpdir(), "bhavya-contract-"));
  try {
    for (const [rel, body] of Object.entries(files)) {
      const abs = join(root, rel);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, body);
    }
    let stdout = "";
    let code = 0;
    try {
      stdout = execFileSync("node", [VALIDATOR, "--root", root], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (e) {
      stdout = `${e.stdout ?? ""}`;
      code = e.status ?? 1;
    }
    return { code, stdout };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const results = [];
function test(id, description, files, expectation) {
  const { code, stdout } = runChecker(files);
  // expectation: { pass: true } or { failCheck: "no-paid-config" | "no-cloudflare-r2" | "b2-client-boundary" }
  let ok;
  let why = "";
  if (expectation.pass) {
    ok = code === 0;
    why = ok ? "passed as required" : `expected PASS, got exit ${code}`;
  } else {
    const failed = /=> FAIL\s+(\S+)/.exec(stdout)?.[1] ?? "";
    ok = code !== 0 && failed === expectation.failCheck;
    why = ok
      ? `correctly failed ${expectation.failCheck}`
      : `expected FAIL on ${expectation.failCheck}, got exit ${code} failed="${failed}"`;
  }
  results.push({ id, ok, description, why });
  console.log(`  ${ok ? "PASS" : "FAIL"}  [${id}] ${description}`);
  console.log(`        ${why}`);
}

console.log("Bhavya OS — Platform Contract Checker Tests");
console.log("Authority: AGENTS.md + docs/architecture/PLATFORM-TRUTH.md\n");

// --- 1. curriculum teaching material must be allowed -----------------------
test(
  1,
  "OPENAI_API_KEY inside a curriculum code example is allowed",
  {
    "src/data/lesson.ts": `export const lesson = {
  code: 'import os\\nfrom openai import OpenAI\\nclient = OpenAI(api_key=os.environ["OPENAI_API_KEY"])',
  note: "Students are taught to read keys from the environment.",
};
`,
  },
  { pass: true },
);

// --- 2. a real environment read in application config must fail -------------
test(
  2,
  "A real environment-variable reference in application config fails",
  {
    "src/lib/provider.ts": `export const client = { apiKey: process.env.OPENAI_API_KEY };
`,
  },
  { failCheck: "no-paid-config" },
);

// --- 3. a prohibited SDK in executable config must fail ---------------------
test(
  3,
  "A prohibited SDK in executable configuration fails (import form)",
  { "src/lib/ai.ts": `import OpenAI from "openai";\nexport const o = new OpenAI();\n` },
  { failCheck: "no-paid-config" },
);

test(
  "3b",
  "A prohibited SDK declared as a package dependency fails",
  { "package.json": `{\n  "name": "x",\n  "dependencies": {\n    "openai": "^4.0.0"\n  }\n}\n` },
  { failCheck: "no-paid-config" },
);

// --- 4. excluded-looking directories must not hide configuration ------------
const HIDDEN = "content/assets/hidden-config.ts";
test(
  4,
  "Prohibited configuration under a previously-excluded directory still fails (content/)",
  { [HIDDEN]: `export const k = process.env.OPENAI_API_KEY;\n` },
  { failCheck: "no-paid-config" },
);

test(
  "4b",
  "Prohibited configuration under registry/ still fails (config file type)",
  { "registry/package.json": `{\n  "name": "r",\n  "dependencies": {\n    "stripe": "^14.0.0"\n  }\n}\n` },
  { failCheck: "no-paid-config" },
);

test(
  "4c",
  "Prohibited R2 binding under content/ still fails",
  { "content/wrangler.json": `{\n  "name": "x",\n  "r2_buckets": [{ "binding": "M", "bucket_name": "b" }]\n}\n` },
  { failCheck: "no-cloudflare-r2" },
);

// --- 5. generated registry with descriptive text is allowed ----------------
test(
  5,
  "A generated registry containing descriptive text is allowed",
  {
    "registry/models.json": `{\n  "models": [\n    { "id": "gpt-4", "provider": "openai", "status": "available" },\n    { "id": "mimo", "provider": "opencode", "status": "active" }\n  ]\n}\n`,
  },
  { pass: true },
);

// --- 6. generated registry containing executable config is caught -----------
test(
  6,
  "A generated registry containing executable configuration is rejected",
  {
    "registry/models.json": `{\n  "models": [\n    { "id": "x", "provider": "openai" }\n  ],\n  "client": { "apiKey": "process.env.OPENAI_API_KEY" }\n}\n`,
  },
  { failCheck: "no-paid-config" },
);

// --- 7. negated policy statements remain allowed ---------------------------
test(
  7,
  "Negated policy statements remain allowed",
  {
    "docs/policy.md": `# Policy\n\n- Cloudflare R2 is prohibited.\n- Never configure R2_BUCKET in application code.\n- Paid APIs are prohibited.\n- Do not use OPENAI_API_KEY in production configuration.\n- The r2.dev endpoint must never appear here.\n`,
  },
  { pass: true },
);

// --- 8. R2 bindings across JSON, JSONC, JS, TS -----------------------------
test("8a", "R2 binding in JSON fails", { "a.json": `{\n  "r2_buckets": [{ "binding": "M" }]\n}\n` }, { failCheck: "no-cloudflare-r2" });
test("8b", "R2 binding in JSONC fails", { "a.jsonc": `{\n  // comment\n  "type": "r2",\n}\n` }, { failCheck: "no-cloudflare-r2" });
test("8c", "R2 binding in JavaScript fails", { "a.js": `const binding = { type: "r2" };\nmodule.exports = binding;\n` }, { failCheck: "no-cloudflare-r2" });
test("8d", "R2 binding in TypeScript fails", { "a.ts": `export const binding = { type: "r2" };\n` }, { failCheck: "no-cloudflare-r2" });
test("8e", "R2 env var in a config file fails", { "b.env": `R2_BUCKET=bhavya\n` }, { failCheck: "no-cloudflare-r2" });

// --- 9. client-side B2 credentials across TS, TSX, JS, JSX -----------------
const B2_BODY = (ext) =>
  ext === "tsx" || ext === "jsx"
    ? `"use client";\nexport const s = process.env.B2_SECRET_ACCESS_KEY;\n`
    : `"use client";\nexport const s = process.env.B2_SECRET_ACCESS_KEY;\n`;

test("9a", "Client-side B2 credentials fail in TSX", { "a.tsx": B2_BODY("tsx") }, { failCheck: "b2-client-boundary" });
test("9b", "Client-side B2 credentials fail in TS", { "a.ts": B2_BODY("ts") }, { failCheck: "b2-client-boundary" });
test("9c", "Client-side B2 credentials fail in JSX", { "a.jsx": B2_BODY("jsx") }, { failCheck: "b2-client-boundary" });
test("9d", "Client-side B2 credentials fail in JS", { "a.js": B2_BODY("js") }, { failCheck: "b2-client-boundary" });

test(
  "9e",
  "Server-only module using B2 credentials is allowed",
  { "server.ts": `import "server-only";\nexport const s = process.env.B2_SECRET_ACCESS_KEY;\n` },
  { pass: true },
);

// --- 10. dynamic environment access ---------------------------------------
test(
  10,
  "Dynamic process.env access in a Client Component fails",
  {
    "a.tsx": `"use client";\nexport function read(key) {\n  return process.env[key];\n}\n`,
  },
  { failCheck: "b2-client-boundary" },
);

test(
  "10b",
  "Destructuring a B2 secret from process.env in a Client Component fails",
  {
    "a.tsx": `"use client";\nexport const { B2_SECRET_ACCESS_KEY } = process.env;\n`,
  },
  { failCheck: "b2-client-boundary" },
);

test(
  "10c",
  "NEXT_PUBLIC exposure of a B2 variable fails",
  { "a.tsx": `"use client";\nexport const b = process.env.NEXT_PUBLIC_B2_BUCKET;\n` },
  { failCheck: "b2-client-boundary" },
);

// --- summary --------------------------------------------------------------
const failed = results.filter((r) => !r.ok).length;
console.log(`\nRESULT: ${failed === 0 ? "PASS" : "FAIL"} (${results.length - failed}/${results.length} tests passed)`);
process.exit(failed === 0 ? 0 : 1);