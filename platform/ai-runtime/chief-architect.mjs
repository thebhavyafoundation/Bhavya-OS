/**
 * Bhavya OS — Chief Architect
 * Supervising agent. Responsibilities:
 *   - Repository overview
 *   - Task decomposition
 *   - Priority assignment
 *   - Conflict resolution
 *   - Architecture enforcement
 *   - Merge approval
 *   - Release approval
 * No coding. Planning only.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";
import { EngineeringMemory } from "./engineering-memory.mjs";

const ROOT = "F:\\Bhavya Foundation";

export class ChiefArchitect {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.memory = config.memory || new EngineeringMemory({ eventBus: this.eventBus });
    this.plans = new Map();
    this.architectureRules = this.loadArchitectureRules();
    this.mergeQueue = [];
    this.releaseQueue = [];
    this.stats = {
      tasksDecomposed: 0,
      mergesApproved: 0,
      mergesRejected: 0,
      releasesApproved: 0,
      architectureViolations: 0,
    };

    // Listen for events
    this.eventBus.on(EventTypes.TASK_COMPLETED, (event) => {
      this.onTaskCompleted(event.data);
    });
  }

  // ── Architecture Rules ──────────────────────────────────────

  loadArchitectureRules() {
    return {
      requiredDirs: ["apps", "packages", "platform", "docs"],
      forbiddenPatterns: [
        /node_modules/,
        /\.git/,
        /\.next/,
        /dist/,
      ],
      maxFileSizeKB: 500,
      requiredFiles: {
        "apps/*/package.json": true,
        "packages/*/package.json": true,
        "packages/*/tsconfig.json": true,
      },
      namingConventions: {
        components: /^[A-Z][a-zA-Z]+$/,
        hooks: /^use[A-Z][a-zA-Z]+$/,
        utilities: /^[a-z][a-zA-Z]+$/,
      },
    };
  }

  // ── Task Decomposition ──────────────────────────────────────

  decomposeTask(task) {
    const plan = {
      id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      originalTask: task,
      subtasks: [],
      createdAt: new Date().toISOString(),
      status: "created",
    };

    // Analyze task and create subtasks
    const subtasks = this.analyzeAndDecompose(task);
    plan.subtasks = subtasks;

    this.plans.set(plan.id, plan);
    this.stats.tasksDecomposed++;

    this.eventBus.emit("architect.task.decomposed", {
      planId: plan.id,
      originalTask: task.name,
      subtaskCount: subtasks.length,
    }, "chief-architect");

    return plan;
  }

  analyzeAndDecompose(task) {
    const subtasks = [];
    const taskType = task.type || "feature";

    switch (taskType) {
      case "feature":
        subtasks.push(
          { name: `Design ${task.name}`, type: "design", priority: task.priority },
          { name: `Implement ${task.name}`, type: "implementation", priority: task.priority },
          { name: `Test ${task.name}`, type: "testing", priority: task.priority },
          { name: `Review ${task.name}`, type: "review", priority: task.priority },
          { name: `Document ${task.name}`, type: "documentation", priority: "low" },
        );
        break;
      case "bugfix":
        subtasks.push(
          { name: `Diagnose ${task.name}`, type: "diagnosis", priority: task.priority },
          { name: `Fix ${task.name}`, type: "implementation", priority: task.priority },
          { name: `Test fix for ${task.name}`, type: "testing", priority: task.priority },
          { name: `Review fix for ${task.name}`, type: "review", priority: task.priority },
        );
        break;
      case "refactor":
        subtasks.push(
          { name: `Analyze ${task.name}`, type: "analysis", priority: task.priority },
          { name: `Plan ${task.name}`, type: "planning", priority: task.priority },
          { name: `Implement ${task.name}`, type: "implementation", priority: task.priority },
          { name: `Verify ${task.name}`, type: "testing", priority: task.priority },
          { name: `Review ${task.name}`, type: "review", priority: task.priority },
        );
        break;
      default:
        subtasks.push(
          { name: task.name, type: taskType, priority: task.priority },
        );
    }

    return subtasks.map((st, i) => ({
      id: `sub-${Date.now()}-${i}`,
      ...st,
      status: "pending",
      dependencies: i > 0 ? [`sub-${Date.now()}-${i - 1}`] : [],
    }));
  }

  // ── Priority Assignment ─────────────────────────────────────

  assignPriority(task) {
    let priority = "normal";

    // High priority: security, performance, critical bugs
    if (task.type === "security" || task.type === "critical-bug") {
      priority = "critical";
    } else if (task.type === "bugfix" || task.type === "performance") {
      priority = "high";
    } else if (task.type === "documentation" || task.type === "cleanup") {
      priority = "low";
    }

    // Check urgency from task description
    const desc = (task.description || "").toLowerCase();
    if (desc.includes("urgent") || desc.includes("critical") || desc.includes("production")) {
      priority = "critical";
    } else if (desc.includes("important") || desc.includes("high priority")) {
      priority = "high";
    }

    return priority;
  }

  // ── Architecture Enforcement ────────────────────────────────

  validateArchitecture(change) {
    const violations = [];

    // Check file location
    if (change.path) {
      const isInApps = change.path.startsWith("apps/");
      const isInPackages = change.path.startsWith("packages/");
      const isInPlatform = change.path.startsWith("platform/");
      const isInDocs = change.path.startsWith("docs/");

      if (!isInApps && !isInPackages && !isInPlatform && !isInDocs) {
        violations.push({
          type: "invalid-location",
          message: `File ${change.path} is not in a valid directory`,
          severity: "warning",
        });
      }
    }

    // Check for forbidden patterns
    if (change.path) {
      for (const pattern of this.architectureRules.forbiddenPatterns) {
        if (pattern.test(change.path)) {
          violations.push({
            type: "forbidden-path",
            message: `File ${change.path} matches forbidden pattern ${pattern}`,
            severity: "error",
          });
        }
      }
    }

    // Check file size
    if (change.sizeKB && change.sizeKB > this.architectureRules.maxFileSizeKB) {
      violations.push({
        type: "large-file",
        message: `File ${change.path} is ${change.sizeKB}KB (max: ${this.architectureRules.maxFileSizeKB}KB)`,
        severity: "warning",
      });
    }

    this.stats.architectureViolations += violations.filter(v => v.severity === "error").length;

    return {
      valid: violations.filter(v => v.severity === "error").length === 0,
      violations,
    };
  }

  // ── Merge Approval ──────────────────────────────────────────

  requestMerge(worktreeId, branch, diff) {
    const request = {
      id: `merge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      worktreeId,
      branch,
      diff,
      status: "pending",
      requestedAt: new Date().toISOString(),
      review: null,
    };

    this.mergeQueue.push(request);
    return request;
  }

  async approveMerge(requestId) {
    const request = this.mergeQueue.find(r => r.id === requestId);
    if (!request) throw new Error(`Merge request ${requestId} not found`);

    // Validate architecture
    const archValidation = this.validateArchitecture({ path: request.diff });

    if (!archValidation.valid) {
      request.status = "rejected";
      request.rejectionReason = archValidation.violations
        .filter(v => v.severity === "error")
        .map(v => v.message)
        .join("; ");
      this.stats.mergesRejected++;
      return request;
    }

    request.status = "approved";
    request.approvedAt = new Date().toISOString();
    this.stats.mergesApproved++;

    // Store in memory
    this.memory.store("architecture-decisions", {
      title: `Merge approved: ${request.branch}`,
      context: `Merging branch ${request.branch} from worktree ${request.worktreeId}`,
      decision: "Approved merge after architecture validation",
      consequences: ["Code merged into master"],
    });

    this.eventBus.emit("architect.merge.approved", {
      requestId,
      worktreeId: request.worktreeId,
      branch: request.branch,
    }, "chief-architect");

    return request;
  }

  rejectMerge(requestId, reason) {
    const request = this.mergeQueue.find(r => r.id === requestId);
    if (!request) throw new Error(`Merge request ${requestId} not found`);

    request.status = "rejected";
    request.rejectionReason = reason;
    this.stats.mergesRejected++;

    this.eventBus.emit("architect.merge.rejected", {
      requestId,
      reason,
    }, "chief-architect");

    return request;
  }

  // ── Release Approval ────────────────────────────────────────

  requestRelease(version, changes) {
    const request = {
      id: `release-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      version,
      changes,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    this.releaseQueue.push(request);
    return request;
  }

  approveRelease(requestId) {
    const request = this.releaseQueue.find(r => r.id === requestId);
    if (!request) throw new Error(`Release request ${requestId} not found`);

    request.status = "approved";
    request.approvedAt = new Date().toISOString();
    this.stats.releasesApproved++;

    this.memory.store("release-notes", {
      title: `Release ${request.version}`,
      description: `Approved release with ${request.changes.length} changes`,
      version: request.version,
      changes: request.changes,
    });

    this.eventBus.emit("architect.release.approved", {
      requestId,
      version: request.version,
    }, "chief-architect");

    return request;
  }

  // ── Event Handlers ──────────────────────────────────────────

  onTaskCompleted(data) {
    // Auto-review completed tasks
    if (data.result) {
      this.memory.storeCompletedTask({
        name: data.taskName || "Unknown task",
        goal: data.result.goal || "Complete task",
        reasoning: data.result.reasoning || "",
        filesModified: data.result.filesModified || [],
        workerId: data.workerId,
        duration: data.duration,
      });
    }
  }

  // ── Status ──────────────────────────────────────────────────

  getStatus() {
    return {
      stats: { ...this.stats },
      plansCount: this.plans.size,
      mergeQueueLength: this.mergeQueue.length,
      releaseQueueLength: this.releaseQueue.length,
      recentMerges: this.mergeQueue.slice(-5),
      recentReleases: this.releaseQueue.slice(-5),
    };
  }
}
