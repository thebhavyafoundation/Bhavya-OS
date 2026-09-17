#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "../..");
const INPUT = join(ROOT, "knowledge", "engineering-graphs");
const issues = [];

console.log("Phase 3: Knowledge Graph Validation\n");

const graphs = [
  "architecture-graph.json",
  "application-graph.json",
  "package-graph.json",
  "component-graph.json",
  "api-graph.json",
  "deployment-graph.json",
  "agent-graph.json",
];

for (const graphFile of graphs) {
  const graphPath = join(INPUT, graphFile);
  if (!existsSync(graphPath)) {
    issues.push({ graph: graphFile, issue: "File missing" });
    continue;
  }

  const graph = JSON.parse(readFileSync(graphPath, "utf-8"));
  console.log("Validating " + graphFile + "...");

  // Check for null/undefined values
  const jsonStr = JSON.stringify(graph);
  if (jsonStr.includes("null")) {
    issues.push({ graph: graphFile, issue: "Contains null values" });
  }

  // Check for empty arrays/objects
  if (jsonStr === "{}" || jsonStr === "[]") {
    issues.push({ graph: graphFile, issue: "Empty graph" });
  }

  // Check nodes/edges if present
  if (graph.nodes) {
    console.log("  Nodes: " + graph.nodes.length);
    const ids = graph.nodes.map(n => n.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length > 0) {
      issues.push({ graph: graphFile, issue: "Duplicate node IDs: " + dupes.join(", ") });
    }
  }

  if (graph.edges) {
    console.log("  Edges: " + graph.edges.length);
    // Check for broken references
    const nodeIds = (graph.nodes || []).map(n => n.id);
    for (const edge of graph.edges) {
      if (edge.from && !nodeIds.includes(edge.from)) {
        issues.push({ graph: graphFile, issue: "Broken edge ref from: " + edge.from });
      }
      if (edge.to && !nodeIds.includes(edge.to)) {
        issues.push({ graph: graphFile, issue: "Broken edge ref to: " + edge.to });
      }
    }
  }

  // Check for required fields
  if (!graph.name) {
    issues.push({ graph: graphFile, issue: "Missing name field" });
  }
  if (!graph.generatedAt) {
    issues.push({ graph: graphFile, issue: "Missing generatedAt field" });
  }
}

console.log("\nIssues found: " + issues.length);
for (const issue of issues) {
  console.log("  [" + issue.graph + "] " + issue.issue);
}

mkdirSync(join(ROOT, "platform", "validation"), { recursive: true });
writeFileSync(join(ROOT, "platform", "validation", "phase3-knowledge-graphs.json"), JSON.stringify({ issues, timestamp: new Date().toISOString() }, null, 2));
console.log("\nPhase 3 complete.");
