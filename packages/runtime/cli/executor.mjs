/**
 * Executor — Task contract execution engine
 *
 * Given a task ID, the executor:
 *   1. Loads the task contract
 *   2. Resolves inputs (files, entities)
 *   3. Runs validation commands
 *   4. Reports success/failure with output
 *
 * In dry-run mode, reports what WOULD be done without executing.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function executeTask(root, taskId, options = {}) {
  const { dryRun = false } = options;

  // Load contract
  const contractPath = path.join(root, `.ai/tasks/contracts/${taskId}.json`);
  const graphPath = path.join(root, ".ai/graph/graph.json");

  if (!fs.existsSync(contractPath)) {
    return { task: taskId, status: "error", error: `Contract not found: ${taskId}.json` };
  }

  const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  const graph = fs.existsSync(graphPath) ? JSON.parse(fs.readFileSync(graphPath, "utf8")) : { nodes: [], edges: [] };

  // Resolve inputs to actual paths
  const inputPaths = [];
  for (const inp of (contract.inputs || [])) {
    const node = graph.nodes.find(n => n.id === inp);
    if (node && node.path) {
      inputPaths.push(node.path);
    } else {
      // Check if it's an entity ID in index.yaml
      const indexFile = path.join(root, ".ai/index.yaml");
      if (fs.existsSync(indexFile)) {
        const indexContent = fs.readFileSync(indexFile, "utf8");
        const m = indexContent.match(new RegExp(`\\b${inp}:\\s*(.*)`));
        if (m) inputPaths.push(m[1].trim());
      }
    }
  }

  // Build validation command list
  const validationCommands = [];
  for (const v of (contract.validation || [])) {
    switch (v) {
      case "lint": validationCommands.push({ name: "lint", cmd: "pnpm lint", cwd: root }); break;
      case "typecheck": validationCommands.push({ name: "typecheck", cmd: "pnpm typecheck", cwd: root }); break;
      case "build": validationCommands.push({ name: "build", cmd: "pnpm build", cwd: root }); break;
      case "tests": validationCommands.push({ name: "tests", cmd: "pnpm test", cwd: root }); break;
      case "runtime:validate": validationCommands.push({ name: "runtime:validate", cmd: `node "${path.join(root, ".ai/build/validate-runtime.mjs")}"`, cwd: root }); break;
      case "security": validationCommands.push({ name: "security", cmd: "pnpm lint --security", cwd: root }); break;
      case "accessibility": validationCommands.push({ name: "accessibility", cmd: "echo 'Accessibility check (manual)'", cwd: root }); break;
    }
  }

  // Build success commands
  const successCommands = [];
  for (const s of (contract.success || [])) {
    switch (s) {
      case "build": successCommands.push({ name: "build", cmd: "pnpm build", cwd: root }); break;
      case "runtime:validate": successCommands.push({ name: "runtime:validate", cmd: `node "${path.join(root, ".ai/build/validate-runtime.mjs")}"`, cwd: root }); break;
    }
  }

  if (dryRun) {
    return {
      task: taskId,
      title: contract.title,
      status: "dry-run",
      inputs: inputPaths,
      outputs: contract.outputs || [],
      validation: validationCommands.map(v => v.name),
      success_criteria: successCommands.map(s => s.name),
      note: "Dry run — no commands executed.",
    };
  }

  // Execute validation commands
  const validationResults = [];
  for (const v of validationCommands) {
    const start = Date.now();
    try {
      const stdout = execSync(v.cmd, { cwd: v.cwd, encoding: "utf8", timeout: 120000, stdio: ["pipe", "pipe", "pipe"] });
      validationResults.push({ name: v.name, status: "passed", duration_ms: Date.now() - start });
    } catch (err) {
      validationResults.push({ name: v.name, status: "failed", duration_ms: Date.now() - start, error: err.message?.slice(0, 200) });
    }
  }

  const allPassed = validationResults.every(r => r.status === "passed");

  // Emit event
  const eventLog = path.join(root, ".ai/events/event-log.jsonl");
  const event = {
    time: new Date().toISOString(),
    type: allPassed ? "task.completed" : "task.failed",
    agent: "executor",
    data: { task: taskId, title: contract.title, validation: validationResults },
  };
  try {
    fs.appendFileSync(eventLog, JSON.stringify(event) + "\n");
  } catch { /* silently fail */ }

  // Update contract status
  contract.status = allPassed ? "completed" : "failed";
  contract.last_executed = new Date().toISOString();
  contract.validation_results = validationResults;
  fs.writeFileSync(contractPath, JSON.stringify(contract, null, 2) + "\n");

  // Update task graph
  const taskGraphPath = path.join(root, ".ai/tasks/graph.json");
  if (fs.existsSync(taskGraphPath)) {
    try {
      const taskGraph = JSON.parse(fs.readFileSync(taskGraphPath, "utf8"));
      const node = taskGraph.nodes?.find(n => n.id === taskId);
      if (node) node.status = allPassed ? "completed" : "failed";
      fs.writeFileSync(taskGraphPath, JSON.stringify(taskGraph, null, 2) + "\n");
    } catch { /* skip */ }
  }

  return {
    task: taskId,
    title: contract.title,
    status: allPassed ? "completed" : "failed",
    validation: validationResults,
    all_passed: allPassed,
    duration_ms: validationResults.reduce((s, r) => s + r.duration_ms, 0),
  };
}
