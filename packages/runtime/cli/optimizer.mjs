/**
 * Context Optimizer — Scored file selection for task context
 *
 * Given a task or goal, the optimizer:
 *   1. Queries the knowledge graph for related entities
 *   2. Scores files by relevance (graph distance + dependency + recency)
 *   3. Returns the top N files within the load budget
 */

import fs from "fs";
import path from "path";

export function optimizeContext(root, taskId, options = {}) {
  const { maxFiles = 8, includeSummaries = true } = options;

  const graphFile = path.join(root, ".ai/graph/graph.json");
  const indexFile = path.join(root, ".ai/index.yaml");
  const contractFile = path.join(root, `.ai/tasks/contracts/${taskId}.json`);

  const graph = fs.existsSync(graphFile) ? JSON.parse(fs.readFileSync(graphFile, "utf8")) : null;
  const contract = fs.existsSync(contractFile) ? JSON.parse(fs.readFileSync(contractFile, "utf8")) : null;

  // Collect seed entities from the task contract
  const seedEntities = new Set();
  if (contract) {
    for (const inp of (contract.inputs || [])) seedEntities.add(inp);
    if (contract.goal) seedEntities.add(contract.goal);
  }
  seedEntities.add(taskId);

  // Score candidates
  const candidates = [];

  // 1. Direct entity matches from graph
  if (graph) {
    for (const seed of seedEntities) {
      const node = graph.nodes.find(n => n.id === seed || n.name?.toUpperCase() === seed.toUpperCase());

      if (node) {
        // Direct match gets highest score
        if (node.path) {
          candidates.push({ file: node.path, score: 100, reason: `direct: ${node.id}` });
        }

        // One-hop neighbors
        const edges = graph.edges.filter(e => e.source === node.id || e.target === node.id);
        for (const edge of edges) {
          const otherId = edge.source === node.id ? edge.target : edge.source;
          const other = graph.nodes.find(n => n.id === otherId);
          if (other?.path) {
            candidates.push({ file: other.path, score: 70, reason: `related: ${node.id} → ${other.id} (${edge.type})` });
          }
        }

        // Two-hop neighbors
        for (const edge of edges) {
          const otherId = edge.source === node.id ? edge.target : edge.source;
          const otherEdges = graph.edges.filter(e => (e.source === otherId || e.target === otherId) && e.source !== node.id && e.target !== node.id);
          for (const e2 of otherEdges) {
            const thirdId = e2.source === otherId ? e2.target : e2.source;
            const third = graph.nodes.find(n => n.id === thirdId);
            if (third?.path && !candidates.find(c => c.file === third.path)) {
              candidates.push({ file: third.path, score: 40, reason: `related: ${node.id} → ${third.id} (2-hop)` });
            }
          }
        }
      }
    }
  }

  // 2. Contract inputs/outputs as file paths
  if (contract) {
    for (const out of (contract.outputs || [])) {
      if (!candidates.find(c => c.file === out)) {
        candidates.push({ file: out, score: 85, reason: `output: ${out}` });
      }
    }
  }

  // 3. Standards and specs referenced by contract
  if (contract) {
    for (const inp of (contract.inputs || [])) {
      if (inp.startsWith("STD-") || inp.startsWith("SPEC-")) {
        // Look up in index.yaml
        if (fs.existsSync(indexFile)) {
          const content = fs.readFileSync(indexFile, "utf8");
          const m = content.match(new RegExp(`\\b${inp}:\\s*(.*)`));
          if (m) {
            const filePath = m[1].trim();
            if (!candidates.find(c => c.file === filePath)) {
              candidates.push({ file: filePath, score: 60, reason: `standard: ${inp}` });
            }
          }
        }
      }
    }
  }

  // 4. Summary files (prefer over full docs)
  if (includeSummaries) {
    const aiDir = path.join(root, ".ai");
    if (fs.existsSync(aiDir)) {
      for (const f of fs.readdirSync(aiDir)) {
        if (f.endsWith(".summary.md")) {
          const fullFile = f.replace(".summary.md", ".md");
          // Only add if we would also include the full
          const baseName = f.replace(".summary.md", "");
          const hasFull = candidates.find(c => c.file.includes(baseName));
          if (hasFull && !candidates.find(c => c.file.includes(f))) {
            candidates.push({ file: `.ai/${f}`, score: hasFull.score + 5, reason: `summary: ${baseName}` });
          }
        }
      }
    }
  }

  // Deduplicate by file, keep highest score
  const deduped = [];
  const seen = new Set();
  for (const c of candidates.sort((a, b) => b.score - a.score)) {
    if (!seen.has(c.file)) {
      seen.add(c.file);
      deduped.push(c);
    }
  }

  // Sort by score, apply budget
  const selected = deduped.slice(0, maxFiles);

  return {
    task: taskId,
    task_title: contract?.title || "unknown",
    budget: { max_files: maxFiles, used: selected.length },
    files: selected.map(c => ({
      path: c.file,
      score: c.score,
      reason: c.reason,
    })),
  };
}
