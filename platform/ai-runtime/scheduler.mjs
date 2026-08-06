/**
 * Bhavya OS — Execution Scheduler
 * Priority Queue, Dependency Queue, Worker Assignment,
 * Concurrency Limits, Resource Awareness, Retry Policy,
 * Failure Recovery, Checkpoint Restore.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = "F:\\Bhavya Foundation";

// ── Priority Levels ──────────────────────────────────────────

export const Priority = {
  CRITICAL: 0,
  HIGH: 1,
  NORMAL: 2,
  LOW: 3,
};

// ── Task States ──────────────────────────────────────────────

export const TaskState = {
  PENDING: "pending",
  QUEUED: "queued",
  ASSIGNED: "assigned",
  EXECUTING: "executing",
  PAUSED: "paused",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  RETRYING: "retrying",
};

// ── Scheduler ────────────────────────────────────────────────

export class ExecutionScheduler {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.tasks = new Map();
    this.queue = []; // sorted by priority
    this.dependencyGraph = new Map(); // taskId -> [dependencyIds]
    this.reverseDeps = new Map(); // taskId -> [dependentIds]
    this.maxConcurrency = config.maxConcurrency || 4;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelayMs = config.retryDelayMs || 5000;
    this.running = 0;
    this.persistencePath = config.persistencePath || join(ROOT, "platform", "ai-runtime", "scheduler-state.json");
    this.workerPool = config.workerPool || null;
    this.resourceMonitor = {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
    };
    this.load();
  }

  // ── Task Submission ─────────────────────────────────────────

  submit(taskDef) {
    const task = {
      id: taskDef.id || `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: taskDef.name,
      type: taskDef.type || "general",
      priority: taskDef.priority ?? Priority.NORMAL,
      state: TaskState.PENDING,
      dependencies: taskDef.dependencies || [],
      payload: taskDef.payload || {},
      result: null,
      error: null,
      attempts: 0,
      maxRetries: taskDef.maxRetries ?? this.maxRetries,
      assignedWorker: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      failedAt: null,
      checkpoints: [],
      timeout: taskDef.timeout || 300000,
    };

    this.tasks.set(task.id, task);

    // Build dependency graph
    this.dependencyGraph.set(task.id, task.dependencies);
    for (const depId of task.dependencies) {
      if (!this.reverseDeps.has(depId)) {
        this.reverseDeps.set(depId, new Set());
      }
      this.reverseDeps.get(depId).add(task.id);
    }

    this.eventBus.emit(EventTypes.TASK_CREATED, {
      taskId: task.id,
      name: task.name,
      type: task.type,
      priority: task.priority,
      dependencies: task.dependencies,
    }, "scheduler");

    // Check if ready to queue
    if (this.dependenciesMet(task.id)) {
      this.enqueue(task.id);
    }

    this.save();
    return task;
  }

  // ── Queue Management ────────────────────────────────────────

  enqueue(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.state = TaskState.QUEUED;
    task.updatedAt = new Date().toISOString();

    // Insert in priority order
    const idx = this.queue.findIndex(id => {
      const t = this.tasks.get(id);
      return t && t.priority > task.priority;
    });
    if (idx === -1) {
      this.queue.push(taskId);
    } else {
      this.queue.splice(idx, 0, taskId);
    }

    this.eventBus.emit("scheduler.task.queued", {
      taskId,
      position: this.queue.indexOf(taskId),
      queueLength: this.queue.length,
    }, "scheduler");

    this.save();
    this.processQueue();
  }

  dependenciesMet(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    return task.dependencies.every(depId => {
      const dep = this.tasks.get(depId);
      return dep && dep.state === TaskState.COMPLETED;
    });
  }

  processQueue() {
    if (!this.workerPool) return;
    while (this.queue.length > 0 && this.running < this.maxConcurrency) {
      const taskId = this.queue.shift();
      const task = this.tasks.get(taskId);

      if (!task || task.state !== TaskState.QUEUED) continue;
      if (!this.dependenciesMet(taskId)) {
        this.queue.unshift(taskId);
        break;
      }

      this.assignTask(taskId);
    }
  }

  // ── Worker Assignment ───────────────────────────────────────

  assignTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    // Find idle worker with matching capabilities
    let worker = null;
    if (this.workerPool) {
      const idleWorkers = this.workerPool.getIdleWorkers();
      worker = idleWorkers.find(w =>
        w.type === task.type || w.capabilities.includes(task.type)
      ) || idleWorkers[0];
    }

    if (!worker) {
      // No worker available, re-queue
      this.queue.unshift(taskId);
      return null;
    }

    task.state = TaskState.ASSIGNED;
    task.assignedWorker = worker.id;
    task.updatedAt = new Date().toISOString();
    this.running++;

    this.eventBus.emit(EventTypes.TASK_ASSIGNED, {
      taskId,
      workerId: worker.id,
    }, "scheduler");

    this.save();
    return worker;
  }

  // ── Task Lifecycle ──────────────────────────────────────────

  startExecution(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.state = TaskState.EXECUTING;
    task.startedAt = new Date().toISOString();
    task.attempts++;
    task.updatedAt = new Date().toISOString();

    this.eventBus.emit("scheduler.task.started", {
      taskId,
      attempt: task.attempts,
    }, "scheduler");

    this.save();
  }

  completeTask(taskId, result) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.state = TaskState.COMPLETED;
    task.result = result;
    task.completedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
    this.running--;

    this.eventBus.emit(EventTypes.TASK_COMPLETED, {
      taskId,
      result,
      duration: new Date(task.completedAt) - new Date(task.startedAt),
    }, "scheduler");

    // Check if any dependent tasks can now be queued
    const dependents = this.reverseDeps.get(taskId) || new Set();
    for (const depId of dependents) {
      if (this.dependenciesMet(depId)) {
        this.enqueue(depId);
      }
    }

    this.processQueue();
    this.save();
  }

  failTask(taskId, error) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.attempts++;
    task.error = error;
    task.updatedAt = new Date().toISOString();

    if (task.attempts < task.maxRetries) {
      // Retry with delay
      task.state = TaskState.RETRYING;
      this.running--;

      this.eventBus.emit(EventTypes.TASK_FAILED, {
        taskId,
        error,
        attempt: task.attempts,
        maxRetries: task.maxRetries,
        willRetry: true,
      }, "scheduler");

      setTimeout(() => {
        task.state = TaskState.PENDING;
        this.enqueue(taskId);
      }, this.retryDelayMs * task.attempts);
    } else {
      // Permanent failure
      task.state = TaskState.FAILED;
      task.failedAt = new Date().toISOString();
      this.running--;

      this.eventBus.emit(EventTypes.TASK_FAILED, {
        taskId,
        error,
        attempt: task.attempts,
        permanent: true,
      }, "scheduler");

      // Unblock dependents
      this.unblockDependents(taskId);
    }

    this.processQueue();
    this.save();
  }

  cancelTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.state = TaskState.CANCELLED;
    task.updatedAt = new Date().toISOString();
    this.running--;

    this.queue = this.queue.filter(id => id !== taskId);

    this.eventBus.emit(EventTypes.TASK_CANCELLED, {
      taskId,
    }, "scheduler");

    // Unblock dependents
    this.unblockDependents(taskId);

    this.processQueue();
    this.save();
  }

  unblockDependents(taskId) {
    const dependents = this.reverseDeps.get(taskId) || new Set();
    for (const depId of dependents) {
      const dep = this.tasks.get(depId);
      if (dep && (dep.state === TaskState.PENDING || dep.state === TaskState.QUEUED)) {
        if (this.dependenciesMet(depId)) {
          this.enqueue(depId);
        }
      }
    }
  }

  // ── Checkpoint ──────────────────────────────────────────────

  checkpoint(taskId, data) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const cp = {
      id: `cp-${Date.now()}`,
      taskId,
      data,
      timestamp: new Date().toISOString(),
      attempt: task.attempts,
    };
    task.checkpoints.push(cp);

    this.eventBus.emit(EventTypes.TASK_CHECKPOINT, {
      taskId,
      checkpointId: cp.id,
      data,
    }, "scheduler");

    this.save();
    return cp;
  }

  restoreFromCheckpoint(taskId, checkpointId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const cp = task.checkpoints.find(c => c.id === checkpointId);
    if (!cp) throw new Error(`Checkpoint ${checkpointId} not found`);

    this.eventBus.emit("scheduler.checkpoint.restored", {
      taskId,
      checkpointId,
      data: cp.data,
    }, "scheduler");

    return cp.data;
  }

  // ── Resource Monitoring ─────────────────────────────────────

  getResourceUsage() {
    // Simplified resource monitoring
    return {
      runningTasks: this.running,
      maxConcurrency: this.maxConcurrency,
      utilization: this.running / this.maxConcurrency,
      queueLength: this.queue.length,
      totalTasks: this.tasks.size,
    };
  }

  // ── Query ───────────────────────────────────────────────────

  getTask(taskId) {
    return this.tasks.get(taskId);
  }

  listTasks(filter = {}) {
    let tasks = [...this.tasks.values()];
    if (filter.state) tasks = tasks.filter(t => t.state === filter.state);
    if (filter.type) tasks = tasks.filter(t => t.type === filter.type);
    if (filter.priority !== undefined) tasks = tasks.filter(t => t.priority === filter.priority);
    return tasks;
  }

  getStats() {
    const tasks = [...this.tasks.values()];
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.state === TaskState.PENDING).length,
      queued: tasks.filter(t => t.state === TaskState.QUEUED).length,
      assigned: tasks.filter(t => t.state === TaskState.ASSIGNED).length,
      executing: tasks.filter(t => t.state === TaskState.EXECUTING).length,
      completed: tasks.filter(t => t.state === TaskState.COMPLETED).length,
      failed: tasks.filter(t => t.state === TaskState.FAILED).length,
      cancelled: tasks.filter(t => t.state === TaskState.CANCELLED).length,
      retrying: tasks.filter(t => t.state === TaskState.RETRYING).length,
      queueLength: this.queue.length,
      running: this.running,
      maxConcurrency: this.maxConcurrency,
    };
  }

  // ── Persistence ─────────────────────────────────────────────

  save() {
    mkdirSync(join(this.persistencePath, ".."), { recursive: true });
    const data = {
      tasks: Object.fromEntries(this.tasks),
      queue: this.queue,
      stats: this.getStats(),
      timestamp: new Date().toISOString(),
    };
    writeFileSync(this.persistencePath, JSON.stringify(data, null, 2));
  }

  load() {
    if (existsSync(this.persistencePath)) {
      try {
        const data = JSON.parse(readFileSync(this.persistencePath, "utf-8"));
        this.tasks = new Map(Object.entries(data.tasks || {}));
        this.queue = data.queue || [];

        // Rebuild dependency graphs
        for (const [id, task] of this.tasks) {
          this.dependencyGraph.set(id, task.dependencies || []);
          for (const depId of task.dependencies || []) {
            if (!this.reverseDeps.has(depId)) {
              this.reverseDeps.set(depId, new Set());
            }
            this.reverseDeps.get(depId).add(id);
          }
        }
      } catch {
        this.tasks = new Map();
        this.queue = [];
      }
    }
  }
}
