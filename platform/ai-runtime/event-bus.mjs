/**
 * Bhavya OS — Central Event Bus
 * Unified event system for all runtime modules.
 * All runtime modules communicate only through events.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

// ── Event Types ──────────────────────────────────────────────

export const EventTypes = {
  // Repository events
  REPOSITORY_CHANGED: "repository.changed",
  FILE_CREATED: "repository.file.created",
  FILE_DELETED: "repository.file.deleted",
  FILE_MODIFIED: "repository.file.modified",
  DEPENDENCY_CHANGED: "repository.dependency.changed",
  ROUTE_ADDED: "repository.route.added",
  COMPONENT_ADDED: "repository.component.added",

  // Task events
  TASK_CREATED: "task.created",
  TASK_ASSIGNED: "task.assigned",
  TASK_COMPLETED: "task.completed",
  TASK_FAILED: "task.failed",
  TASK_CANCELLED: "task.cancelled",
  TASK_CHECKPOINT: "task.checkpoint",

  // Build events
  BUILD_STARTED: "build.started",
  BUILD_FINISHED: "build.finished",
  BUILD_FAILED: "build.failed",

  // Review events
  REVIEW_STARTED: "review.started",
  REVIEW_PASSED: "review.passed",
  REVIEW_FAILED: "review.failed",

  // Deployment events
  DEPLOYMENT_STARTED: "deployment.started",
  DEPLOYMENT_SUCCEEDED: "deployment.succeeded",
  DEPLOYMENT_FAILED: "deployment.failed",

  // Memory events
  MEMORY_UPDATED: "memory.updated",
  MEMORY_SEARCHED: "memory.searched",

  // Agent events
  AGENT_REGISTERED: "agent.registered",
  AGENT_HEARTBEAT: "agent.heartbeat",
  AGENT_UNREGISTERED: "agent.unregistered",

  // Worker events
  WORKER_STARTED: "worker.started",
  WORKER_STOPPED: "worker.stopped",
  WORKER_HEARTBEAT: "worker.heartbeat",
  WORKER_IDLE: "worker.idle",
  WORKER_BUSY: "worker.busy",

  // Workflow events
  WORKFLOW_STARTED: "workflow.started",
  WORKFLOW_STEP_COMPLETED: "workflow.step.completed",
  WORKFLOW_COMPLETED: "workflow.completed",
  WORKFLOW_FAILED: "workflow.failed",

  // System events
  SYSTEM_STARTUP: "system.startup",
  SYSTEM_SHUTDOWN: "system.shutdown",
  SYSTEM_ERROR: "system.error",
};

// ── Event Bus ────────────────────────────────────────────────

export class EventBus {
  constructor(config = {}) {
    this.listeners = new Map();
    this.history = [];
    this.maxHistory = config.maxHistory || 10000;
    this.persistencePath = config.persistencePath || null;
    this.processing = false;
    this.queue = [];
    this.metrics = {
      totalEmitted: 0,
      totalDelivered: 0,
      totalErrors: 0,
      byType: {},
      avgDeliveryTime: 0,
    };

    if (this.persistencePath) {
      this.loadHistory();
    }
  }

  // ── Subscribe ────────────────────────────────────────────────

  on(event, callback, options = {}) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const entry = {
      callback,
      once: options.once || false,
      priority: options.priority || 0,
      filter: options.filter || null,
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    };
    this.listeners.get(event).push(entry);
    this.listeners.get(event).sort((a, b) => b.priority - a.priority);
    return entry.id;
  }

  once(event, callback, options = {}) {
    return this.on(event, callback, { ...options, once: true });
  }

  off(event, callbackOrId) {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;
    const idx = typeof callbackOrId === "string"
      ? callbacks.findIndex(e => e.id === callbackOrId)
      : callbacks.findIndex(e => e.callback === callbackOrId);
    if (idx > -1) callbacks.splice(idx, 1);
  }

  // ── Emit ─────────────────────────────────────────────────────

  emit(eventType, data = {}, source = "system") {
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type: eventType,
      source,
      data,
      timestamp: new Date().toISOString(),
      deliveredTo: [],
    };

    // Record in history
    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }

    // Update metrics
    this.metrics.totalEmitted++;
    this.metrics.byType[eventType] = (this.metrics.byType[eventType] || 0) + 1;

    // Deliver to subscribers
    const subscribers = this.listeners.get(eventType) || [];
    const wildcardSubscribers = this.listeners.get("*") || [];
    const allSubscribers = [...subscribers, ...wildcardSubscribers];

    for (const entry of allSubscribers) {
      try {
        if (entry.filter && !entry.filter(event)) continue;
        entry.callback(event);
        event.deliveredTo.push(entry.id);
        this.metrics.totalDelivered++;

        if (entry.once) {
          this.off(eventType, entry.id);
        }
      } catch (error) {
        this.metrics.totalErrors++;
        console.error(`EventBus: handler error for ${eventType}:`, error.message);
      }
    }

    // Persist if configured
    if (this.persistencePath) {
      this.saveHistory();
    }

    return event;
  }

  // ── Query ────────────────────────────────────────────────────

  getHistory(eventType, limit = 50) {
    let events = this.history;
    if (eventType) {
      events = events.filter(e => e.type === eventType);
    }
    return events.slice(-limit);
  }

  getRecentEvents(limit = 20) {
    return this.history.slice(-limit);
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getSubscriberCount(eventType) {
    if (eventType) {
      return (this.listeners.get(eventType) || []).length;
    }
    let total = 0;
    for (const subs of this.listeners.values()) {
      total += subs.length;
    }
    return total;
  }

  // ── Persistence ──────────────────────────────────────────────

  saveHistory() {
    if (!this.persistencePath) return;
    mkdirSync(dirname(this.persistencePath), { recursive: true });
    const recent = this.history.slice(-this.maxHistory);
    writeFileSync(this.persistencePath, JSON.stringify(recent, null, 2));
  }

  loadHistory() {
    if (!this.persistencePath || !existsSync(this.persistencePath)) return;
    try {
      this.history = JSON.parse(readFileSync(this.persistencePath, "utf-8"));
    } catch {
      this.history = [];
    }
  }

  clearHistory() {
    this.history = [];
    if (this.persistencePath) {
      this.saveHistory();
    }
  }
}

// ── Singleton ────────────────────────────────────────────────

let defaultBus = null;

export function getEventBus(config = {}) {
  if (!defaultBus) {
    defaultBus = new EventBus(config);
  }
  return defaultBus;
}

export function resetEventBus() {
  defaultBus = null;
}
