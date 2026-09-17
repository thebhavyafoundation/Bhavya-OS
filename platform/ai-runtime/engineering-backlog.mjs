/**
 * Bhavya OS v3 — Engineering Backlog
 * Persistent engineering backlog with full task metadata.
 * Every task has: ID, Title, Description, Priority, Dependencies,
 * Owner, Worker, Status, Evidence, Artifacts, Review, Metrics, History.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = join(import.meta.dirname, "../..");
const BACKLOG_DIR = join(ROOT, "platform/ai-runtime/backlog");

export const TaskPriority = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
export const TaskStatus = {
  BACKLOG: "backlog", PLANNED: "planned", QUEUED: "queued",
  ASSIGNED: "assigned", EXECUTING: "executing", REVIEW: "review",
  TESTING: "testing", COMPLETED: "completed", FAILED: "failed",
  CANCELLED: "cancelled", BLOCKED: "blocked",
};

export class EngineeringBacklog {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.backlogDir = config.backlogDir || BACKLOG_DIR;
    this.tasks = new Map();
    this.sprints = [];
    this.metrics = { totalCreated: 0, totalCompleted: 0, totalFailed: 0, avgCycleTime: 0 };
    mkdirSync(this.backlogDir, { recursive: true });
    this.load();
  }

  // ── Create Task ────────────────────────────────────────────

  createTask(taskDef) {
    const id = taskDef.id || `ENG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const task = {
      id,
      title: taskDef.title,
      description: taskDef.description || "",
      priority: taskDef.priority ?? TaskPriority.NORMAL,
      status: TaskStatus.BACKLOG,
      dependencies: taskDef.dependencies || [],
      owner: taskDef.owner || null,
      worker: taskDef.worker || null,
      type: taskDef.type || "feature",
      scope: taskDef.scope || null,
      evidence: [],
      artifacts: [],
      review: null,
      metrics: { estimatedMinutes: taskDef.estimatedMinutes || 0, actualMinutes: 0, complexity: taskDef.complexity || "medium" },
      history: [{ status: TaskStatus.BACKLOG, timestamp: new Date().toISOString(), action: "created" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      tags: taskDef.tags || [],
      acceptanceCriteria: taskDef.acceptanceCriteria || [],
    };

    this.tasks.set(id, task);
    this.metrics.totalCreated++;

    this.eventBus.emit("backlog.task.created", {
      taskId: id, title: task.title, priority: task.priority, type: task.type,
    }, "backlog");

    this.save();
    return task;
  }

  // ── Update Task ────────────────────────────────────────────

  updateTask(taskId, updates) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const oldStatus = task.status;
    Object.assign(task, updates, { updatedAt: new Date().toISOString() });

    if (updates.status && updates.status !== oldStatus) {
      task.history.push({
        status: updates.status,
        timestamp: new Date().toISOString(),
        action: `status:${oldStatus}→${updates.status}`,
        by: updates.worker || task.worker,
      });

      if (updates.status === TaskStatus.EXECUTING && !task.startedAt) {
        task.startedAt = new Date().toISOString();
      }
      if (updates.status === TaskStatus.COMPLETED) {
        task.completedAt = new Date().toISOString();
        task.metrics.actualMinutes = task.startedAt
          ? Math.round((new Date(task.completedAt) - new Date(task.startedAt)) / 60000) : 0;
        this.metrics.totalCompleted++;
      }
      if (updates.status === TaskStatus.FAILED) {
        this.metrics.totalFailed++;
      }

      this.eventBus.emit("backlog.task.updated", {
        taskId, oldStatus, newStatus: updates.status,
      }, "backlog");
    }

    this.save();
    return task;
  }

  // ── Query ──────────────────────────────────────────────────

  getTask(taskId) { return this.tasks.get(taskId); }

  listTasks(filter = {}) {
    let tasks = [...this.tasks.values()];
    if (filter.status) tasks = tasks.filter(t => t.status === filter.status);
    if (filter.priority !== undefined) tasks = tasks.filter(t => t.priority === filter.priority);
    if (filter.type) tasks = tasks.filter(t => t.type === filter.type);
    if (filter.worker) tasks = tasks.filter(t => t.worker === filter.worker);
    if (filter.owner) tasks = tasks.filter(t => t.owner === filter.owner);
    if (filter.tag) tasks = tasks.filter(t => t.tags.includes(filter.tag));
    return tasks;
  }

  getBacklog() { return this.listTasks({ status: TaskStatus.BACKLOG }); }
  getQueued() { return this.listTasks({ status: TaskStatus.QUEUED }); }
  getInProgress() {
    return this.listTasks({}).filter(t =>
      [TaskStatus.ASSIGNED, TaskStatus.EXECUTING, TaskStatus.REVIEW, TaskStatus.TESTING].includes(t.status)
    );
  }
  getCompleted() { return this.listTasks({ status: TaskStatus.COMPLETED }); }

  // ── Dependencies ───────────────────────────────────────────

  dependenciesMet(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    return task.dependencies.every(depId => {
      const dep = this.tasks.get(depId);
      return dep && dep.status === TaskStatus.COMPLETED;
    });
  }

  getBlockedTasks() {
    return this.listTasks({}).filter(t =>
      t.status === TaskStatus.QUEUED && !this.dependenciesMet(t.id)
    );
  }

  // ── Metrics ────────────────────────────────────────────────

  getMetrics() {
    const tasks = [...this.tasks.values()];
    const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED);
    const avgCycleTime = completed.length > 0
      ? completed.reduce((sum, t) => sum + (t.metrics.actualMinutes || 0), 0) / completed.length
      : 0;

    return {
      ...this.metrics,
      totalTasks: tasks.length,
      backlog: tasks.filter(t => t.status === TaskStatus.BACKLOG).length,
      inProgress: this.getInProgress().length,
      completed: completed.length,
      failed: tasks.filter(t => t.status === TaskStatus.FAILED).length,
      avgCycleTime: Math.round(avgCycleTime),
      byPriority: {
        critical: tasks.filter(t => t.priority === TaskPriority.CRITICAL).length,
        high: tasks.filter(t => t.priority === TaskPriority.HIGH).length,
        normal: tasks.filter(t => t.priority === TaskPriority.NORMAL).length,
        low: tasks.filter(t => t.priority === TaskPriority.LOW).length,
      },
      byType: {
        feature: tasks.filter(t => t.type === "feature").length,
        bugfix: tasks.filter(t => t.type === "bugfix").length,
        refactor: tasks.filter(t => t.type === "refactor").length,
        documentation: tasks.filter(t => t.type === "documentation").length,
        testing: tasks.filter(t => t.type === "testing").length,
      },
    };
  }

  // ── Evidence & Artifacts ───────────────────────────────────

  addEvidence(taskId, evidence) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    task.evidence.push({
      id: `ev-${Date.now()}`,
      type: evidence.type,
      description: evidence.description,
      data: evidence.data,
      timestamp: new Date().toISOString(),
    });
    this.save();
    return task.evidence;
  }

  addArtifact(taskId, artifact) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    task.artifacts.push({
      id: `art-${Date.now()}`,
      type: artifact.type,
      path: artifact.path,
      name: artifact.name,
      description: artifact.description,
      timestamp: new Date().toISOString(),
    });
    this.save();
    return task.artifacts;
  }

  // ── Persistence ────────────────────────────────────────────

  save() {
    const data = {
      tasks: Object.fromEntries(this.tasks),
      metrics: this.metrics,
      savedAt: new Date().toISOString(),
    };
    writeFileSync(join(this.backlogDir, "backlog.json"), JSON.stringify(data, null, 2));
  }

  load() {
    const file = join(this.backlogDir, "backlog.json");
    if (existsSync(file)) {
      try {
        const data = JSON.parse(readFileSync(file, "utf-8"));
        this.tasks = new Map(Object.entries(data.tasks || {}));
        this.metrics = data.metrics || this.metrics;
      } catch {}
    }
  }
}
