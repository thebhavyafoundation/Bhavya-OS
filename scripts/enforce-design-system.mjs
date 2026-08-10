#!/usr/bin/env node

// Design System Enforcement Script
// Checks for:
// 1. Duplicate token definitions in app globals.css files
// 2. Hardcoded brand colors in components (not using CSS variables)
// 3. Apps with their own token definitions instead of importing generated tokens

import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const BRAND_COLORS = [
  "#1a3a2a", // forest
  "#c9a227", // gold
  "#8a7359", // earth
  "#f5f1e6", // cream
];

const TOKEN_PATTERNS = [
  /--color-bg-primary/,
  /--color-text-primary/,
  /--color-accent-green/,
  /--color-accent-gold/,
];

let errors = 0;
let warnings = 0;

function checkApp(appName) {
  const appDir = join(ROOT, "apps/" + appName + "/src/app");
  const globalsFile = join(appDir, "globals.css");

  if (!existsSync(globalsFile)) return;

  const content = readFileSync(globalsFile, "utf8");

  // Check 1: Does it import generated tokens?
  const hasImport = content.includes("_tokens-generated.css");
  const hasOwnTokens = TOKEN_PATTERNS.some((p) => p.test(content));

  if (hasOwnTokens && !hasImport) {
    console.error("ERROR: " + appName + " has own token definitions without importing generated tokens");
    errors++;
  }

  // Check 2: Check for hardcoded brand colors in component files
  const componentsDir = join(ROOT, "apps/" + appName + "/src/components");
  if (existsSync(componentsDir)) {
    checkDir(componentsDir, appName);
  }
}

function checkDir(dir, appName) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      checkDir(fullPath, appName);
    } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      checkFile(fullPath, appName);
    }
  }
}

function checkFile(filePath, appName) {
  const content = readFileSync(filePath, "utf8");
  const relPath = filePath.replace(ROOT + "/", "");

  for (const color of BRAND_COLORS) {
    // Skip the generated tokens file and the canonical source
    if (relPath.includes("_tokens-generated")) continue;
    if (relPath.includes("platform-ui/src/styles")) continue;

    if (content.includes(color)) {
      // Check if it's in a CSS variable definition (allowed) or hardcoded in JSX (not allowed)
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(color) && !lines[i].includes("var(") && !lines[i].includes("--")) {
          // Likely hardcoded in JSX
          console.warn("WARN: " + relPath + ":" + (i + 1) + " uses hardcoded brand color " + color);
          warnings++;
          break;
        }
      }
    }
  }
}

// Main
console.log("Design System Enforcement");
console.log("=========================");
console.log("");

const apps = readdirSync(join(ROOT, "apps")).filter((name) => {
  return statSync(join(ROOT, "apps/" + name)).isDirectory();
});

for (const app of apps) {
  checkApp(app);
}

console.log("");
console.log("Results: " + errors + " errors, " + warnings + " warnings");

if (errors > 0) {
  console.error("FAILED: Design system enforcement failed.");
  process.exit(1);
} else {
  console.log("PASSED: Design system enforcement passed.");
}
