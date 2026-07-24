/**
 * Planner — Goal → Execution Plan derivation
 *
 * Given a goal (e.g., "Build APP-001"), the planner:
 *   1. Parses the goal to identify target entities
 *   2. Looks up the entity in the knowledge graph
 *   3. Finds available task contracts that satisfy the goal
 *   4. Orders tasks by dependency (derived from graph edges + contract inputs)
 *   5. Returns an execution plan with task sequence, dependencies, and estimated effort
 */

import fs from "fs";
import path from "path";

export function buildPlan(root, goal) {
  const graphFile = path.join(root, ".ai/graph/graph.json");
  const contractsDir = path.join(root, ".ai/tasks/contracts");
  const stateFile = path.join(root, ".ai/state/repository.json");

  const graph = fs.existsSync(graphFile) ? JSON.parse(fs.readFileSync(graphFile, "utf8")) : null;
  const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : null;

  // Parse goal to find target entity
  const goalUpper = goal.toUpperCase();
  const targetEntity = findTargetEntity(goalUpper, graph);

  // Find matching contracts
  const contracts = [];
  if (fs.existsSync(contractsDir)) {
    for (const f of fs.readdirSync(contractsDir).filter(f => f.endsWith(".json"))) {
      try {
        const c = JSON.parse(fs.readFileSync(path.join(contractsDir, f), "utf8"));
        contracts.push(c);
      } catch { /* skip invalid */ }
    }
  }

  // Score contracts by relevance to goal
  const scored = contracts.map(c => ({
    ...c,
    _score: scoreContract(c, goalUpper, targetEntity),
  })).filter(c => c._score > 0);

  // Sort by score descending, then priority, then deps
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  scored.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
  });

  // Order by dependencies (topological sort)
  const ordered = topologicalSort(scored);

  const totalMinutes = ordered.reduce((sum, t) => sum + (t.estimated_minutes || 30), 0);

  return {
    goal,
    target_entity: targetEntity,
    timestamp: new Date().toISOString(),
    tasks: ordered.map(t => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      capability: t.capability,
      inputs: t.inputs,
      outputs: t.outputs,
      estimated_minutes: t.estimated_minutes || 30,
      status: t.status,
    })),
    summary: {
      total_tasks: ordered.length,
      estimated_minutes: totalMinutes,
      estimated_hours: Math.round(totalMinutes / 60 * 10) / 10,
      blocked_by: state?.blocked?.length ? state.blocked : [],
    },
  };
}

function findTargetEntity(goal, graph) {
  if (!graph) return null;

  // Look for explicit entity IDs
  const appMatch = goal.match(/APP-(\d+)/);
  if (appMatch) {
    const node = graph.nodes.find(n => n.id === `APP-${appMatch[1]}`);
    return node ? { id: node.id, name: node.name, type: node.type, path: node.path } : { id: `APP-${appMatch[1]}`, type: "app" };
  }

  const pkgMatch = goal.match(/PKG-(\d+)/);
  if (pkgMatch) {
    const node = graph.nodes.find(n => n.id === `PKG-${pkgMatch[1]}`);
    return node ? { id: node.id, name: node.name, type: node.type, path: node.path } : { id: `PKG-${pkgMatch[1]}`, type: "package" };
  }

  // Fuzzy match by name in goal
  for (const node of graph.nodes) {
    if (goal.includes(node.name?.toUpperCase()) || goal.includes(node.id)) {
      return { id: node.id, name: node.name, type: node.type, path: node.path };
    }
  }

  return null;
}

function scoreContract(contract, goalUpper, targetEntity) {
  let score = 0;

  // Direct match: contract goal matches goal
  if (contract.goal && goalUpper.includes(contract.goal.toUpperCase())) {
    score += 100;
  }

  // Input match: contract uses the target entity
  if (targetEntity && contract.inputs?.includes(targetEntity.id)) {
    score += 50;
  }

  // Title match: contract title contains goal keywords
  const goalWords = goalUpper.replace(/-/g, " ").split(/\s+/).filter(w => w.length > 3);
  for (const word of goalWords) {
    if (contract.title?.toUpperCase().includes(word)) {
      score += 20;
    }
  }

  // Entity reference: contract mentions the goal text
  if (contract.inputs?.some(i => goalUpper.includes(i))) {
    score += 30;
  }

  // Prefer high priority
  if (contract.priority === "high") score += 10;
  if (contract.priority === "medium") score += 5;

  return score;
}

function topologicalSort(tasks) {
  // Build adjacency: which tasks depend on which
  const graph = {};
  const idToTask = {};
  for (const t of tasks) {
    graph[t.id] = [];
    idToTask[t.id] = t;
  }

  // Dependencies: if task A's inputs match another task's outputs, A depends on that task
  for (const t of tasks) {
    for (const other of tasks) {
      if (t.id === other.id) continue;
      if (t.inputs?.some(inp => other.outputs?.some(out => inp.includes(out) || out.includes(inp)))) {
        graph[t.id].push(other.id);
      }
    }
  }

  // Kahn's algorithm
  const inDegree = {};
  for (const id of Object.keys(graph)) inDegree[id] = 0;
  for (const id of Object.keys(graph)) {
    for (const dep of graph[id]) {
      inDegree[dep] = (inDegree[dep] || 0) + 1;
    }
  }

  const queue = Object.keys(inDegree).filter(id => inDegree[id] === 0);
  const sorted = [];

  while (queue.length > 0) {
    const id = queue.shift();
    sorted.push(idToTask[id]);
    for (const dep of graph[id]) {
      inDegree[dep]--;
      if (inDegree[dep] === 0) queue.push(dep);
    }
  }

  // Append any remaining (cycles or no-dependency tasks)
  for (const t of tasks) {
    if (!sorted.find(s => s.id === t.id)) sorted.push(t);
  }

  return sorted;
}
