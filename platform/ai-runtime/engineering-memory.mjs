/**
 * Bhavya OS — Engineering Memory
 * Every completed task stores: goal, reasoning, files modified,
 * tests executed, review results, performance, deployment, lessons learned.
 * Memory is searchable.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = "F:\\Bhavya Foundation";
const MEMORY_DIR = join(ROOT, "memory", "engineering");

export class EngineeringMemory {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.memoryDir = config.memoryDir || MEMORY_DIR;
    this.categories = [
      "architecture-decisions",
      "engineering-decisions",
      "completed-work",
      "known-issues",
      "technical-debt",
      "release-notes",
      "lessons-learned",
    ];
    this.index = new Map(); // full-text search index
    this.init();
    this.buildIndex();
  }

  // ── Initialization ──────────────────────────────────────────

  init() {
    mkdirSync(this.memoryDir, { recursive: true });
    for (const cat of this.categories) {
      const file = join(this.memoryDir, `${cat}.json`);
      if (!existsSync(file)) {
        writeFileSync(file, "[]");
      }
    }
  }

  // ── Store ───────────────────────────────────────────────────

  store(category, entry) {
    if (!this.categories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    const file = join(this.memoryDir, `${category}.json`);
    const entries = JSON.parse(readFileSync(file, "utf-8"));

    const record = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category,
      ...entry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    entries.push(record);
    writeFileSync(file, JSON.stringify(entries, null, 2));

    // Update index
    this.indexEntry(record);

    this.eventBus.emit(EventTypes.MEMORY_UPDATED, {
      category,
      entryId: record.id,
      title: entry.title,
    }, "memory");

    return record;
  }

  // ── Store Completed Task ────────────────────────────────────

  storeCompletedTask(taskResult) {
    return this.store("completed-work", {
      title: taskResult.name,
      goal: taskResult.goal,
      reasoning: taskResult.reasoning,
      filesModified: taskResult.filesModified || [],
      testsExecuted: taskResult.testsExecuted || [],
      testResults: taskResult.testResults || null,
      reviewResults: taskResult.reviewResults || null,
      performance: taskResult.performance || null,
      deployment: taskResult.deployment || null,
      lessonsLearned: taskResult.lessonsLearned || [],
      recommendations: taskResult.recommendations || [],
      workerId: taskResult.workerId,
      duration: taskResult.duration,
      taskType: taskResult.taskType,
      tags: taskResult.tags || [],
    });
  }

  // ── Store Architecture Decision ─────────────────────────────

  storeArchitectureDecision(decision) {
    return this.store("architecture-decisions", {
      title: decision.title,
      context: decision.context,
      decision: decision.decision,
      alternatives: decision.alternatives || [],
      consequences: decision.consequences || [],
      status: decision.status || "accepted",
      supersedes: decision.supersedes || null,
      tags: decision.tags || [],
    });
  }

  // ── Store Known Issue ───────────────────────────────────────

  storeKnownIssue(issue) {
    return this.store("known-issues", {
      title: issue.title,
      description: issue.description,
      severity: issue.severity || "medium",
      affectedComponents: issue.affectedComponents || [],
      workaround: issue.workaround || null,
      status: issue.status || "open",
      reportedBy: issue.reportedBy,
      tags: issue.tags || [],
    });
  }

  // ── Store Technical Debt ────────────────────────────────────

  storeTechnicalDebt(debt) {
    return this.store("technical-debt", {
      title: debt.title,
      description: debt.description,
      location: debt.location,
      impact: debt.impact || "low",
      effort: debt.effort || "unknown",
      status: debt.status || "identified",
      tags: debt.tags || [],
    });
  }

  // ── Store Lesson Learned ────────────────────────────────────

  storeLesson(lesson) {
    return this.store("lessons-learned", {
      title: lesson.title,
      description: lesson.description,
      category: lesson.category || "general",
      applicability: lesson.applicability || "general",
      tags: lesson.tags || [],
    });
  }

  // ── Search ──────────────────────────────────────────────────

  search(query, options = {}) {
    const { category, limit = 20, tags } = options;
    const queryLower = query.toLowerCase();
    const results = [];

    const searchIn = category
      ? [category]
      : this.categories;

    for (const cat of searchIn) {
      const entries = this.loadCategory(cat);
      for (const entry of entries) {
        const score = this.scoreEntry(entry, queryLower);
        if (score > 0) {
          results.push({ ...entry, score, category: cat });
        }
      }
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    // Filter by tags
    let filtered = results;
    if (tags && tags.length > 0) {
      filtered = results.filter(r =>
        r.tags && tags.some(t => r.tags.includes(t))
      );
    }

    this.eventBus.emit(EventTypes.MEMORY_SEARCHED, {
      query,
      category,
      resultCount: filtered.length,
    }, "memory");

    return filtered.slice(0, limit);
  }

  scoreEntry(entry, queryLower) {
    let score = 0;
    const text = [
      entry.title || "",
      entry.description || "",
      entry.goal || "",
      entry.reasoning || "",
      entry.decision || "",
      entry.context || "",
      (entry.tags || []).join(" "),
      (entry.filesModified || []).join(" "),
    ].join(" ").toLowerCase();

    // Exact match
    if (text.includes(queryLower)) {
      score += 10;
    }

    // Word matches
    const words = queryLower.split(/\s+/);
    for (const word of words) {
      if (word.length < 2) continue;
      const count = (text.match(new RegExp(word, "g")) || []).length;
      score += count * 2;
    }

    // Recency bonus
    if (entry.createdAt) {
      const age = Date.now() - new Date(entry.createdAt).getTime();
      const dayAge = age / (1000 * 60 * 60 * 24);
      if (dayAge < 7) score += 5;
      else if (dayAge < 30) score += 3;
      else if (dayAge < 90) score += 1;
    }

    return score;
  }

  // ── Retrieval ───────────────────────────────────────────────

  get(category, id) {
    const entries = this.loadCategory(category);
    return entries.find(e => e.id === id) || null;
  }

  list(category, options = {}) {
    const { limit = 50, offset = 0 } = options;
    const entries = this.loadCategory(category);
    return entries.slice(offset, offset + limit);
  }

  getRecent(category, limit = 10) {
    const entries = this.loadCategory(category);
    return entries.slice(-limit);
  }

  getStats() {
    const stats = {};
    for (const cat of this.categories) {
      const entries = this.loadCategory(cat);
      stats[cat] = entries.length;
    }
    stats.total = Object.values(stats).reduce((a, b) => a + b, 0);
    return stats;
  }

  // ── Full-text Index ─────────────────────────────────────────

  buildIndex() {
    this.index.clear();
    for (const cat of this.categories) {
      const entries = this.loadCategory(cat);
      for (const entry of entries) {
        this.indexEntry(entry);
      }
    }
  }

  indexEntry(entry) {
    const text = [
      entry.title || "",
      entry.description || "",
      entry.goal || "",
      entry.reasoning || "",
      entry.decision || "",
      (entry.tags || []).join(" "),
    ].join(" ").toLowerCase();

    const words = text.split(/\s+/).filter(w => w.length > 2);
    for (const word of words) {
      if (!this.index.has(word)) {
        this.index.set(word, new Set());
      }
      this.index.get(word).add(entry.id);
    }
  }

  // ── Load Category ───────────────────────────────────────────

  loadCategory(category) {
    const file = join(this.memoryDir, `${category}.json`);
    if (!existsSync(file)) return [];
    try {
      return JSON.parse(readFileSync(file, "utf-8"));
    } catch {
      return [];
    }
  }
}
