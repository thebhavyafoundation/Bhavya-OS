/**
 * Bhavya OS v4.0 — Engineering Metrics
 * Track: Lead Time, Cycle Time, Deployment Frequency,
 * Review Time, Build Success Rate, Quality Gate Success,
 * Worker Utilization, Repository Growth, Technical Debt Trend
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = join(import.meta.dirname, "../..");

export class EngineeringMetrics {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.metricsPath = config.metricsPath || join(ROOT, "platform/ai-runtime/engineering-metrics.json");
    this.metrics = this.getInitialMetrics();
    this.load();
    this.subscribeToEvents();
  }

  getInitialMetrics() {
    return {
      leadTime: { avg: 0, min: 0, max: 0, samples: [] },
      cycleTime: { avg: 0, min: 0, max: 0, samples: [] },
      deploymentFrequency: { total: 0, byDay: {}, byWeek: {} },
      reviewTime: { avg: 0, min: 0, max: 0, samples: [] },
      buildSuccessRate: { total: 0, success: 0, failed: 0, rate: 100 },
      qualityGateSuccess: { total: 0, success: 0, failed: 0, rate: 100 },
      workerUtilization: { avg: 0, samples: [] },
      repositoryGrowth: { files: 0, lines: 0, packages: 0, history: [] },
      technicalDebt: { issues: 0, trend: [], score: 0 },
      taskMetrics: { total: 0, completed: 0, failed: 0, avgTime: 0 },
    };
  }

  subscribeToEvents() {
    this.eventBus.on(EventTypes.TASK_COMPLETED, (e) => this.recordTaskCompletion(e.data));
    this.eventBus.on(EventTypes.TASK_FAILED, (e) => this.recordTaskFailure(e.data));
    this.eventBus.on(EventTypes.REVIEW_PASSED, (e) => this.recordReview(true));
    this.eventBus.on(EventTypes.REVIEW_FAILED, (e) => this.recordReview(false));
  }

  // ── Recording ──────────────────────────────────────────────

  recordTaskCompletion(data) {
    this.metrics.taskMetrics.total++;
    this.metrics.taskMetrics.completed++;

    if (data.duration) {
      this.updateSamples(this.metrics.cycleTime.samples, data.duration);
      this.updateAverages(this.metrics.cycleTime);
    }

    this.save();
  }

  recordTaskFailure(data) {
    this.metrics.taskMetrics.total++;
    this.metrics.taskMetrics.failed++;
    this.save();
  }

  recordReview(passed) {
    this.metrics.qualityGateSuccess.total++;
    if (passed) this.metrics.qualityGateSuccess.success++;
    else this.metrics.qualityGateSuccess.failed++;
    this.metrics.qualityGateSuccess.rate = Math.round(
      (this.metrics.qualityGateSuccess.success / this.metrics.qualityGateSuccess.total) * 100
    );
    this.save();
  }

  recordLeadTime(startTime, endTime) {
    const leadTime = endTime - startTime;
    this.updateSamples(this.metrics.leadTime.samples, leadTime);
    this.updateAverages(this.metrics.leadTime);
    this.save();
  }

  recordDeployment() {
    const day = new Date().toISOString().split("T")[0];
    const week = this.getWeekNumber();
    this.metrics.deploymentFrequency.total++;
    this.metrics.deploymentFrequency.byDay[day] = (this.metrics.deploymentFrequency.byDay[day] || 0) + 1;
    this.metrics.deploymentFrequency.byWeek[week] = (this.metrics.deploymentFrequency.byWeek[week] || 0) + 1;
    this.save();
  }

  recordBuildResult(success) {
    this.metrics.buildSuccessRate.total++;
    if (success) this.metrics.buildSuccessRate.success++;
    else this.metrics.buildSuccessRate.failed++;
    this.metrics.buildSuccessRate.rate = Math.round(
      (this.metrics.buildSuccessRate.success / this.metrics.buildSuccessRate.total) * 100
    );
    this.save();
  }

  recordWorkerUtilization(utilization) {
    this.updateSamples(this.metrics.workerUtilization.samples, utilization);
    this.updateAverages(this.metrics.workerUtilization);
    this.save();
  }

  recordRepositoryGrowth(files, lines, packages) {
    this.metrics.repositoryGrowth.files = files;
    this.metrics.repositoryGrowth.lines = lines;
    this.metrics.repositoryGrowth.packages = packages;
    this.metrics.repositoryGrowth.history.push({
      timestamp: Date.now(),
      files,
      lines,
      packages,
    });
    if (this.metrics.repositoryGrowth.history.length > 100) {
      this.metrics.repositoryGrowth.history = this.metrics.repositoryGrowth.history.slice(-100);
    }
    this.save();
  }

  recordTechnicalDebt(issues) {
    this.metrics.technicalDebt.issues = issues;
    this.metrics.technicalDebt.trend.push({
      timestamp: Date.now(),
      issues,
    });
    if (this.metrics.technicalDebt.trend.length > 100) {
      this.metrics.technicalDebt.trend = this.metrics.technicalDebt.trend.slice(-100);
    }
    this.metrics.technicalDebt.score = Math.max(0, 100 - issues);
    this.save();
  }

  // ── Helpers ────────────────────────────────────────────────

  updateSamples(samples, value) {
    samples.push(value);
    if (samples.length > 100) samples.shift();
  }

  updateAverages(metric) {
    if (metric.samples.length === 0) return;
    metric.avg = Math.round(metric.samples.reduce((a, b) => a + b, 0) / metric.samples.length);
    metric.min = Math.min(...metric.samples);
    metric.max = Math.max(...metric.samples);
  }

  getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  }

  // ── Query ──────────────────────────────────────────────────

  getMetrics() {
    return { ...this.metrics };
  }

  getSummary() {
    return {
      leadTime: this.metrics.leadTime.avg,
      cycleTime: this.metrics.cycleTime.avg,
      deploymentFrequency: this.metrics.deploymentFrequency.total,
      buildSuccessRate: this.metrics.buildSuccessRate.rate,
      qualityGateSuccess: this.metrics.qualityGateSuccess.rate,
      workerUtilization: this.metrics.workerUtilization.avg,
      taskCompletionRate: this.metrics.taskMetrics.total > 0
        ? Math.round((this.metrics.taskMetrics.completed / this.metrics.taskMetrics.total) * 100)
        : 100,
      technicalDebtScore: this.metrics.technicalDebt.score,
    };
  }

  // ── Persistence ────────────────────────────────────────────

  save() {
    writeFileSync(this.metricsPath, JSON.stringify(this.metrics, null, 2));
  }

  load() {
    if (existsSync(this.metricsPath)) {
      try {
        this.metrics = { ...this.getInitialMetrics(), ...JSON.parse(readFileSync(this.metricsPath, "utf-8")) };
      } catch {}
    }
  }
}
