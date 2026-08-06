#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = "F:\\Bhavya Foundation";
const issues = [];

console.log("Phase 9: Technical Debt Identification\n");

// ── Duplicate Code Detection ─────────────────────────────────
console.log("--- Duplicate Code Detection ---");

const platformUIComponents = existsSync(join(ROOT, "packages/platform-ui/src/components"))
  ? readdirSync(join(ROOT, "packages/platform-ui/src/components")).filter(f => f.endsWith(".tsx"))
  : [];

const websiteComponents = existsSync(join(ROOT, "apps/website/src/components"))
  ? readdirSync(join(ROOT, "apps/website/src/components")).filter(f => f.endsWith(".tsx"))
  : [];

const duplicates = platformUIComponents.filter(c => websiteComponents.includes(c));
if (duplicates.length > 0) {
  console.log("  Duplicate components found: " + duplicates.join(", "));
  duplicates.forEach(d => issues.push({ type: "duplicate", item: d, locations: ["packages/platform-ui", "apps/website"] }));
} else {
  console.log("  No duplicate components found");
}

// ── Dead Code Detection ──────────────────────────────────────
console.log("\n--- Dead Code Detection ---");

// Check for unused exports in animation lib
const animationsPath = join(ROOT, "apps/website/src/lib/animations.ts");
if (existsSync(animationsPath)) {
  const animContent = readFileSync(animationsPath, "utf-8");
  const exportMatch = animContent.match(/export\s+(?:function|const)\s+(\w+)/g);
  if (exportMatch) {
    console.log("  Animation exports: " + exportMatch.length);
    // Check if they're used
    const websiteSrc = join(ROOT, "apps/website/src");
    for (const exp of exportMatch) {
      const name = exp.replace(/export\s+(?:function|const)\s+/, "");
      try {
        const usage = execSync(`findstr /s /i "${name}" "${websiteSrc}\\*.tsx" "${websiteSrc}\\*.ts"`, { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
        if (!usage.includes(name)) {
          issues.push({ type: "unused-export", item: name, file: "animations.ts" });
        }
      } catch { /* not found = unused */ }
    }
  }
}

// ── Unused Packages ──────────────────────────────────────────
console.log("\n--- Unused Packages Check ---");

const rootPkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
const allDeps = { ...rootPkg.dependencies, ...rootPkg.devDependencies };
console.log("  Root dependencies: " + Object.keys(allDeps).length);

// Check for heavy dependencies
const heavyDeps = ["@gsap/react", "gsap", "three", "d3", "chart.js"];
for (const dep of heavyDeps) {
  if (allDeps[dep]) {
    issues.push({ type: "heavy-dependency", item: dep, version: allDeps[dep] });
  }
}

// ── Unused Configs ───────────────────────────────────────────
console.log("\n--- Unused Configs ---");

const configs = [
  ".eslintrc.js", ".eslintrc.json", ".eslintrc",
  "jest.config.js", "jest.config.ts",
  "cypress.config.js", "cypress.config.ts",
  ".env.example", ".env.local",
];

for (const config of configs) {
  if (existsSync(join(ROOT, config))) {
    console.log("  Found: " + config);
  }
}

// ── Unused Assets ────────────────────────────────────────────
console.log("\n--- Unused Assets ---");

const websitePublic = join(ROOT, "apps/website/public");
if (existsSync(websitePublic)) {
  const assets = readdirSync(websitePublic, { recursive: true }).filter(f => {
    return f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".svg") || f.endsWith(".ico");
  });
  console.log("  Website assets: " + assets.length);
}

// ── Obsolete Scripts ─────────────────────────────────────────
console.log("\n--- Obsolete Scripts ---");

const scripts = rootPkg.scripts || {};
const obsoletePatterns = ["deploy:old", "build:legacy", "test:skip"];
for (const [name, cmd] of Object.entries(scripts)) {
  for (const pattern of obsoletePatterns) {
    if (name.includes(pattern)) {
      issues.push({ type: "obsolete-script", item: name, command: cmd });
    }
  }
}

// ── Summary ──────────────────────────────────────────────────
console.log("\n--- Technical Debt Summary ---");
console.log("Issues found: " + issues.length);
for (const issue of issues) {
  console.log("  [" + issue.type + "] " + issue.item);
}

mkdirSync(join(ROOT, "platform", "validation"), { recursive: true });
writeFileSync(join(ROOT, "platform/validation/phase9-debt.json"), JSON.stringify({ issues, timestamp: new Date().toISOString() }, null, 2));
console.log("\nPhase 9 complete.");
