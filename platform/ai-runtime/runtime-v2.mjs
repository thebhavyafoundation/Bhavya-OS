/**
 * Bhavya OS — Runtime v2
 * Unified autonomous engineering runtime.
 * All modules communicate through the Event Bus.
 */

import { EventBus, EventTypes, getEventBus } from "./event-bus.mjs";
import { FileWatcher } from "./file-watcher.mjs";
import { WorkerPool, Worker } from "./worker-pool.mjs";
import { WorktreeManager } from "./worktree-manager.mjs";
import { ExecutionScheduler, Priority, TaskState } from "./scheduler.mjs";
import { EngineeringMemory } from "./engineering-memory.mjs";
import { SelfReview } from "./self-review.mjs";
import { ChiefArchitect } from "./chief-architect.mjs";
import { Dashboard } from "./dashboard.mjs";

const ROOT = "F:\\Bhavya Foundation";

export class Runtime {
  constructor(config = {}) {
    // Core event bus
    this.eventBus = getEventBus({
      persistencePath: config.eventLogPath || `${ROOT}/.ai/events/event-log.jsonl`,
    });

    // Core modules
    this.fileWatcher = new FileWatcher({
      eventBus: this.eventBus,
      root: config.root || ROOT,
    });

    this.workerPool = new WorkerPool({
      eventBus: this.eventBus,
      maxWorkers: config.maxWorkers || 4,
    });

    this.worktreeManager = new WorktreeManager({
      eventBus: this.eventBus,
      root: config.root || ROOT,
    });

    this.scheduler = new ExecutionScheduler({
      eventBus: this.eventBus,
      workerPool: this.workerPool,
      maxConcurrency: config.maxConcurrency || 4,
      maxRetries: config.maxRetries || 3,
    });

    this.memory = new EngineeringMemory({
      eventBus: this.eventBus,
    });

    this.selfReview = new SelfReview({
      eventBus: this.eventBus,
    });

    this.chiefArchitect = new ChiefArchitect({
      eventBus: this.eventBus,
      memory: this.memory,
    });

    this.dashboard = new Dashboard({
      eventBus: this.eventBus,
      port: config.dashboardPort || 3101,
    });

    this.status = "stopped";
    this.startedAt = null;
  }

  // ── Lifecycle ──────────────────────────────────────────────

  async start() {
    console.log("\n🚀 Bhavya OS — Autonomous Engineering Runtime v2\n");

    this.status = "starting";
    this.startedAt = new Date().toISOString();

    // Start modules
    this.fileWatcher.start();
    this.workerPool.start();

    // Create default workers
    this.createDefaultWorkers();

    // Start dashboard
    await this.dashboard.start();

    this.status = "running";

    this.eventBus.emit(EventTypes.SYSTEM_STARTUP, {
      version: "2.0.0",
      modules: [
        "EventBus",
        "FileWatcher",
        "WorkerPool",
        "WorktreeManager",
        "ExecutionScheduler",
        "EngineeringMemory",
        "SelfReview",
        "ChiefArchitect",
        "Dashboard",
      ],
      timestamp: this.startedAt,
    }, "runtime");

    console.log("\n✅ Runtime v2 started successfully\n");
    this.printStatus();
  }

  stop() {
    this.status = "stopping";

    this.fileWatcher.stop();
    this.workerPool.stop();
    this.dashboard.stop();

    this.eventBus.emit(EventTypes.SYSTEM_SHUTDOWN, {
      uptime: Date.now() - new Date(this.startedAt).getTime(),
    }, "runtime");

    this.status = "stopped";
    console.log("🛑 Runtime v2 stopped");
  }

  // ── Default Workers ─────────────────────────────────────────

