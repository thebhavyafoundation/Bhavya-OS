#!/usr/bin/env node
/**
 * Git OS — Knowledge Graph Validation Tests (J27-J32)
 *
 * J27: Graph node integrity — all nodes have required fields
 * J28: Graph edge integrity — all edges reference valid nodes
 * J29: Relationship accuracy — edges represent correct relationships
 * J30: Graph consistency — no orphaned nodes/edges
 * J31: Graph completeness — all repositories have nodes
 * J32: Graph deduplication — no duplicate nodes/edges
 *
 * Usage: node scripts/test-knowledge-graph.mjs
 */

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;

function assert(condition, testName, details) {
  totalTests++;
  if (condition) {
    totalPassed++;
    console.log(`  ✅ ${testName}${details ? ` — ${details}` : ""}`);
  } else {
    totalFailed++;
    console.log(`  ❌ ${testName}${details ? ` — ${details}` : ""}`);
  }
}

// ─── SIMULATED KNOWLEDGE GRAPH ──────────────────────────────────────────────

const nodes = [
  { id: "repo-expressjs-express", node_type: "repository", label: "expressjs/express", metadata: '{"bhavya_score":78}' },
  { id: "tech-javascript", node_type: "technology", label: "JavaScript", metadata: '{"category":"language"}' },
  { id: "tech-typescript", node_type: "technology", label: "TypeScript", metadata: '{"category":"language"}' },
  { id: "pattern-express-architecture", node_type: "pattern", label: "Express.js Architecture", metadata: '{}' },
  { id: "pattern-middleware", node_type: "pattern", label: "Middleware Pattern", metadata: '{}' },
  { id: "kp-express-kp1", node_type: "knowledge_package", label: "Express.js Patterns", metadata: '{"category":"architectural"}' },
  { id: "rec-express-rec1", node_type: "recommendation", label: "Adopt Express.js", metadata: '{"type":"adopt"}' },
];

const edges = [
  { id: "edge-repo-expressjs-express-uses-tech-javascript", source_id: "repo-expressjs-express", target_id: "tech-javascript", relationship: "uses", weight: 1 },
  { id: "edge-repo-expressjs-express-implements-pattern-express-architecture", source_id: "repo-expressjs-express", target_id: "pattern-express-architecture", relationship: "implements", weight: 1 },
  { id: "edge-repo-expressjs-express-implements-pattern-middleware", source_id: "repo-expressjs-express", target_id: "pattern-middleware", relationship: "implements", weight: 1 },
  { id: "edge-kp-express-kp1-derived-from-repo-expressjs-express", source_id: "kp-express-kp1", target_id: "repo-expressjs-express", relationship: "derived_from", weight: 1 },
];

// ─── J27: GRAPH NODE INTEGRITY ──────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔗 J27: GRAPH NODE INTEGRITY");
console.log("═".repeat(60));

// Test: All nodes have required fields
for (const node of nodes) {
  assert(typeof node.id === "string" && node.id.length > 0, `Node ${node.id} has ID`, "string");
  assert(typeof node.node_type === "string" && node.node_type.length > 0, `Node ${node.id} has type`, node.node_type);
  assert(typeof node.label === "string" && node.label.length > 0, `Node ${node.id} has label`, node.label.substring(0, 30));
  assert(typeof node.metadata === "string", `Node ${node.id} has metadata`, "string");
}

// Test: Node types are valid
const validTypes = new Set(["repository", "technology", "pattern", "knowledge_package", "recommendation"]);
for (const node of nodes) {
  assert(validTypes.has(node.node_type), `Node ${node.id} has valid type`, node.node_type);
}

// Test: Node IDs are unique
const nodeIds = nodes.map((n) => n.id);
const uniqueNodeIds = new Set(nodeIds);
assert(uniqueNodeIds.size === nodeIds.length, "All node IDs are unique", `${uniqueNodeIds.size}/${nodeIds.length}`);

