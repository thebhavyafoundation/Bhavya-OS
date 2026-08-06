/**
 * Bhavya OS — Self Review
 * Every completed task automatically runs quality gates
 * and generates a review report.
 */

import { QualityGates } from "./quality-gates.mjs";
import { EventBus, EventTypes } from "./event-bus.mjs";

export class SelfReview {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.qualityGates = new QualityGates({ quickMode: config.quickMode || false });
    this.reviews = new Map();
    this.reviewHistory = [];
  }

  // ── Run Review ──────────────────────────────────────────────

  async runReview(taskResult) {
    const reviewId = `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    this.eventBus.emit(EventTypes.REVIEW_STARTED, {
      reviewId,
      taskId: taskResult.id,
      taskName: taskResult.name,
    }, "self-review");

    console.log(`\n🔍 Running self-review for task: ${taskResult.name}`);

    // Run quality gates
    const gateResults = await this.qualityGates.runAll();

    // Build review report
    const report = {
      id: reviewId,
      taskId: taskResult.id,
      taskName: taskResult.name,
      timestamp: new Date().toISOString(),
      gates: gateResults.results,
      passed: gateResults.requiredFailed === 0,
      passedCount: gateResults.passed,
      failedCount: gateResults.failed,
      requiredFailed: gateResults.requiredFailed,
      filesModified: taskResult.filesModified || [],
      summary: this.generateSummary(gateResults, taskResult),
      recommendation: this.generateRecommendation(gateResults),
    };

    this.reviews.set(reviewId, report);
    this.reviewHistory.push(report);

    if (report.passed) {
      this.eventBus.emit(EventTypes.REVIEW_PASSED, {
        reviewId,
        taskId: taskResult.id,
        passedGates: gateResults.passed,
      }, "self-review");
    } else {
      this.eventBus.emit(EventTypes.REVIEW_FAILED, {
        reviewId,
        taskId: taskResult.id,
        failedGates: gateResults.failed,
        requiredFailed: gateResults.requiredFailed,
      }, "self-review");
    }

    console.log(`\n📊 Review ${report.passed ? "PASSED" : "FAILED"}: ${report.passedCount}/${report.passedCount + report.failedCount} gates passed`);

    return report;
  }

  // ── Summary ─────────────────────────────────────────────────

  generateSummary(gateResults, taskResult) {
    const lines = [];
    lines.push(`Task: ${taskResult.name}`);
    lines.push(`Gates: ${gateResults.passed} passed, ${gateResults.failed} failed`);

    const failedGates = gateResults.results.filter(r => !r.passed);
    if (failedGates.length > 0) {
      lines.push(`Failed gates: ${failedGates.map(g => g.gateName).join(", ")}`);
    }

    if (taskResult.filesModified) {
      lines.push(`Files modified: ${taskResult.filesModified.length}`);
    }

    return lines.join("; ");
  }

  generateRecommendation(gateResults) {
    const failedRequired = gateResults.results.filter(r => !r.passed && r.required);
    const failedOptional = gateResults.results.filter(r => !r.passed && !r.required);

    if (failedRequired.length > 0) {
      return {
        action: "block",
        reason: `${failedRequired.length} required gates failed: ${failedRequired.map(g => g.gateName).join(", ")}`,
        gatesToFix: failedRequired.map(g => g.gateId),
      };
    }

    if (failedOptional.length > 0) {
      return {
        action: "approve-with-warnings",
        reason: `${failedOptional.length} optional gates failed: ${failedOptional.map(g => g.gateName).join(", ")}`,
        gatesToFix: failedOptional.map(g => g.gateId),
      };
    }

    return {
      action: "approve",
      reason: "All gates passed",
    };
  }

  // ── Query ───────────────────────────────────────────────────

  getReview(reviewId) {
    return this.reviews.get(reviewId);
  }

  getReviewByTaskId(taskId) {
    return [...this.reviews.values()].find(r => r.taskId === taskId);
  }

  getRecentReviews(limit = 10) {
    return this.reviewHistory.slice(-limit);
  }

  getStats() {
    const reviews = [...this.reviews.values()];
    return {
      total: reviews.length,
      passed: reviews.filter(r => r.passed).length,
      failed: reviews.filter(r => !r.passed).length,
      approvalRate: reviews.length > 0
        ? (reviews.filter(r => r.passed).length / reviews.length * 100).toFixed(1) + "%"
        : "N/A",
    };
  }
}
