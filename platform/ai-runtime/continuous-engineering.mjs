/**
 * Bhavya OS v4.0 — Continuous Engineering
 * Repository changes automatically trigger:
 * - Repository Intelligence
 * - Task Generation
 * - Worker Assignment
 * - Review
 * - Documentation
 * - Quality Gates
 * - Deployment Validation
 */

import { EventBus, EventTypes } from "./event-bus.mjs";
import { FileWatcher } from "./file-watcher.mjs";
import { EngineeringBacklog } from "./engineering-backlog.mjs";
import { ContinuousVerification } from "./continuous-verification.mjs";

const ROOT = "F:\\Bhavya Foundation";

export class ContinuousEngineering {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.fileWatcher = config.fileWatcher || new FileWatcher({ eventBus: this.eventBus, root: ROOT });
    this.backlog = config.backlog || new EngineeringBacklog({ eventBus: this.eventBus });
    this.verification = config.verification || new ContinuousVerification({ eventBus: this.eventBus });
    this.active = false;
    this.lastChange = null;
    this.changeQueue = [];
  }

  // ── Start Continuous Engineering ───────────────────────────

  start() {
    if (this.active) return;
    this.active = true;

    this.fileWatcher.start();

    this.eventBus.on("file.changed", (event) => this.onFileChanged(event.data));
    this.eventBus.on("file.created", (event) => this.onFileCreated(event.data));
    this.eventBus.on("file.deleted", (event) => this.onFileDeleted(event.data));

    console.log("🔄 Continuous Engineering started");
    this.eventBus.emit("continuous-engineering.started", {}, "continuous-engineering");
  }

  stop() {
    this.active = false;
    this.fileWatcher.stop();
    console.log("⏹️  Continuous Engineering stopped");
    this.eventBus.emit("continuous-engineering.stopped", {}, "continuous-engineering");
  }

  // ── Event Handlers ─────────────────────────────────────────

  onFileChanged(data) {
    this.lastChange = { type: "changed", ...data, timestamp: Date.now() };
    this.processChange(this.lastChange);
  }

  onFileCreated(data) {
    this.lastChange = { type: "created", ...data, timestamp: Date.now() };
    this.processChange(this.lastChange);
  }

  onFileDeleted(data) {
    this.lastChange = { type: "deleted", ...data, timestamp: Date.now() };
    this.processChange(this.lastChange);
  }

  // ── Process Change ─────────────────────────────────────────

  async processChange(change) {
    if (!this.shouldProcess(change)) return;

    console.log(`📝 Processing change: ${change.type} ${change.path}`);

    // 1. Repository Intelligence
    await this.runRepositoryIntelligence(change);

    // 2. Task Generation
    const task = await this.generateTask(change);

    // 3. Worker Assignment
    if (task) {
      await this.assignWorker(task);
    }

    // 4. Review
    await this.runReview(change);

    // 5. Documentation
    await this.updateDocumentation(change);

    // 6. Quality Gates
    await this.runQualityGates(change);

    // 7. Deployment Validation
    await this.validateDeployment(change);

    this.eventBus.emit("continuous-engineering.change.processed", {
      change,
      timestamp: Date.now(),
    }, "continuous-engineering");
  }

  shouldProcess(change) {
    // Skip node_modules, .next, build outputs
    const skipPatterns = ["node_modules", ".next", "dist", "build", ".git"];
    return !skipPatterns.some(p => change.path.includes(p));
  }

  // ── Pipeline Steps ─────────────────────────────────────────

  async runRepositoryIntelligence(change) {
    // Scan affected files and update knowledge graphs
    this.eventBus.emit("continuous-engineering.intelligence", { change }, "continuous-engineering");
  }

  async generateTask(change) {
    if (change.type === "created" || change.type === "changed") {
      const task = this.backlog.createTask({
        title: `Auto-generated: ${change.type} ${change.path}`,
        description: `File ${change.type}: ${change.path}`,
        type: "auto",
        priority: "low",
        owner: "continuous-engineering",
      });
      return task;
    }
    return null;
  }

  async assignWorker(task) {
    // Assign based on file path
    let workerType = "backend-engineer";
    if (task.title.includes("component") || task.title.includes(".tsx")) {
      workerType = "frontend-engineer";
    } else if (task.title.includes("test")) {
      workerType = "qa-engineer";
    } else if (task.title.includes("deploy") || task.title.includes("ci")) {
      workerType = "devops-engineer";
    }

    this.eventBus.emit("continuous-engineering.worker.assigned", {
      task,
      workerType,
    }, "continuous-engineering");
  }

  async runReview(change) {
    await this.verification.postExecutionCheck({ change });
  }

  async updateDocumentation(change) {
    this.eventBus.emit("continuous-engineering.documentation", { change }, "continuous-engineering");
  }

  async runQualityGates(change) {
    this.eventBus.emit("continuous-engineering.quality-gates", { change }, "continuous-engineering");
  }

  async validateDeployment(change) {
    this.eventBus.emit("continuous-engineering.deployment-validation", { change }, "continuous-engineering");
  }

  // ── Query ──────────────────────────────────────────────────

  getStatus() {
    return {
      active: this.active,
      lastChange: this.lastChange,
      queueLength: this.changeQueue.length,
    };
  }
}
