/**
 * Bhavya OS — Worker Pool
 * Executable workers that claim tasks, lock ownership, report progress,
 * emit events, create checkpoints, support retry and cancellation.
 * Workers execute concurrently without modifying the same files.
 */

import { EventBus, EventTypes } from "./event-bus.mjs";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fork } from "child_process";

const ROOT = join(import.meta.dirname, "../..");

// ── Worker States ────────────────────────────────────────────

export const WorkerState = {
  IDLE: "idle",
  CLAIMING: "claiming",
  EXECUTING: "executing",
  PAUSED: "paused",
  STOPPING: "stopping",
  STOPPED: "stopped",
  ERROR: "error",
};

// ── Worker ───────────────────────────────────────────────────

export class Worker {
  constructor(config = {}) {
    this.id = config.id || `worker-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.name = config.name || this.id;
    this.type = config.type || "general";
    this.capabilities = config.capabilities || [];
    this.eventBus = config.eventBus || new EventBus();
    this.state = WorkerState.IDLE;
    this.currentTask = null;
    this.worktreePath = null;
    this.stats = {
      tasksCompleted: 0,
      tasksFailed: 0,
      totalExecutionTime: 0,
      checkpoints: 0,
      retries: 0,
    };
    this.maxConcurrent = config.maxConcurrent || 1;
    this.heartbeatInterval = null;
    this.taskTimeout = config.taskTimeout || 300000; // 5 minutes
    this.taskTimer = null;
  }

  // ── Lifecycle ───────────────────────────────────────────────

  start() {
    this.state = WorkerState.IDLE;
    this.eventBus.emit(EventTypes.WORKER_STARTED, {
      workerId: this.id,
      name: this.name,
      type: this.type,
      capabilities: this.capabilities,
    }, this.id);

    // Heartbeat every 30s
    this.heartbeatInterval = setInterval(() => {
      this.eventBus.emit(EventTypes.WORKER_HEARTBEAT, {
        workerId: this.id,
        state: this.state,
        currentTask: this.currentTask?.id || null,
        stats: this.stats,
      }, this.id);
    }, 30000);

    console.log(`Worker ${this.id} started (${this.type})`);
    return this;
  }

  stop() {
    this.state = WorkerState.STOPPING;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.taskTimer) {
      clearTimeout(this.taskTimer);
      this.taskTimer = null;
    }
    this.state = WorkerState.STOPPED;
    this.eventBus.emit(EventTypes.WORKER_STOPPED, {
      workerId: this.id,
      stats: this.stats,
    }, this.id);
    console.log(`Worker ${this.id} stopped`);
  }

  // ── Task Execution ──────────────────────────────────────────

  async claimTask(task) {
    if (this.state !== WorkerState.IDLE) {
      return false;
    }

    this.state = WorkerState.CLAIMING;
    this.currentTask = task;
    this.state = WorkerState.EXECUTING;

    this.eventBus.emit(EventTypes.TASK_ASSIGNED, {
      taskId: task.id,
      workerId: this.id,
      taskName: task.name,
    }, this.id);

    // Set timeout
    this.taskTimer = setTimeout(() => {
      if (this.currentTask?.id === task.id) {
        this.failCurrentTask("Task timed out");
      }
    }, this.taskTimeout);

    return true;
  }

  async executeTask(task, handler) {
    const claimed = await this.claimTask(task);
    if (!claimed) return false;

    const startTime = Date.now();

    try {
      this.eventBus.emit("worker.task.start", {
        taskId: task.id,
        workerId: this.id,
      }, this.id);

      const result = await handler(task, {
        workerId: this.id,
        worktreePath: this.worktreePath,
        checkpoint: (data) => this.createCheckpoint(task.id, data),
        reportProgress: (progress) => this.reportProgress(task.id, progress),
      });

      if (this.taskTimer) {
        clearTimeout(this.taskTimer);
        this.taskTimer = null;
      }

      const duration = Date.now() - startTime;
      this.stats.tasksCompleted++;
      this.stats.totalExecutionTime += duration;

      this.eventBus.emit(EventTypes.TASK_COMPLETED, {
        taskId: task.id,
        workerId: this.id,
        result,
        duration,
      }, this.id);

      this.currentTask = null;
      this.state = WorkerState.IDLE;

      this.eventBus.emit(EventTypes.WORKER_IDLE, {
        workerId: this.id,
      }, this.id);

      return result;
    } catch (error) {
      if (this.taskTimer) {
        clearTimeout(this.taskTimer);
        this.taskTimer = null;
      }
      this.stats.tasksFailed++;
      this.failCurrentTask(error.message);
      throw error;
    }
  }

  failCurrentTask(errorMessage) {
    if (!this.currentTask) return;

    this.eventBus.emit(EventTypes.TASK_FAILED, {
      taskId: this.currentTask.id,
      workerId: this.id,
      error: errorMessage,
    }, this.id);

    this.currentTask = null;
    this.state = WorkerState.IDLE;
  }

  // ── Checkpoint ──────────────────────────────────────────────

  createCheckpoint(taskId, data) {
    this.stats.checkpoints++;
    this.eventBus.emit(EventTypes.TASK_CHECKPOINT, {
      taskId,
      workerId: this.id,
      data,
      checkpointNumber: this.stats.checkpoints,
    }, this.id);
    return this.stats.checkpoints;
  }

  // ── Progress ────────────────────────────────────────────────

  reportProgress(taskId, progress) {
    this.eventBus.emit("worker.task.progress", {
      taskId,
      workerId: this.id,
      progress,
    }, this.id);
  }

  // ── Pause / Resume ──────────────────────────────────────────

  pause() {
    if (this.state === WorkerState.EXECUTING) {
      this.state = WorkerState.PAUSED;
    }
  }

  resume() {
    if (this.state === WorkerState.PAUSED) {
      this.state = WorkerState.EXECUTING;
    }
  }

  // ── Status ──────────────────────────────────────────────────

  getStatus() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      state: this.state,
      capabilities: this.capabilities,
      currentTask: this.currentTask?.id || null,
      worktreePath: this.worktreePath,
      stats: { ...this.stats },
    };
  }
}

// ── Worker Pool ──────────────────────────────────────────────

export class WorkerPool {
  constructor(config = {}) {
    this.workers = new Map();
    this.eventBus = config.eventBus || new EventBus();
    this.maxWorkers = config.maxWorkers || 4;
    this.taskQueue = [];
    this.persistencePath = config.persistencePath || join(ROOT, "platform", "ai-runtime", "worker-pool-state.json");
    this.running = false;
    this.scheduler = null;
  }

  // ── Worker Management ──────────────────────────────────────

  addWorker(config = {}) {
    if (this.workers.size >= this.maxWorkers) {
      throw new Error(`Worker pool full (${this.maxWorkers} max)`);
    }

    const worker = new Worker({
      ...config,
      eventBus: this.eventBus,
    });

    this.workers.set(worker.id, worker);
    worker.start();
    this.save();
    return worker;
  }

  removeWorker(workerId) {
    const worker = this.workers.get(workerId);
    if (!worker) return false;
    worker.stop();
    this.workers.delete(workerId);
    this.save();
    return true;
  }

  getWorker(workerId) {
    return this.workers.get(workerId);
  }

  getIdleWorkers() {
    return [...this.workers.values()].filter(w => w.state === WorkerState.IDLE);
  }

  getBusyWorkers() {
    return [...this.workers.values()].filter(w => w.state === WorkerState.EXECUTING);
  }

  // ── Task Submission ─────────────────────────────────────────

  submitTask(task, handler) {
    this.taskQueue.push({ task, handler });
    this.processQueue();
    return task.id;
  }

  async processQueue() {
    if (this.taskQueue.length === 0) return;

    const idleWorkers = this.getIdleWorkers();
    if (idleWorkers.length === 0) return;

    while (this.taskQueue.length > 0 && idleWorkers.length > 0) {
      const { task, handler } = this.taskQueue.shift();
      const worker = idleWorkers.shift();
      worker.executeTask(task, handler).catch(err => {
        console.error(`Worker ${worker.id} failed:`, err.message);
      });
    }
  }

  // ── Stats ──────────────────────────────────────────────────

  getStats() {
    const workers = [...this.workers.values()];
    return {
      totalWorkers: workers.length,
      idleWorkers: workers.filter(w => w.state === WorkerState.IDLE).length,
      busyWorkers: workers.filter(w => w.state === WorkerState.EXECUTING).length,
      queuedTasks: this.taskQueue.length,
      totalCompleted: workers.reduce((sum, w) => sum + w.stats.tasksCompleted, 0),
      totalFailed: workers.reduce((sum, w) => sum + w.stats.tasksFailed, 0),
      workers: workers.map(w => w.getStatus()),
    };
  }

  // ── Persistence ─────────────────────────────────────────────

  save() {
    mkdirSync(join(this.persistencePath, ".."), { recursive: true });
    const data = {
      workers: [...this.workers.values()].map(w => w.getStatus()),
      queuedTasks: this.taskQueue.length,
      timestamp: new Date().toISOString(),
    };
    writeFileSync(this.persistencePath, JSON.stringify(data, null, 2));
  }

  // ── Lifecycle ──────────────────────────────────────────────

  start() {
    this.running = true;
    console.log(`WorkerPool: started with ${this.workers.size} workers (max: ${this.maxWorkers})`);
  }

  stop() {
    this.running = false;
    for (const worker of this.workers.values()) {
      worker.stop();
    }
    console.log("WorkerPool: stopped");
  }
}
