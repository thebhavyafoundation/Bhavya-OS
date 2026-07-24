/**
 * Orchestrator — Multi-agent work allocation
 *
 * Given a goal, the orchestrator:
 *   1. Calls the planner to derive an execution plan
 *   2. For each task, finds an agent with matching capability from registry
 *   3. Assigns each task with context budget and output contract
 *   4. Returns an execution report with agent assignments
 */

import fs from "fs";
import path from "path";

export async function orchestrate(root, goal) {
  const { buildPlan } = await import("./planner.mjs");
  const { optimizeContext } = await import("./optimizer.mjs");

  const registryFile = path.join(root, ".ai/agents/registry.yaml");
  const eventLog = path.join(root, ".ai/events/event-log.jsonl");

  // Load agent registry
  const registry = parseRegistry(registryFile);
  const agents = registry.agents || {};

  // Build plan
  const plan = buildPlan(root, goal);

  // Assign tasks to agents
  const assignments = [];
  for (const task of plan.tasks) {
    // Find best agent by capability
    const bestAgent = findBestAgent(agents, task.capability);
    const context = optimizeContext(root, task.id, { maxFiles: bestAgent?.max_files || 8 });

    assignments.push({
      task: task.id,
      title: task.title,
      assigned_to: bestAgent?.id || "unassigned",
      capability_match: task.capability,
      context_files: context.files.length,
      context_budget: bestAgent?.max_files || 8,
      estimated_minutes: task.estimated_minutes,
      priority: task.priority,
    });
  }

  // Emit orchestration event
  const event = {
    time: new Date().toISOString(),
    type: "orchestration.plan",
    agent: "orchestrator",
    data: { goal, task_count: assignments.length, assignable: assignments.filter(a => a.assigned_to !== "unassigned").length },
  };
  try {
    fs.appendFileSync(eventLog, JSON.stringify(event) + "\n");
  } catch { /* silently fail */ }

  return {
    goal,
    timestamp: new Date().toISOString(),
    plan_summary: plan.summary,
    execution_order: assignments.map(a => `${a.task} → ${a.assigned_to} (${a.capability_match})`),
    assignments,
    unassigned: assignments.filter(a => a.assigned_to === "unassigned").map(a => a.task),
    next_step: assignments.length > 0
      ? `Run: bhavya execute ${assignments[0].task}`
      : "No tasks to execute.",
  };
}

function findBestAgent(agents, capability) {
  if (!agents || !capability) return null;

  let best = null;
  let bestScore = 0;

  for (const [id, agent] of Object.entries(agents)) {
    const caps = agent.capabilities || [];
    if (caps.includes(capability)) {
      // Exact match scores highest
      const score = 100;
      if (score > bestScore) { bestScore = score; best = { id, ...agent }; }
    } else {
      // Partial match
      for (const cap of caps) {
        if (capability.includes(cap) || cap.includes(capability)) {
          const score = 50;
          if (score > bestScore) { bestScore = score; best = { id, ...agent }; }
        }
      }
    }
  }

  return best;
}

function parseRegistry(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const result = { agents: {} };
  let currentAgent = null;
  let currentArray = null;

  for (const line of content.split("\n")) {
    if (line.startsWith("#") || line.startsWith("---") || line.trim() === "") continue;

    // Agent declaration: "  frontend:"
    const agentMatch = line.match(/^  (\w+):\s*$/);
    if (agentMatch) {
      currentAgent = agentMatch[1];
      result.agents[currentAgent] = { capabilities: [], loads: [], max_files: 5 };
      currentArray = null;
      continue;
    }

    if (!currentAgent) continue;

    // List property: "    capabilities:"
    const listMatch = line.match(/^    (\w+):\s*$/);
    if (listMatch) {
      currentArray = listMatch[1];
      continue;
    }

    // List item: "      - value"
    const itemMatch = line.match(/^      -\s*(.+)/);
    if (itemMatch && currentArray && result.agents[currentAgent][currentArray]) {
      result.agents[currentAgent][currentArray].push(itemMatch[1]);
      continue;
    }

    // Key-value: "    max_files: 8"
    const kvMatch = line.match(/^    (\w+):\s*(.+)/);
    if (kvMatch) {
      const val = kvMatch[2].trim().replace(/^"(.*)"$/, "$1");
      result.agents[currentAgent][kvMatch[1]] = isNaN(val) ? val : Number(val);
    }
  }

  return result;
}
