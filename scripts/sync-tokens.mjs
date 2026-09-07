#!/usr/bin/env node

// Token Synchronization Script
//
// Reads the canonical tokens.css from packages/platform-ui/src/styles/tokens.css
// and generates a local copy in each consuming app.
//
// Usage:
//   node scripts/sync-tokens.mjs          # sync all apps
//   node scripts/sync-tokens.mjs --check   # check if sync is needed (CI mode)

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CANONICAL_SOURCE = join(ROOT, "packages/platform-ui/src/styles/tokens.css");

const CONSUMING_APPS = [
  "ai-institute",
  "admin",
  "design-system",
  "docs",
  "github-os",
  "ioc",
  "social-os",
  "website",
];

const HEADER = `/*
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Source: packages/platform-ui/src/styles/tokens.css
 * Run: node scripts/sync-tokens.mjs
 */\n\n`;

function readCanonicalSource() {
  if (!existsSync(CANONICAL_SOURCE)) {
    console.error("Canonical source not found: " + CANONICAL_SOURCE);
    process.exit(1);
  }
  return readFileSync(CANONICAL_SOURCE, "utf-8");
}

function syncApp(appName, canonicalContent, checkOnly) {
  const appDir = join(ROOT, "apps/" + appName + "/src/app");
  const targetFile = join(appDir, "_tokens-generated.css");

  if (!existsSync(appDir)) {
    console.log("  SKIP: " + appName + " (no src/app/ directory)");
    return false;
  }

  if (existsSync(targetFile)) {
    const existing = readFileSync(targetFile, "utf-8");
    const existingContent = existing.replace(/^\/\*[\s\S]*?\*\/\n\n/, "");
    if (existingContent.trim() === canonicalContent.trim()) {
      console.log("  OK: " + appName);
      return false;
    }
  }

  if (checkOnly) {
    console.log("  NEEDS SYNC: " + appName);
    return true;
  }

  const generatedContent = HEADER + canonicalContent;
  writeFileSync(targetFile, generatedContent, "utf-8");
  console.log("  SYNCED: " + appName);
  return true;
}

const checkOnly = process.argv.includes("--check");
const canonicalContent = readCanonicalSource();
console.log("Canonical: " + CANONICAL_SOURCE);
console.log("Mode: " + (checkOnly ? "CHECK" : "SYNC"));
console.log("");

let syncNeeded = 0;
for (const app of CONSUMING_APPS) {
  if (syncApp(app, canonicalContent, checkOnly)) {
    syncNeeded++;
  }
}

console.log("");
if (checkOnly && syncNeeded > 0) {
  console.error(syncNeeded + " app(s) need token sync.");
  process.exit(1);
} else if (checkOnly) {
  console.log("All apps in sync.");
} else {
  console.log("Token sync complete.");
}
