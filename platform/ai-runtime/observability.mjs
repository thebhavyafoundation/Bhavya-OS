/**
 * Bhavya OS v3 — Observability
 * Live telemetry system tracking: worker utilization, task throughput,
 * average completion time, failure rate, retry rate, queue depth,
 * repository growth, knowledge graph growth, memory growth,
 * deployment frequency.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = "F:\\Bhavya Foundation";

export class Observability {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.metrics = this.getInitialMetrics();
    this.timeSeries = [];
    this.persistencePath = config.persistencePath || join(ROOT, "platform/ai-runtime/observability-state.json");
    this.maxTimeSeries = 1000;
    this.subscribeToEvents();
    this.load();
  }

  getInitialMetrics() {
    return {
      workers: { total: 0, idle: 0, busy: 0, utilization: 0 },
      tasks: { total: 0, completed: 0, failed: 0, pending: 0, throughput: 0, avgCompletionTime: 0, failureRate: 0, retryRate: 0 },
      queue: { depth: 0, maxDepth: 0, avgWaitTime: 0 },
      repository: { files: 0, packages: 0, growth: 0 },
      knowledgeGraph: { nodes: 0, edges: 0, growth: 0 },
      memory: { entries: 0, growth: 0 },
      deployments: { total: 0, successful: 0, failed: 0, frequency: 0 },
      events: { total: 0, byType: {} },
      performance: { cpuUsage: 0, memoryUsage: 0, uptime: 0 },
      quality: { gatesPassed: 0, gatesFailed: 0, passRate: 100 },
    };
  }

  // ── Event Subscription ─────────────────────────────────────

  subscribeToEvents() {
    this.eventBus.on("*", (event) => this.processEvent(event));
  }

  processEvent(event) {
    const { type, data } = event;

    // Worker events
    if (type === EventTypes.WORKER_STARTED) this.metrics.workers.total++;
    if (type === EventTypes.WORKER_STOPPED) this.metrics.workers.total = Math.max(0, this.metrics.workers.total - 1);
    if (type === EventTypes.WORKER_IDLE) { this.metrics.workers.idle++; this.metrics.workers.busy = Math.max(0, this.metrics.workers.busy - 1); }
    if (type === EventTypes.WORKER_BUSY) { this.metrics.workers.busy++; this.metrics.workers.idle = Math.max(0, this.metrics.workers.idle - 1); }
    this.metrics.workers.utilization = this.metrics.workers.total > 0
      ? Math.round((this.metrics.workers.busy / this.metrics.workers.total) * 100) : 0;

    // Task events
    if (type === EventTypes.TASK_CREATED) this.metrics.tasks.total++;
    if (type === EventTypes.TASK_COMPLETED) {
      this.metrics.tasks.completed++;
      if (data.duration) {
        const avg = this.metrics.tasks.avgCompletionTime;
        const count = this.metrics.tasks.completed;
        this.metrics.tasks.avgCompletionTime = Math.round(((avg * (count - 1)) + data.duration) / count);
      }
    }
    if (type === EventTypes.TASK_FAILED) this.metrics.tasks.failed++;
    this.metrics.tasks.failureRate = this.metrics.tasks.total > 0
      ? Math.round((this.metrics.tasks.failed / this.metrics.tasks.total) * 100) : 0;
    this.metrics.tasks.throughput = this.metrics.tasks.completed;

    // Queue events
    if (type === "scheduler.task.queued") {
      this.metrics.queue.depth++;
      this.metrics.queue.maxDepth = Math.max(this.metrics.queue.maxDepth, this.metrics.queue.depth);
    }
    if (type === EventTypes.TASK_COMPLETED || type === EventTypes.TASK_FAILED) {
      this.metrics.queue.depth = Math.max(0, this.metrics.queue.depth - 1);
    }

    // Memory events
    if (type === EventTypes.MEMORY_UPDATED) this.metrics.memory.entries++;

    // Review events
    if (type === EventTypes.REVIEW_PASSED) this.metrics.quality.gatesPassed++;
    if (type === EventTypes.REVIEW_FAILED) this.metrics.quality.gatesFailed++;
    const totalGates = this.metrics.quality.gatesPassed + this.metrics.quality.gatesFailed;
    this.metrics.quality.passRate = totalGates > 0
      ? Math.round((this.metrics.quality.gatesPassed / totalGates) * 100) : 100;

    // Event counting
    this.metrics.events.total++;
    this.metrics.events.byType[type] = (this.metrics.events.byType[type] || 0) + 1;

    // Record time series data point
    this.recordTimeSeries();
  }

  recordTimeSeries() {
    const point = {
      timestamp: Date.now(),
      workers: { ...this.metrics.workers },
      tasks: { ...this.metrics.tasks },
      queue: { ...this.metrics.queue },
      quality: { ...this.metrics.quality },
    };

    this.timeSeries.push(point);
    if (this.timeSeries.length > this.maxTimeSeries) {
      this.timeSeries = this.timeSeries.slice(-this.maxTimeSeries);
    }
  }

  // ── Update Repository Metrics ──────────────────────────────

  updateRepositoryMetrics(repoState) {
    const oldFiles = this.metrics.repository.files;
    this.metrics.repository.files = repoState.workspace?.totalFiles || 0;
    this.metrics.repository.packages = repoState.workspace?.totalPackages || 0;
    this.metrics.repository.growth = this.metrics.repository.files - oldFiles;
  }

  updateKnowledgeGraphMetrics(graphState) {
    this.metrics.knowledgeGraph.nodes = graphState.nodes || 0;
    this.metrics.knowledgeGraph.edges = graphState.edges || 0;
  }

  updateDeploymentMetrics(deployment) {
    this.metrics.deployments.total++;
    if (deployment.success) this.metrics.deployments.successful++;
    else this.metrics.deployments.failed++;
  }

  // ── Query ──────────────────────────────────────────────────

  getMetrics() { return { ...this.metrics }; }

  getTimeSeries(limit = 100) {
    return this.timeSeries.slice(-limit);
  }

  getWorkerUtilization() {
    return {
      total: this.metrics.workers.total,
      busy: this.metrics.workers.busy,
      idle: this.metrics.workers.idle,
      utilization: this.metrics.workers.utilization,
    };
  }

  getTaskMetrics() {
    return {
      total: this.metrics.tasks.total,
      completed: this.metrics.tasks.completed,
      failed: this.metrics.tasks.failed,
      pending: this.metrics.tasks.pending,
      throughput: this.metrics.tasks.throughput,
      avgCompletionTime: this.metrics.tasks.avgCompletionTime,
      failureRate: this.metrics.tasks.failureRate,
    };
  }

  getQualityMetrics() {
    return {
      gatesPassed: this.metrics.quality.gatesPassed,
      gatesFailed: this.metrics.quality.gatesFailed,
      passRate: this.metrics.quality.passRate,
    };
  }

  // ── Persistence ────────────────────────────────────────────

  save() {
    writeFileSync(this.persistencePath, JSON.stringify({
      metrics: this.metrics,
      timeSeries: this.timeSeries.slice(-100),
      savedAt: new Date().toISOString(),
    }, null, 2));
  }

  load() {
    if (existsSync(this.persistencePath)) {
      try {
        const data = JSON.parse(readFileSync(this.persistencePath, "utf-8"));
        this.metrics = { ...this.getInitialMetrics(), ...data.metrics };
        this.timeSeries = data.timeSeries || [];
      } catch {}
    }
  }
}