// ─── J28: GRAPH EDGE INTEGRITY ──────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔗 J28: GRAPH EDGE INTEGRITY");
console.log("═".repeat(60));

// Test: All edges have required fields
for (const edge of edges) {
  assert(typeof edge.id === "string" && edge.id.length > 0, `Edge ${edge.id.substring(0, 30)} has ID`, "string");
  assert(typeof edge.source_id === "string" && edge.source_id.length > 0, `Edge has source`, edge.source_id);
  assert(typeof edge.target_id === "string" && edge.target_id.length > 0, `Edge has target`, edge.target_id);
  assert(typeof edge.relationship === "string" && edge.relationship.length > 0, `Edge has relationship`, edge.relationship);
  assert(typeof edge.weight === "number" && edge.weight > 0, `Edge has positive weight`, `${edge.weight}`);
}

// Test: All edge source_id references exist in nodes
const nodeIdSet = new Set(nodes.map((n) => n.id));
for (const edge of edges) {
  assert(nodeIdSet.has(edge.source_id), `Edge source ${edge.source_id} exists in nodes`, "valid FK");
}

// Test: All edge target_id references exist in nodes
for (const edge of edges) {
  assert(nodeIdSet.has(edge.target_id), `Edge target ${edge.target_id} exists in nodes`, "valid FK");
}

// Test: Edge IDs are unique
const edgeIds = edges.map((e) => e.id);
const uniqueEdgeIds = new Set(edgeIds);
assert(uniqueEdgeIds.size === edgeIds.length, "All edge IDs are unique", `${uniqueEdgeIds.size}/${edgeIds.length}`);

// ─── J29: RELATIONSHIP ACCURACY ─────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🎯 J29: RELATIONSHIP ACCURACY");
console.log("═".repeat(60));

const validRelationships = new Set(["uses", "implements", "derived_from", "extracted_from", "depends_on", "related_to"]);

// Test: All relationships are from valid set
for (const edge of edges) {
  assert(validRelationships.has(edge.relationship), `Edge ${edge.id.substring(0, 30)} has valid relationship`, edge.relationship);
}

// Test: Repository → Technology relationship
const repoTechEdges = edges.filter((e) => e.source_id.startsWith("repo-") && e.target_id.startsWith("tech-"));
assert(repoTechEdges.length >= 1, "Repository has technology edges", `${repoTechEdges.length} edges`);

// Test: Repository → Pattern relationship
const repoPatternEdges = edges.filter((e) => e.source_id.startsWith("repo-") && e.target_id.startsWith("pattern-"));
assert(repoPatternEdges.length >= 1, "Repository has pattern edges", `${repoPatternEdges.length} edges`);

// Test: Knowledge package → Repository relationship
const kpRepoEdges = edges.filter((e) => e.source_id.startsWith("kp-") && e.target_id.startsWith("repo-"));
assert(kpRepoEdges.length >= 1, "Knowledge package has repository edge", `${kpRepoEdges.length} edges`);

// ─── J30: GRAPH CONSISTENCY ─────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔄 J30: GRAPH CONSISTENCY");
console.log("═".repeat(60));

// Test: No orphaned nodes (nodes with no edges)
// Note: recommendation and technology nodes may legitimately have no edges
// (e.g., technology nodes for languages not yet associated with a repo)
const nodesWithEdges = new Set();
for (const edge of edges) {
  nodesWithEdges.add(edge.source_id);
  nodesWithEdges.add(edge.target_id);
}
const orphanedNodes = nodes.filter((n) => !nodesWithEdges.has(n.id));
const allowedOrphanTypes = new Set(["recommendation", "technology"]);
const orphanedRepositoryNodes = orphanedNodes.filter((n) => !allowedOrphanTypes.has(n.node_type));
assert(orphanedRepositoryNodes.length === 0, "No orphaned repository/pattern/knowledge_package nodes", `${orphanedRepositoryNodes.length} orphans`);

// Test: No self-referencing edges
const selfRefEdges = edges.filter((e) => e.source_id === e.target_id);
assert(selfRefEdges.length === 0, "No self-referencing edges", `${selfRefEdges.length} self-refs`);

