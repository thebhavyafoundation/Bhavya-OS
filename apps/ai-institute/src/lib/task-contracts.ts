/**
 * Task-contract read model (Mission Control projection).
 *
 * `.ai/tasks` remains the planning source of truth (static contracts +
 * DAG validated by validate-runtime.mjs). This module only READS it and
 * joins linked Mission Control jobs. No writes, no merge, no second DAG.
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

export interface TaskContractProjection {
  id: string;
  title: string;
  status: string;
  priority: string;
  goal: string;
  capability: string;
  dependsOn: string[];
}

function tasksRoot(): string | null {
  let dir = process.cwd();
  while (dir !== join(dir, "..")) {
    if (existsSync(join(dir, ".ai", "tasks", "graph.json"))) return join(dir, ".ai", "tasks");
    dir = join(dir, "..");
  }
  return null;
}

function readJson(path: string): unknown | null {
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

export function listTaskContracts(): TaskContractProjection[] {
  const root = tasksRoot();
  if (!root) return [];
  const graph = readJson(join(root, "graph.json")) as {
    nodes?: { id: string; title: string; status: string; priority: string }[];
    edges?: { source: string; target: string; type: string }[];
  } | null;
  if (!graph) return [];
  const deps = new Map<string, string[]>();
  for (const e of graph.edges ?? []) {
    if (e.type !== "depends") continue;
    deps.set(e.source, [...(deps.get(e.source) ?? []), e.target]);
  }
  return (graph.nodes ?? []).map((n) => {
    const contract = readJson(join(root, "contracts", `${n.id}.json`)) as {
      goal?: string;
      capability?: string;
    } | null;
    return {
      id: n.id,
      title: n.title,
      status: n.status,
      priority: n.priority,
      goal: contract?.goal ?? "",
      capability: contract?.capability ?? "",
      dependsOn: deps.get(n.id) ?? [],
    };
  });
}

export function getTaskContract(id: string): TaskContractProjection | undefined {
  if (!/^[A-Z]+-[0-9]+$/.test(id)) return undefined;
  return listTaskContracts().find((t) => t.id === id);
}

export function listTaskContractIds(): string[] {
  return listTaskContracts().map((t) => t.id);
}
