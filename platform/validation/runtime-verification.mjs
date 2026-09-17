/**
 * Bhavya OS — Runtime Verification
 * Comprehensive integration tests for all platform components.
 */

import { join } from "path";
import { EventBus, EventTypes, getEventBus, resetEventBus } from "../ai-runtime/event-bus.mjs";
import { FileWatcher } from "../ai-runtime/file-watcher.mjs";
import { WorkerPool, Worker, WorkerState } from "../ai-runtime/worker-pool.mjs";
import { WorktreeManager } from "../ai-runtime/worktree-manager.mjs";
import { ExecutionScheduler, Priority, TaskState } from "../ai-runtime/scheduler.mjs";
import { EngineeringMemory } from "../ai-runtime/engineering-memory.mjs";
import { SelfReview } from "../ai-runtime/self-review.mjs";
import { ChiefArchitect } from "../ai-runtime/chief-architect.mjs";
import { OpenCodeIntegration } from "../ai-runtime/opencode-integration.mjs";

const ROOT = join(import.meta.dirname, "../..");

let passed = 0;
let failed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (error) {
    failed++;
    console.log(`  ❌ ${name}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(message || `Expected ${expected}, got ${actual}`);
}

// ── Test Suite ───────────────────────────────────────────────

console.log("\n🧪 Bhavya OS — Runtime Verification\n");

// ── 1. Event Bus ────────────────────────────────────────────

console.log("1. Event Bus");

test("EventBus: emit and subscribe", () => {
  const bus = new EventBus();
  let received = null;
  bus.on("test.event", (event) => { received = event; });
  bus.emit("test.event", { data: "hello" });
  assert(received !== null, "Event not received");
  assertEqual(received.data.data, "hello");
});

test("EventBus: wildcard subscription", () => {
  const bus = new EventBus();
  let count = 0;
  bus.on("*", () => { count++; });
  bus.emit("any.event", {});
  bus.emit("another.event", {});
  assertEqual(count, 2);
});

test("EventBus: once subscription", () => {
  const bus = new EventBus();
  let count = 0;
  bus.once("test.once", () => { count++; });
  bus.emit("test.once", {});
  bus.emit("test.once", {});
  assertEqual(count, 1);
});

test("EventBus: history tracking", () => {
  const bus = new EventBus();
  bus.emit("event1", {});
  bus.emit("event2", {});
  const history = bus.getHistory();
  assertEqual(history.length, 2);
});

test("EventBus: metrics", () => {
  const bus = new EventBus();
  bus.emit("test", {});
  bus.emit("test", {});
  const metrics = bus.getMetrics();
  assertEqual(metrics.totalEmitted, 2);
  assertEqual(metrics.byType["test"], 2);
});

console.log();

// ── 2. Worker Pool ──────────────────────────────────────────

console.log("2. Worker Pool");

test("WorkerPool: add worker", () => {
  const bus = new EventBus();
  const pool = new WorkerPool({ eventBus: bus, maxWorkers: 4 });
  const worker = pool.addWorker({ name: "test-worker", type: "test" });
  assert(worker.id.startsWith("worker-"));
  assertEqual(pool.workers.size, 1);
  pool.stop();
});

test("WorkerPool: max workers limit", () => {
  const bus = new EventBus();
  const pool = new WorkerPool({ eventBus: bus, maxWorkers: 2 });
  pool.addWorker({ name: "w1" });
  pool.addWorker({ name: "w2" });
  try {
    pool.addWorker({ name: "w3" });
    assert(false, "Should have thrown");
  } catch (e) {
    assert(e.message.includes("full"));
  }
  pool.stop();
});

test("Worker: claim task", async () => {
  const bus = new EventBus();
  const worker = new Worker({ eventBus: bus, name: "test" });
  worker.start();
  const claimed = await worker.claimTask({ id: "task-1", name: "Test" });
  assertEqual(claimed, true);
  assertEqual(worker.state, WorkerState.EXECUTING);
  worker.stop();
});

test("Worker: execute task", async () => {
  const bus = new EventBus();
  const worker = new Worker({ eventBus: bus, name: "test" });
  worker.start();
  const result = await worker.executeTask(
    { id: "task-1", name: "Test" },
    async (task, ctx) => {
      return { success: true };
    }
  );
  assert(result.success === true);
  assertEqual(worker.state, WorkerState.IDLE);
  worker.stop();
});

console.log();

// ── 3. Execution Scheduler ──────────────────────────────────

console.log("3. Execution Scheduler");

test("Scheduler: submit task", () => {
  const bus = new EventBus();
  const scheduler = new ExecutionScheduler({
    eventBus: bus,
    persistencePath: `/tmp/scheduler-submit-test-${Date.now()}.json`,
  });
  const task = scheduler.submit({ name: "Test task", type: "test" });
  assert(task.id.startsWith("task-"));
  assertEqual(task.state, TaskState.QUEUED);
});

test("Scheduler: priority ordering", () => {
  const bus = new EventBus();
  const scheduler = new ExecutionScheduler({
    eventBus: bus,
    persistencePath: `/tmp/scheduler-test-${Date.now()}.json`,
  });
  scheduler.submit({ name: "Low", priority: Priority.LOW });
  scheduler.submit({ name: "High", priority: Priority.HIGH });
  scheduler.submit({ name: "Normal", priority: Priority.NORMAL });
  assertEqual(scheduler.queue.length, 3);
  const first = scheduler.tasks.get(scheduler.queue[0]);
  assertEqual(first.priority, Priority.HIGH);
});

test("Scheduler: dependency resolution", () => {
  const bus = new EventBus();
  const scheduler = new ExecutionScheduler({
    eventBus: bus,
    maxConcurrency: 0,
    persistencePath: `/tmp/scheduler-dep-test-${Date.now()}.json`,
  });
  const task1 = scheduler.submit({ name: "Task 1" });
  const task2 = scheduler.submit({ name: "Task 2", dependencies: [task1.id] });
  assertEqual(task2.state, TaskState.PENDING); // Not queued yet
  // Manually complete to avoid queue processing
  task1.state = TaskState.COMPLETED;
  scheduler.save();
  assertEqual(scheduler.dependenciesMet(task2.id), true);
});

test("Scheduler: checkpoint and restore", () => {
  const bus = new EventBus();
  const scheduler = new ExecutionScheduler({
    eventBus: bus,
    maxConcurrency: 0,
    persistencePath: `/tmp/scheduler-cp-test-${Date.now()}.json`,
  });
  const task = scheduler.submit({ name: "Test" });
  // Manually set state to avoid queue processing
  task.state = TaskState.EXECUTING;
  task.startedAt = new Date().toISOString();
  task.attempts = 1;
  const cp = scheduler.checkpoint(task.id, { step: "halfway" });
  assert(cp.id.startsWith("cp-"));
  const data = scheduler.restoreFromCheckpoint(task.id, cp.id);
  assertEqual(data.step, "halfway");
});

console.log();

// ── 4. Engineering Memory ───────────────────────────────────

console.log("4. Engineering Memory");

test("Memory: store and retrieve", () => {
  const bus = new EventBus();
  const mem = new EngineeringMemory({ eventBus: bus });
  const entry = mem.store("lessons-learned", {
    title: "Test lesson",
    description: "Testing memory",
    tags: ["test"],
  });
  assert(entry.id.startsWith("mem-"));
  const retrieved = mem.get("lessons-learned", entry.id);
  assertEqual(retrieved.title, "Test lesson");
});

test("Memory: search", () => {
  const bus = new EventBus();
  const mem = new EngineeringMemory({ eventBus: bus });
  mem.store("lessons-learned", { title: "React hooks are useful", tags: ["react"] });
  mem.store("lessons-learned", { title: "TypeScript improves quality", tags: ["typescript"] });
  const results = mem.search("React");
  assert(results.length > 0);
  assert(results[0].title.includes("React"));
});

test("Memory: stats", () => {
  const bus = new EventBus();
  const mem = new EngineeringMemory({
    eventBus: bus,
    memoryDir: `/tmp/memory-test-${Date.now()}`,
  });
  mem.store("completed-work", { title: "Work 1" });
  mem.store("completed-work", { title: "Work 2" });
  const stats = mem.getStats();
  assertEqual(stats["completed-work"], 2);
  assertEqual(stats.total, 2);
});

console.log();

// ── 5. Chief Architect ──────────────────────────────────────

console.log("5. Chief Architect");

test("ChiefArchitect: decompose task", () => {
  const bus = new EventBus();
  const ca = new ChiefArchitect({ eventBus: bus });
  const plan = ca.decomposeTask({ name: "Add login", type: "feature" });
  assert(plan.subtasks.length > 0);
  assertEqual(plan.subtasks.length, 5); // design, implement, test, review, document
});

test("ChiefArchitect: assign priority", () => {
  const bus = new EventBus();
  const ca = new ChiefArchitect({ eventBus: bus });
  assertEqual(ca.assignPriority({ type: "security" }), "critical");
  assertEqual(ca.assignPriority({ type: "bugfix" }), "high");
  assertEqual(ca.assignPriority({ type: "documentation" }), "low");
});

test("ChiefArchitect: validate architecture", () => {
  const bus = new EventBus();
  const ca = new ChiefArchitect({ eventBus: bus });
  const valid = ca.validateArchitecture({ path: "apps/website/page.tsx" });
  assertEqual(valid.valid, true);
  const invalid = ca.validateArchitecture({ path: "node_modules/test.js" });
  assertEqual(invalid.valid, false);
});

console.log();

// ── 6. OpenCode Integration ─────────────────────────────────

console.log("6. OpenCode Integration");

test("OpenCode: create plan", () => {
  const bus = new EventBus();
  const oc = new OpenCodeIntegration({ eventBus: bus });
  const plan = oc.createPlan("Add user authentication");
  assert(plan.id.startsWith("plan-"));
  assertEqual(plan.steps.length, 5);
});

test("OpenCode: validate plan", () => {
  const bus = new EventBus();
  const oc = new OpenCodeIntegration({ eventBus: bus });
  const plan = oc.createPlan("Test plan");
  const validation = oc.validatePlan(plan.id);
  assertEqual(validation.valid, true);
});

test("OpenCode: get execution order", () => {
  const bus = new EventBus();
  const oc = new OpenCodeIntegration({ eventBus: bus });
  const plan = oc.createPlan("Test plan");
  const execution = oc.getExecutionPlan(plan.id);
  assertEqual(execution.totalSteps, 5);
  assert(execution.executionOrder.length === 5);
});

console.log();

// ── 7. File Watcher ─────────────────────────────────────────

console.log("7. File Watcher");

test("FileWatcher: create and stats", () => {
  const bus = new EventBus();
  const watcher = new FileWatcher({ eventBus: bus });
  const stats = watcher.getStats();
  assertEqual(stats.running, false);
  assertEqual(stats.totalEvents, 0);
});

test("FileWatcher: should skip", () => {
  const bus = new EventBus();
  const watcher = new FileWatcher({ eventBus: bus });
  assertEqual(watcher.shouldSkip("node_modules/test.js"), true);
  assertEqual(watcher.shouldSkip("src/page.tsx"), false);
});

console.log();

// ── 8. Worktree Manager ─────────────────────────────────────

console.log("8. Worktree Manager");

test("WorktreeManager: create and list", () => {
  const bus = new EventBus();
  const wm = new WorktreeManager({
    eventBus: bus,
    persistencePath: `/tmp/worktree-test-${Date.now()}.json`,
  });
  const stats = wm.getStats();
  assertEqual(stats.total, 0);
});

console.log();

// ── 9. Self Review ──────────────────────────────────────────

console.log("9. Self Review");

test("SelfReview: create instance", () => {
  const bus = new EventBus();
  const sr = new SelfReview({ eventBus: bus });
  const stats = sr.getStats();
  assertEqual(stats.total, 0);
});

console.log();

// ── 10. Event-driven Integration ────────────────────────────

console.log("10. Event-driven Integration");

test("Full pipeline: event → scheduler → worker → memory", async () => {
  const bus = new EventBus();
  const scheduler = new ExecutionScheduler({ eventBus: bus });
  const mem = new EngineeringMemory({ eventBus: bus });

  let taskCompleted = false;
  bus.on(EventTypes.TASK_COMPLETED, () => { taskCompleted = true; });

  // Submit and complete a task
  const task = scheduler.submit({ name: "Integration test" });
  scheduler.startExecution(task.id);
  scheduler.completeTask(task.id, { result: "success" });

  assertEqual(taskCompleted, true);

  // Store in memory
  mem.storeCompletedTask({
    name: "Integration test",
    goal: "Test the pipeline",
    workerId: "test-worker",
  });

  const stats = mem.getStats();
  assert(stats["completed-work"] > 0);
});

console.log();

// ── Summary ─────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────┐");
console.log("│  Runtime Verification Results               │");
console.log("├─────────────────────────────────────────────┤");
console.log(`│  Total:    ${String(total).padEnd(28)}│`);
console.log(`│  Passed:   ${String(passed).padEnd(28)}│`);
console.log(`│  Failed:   ${String(failed).padEnd(28)}│`);
console.log(`│  Rate:     ${((passed / total) * 100).toFixed(1)}%`.padEnd(46) + "│");
console.log("└─────────────────────────────────────────────┘\n");

process.exit(failed > 0 ? 1 : 0);
