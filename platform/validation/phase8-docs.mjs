#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = "F:\\Bhavya Foundation";
const issues = [];

console.log("Phase 8: Documentation Audit\n");

// Check all documentation files
const docsDir = join(ROOT, "docs/platform");
if (!existsSync(docsDir)) {
  issues.push("docs/platform/ directory not found");
  console.log("FAIL: docs/platform/ not found");
} else {
  const docs = readdirSync(docsDir).filter(f => f.endsWith(".md"));
  console.log("Found " + docs.length + " documentation files\n");

  for (const doc of docs) {
    console.log("Auditing " + doc + "...");
    const content = readFileSync(join(docsDir, doc), "utf-8");

    // Check for referenced paths
    const pathMatch = content.match(/`([^`]*(?:apps|packages|platform|docs)\/[^`]*)`/g);
    if (pathMatch) {
      for (const match of pathMatch) {
        const path = match.replace(/`/g, "");
        // Skip template paths
        if (path.includes("*") || path.includes("<")) continue;
        if (!existsSync(join(ROOT, path))) {
          issues.push({ doc, issue: "Referenced path not found: " + path });
        }
      }
    }

    // Check for referenced commands
    const cmdMatch = content.match(/```bash\n([^`]*)```/g);
    if (cmdMatch) {
      for (const match of cmdMatch) {
        const cmds = match.replace(/```bash\n/, "").replace(/```/g, "").split("\n").filter(Boolean);
        for (const cmd of cmds) {
          // Skip template commands
          if (cmd.includes("<") || cmd.includes("#")) continue;
          // We won't actually run commands, just note them
        }
      }
    }

    // Check content quality
    if (content.length < 200) {
      issues.push({ doc, issue: "Document too short (" + content.length + " chars)" });
    }

    if (!content.includes("# ")) {
      issues.push({ doc, issue: "Missing title heading" });
    }

    console.log("  Size: " + content.length + " chars");
  }
}

// Check CLI documentation in bhavya.mjs
console.log("\nAuditing CLI documentation...");
const cliPath = join(ROOT, "packages/runtime/cli/bhavya.mjs");
if (existsSync(cliPath)) {
  const cliContent = readFileSync(cliPath, "utf-8");
  
  // Extract documented commands from help text
  const cmdRegex = /console\.log\("  (\w+)/g;
  let match;
  const documentedCmds = [];
  while ((match = cmdRegex.exec(cliContent))) {
    documentedCmds.push(match[1]);
  }
  
  console.log("  Documented commands: " + documentedCmds.length);
}

console.log("\nIssues: " + issues.length);
for (const issue of issues) {
  if (typeof issue === "string") {
    console.log("  - " + issue);
  } else {
    console.log("  [" + issue.doc + "] " + issue.issue);
  }
}

mkdirSync(join(ROOT, "platform", "validation"), { recursive: true });
writeFileSync(join(ROOT, "platform/validation/phase8-documentation.json"), JSON.stringify({ issues, timestamp: new Date().toISOString() }, null, 2));
console.log("\nPhase 8 complete.");
