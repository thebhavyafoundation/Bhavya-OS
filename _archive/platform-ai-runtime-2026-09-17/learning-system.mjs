/**
 * Bhavya OS v3 — Learning System
 * Captures knowledge from completed tasks. Builds a growing library
 * of patterns that work. Improves estimation accuracy over time.
 * Learns from failures.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = join(import.meta.dirname, "../..");

export class LearningSystem {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.learningPath = config.learningPath || join(ROOT, "platform/ai-runtime/learning-state.json");
    this.patterns = [];
    this.estimationHistory = [];
    this.failurePatterns = [];
    this.successPatterns = [];
    this.knowledgeBase = { concepts: {}, relationships: [], recommendations: [] };
    this.load();
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.eventBus.on(EventTypes.TASK_COMPLETED, (event) => this.recordTaskCompletion(event.data));
    this.eventBus.on(EventTypes.TASK_FAILED, (event) => this.recordTaskFailure(event.data));
    this.eventBus.on(EventTypes.REVIEW_PASSED, (event) => this.recordReviewOutcome(event.data, true));
    this.eventBus.on(EventTypes.REVIEW_FAILED, (event) => this.recordReviewOutcome(event.data, false));
  }

  // ── Learning ───────────────────────────────────────────────

  recordTaskCompletion(data) {
    const pattern = {
      type: data.taskType || "unknown",
      category: data.category || "general",
      estimatedMinutes: data.estimatedMinutes,
      actualMinutes: data.actualMinutes,
      worker: data.worker,
      qualityScore: data.qualityScore || 100,
      timestamp: Date.now(),
      success: true,
    };

    this.successPatterns.push(pattern);
    this.updateEstimation(pattern);
    this.extractPattern(pattern);
    this.save();
  }

  recordTaskFailure(data) {
    const pattern = {
      type: data.taskType || "unknown",
      category: data.category || "general",
      error: data.error || "unknown",
      worker: data.worker,
      timestamp: Date.now(),
      success: false,
      retryable: data.retryable || false,
    };

    this.failurePatterns.push(pattern);
    this.extractFailurePattern(pattern);
    this.save();
  }

  recordReviewOutcome(data, passed) {
    this.knowledgeBase.recommendations.push({
      type: passed ? "approval" : "rejection",
      taskType: data.taskType,
      reasons: data.reasons || [],
      timestamp: Date.now(),
    });
    this.save();
  }

  // ── Estimation ─────────────────────────────────────────────

  updateEstimation(pattern) {
    const existing = this.estimationHistory.find(
      e => e.type === pattern.type && e.category === pattern.category
    );

    if (existing) {
      const diff = pattern.actualMinutes - pattern.estimatedMinutes;
      existing.avgDiff = (existing.avgDiff * existing.count + diff) / (existing.count + 1);
      existing.count++;
      existing.confidence = Math.min(100, existing.confidence + 5);
      existing.lastUpdated = Date.now();
    } else {
      this.estimationHistory.push({
        type: pattern.type,
        category: pattern.category,
        avgDiff: pattern.actualMinutes - pattern.estimatedMinutes,
        count: 1,
        confidence: 30,
        lastUpdated: Date.now(),
      });
    }
  }

  getImprovedEstimate(taskType, category, baselineEstimate) {
    const history = this.estimationHistory.find(
      e => e.type === taskType && e.category === category
    );

    if (history && history.count >= 3) {
      const adjusted = baselineEstimate + history.avgDiff;
      return {
        estimate: Math.max(1, Math.round(adjusted)),
        confidence: history.confidence,
        basedOn: history.count,
        adjustment: history.avgDiff,
      };
    }

    return { estimate: baselineEstimate, confidence: 20, basedOn: 0, adjustment: 0 };
  }

  // ── Pattern Extraction ─────────────────────────────────────

  extractPattern(pattern) {
    const existing = this.patterns.find(
      p => p.type === pattern.type && p.worker === pattern.worker
    );

    if (existing) {
      existing.count++;
      existing.avgQuality = (existing.avgQuality * (existing.count - 1) + pattern.qualityScore) / existing.count;
      existing.avgTime = (existing.avgTime * (existing.count - 1) + pattern.actualMinutes) / existing.count;
      existing.lastSeen = Date.now();
    } else {
      this.patterns.push({
        type: pattern.type,
        worker: pattern.worker,
        count: 1,
        avgQuality: pattern.qualityScore,
        avgTime: pattern.actualMinutes,
        lastSeen: Date.now(),
      });
    }
  }

  extractFailurePattern(pattern) {
    const existing = this.failurePatterns.find(
      p => p.type === pattern.type && p.error === pattern.error
    );

    if (existing) {
      existing.count++;
      existing.lastSeen = Date.now();
    } else {
      this.failurePatterns.push({
        type: pattern.type,
        error: pattern.error,
        count: 1,
        lastSeen: Date.now(),
      });
    }
  }

  // ── Recommendations ────────────────────────────────────────

  getRecommendations(taskType) {
    const recommendations = [];

    const bestWorker = this.getBestWorkerForType(taskType);
    if (bestWorker) recommendations.push({ type: "worker", value: bestWorker.worker, reason: `Highest success rate (${bestWorker.successRate}%)` });

    const failurePattern = this.failurePatterns.find(p => p.type === taskType);
    if (failurePattern) recommendations.push({ type: "warning", value: failurePattern.error, reason: `Known failure pattern (${failurePattern.count} occurrences)` });

    return recommendations;
  }

  getBestWorkerForType(taskType) {
    const relevant = this.successPatterns.filter(p => p.type === taskType);
    if (relevant.length === 0) return null;

    const byWorker = {};
    for (const p of relevant) {
      if (!byWorker[p.worker]) byWorker[p.worker] = { count: 0, totalQuality: 0 };
      byWorker[p.worker].count++;
      byWorker[p.worker].totalQuality += p.qualityScore;
    }

    let best = null;
    let bestRate = -1;
    for (const [worker, stats] of Object.entries(byWorker)) {
      const successRate = (stats.count / relevant.length) * 100;
      if (successRate > bestRate) {
        bestRate = successRate;
        best = { worker, successRate: Math.round(successRate), avgQuality: Math.round(stats.totalQuality / stats.count) };
      }
    }

    return best;
  }

  // ── Query ──────────────────────────────────────────────────

  getStats() {
    return {
      patterns: this.patterns.length,
      successPatterns: this.successPatterns.length,
      failurePatterns: this.failurePatterns.length,
      estimationHistory: this.estimationHistory.length,
      knowledgeBase: this.knowledgeBase,
    };
  }

  // ── Persistence ────────────────────────────────────────────

  save() {
    writeFileSync(this.learningPath, JSON.stringify({
      patterns: this.patterns.slice(-100),
      estimationHistory: this.estimationHistory,
      failurePatterns: this.failurePatterns.slice(-50),
      successPatterns: this.successPatterns.slice(-100),
      knowledgeBase: this.knowledgeBase,
    }, null, 2));
  }

  load() {
    if (existsSync(this.learningPath)) {
      try {
        const data = JSON.parse(readFileSync(this.learningPath, "utf-8"));
        this.patterns = data.patterns || [];
        this.estimationHistory = data.estimationHistory || [];
        this.failurePatterns = data.failurePatterns || [];
        this.successPatterns = data.successPatterns || [];
        this.knowledgeBase = data.knowledgeBase || this.knowledgeBase;
      } catch {}
    }
  }
}
