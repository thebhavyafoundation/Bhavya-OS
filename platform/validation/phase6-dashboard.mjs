#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = "F:\\Bhavya Foundation";
const issues = [];

console.log("Phase 6: Dashboard Validation\n");

// Check dashboard HTML exists
const dashboardPath = join(ROOT, "platform/dashboard/dashboard.html");
if (!existsSync(dashboardPath)) {
  issues.push("Dashboard HTML not found");
  console.log("FAIL: Dashboard HTML not found");
} else {
  console.log("PASS: Dashboard HTML exists");
  
  const html = readFileSync(dashboardPath, "utf-8");
  
  // Check for mocked values
  const mockedPatterns = [
    "Lorem ipsum",
    "placeholder",
    "mock",
    "fake",
    "dummy",
    "sample",
    "example.com",
    "test@test",
  ];
  
  for (const pattern of mockedPatterns) {
    if (html.toLowerCase().includes(pattern.toLowerCase())) {
      issues.push("Found mocked value: " + pattern);
    }
  }
  
  // Check for required sections
  const requiredSections = [
    "Repository Overview",
    "Package Distribution",
    "Git Activity",
    "Architecture Health",
  ];
  
  for (const section of requiredSections) {
    if (!html.includes(section)) {
      issues.push("Missing section: " + section);
    } else {
      console.log("PASS: Section found: " + section);
    }
  }
  
  // Check that stats are from actual data
  if (html.includes("13,126") || html.includes("13126")) {
    console.log("PASS: Uses actual file count");
  } else {
    issues.push("File count may not be from live data");
  }
}

// Check generator exists
const genPath = join(ROOT, "platform/dashboard/generate.mjs");
if (!existsSync(genPath)) {
  issues.push("Dashboard generator not found");
} else {
  console.log("PASS: Dashboard generator exists");
  
  // Verify generator reads from actual data
  const genContent = readFileSync(genPath, "utf-8");
  if (genContent.includes("repository-index.json")) {
    console.log("PASS: Generator reads from repository-index.json");
  } else {
    issues.push("Generator does not read from repository-index.json");
  }
}

console.log("\nIssues: " + issues.length);
for (const issue of issues) {
  console.log("  - " + issue);
}

mkdirSync(join(ROOT, "platform", "validation"), { recursive: true });
writeFileSync(join(ROOT, "platform/validation/phase6-dashboard.json"), JSON.stringify({ issues, timestamp: new Date().toISOString() }, null, 2));
console.log("\nPhase 6 complete.");
