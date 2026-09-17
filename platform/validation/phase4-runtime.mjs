#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "../..");
const results = [];

console.log("Phase 4: AI Runtime Validation\n");

async function testModule(name, testFn) {
  const start = Date.now();
  let passed = false;
  let error = null;
  try {
    await testFn();
    passed = true;
  } catch (e) {
    error = e.message;
  }
  const duration = Date.now() - start;
  results.push({ name, passed, duration, error });
  console.log((passed ? "PASS" : "FAIL") + " " + name + " (" + duration + "ms)");
  if (error) console.log("  Error: " + error);
}

// Import modules
function toFileURL(p) {
  return "file:///" + p.replace(/\\/g, "/");
}
const { Planner } = await import(toFileURL(join(ROOT, "platform/ai-runtime/planner.mjs")));
const { Memory } = await import(toFileURL(join(ROOT, "platform/ai-runtime/memory.mjs")));
const { Execution } = await import(toFileURL(join(ROOT, "platform/ai-runtime/execution.mjs")));
const { Review } = await import(toFileURL(join(ROOT, "platform/ai-runtime/review.mjs")));
const { Workflow } = await import(toFileURL(join(ROOT, "platform/ai-runtime/workflow.mjs")));
const { Registry } = await import(toFileURL(join(ROOT, "platform/ai-runtime/registry.mjs")));
const { State } = await import(toFileURL(join(ROOT, "platform/ai-runtime/state.mjs")));
const { Events } = await import(toFileURL(join(ROOT, "platform/ai-runtime/events.mjs")));
const { Tools } = await import(toFileURL(join(ROOT, "platform/ai-runtime/tools.mjs")));

// Test Planner
await testModule("Planner: createPlan", async () => {
  const p = new Planner();
  const plan = await p.createPlan({ goal: "test" });
  if (!plan.id) throw new Error("No plan ID");
  if (plan.status !== "draft") throw new Error("Wrong status: " + plan.status);
});

await testModule("Planner: addStep", async () => {
  const p = new Planner();
  const plan = await p.createPlan({ goal: "test" });
  await p.addStep(plan.id, { name: "step1", description: "test step" });
  const updated = p.getPlan(plan.id);
  if (updated.steps.length !== 1) throw new Error("Step not added");
});

// Test Memory
await testModule("Memory: addEntry", async () => {
  const mem = new Memory(join(ROOT, "memory/engineering/test.json"));
  mem.addArchitectureDecision({ title: "test", description: "test decision" });
  const stats = mem.getStats();
  if (stats.architectureDecisions !== 1) throw new Error("Entry not saved");
});

await testModule("Memory: query", async () => {
  const mem = new Memory(join(ROOT, "memory/engineering/test.json"));
  const results = mem.query("architectureDecisions");
  if (!Array.isArray(results)) throw new Error("Query failed");
});

// Test Execution
await testModule("Execution: submitTask", async () => {
  const e = new Execution();
  const task = await e.submitTask({ name: "test", type: "test" });
  if (!task.id) throw new Error("No task ID");
  if (task.status !== "queued") throw new Error("Wrong status");
});

await testModule("Execution: completeTask", async () => {
  const e = new Execution();
  const task = await e.submitTask({ name: "test" });
  await e.completeTask(task.id, { result: "done" });
  const completed = e.getTask(task.id);
  if (completed.status !== "completed") throw new Error("Not completed");
});

// Test Review
await testModule("Review: createReview", async () => {
  const r = new Review();
  const review = await r.createReview({ submission: "test" });
  if (!review.id) throw new Error("No review ID");
});

await testModule("Review: runGate", async () => {
  const r = new Review();
  const review = await r.createReview({ submission: "test" });
  await r.runGate(review.id, "typecheck", { passed: true, message: "OK" });
  const updated = r.getReview(review.id);
  if (updated.gateResults.length !== 1) throw new Error("Gate not recorded");
});

// Test Workflow
await testModule("Workflow: registerWorkflow", async () => {
  const w = new Workflow();
  w.registerWorkflow({ id: "test", steps: ["a", "b"] });
  const wf = w.workflows.get("test");
  if (!wf) throw new Error("Workflow not registered");
});

await testModule("Workflow: startInstance", async () => {
  const w = new Workflow();
  w.registerWorkflow({ id: "test", steps: ["a", "b"] });
  const instance = await w.startInstance("test", {});
  if (instance.status !== "running") throw new Error("Not running");
});

// Test Registry
await testModule("Registry: registerAgent", async () => {
  const r = new Registry();
  r.registerAgent({ id: "test-agent", role: "tester" });
  const agent = r.getAgent("test-agent");
  if (!agent) throw new Error("Agent not registered");
});

await testModule("Registry: registerTool", async () => {
  const r = new Registry();
  r.registerTool({ id: "test-tool", name: "Test Tool" });
  const tool = r.getTool("test-tool");
  if (!tool) throw new Error("Tool not registered");
});

// Test State
await testModule("State: set/get", async () => {
  const s = new State();
  s.set("a.b.c", "value");
  const val = s.get("a.b.c");
  if (val !== "value") throw new Error("Value mismatch: " + val);
});

await testModule("State: history", async () => {
  const s = new State();
  s.set("key", "val1");
  s.set("key", "val2");
  const history = s.getHistory();
  if (history.length !== 2) throw new Error("History wrong length");
});

// Test Events
await testModule("Events: on/emit", async () => {
  const e = new Events();
  let received = false;
  e.on("test", () => { received = true; });
  e.emit("test", {});
  if (!received) throw new Error("Event not received");
});

await testModule("Events: history", async () => {
  const e = new Events();
  e.emit("test", { data: 1 });
  const history = e.getHistory();
  if (history.length !== 1) throw new Error("History wrong");
});

// Test Tools
await testModule("Tools: register/execute", async () => {
  const t = new Tools();
  t.register({ id: "echo", execute: async (p) => p });
  const result = await t.execute("echo", { msg: "hi" });
  if (result.result.msg !== "hi") throw new Error("Tool execution failed");
});

// Summary
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;
console.log("\nSummary: " + passed + " passed, " + failed + " failed");

mkdirSync(join(ROOT, "platform", "validation"), { recursive: true });
writeFileSync(join(ROOT, "platform/validation/phase4-ai-runtime.json"), JSON.stringify({ results, passed, failed, timestamp: new Date().toISOString() }, null, 2));
console.log("Phase 4 complete.");
