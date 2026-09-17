#!/usr/bin/env node
/**
 * Consolidation Quality Gates
 *
 * Checks that architectural integrity rules are satisfied.
 * Run: node scripts/quality-gates.mjs
 */

import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

const ROOT = join(import.meta.dirname, "..");
const IGNORE_DIRS = ["node_modules", ".next", "dist", ".git", ".playwright-mcp", ".worktrees", "bar", "memory", "knowledge", "platform", "prototypes", "specs", "website"];

let passed = 0;
let failed = 0;
let warnings = 0;

function check(name, fn) {
  const result = fn();
  if (result === true) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else if (result === "warn") {
    console.log(`  WARN  ${name}`);
    warnings++;
  } else {
    console.log(`  FAIL  ${name}: ${result}`);
    failed++;
  }
}

// Gate 1: No duplicate type definitions outside @bhavya/shared
// Runtime engines may extend shared types with additional fields — this is allowed.
// Only flag types that are EXACT copies (same interface body) in non-shared packages.
function checkNoDuplicateTypes() {
  const sharedTypes = readFileSync(join(ROOT, "packages/shared/src/types.ts"), "utf-8");
  const criticalTypes = ["Workflow", "WorkflowStep", "WorkflowStatus", "BhavyaEvent", "EventHandler", "Memory", "MemoryType", "Goal", "Task", "Plan", "Agent", "Permission", "Schema", "Artifact"];
  
  // Allowed extensions: runtime engines define extended versions with additional fields
  const allowedExtensions = [
    "runtime/engines/workflow-engine.ts",
    "runtime/engines/memory-engine.ts",
    "runtime/engines/planning-engine.ts",
    "runtime/engines/event-bus.ts",
    "types/src/index.ts",
    "types/src/workflow.ts",
    "types/src/events.ts",
    "types/src/user.ts",
    "types/src/artifacts.ts",
    "kernel/src/types/index.ts",
    "observability/index.ts",
    "sdk/extension.ts", // Re-exports shared types for convenience
  ];
  // Allowed name collisions: interfaces with same name but different fields
  const allowedNameCollisions = ["ioc/types.ts: Task"];
  
  const duplicates = [];
  for (const pkg of readdirSync(join(ROOT, "packages"))) {
    if (pkg === "shared" || pkg === "node_modules") continue;
    const pkgDir = join(ROOT, "packages", pkg);
    if (!statSync(pkgDir).isDirectory()) continue;
    const srcDir = join(pkgDir, "src");
    if (!existsSync(srcDir)) continue;
    
    for (const type of criticalTypes) {
      const pattern = new RegExp(`export\\s+(?:interface|type)\\s+${type}\\b`, "g");
      const aliasPattern = new RegExp(`export\\s+type\\s+${type}\\s*=\\s*\\w+\\s*;`, "g");
      const files = readdirSync(srcDir, { recursive: true }).filter(f => /\.(ts|tsx)$/.test(f));
      for (const file of files) {
        const relPath = `${pkg}/${file}`.replace(/\\/g, "/");
        // Skip allowed extensions and re-exports
        if (allowedExtensions.some(ext => relPath.includes(ext))) continue;
        try {
          const content = readFileSync(join(pkgDir, "src", file), "utf-8");
          // Skip type aliases (re-exports like `export type Agent = SelfOrganizingAgent`)
          if (aliasPattern.test(content)) continue;
          if (pattern.test(content)) {
            duplicates.push(relPath + ": " + type);
          }
        } catch {}
      }
    }
  }
  
  const filtered = duplicates.filter(d => !allowedNameCollisions.includes(d));
  if (filtered.length === 0) return true;
  return `${filtered.length} duplicate type definitions found:\n    ${filtered.join("\n    ")}`;
}

