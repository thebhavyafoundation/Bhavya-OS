/**
 * Bhavya OS — Task Orchestration
 * Task queue, priority queue, dependencies, retry, checkpoint, cancellation.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export class TaskOrchestrator {
  constructor(config = {}) {
    this.tasks = new Map();
    this.queue = [];
    this.workers = new Map();
    this.checkpoints = new Map();
    this.persistencePath = config.persistencePath || "tasks.json";
    this.maxRetries = config.maxRetries || 3;
    this.load();
  }

  // ── Task Management ────────────────────────────────────────

  createTask(task) {
    const id = task.id || `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const entry = {
      id,
      name: task.name,
      type: task.type || "general",
      priority: task.priority || "normal",
      status: "pending",
      dependencies: task.dependencies || [],
      payload: task.payload || {},
      result: null,
      error: null,
      attempts: 0,
      maxRetries: task.maxRetries || this.maxRetries,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      failedAt: null,
      assignedTo: null,
      checkpoints: [],
    };
    this.tasks.set(id, entry);
    this.addToQueue(id);
    this.save();
    return entry;
  }

  getTask(id) {
    return this.tasks.get(id);
  }

  listTasks(filter) {
    let tasks = [...this.tasks.values()];
    if (filter) {
      if (filter.status) tasks = tasks.filter(t => t.status === filter.status);
      if (filter.type) tasks = tasks.filter(t => t.type === filter.type);
      if (filter.priority) tasks = tasks.filter(t => t.priority === filter.priority);
    }
    return tasks;
  }

  // ── Queue Management ───────────────────────────────────────

  addToQueue(taskId) {
    this.queue.push(taskId);
    this.sortQueue();
  }

  sortQueue() {
    const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
    this.queue.sort((a, b) => {
      const taskA = this.tasks.get(a);
      const taskB = this.tasks.get(b);
      return (priorityOrder[taskA.priority] || 2) - (priorityOrder[taskB.priority] || 2);
    });
  }

  getNextTask() {
    for (const taskId of this.queue) {
      const task = this.tasks.get(taskId);
      if (task.status === "pending" && this.dependenciesMet(taskId)) {
        return task;
      }
    }
    return null;
  }

  dependenciesMet(taskId) {
    const task = this.tasks.get(taskId);
    return task.dependencies.every(depId => {
      const dep = this.tasks.get(depId);
      return dep && dep.status === "completed";
    });
  }

  // ── Worker Management ──────────────────────────────────────

  registerWorker(worker) {
    this.workers.set(worker.id, {
      ...worker,
      status: "idle",
      currentTask: null,
      registeredAt: new Date().toISOString(),
    });
    return worker;
  }

  assignTask(taskId, workerId) {
    const task = this.tasks.get(taskId);
    const worker = this.workers.get(workerId);
    if (!task || !worker) throw new Error("Task or worker not found");

    task.status = "assigned";
    task.assignedTo = workerId;
    task.updatedAt = new Date().toISOString();

    worker.status = "busy";
    worker.currentTask = taskId;

    this.queue = this.queue.filter(id => id !== taskId);
    this.save();
    return task;
  }

  // ── Task Execution ─────────────────────────────────────────

  async startTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.status = "executing";
    task.startedAt = new Date().toISOString();
    task.attempts++;
    task.updatedAt = new Date().toISOString();
    this.save();
    return task;
  }

  async completeTask(taskId, result) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.status = "completed";
    task.result = result;
    task.completedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();

    // Free worker
    if (task.assignedTo) {
      const worker = this.workers.get(task.assignedTo);
      if (worker) {
        worker.status = "idle";
        worker.currentTask = null;
      }
    }

    this.save();
    return task;
  }

  async failTask(taskId, error) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.attempts++;
    task.error = error;

    if (task.attempts < task.maxRetries) {
      task.status = "pending";
      task.assignedTo = null;
      this.addToQueue(taskId);
    } else {
      task.status = "failed";
      task.failedAt = new Date().toISOString();
    }

    task.updatedAt = new Date().toISOString();

    // Free worker
    if (task.assignedTo) {
      const worker = this.workers.get(task.assignedTo);
      if (worker) {
        worker.status = "idle";
        worker.currentTask = null;
      }
    }

    this.save();
    return task;
  }

  // ── Checkpoint ─────────────────────────────────────────────

  checkpoint(taskId, data) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const cp = {
      id: `cp-${Date.now()}`,
      taskId,
      data,
      timestamp: new Date().toISOString(),
    };
    task.checkpoints.push(cp);
    this.checkpoints.set(cp.id, cp);
    this.save();
    return cp;
  }

  // ── Cancellation ───────────────────────────────────────────

  cancelTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.status = "cancelled";
    task.updatedAt = new Date().toISOString();

    // Free worker
    if (task.assignedTo) {
      const worker = this.workers.get(task.assignedTo);
      if (worker) {
        worker.status = "idle";
        worker.currentTask = null;
      }
    }

    this.queue = this.queue.filter(id => id !== taskId);
    this.save();
    return task;
  }

  // ── Persistence ────────────────────────────────────────────

  save() {
    mkdirSync(join(this.persistencePath, ".."), { recursive: true });
    const data = {
      tasks: Object.fromEntries(this.tasks),
      queue: this.queue,
      workers: Object.fromEntries(this.workers),
      checkpoints: Object.fromEntries(this.checkpoints),
    };
    writeFileSync(this.persistencePath, JSON.stringify(data, null, 2));
  }

  load() {
    if (existsSync(this.persistencePath)) {
      try {
        const data = JSON.parse(readFileSync(this.persistencePath, "utf-8"));
        this.tasks = new Map(Object.entries(data.tasks || {}));
        this.queue = data.queue || [];
        this.workers = new Map(Object.entries(data.workers || {}));
        this.checkpoints = new Map(Object.entries(data.checkpoints || {}));
      } catch { /* use defaults */ }
    }
  }

  // ── Stats ──────────────────────────────────────────────────

  getStats() {
    const tasks = [...this.tasks.values()];
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === "pending").length,
      assigned: tasks.filter(t => t.status === "assigned").length,
      executing: tasks.filter(t => t.status === "executing").length,
      completed: tasks.filter(t => t.status === "completed").length,
      failed: tasks.filter(t => t.status === "failed").length,
      cancelled: tasks.filter(t => t.status === "cancelled").length,
      workers: this.workers.size,
      idleWorkers: [...this.workers.values()].filter(w => w.status === "idle").length,
    };
  }
}
