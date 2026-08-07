#!/usr/bin/env node
/**
 * Dependency Enforcement Script
 *
 * Checks that no package imports from deprecated/consolidated packages.
 * Run: node scripts/enforce-deps.mjs
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN = [
  { pattern: /^import\s+.*from\s+["']@bhavya\/bdl["']/gm, replacement: "@bhavya/platform-ui" },
  { pattern: /^import\s+.*from\s+["']@bhavya\/ui["']/gm, replacement: "@bhavya/platform-ui" },
  { pattern: /^import\s+["']@bhavya\/bdl["']/gm, replacement: "@bhavya/platform-ui" },
  { pattern: /^import\s+["']@bhavya\/ui["']/gm, replacement: "@bhavya/platform-ui" },
  { pattern: /require\(["']@bhavya\/bdl["']\)/g, replacement: "@bhavya/platform-ui" },
  { pattern: /require\(["']@bhavya\/ui["']\)/g, replacement: "@bhavya/platform-ui" },
];

const IGNORE_DIRS = ["node_modules", ".next", "dist", ".git", ".playwright-mcp", ".worktrees"];

let violations = 0;

function scanDir(dir) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.includes(entry)) continue;
    const fullPath = join(dir, entry);
    try {
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
        const content = readFileSync(fullPath, "utf-8");
        for (const { pattern, replacement } of FORBIDDEN) {
          pattern.lastIndex = 0;
          if (pattern.test(content)) {
            const rel = relative(ROOT, fullPath);
            console.log(`VIOLATION: ${rel} imports from deprecated package. Use ${replacement} instead.`);
            violations++;
          }
        }
      }
    } catch {
      // Skip inaccessible files
    }
  }
}

console.log("Checking dependency rules...");
scanDir(join(ROOT, "packages"));
scanDir(join(ROOT, "apps"));

if (violations === 0) {
  console.log("All dependency rules satisfied.");
  process.exit(0);
} else {
  console.log(`\n${violations} violation(s) found.`);
  process.exit(1);
}