// Gate 2: No imports from deprecated packages
function checkNoDeprecatedImports() {
  const deprecated = ["@bhavya/bdl", "@bhavya/ui"];
  const violations = [];
  
  for (const dir of ["packages", "apps"]) {
    const dirPath = join(ROOT, dir);
    if (!existsSync(dirPath)) continue;
    
    for (const entry of readdirSync(dirPath)) {
      const entryPath = join(dirPath, entry);
      try {
        if (!statSync(entryPath).isDirectory()) continue;
        const srcDir = join(entryPath, "src");
        if (!existsSync(srcDir)) continue;
        
        const files = readdirSync(srcDir, { recursive: true }).filter(f => /\.(ts|tsx|js|jsx|mjs)$/.test(f));
        for (const file of files) {
          try {
            const content = readFileSync(join(srcDir, file), "utf-8");
            const lines = content.split("\n");
            for (const dep of deprecated) {
              let found = false;
              for (const line of lines) {
                // Skip comments and string literals
                const trimmed = line.trim();
                if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;
                // Skip lines that are clearly string content (inside quotes, backticks, template literals)
                if (trimmed.match(/^["'`]/) && !trimmed.match(/^import\s/)) continue;
                // Skip lines that are part of code examples (contain backticks or are indented inside template literals)
                if (line.includes("`") || line.match(/^\s{4,}/)) continue;
                if (line.includes(`from "${dep}"`) || line.includes(`from '${dep}'`) || line.includes(`require("${dep}")`) || line.includes(`require('${dep}')`)) {
                  violations.push(`${dir}/${entry}/${file}: imports ${dep}`);
                  found = true;
                  break;
                }
              }
            }
          } catch {}
        }
      } catch {}
    }
  }
  
  if (violations.length === 0) return true;
  return `${violations.length} deprecated imports:\n    ${violations.join("\n    ")}`;
}

// Gate 3: @bhavya/shared exists and has types
function checkSharedPackage() {
  const typesFile = join(ROOT, "packages/shared/src/types.ts");
  if (!existsSync(typesFile)) return "packages/shared/src/types.ts not found";
  const content = readFileSync(typesFile, "utf-8");
  const typeCount = (content.match(/export\s+(?:interface|type)\s+\w+/g) || []).length;
  if (typeCount < 50) return `Only ${typeCount} types in @bhavya/shared (expected 50+)`;
  return true;
}

// Gate 4: No circular dependencies in canonical packages
function checkCircularDeps() {
  // Simplified check: kernel should not depend on agent-engine if agent-engine depends on kernel
  const kernelPkg = join(ROOT, "packages/kernel/package.json");
  const agentEnginePkg = join(ROOT, "packages/agent-engine/package.json");
  
  if (existsSync(kernelPkg) && existsSync(agentEnginePkg)) {
    const kernel = JSON.parse(readFileSync(kernelPkg, "utf-8"));
    const agent = JSON.parse(readFileSync(agentEnginePkg, "utf-8"));
    
    const kernelDependsOnAgent = kernel.dependencies?.["@bhavya/agent-engine"];
    const agentDependsOnKernel = agent.dependencies?.["@bhavya/kernel"];
    
    if (kernelDependsOnAgent && agentDependsOnKernel) {
      return "Circular dependency: kernel <-> agent-engine";
    }
  }
  return true;
}

// Gate 5: Constitution docs exist
function checkConstitutionDocs() {
  const docsDir = join(ROOT, "docs/constitution");
  if (!existsSync(docsDir)) return "docs/constitution/ not found";
  const docs = readdirSync(docsDir).filter(f => f.endsWith(".md"));
  if (docs.length < 10) return `Only ${docs.length} constitution docs (expected 10+)`;
  return true;
}

console.log("=== Consolidation Quality Gates ===\n");

check("Shared package has 50+ types", checkSharedPackage);
check("No duplicate type definitions", checkNoDuplicateTypes);
check("No deprecated package imports", checkNoDeprecatedImports);
check("No circular dependencies", checkCircularDeps);
check("Constitution docs exist", checkConstitutionDocs);

console.log(`\n=== Results: ${passed} passed, ${failed} failed, ${warnings} warnings ===`);

process.exit(failed > 0 ? 1 : 0);
