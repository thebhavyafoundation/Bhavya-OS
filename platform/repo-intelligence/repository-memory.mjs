#!/usr/bin/env node
/**
 * Bhavya OS — Repository Memory
 * Initializes and manages persistent engineering memory.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const MEMORY_DIR = "F:\\Bhavya Foundation\\memory\\engineering";

// Ensure directory exists
mkdirSync(MEMORY_DIR, { recursive: true });

// ── Memory Schema ────────────────────────────────────────────

const memorySchema = {
  architectureDecisions: [],
  engineeringDecisions: [],
  completedWork: [],
  knownIssues: [],
  technicalDebt: [],
  releaseNotes: [],
  lessonsLearned: [],
};

// ── Initialize Memory ────────────────────────────────────────

function initMemory() {
  const files = [
    "architecture-decisions.json",
    "engineering-decisions.json",
    "completed-work.json",
    "known-issues.json",
    "technical-debt.json",
    "release-notes.json",
    "lessons-learned.json",
  ];

  for (const file of files) {
    const path = join(MEMORY_DIR, file);
    if (!existsSync(path)) {
      writeFileSync(path, JSON.stringify([], null, 2));
      console.log(`  ✅ Created ${file}`);
    }
  }
}

// ── Memory Operations ────────────────────────────────────────

function readMemory(category) {
  const path = join(MEMORY_DIR, `${category}.json`);
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeMemory(category, data) {
  const path = join(MEMORY_DIR, `${category}.json`);
  writeFileSync(path, JSON.stringify(data, null, 2));
}

function addEntry(category, entry) {
  const data = readMemory(category);
  const fullEntry = {
    id: `${category.slice(0, 3)}-${Date.now()}`,
    ...entry,
    timestamp: new Date().toISOString(),
  };
  data.push(fullEntry);
  writeMemory(category, data);
  return fullEntry;
}

function queryMemory(category, filter) {
  const data = readMemory(category);
  if (!filter) return data;
  return data.filter(filter);
}

function getStats() {
  const categories = [
    "architecture-decisions",
    "engineering-decisions",
    "completed-work",
    "known-issues",
    "technical-debt",
    "release-notes",
    "lessons-learned",
  ];
  return categories.reduce((acc, cat) => {
    acc[cat] = readMemory(cat).length;
    return acc;
  }, {});
}

// ── CLI ──────────────────────────────────────────────────────

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case "init":
    console.log("🔧 Initializing Repository Memory...");
    initMemory();
    console.log("✅ Memory initialized");
    break;

  case "stats":
    console.log("📊 Repository Memory Stats:");
    const stats = getStats();
    for (const [cat, count] of Object.entries(stats)) {
      console.log(`  ${cat}: ${count} entries`);
    }
    break;

  case "add":
    if (args.length < 3) {
      console.error("Usage: node repository-memory.mjs add <category> <title> <description>");
      process.exit(1);
    }
    const [category, title, ...descParts] = args;
    const description = descParts.join(" ");
    const entry = addEntry(category, { title, description });
    console.log(`✅ Added entry: ${entry.id}`);
    break;

  case "query":
    if (args.length < 1) {
      console.error("Usage: node repository-memory.mjs query <category>");
      process.exit(1);
    }
    const results = queryMemory(args[0]);
    console.log(JSON.stringify(results, null, 2));
    break;

  default:
    console.log("Bhavya OS — Repository Memory");
    console.log("Commands: init, stats, add, query");
}