  createDefaultWorkers() {
    const workerTypes = [
      { name: "frontend-engineer", type: "frontend", capabilities: ["frontend", "ui", "css", "react"] },
      { name: "backend-engineer", type: "backend", capabilities: ["backend", "api", "database", "server"] },
      { name: "qa-engineer", type: "testing", capabilities: ["testing", "qa", "validation"] },
      { name: "devops-engineer", type: "devops", capabilities: ["deployment", "ci", "infrastructure"] },
    ];

    for (const config of workerTypes) {
      this.workerPool.addWorker(config);
    }
  }

  // ── Task Execution ──────────────────────────────────────────

  async executeTask(taskDef, handler) {
    // Chief Architect decomposes the task
    const plan = this.chiefArchitect.decomposeTask(taskDef);

    // Submit to scheduler
    const task = this.scheduler.submit({
      ...taskDef,
      name: taskDef.name,
      type: taskDef.type,
      priority: this.chiefArchitect.assignPriority(taskDef),
    });

    // Worker executes
    const worker = this.scheduler.getIdleWorkers?.()[0] || this.workerPool.getIdleWorkers()[0];
    if (!worker) {
      console.log("No idle workers available. Task queued.");
      return task;
    }

    try {
      // Create worktree for coding tasks
      if (taskDef.type !== "review" && taskDef.type !== "documentation") {
        const worktree = this.worktreeManager.create(worker.id);
        worker.worktreePath = worktree.path;
      }

      // Execute
      const result = await worker.executeTask(task, handler);

      // Self-review
      const review = await this.selfReview.runReview({
        id: task.id,
        name: task.name,
        filesModified: result?.filesModified || [],
      });

      // Store in memory
      this.memory.storeCompletedTask({
        name: task.name,
        goal: taskDef.description || taskDef.name,
        reasoning: result?.reasoning || "",
        filesModified: result?.filesModified || [],
        workerId: worker.id,
        reviewResults: review,
        taskType: taskDef.type,
      });

      // Clean up worktree
      if (worker.worktreePath) {
        const worktrees = this.worktreeManager.getByWorker(worker.id);
        for (const wt of worktrees) {
          if (wt.status === "active") {
            // Commit changes
            this.worktreeManager.commit(wt.id, `Task completed: ${task.name}`);
          }
        }
      }

      return { task, result, review };
    } catch (error) {
      this.scheduler.failTask(task.id, error.message);
      throw error;
    }
  }

  // ── Status ──────────────────────────────────────────────────

  getStatus() {
    return {
      status: this.status,
      startedAt: this.startedAt,
      uptime: this.startedAt ? Date.now() - new Date(this.startedAt).getTime() : 0,
      modules: {
        eventBus: {
          metrics: this.eventBus.getMetrics(),
          subscribers: this.eventBus.getSubscriberCount(),
        },
        fileWatcher: this.fileWatcher.getStats(),
        workerPool: this.workerPool.getStats(),
        scheduler: this.scheduler.getStats(),
        memory: this.memory.getStats(),
        selfReview: this.selfReview.getStats(),
        chiefArchitect: this.chiefArchitect.getStatus(),
      },
    };
  }

  printStatus() {
    const status = this.getStatus();
    console.log("┌─────────────────────────────────────────────┐");
    console.log("│  Bhavya OS — Runtime Status                 │");
    console.log("├─────────────────────────────────────────────┤");
    console.log(`│  Status:     ${status.status.padEnd(28)}│`);
    console.log(`│  Workers:    ${String(status.modules.workerPool.totalWorkers).padEnd(28)}│`);
    console.log(`│  Idle:       ${String(status.modules.workerPool.idleWorkers).padEnd(28)}│`);
    console.log(`│  Tasks:      ${String(status.modules.scheduler.total).padEnd(28)}│`);
    console.log(`│  Completed:  ${String(status.modules.scheduler.completed).padEnd(28)}│`);
    console.log(`│  Memory:     ${String(status.modules.memory.total).padEnd(28)}│`);
    console.log(`│  Reviews:    ${String(status.modules.selfReview.total).padEnd(28)}│`);
    console.log("└─────────────────────────────────────────────┘\n");
  }
}
