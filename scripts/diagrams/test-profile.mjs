#!/usr/bin/env node
/**
 * Bhavya OS — Diagram Profile Tests
 *
 * Proves that every exported diagram actually satisfies the Bhavya diagram
 * profile: canonical typography, no external font or resource requests, real
 * text alternatives, responsive scaling, and a component that integrates it.
 *
 * This complements scripts/diagrams/validate-diagrams.mjs (manifest + SVG
 * safety). Where that script is the gate, this one is the regression net.
 *
 * Usage: node scripts/diagrams/test-profile.mjs
 * Exit:  0 = pass, 1 = failure
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PROFILE_PATH = "content/diagrams/profile/bhavya-diagram-profile.json";
const MANIFEST_DIR = "content/diagrams/manifests";
const SVG_DIR = "apps/ai-institute/public/diagrams";
const COMPONENT = "packages/platform-ui/src/components/editorial-diagram/EditorialDiagram.tsx";
const TOKENS = "packages/platform-ui/src/styles/tokens.css";

const results = [];
function check(id, desc, ok, detail = "") {
  results.push({ id, desc, ok });
  console.log(`  ${ok ? "PASS" : "FAIL"}  [${id}] ${desc}${detail ? `\n        ${detail}` : ""}`);
}

console.log("Bhavya OS — Diagram Profile Tests");
console.log("Profile: content/diagrams/profile/bhavya-diagram-profile.json\n");

// --- profile exists and is well-formed ------------------------------------
if (!existsSync(PROFILE_PATH)) {
  console.log(`  FAIL  [1] profile missing at ${PROFILE_PATH}`);
  process.exit(1);
}
const profile = JSON.parse(readFileSync(join(ROOT, PROFILE_PATH), "utf8"));
check(1, "Profile exists and parses as JSON", true, `${profile.profile_id} v${profile.version}`);

// --- profile typography matches the canonical tokens ----------------------
const tokens = readFileSync(join(ROOT, TOKENS), "utf8");
const displayToken = /--font-display:\s*([^;]+);/.exec(tokens)?.[1] ?? "";
const sansStackHasInter = /--font-sans:[\s\S]{0,200}?Inter/.test(tokens);
check(
  2,
  "Profile typography derives from tokens.css, not invented",
  /Playfair/.test(profile.typography.display_stack) &&
    /Playfair/.test(displayToken) &&
    /Inter/.test(profile.typography.sans_stack) &&
    sansStackHasInter,
  `tokens --font-display = ${displayToken.trim()}`,
);

// --- profile forbids external fonts ---------------------------------------
check(
  3,
  "Profile forbids Google Fonts and external font CDNs",
  (profile.typography.forbidden ?? []).some((f) => f.includes("fonts.googleapis.com")) &&
    (profile.typography.forbidden ?? []).some((f) => f.includes("fonts.gstatic.com")),
);

// --- exported SVGs honour the profile -------------------------------------
const svgFiles = existsSync(join(ROOT, SVG_DIR))
  ? readdirSync(join(ROOT, SVG_DIR), { recursive: true })
      .filter((f) => String(f).endsWith(".svg"))
      .map((f) => join(SVG_DIR, String(f)))
  : [];

check(4, "At least one exported diagram exists to test", svgFiles.length > 0, `${svgFiles.length} SVG(s)`);

let fontClean = 0;
let extClean = 0;
let a11y = 0;
let responsive = 0;
const bad = [];

for (const rel of svgFiles) {
  const svg = readFileSync(join(ROOT, rel), "utf8");
  const id = rel.split(/[\\/]/).pop();

  if (!/fonts\.googleapis|fonts\.gstatic/i.test(svg)) fontClean++;
  else bad.push(`${id}: external font reference`);

  if (!/(href|src|xlink:href)\s*=\s*"https?:\/\//i.test(svg) && !/@import\s*url\(\s*["']?https?:/i.test(svg)) extClean++;
  else bad.push(`${id}: external resource reference`);

  if (/role="img"/.test(svg) && /<title[\s>]/.test(svg) && /<desc[\s>]/.test(svg) && /aria-labelledby=/.test(svg)) a11y++;
  else bad.push(`${id}: missing role/title/desc/aria-labelledby`);

  if (/viewBox\s*=/.test(svg) && /width="/.test(svg) && /height="/.test(svg)) responsive++;
  else bad.push(`${id}: missing viewBox or width/height`);
}

check(5, "No exported SVG references Google Fonts", fontClean === svgFiles.length, `${fontClean}/${svgFiles.length}`);
check(6, "No exported SVG references an external resource", extClean === svgFiles.length, `${extClean}/${svgFiles.length}`);
check(7, "Every SVG has role=img, <title>, <desc> and aria-labelledby", a11y === svgFiles.length, `${a11y}/${svgFiles.length}`);
check(8, "Every SVG declares viewBox + width/height for mobile and desktop scaling", responsive === svgFiles.length, `${responsive}/${svgFiles.length}`);

// --- manifests carry text alternatives ------------------------------------
const manifests = readdirSync(join(ROOT, MANIFEST_DIR)).filter(
  (f) => f.endsWith(".json") && f !== "manifest.schema.json",
);
let withText = 0;
const noText = [];
for (const f of manifests) {
  const m = JSON.parse(readFileSync(join(ROOT, MANIFEST_DIR, f), "utf8"));
  const text = (m.accessible_text ?? "").trim();
  if (text.length > 0) withText++;
  else noText.push(f);
}
check(
  9,
  "Every manifest carries a non-empty accessible_text",
  withText === manifests.length,
  `${withText}/${manifests.length}${noText.length ? ` missing: ${noText.join(", ")}` : ""}`,
);

// --- component integration -------------------------------------------------
if (existsSync(join(ROOT, COMPONENT))) {
  const comp = readFileSync(join(ROOT, COMPONENT), "utf8");
  check(10, "EditorialDiagram is a Client Component (hooks require it)", /^\s*(["'])use client\1\s*;?/m.test(comp));
  check(
    11,
    "EditorialDiagram renders alt text via <img alt> and links a full-size view",
    /alt=\{title\}/.test(comp) && /href=\{src\}/.test(comp),
  );
} else {
  check(10, "EditorialDiagram component exists", false, COMPONENT);
}

// --- summary ---------------------------------------------------------------
if (bad.length) {
  console.log("\n  SVG findings:");
  for (const b of bad) console.log(`    - ${b}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\nRESULT: ${failed === 0 ? "PASS" : "FAIL"} (${results.length - failed}/${results.length} checks passed)`);
process.exit(failed === 0 ? 0 : 1);