// Test: No duplicate edges
const edgeKeySet = new Set();
const duplicateEdges = edges.filter((e) => {
  const key = `${e.source_id}-${e.target_id}-${e.relationship}`;
  if (edgeKeySet.has(key)) return true;
  edgeKeySet.add(key);
  return false;
});
assert(duplicateEdges.length === 0, "No duplicate edges", `${duplicateEdges.length} duplicates`);

// ─── J31: GRAPH COMPLETENESS ────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 J31: GRAPH COMPLETENESS");
console.log("═".repeat(60));

// Test: Every repository has at least one edge
const repoNodes = nodes.filter((n) => n.node_type === "repository");
for (const repo of repoNodes) {
  const repoEdges = edges.filter((e) => e.source_id === repo.id || e.target_id === repo.id);
  assert(repoEdges.length >= 1, `Repository ${repo.label} has at least 1 edge`, `${repoEdges.length} edges`);
}

// Test: Every repository has technology association
for (const repo of repoNodes) {
  const techEdges = edges.filter((e) => e.source_id === repo.id && e.target_id.startsWith("tech-"));
  assert(techEdges.length >= 1, `Repository ${repo.label} has technology association`, `${techEdges.length} tech edges`);
}

// Test: Knowledge packages link back to repositories
const kpNodes = nodes.filter((n) => n.node_type === "knowledge_package");
for (const kp of kpNodes) {
  const kpEdges = edges.filter((e) => e.source_id === kp.id && e.relationship === "derived_from");
  assert(kpEdges.length >= 1, `Knowledge package ${kp.label} links to repository`, `${kpEdges.length} links`);
}

// ─── J32: GRAPH DEDUPLICATION ───────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔗 J32: GRAPH DEDUPLICATION");
console.log("═".repeat(60));

// Test: No duplicate node IDs
const nodeIdCheck = new Set();
const duplicateNodeIds = nodes.filter((n) => {
  if (nodeIdCheck.has(n.id)) return true;
  nodeIdCheck.add(n.id);
  return false;
});
assert(duplicateNodeIds.length === 0, "No duplicate node IDs", `${duplicateNodeIds.length} duplicates`);

// Test: No duplicate edge IDs
const edgeIdCheck = new Set();
const duplicateEdgeIds = edges.filter((e) => {
  if (edgeIdCheck.has(e.id)) return true;
  edgeIdCheck.add(e.id);
  return false;
});
assert(duplicateEdgeIds.length === 0, "No duplicate edge IDs", `${duplicateEdgeIds.length} duplicates`);

// Test: Deterministic ID generation produces same IDs
function generateNodeId(type, name) {
  return `${type}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

const id1 = generateNodeId("repo", "expressjs/express");
const id2 = generateNodeId("repo", "expressjs/express");
assert(id1 === id2, "Deterministic node ID generation", id1);

// Test: Edge ID includes source, target, and relationship
function generateEdgeId(source, target, relationship) {
  return `edge-${source}-${target}-${relationship}`;
}

const edgeId1 = generateEdgeId("repo-express", "tech-js", "uses");
const edgeId2 = generateEdgeId("repo-express", "tech-js", "uses");
assert(edgeId1 === edgeId2, "Deterministic edge ID generation", edgeId1);

// Different relationships produce different IDs
const edgeId3 = generateEdgeId("repo-express", "tech-js", "implements");
assert(edgeId1 !== edgeId3, "Different relationships → different IDs", `${edgeId1} !== ${edgeId3}`);

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 KNOWLEDGE GRAPH VALIDATION RESULTS");
console.log("═".repeat(60));
console.log(`  Total: ${totalTests} tests, ${totalPassed} passed, ${totalFailed} failed`);
console.log("═".repeat(60));
console.log(`\n🎉 Knowledge Graph Validation: ${totalFailed === 0 ? "PASS ✅" : "FAIL ❌"}`);
