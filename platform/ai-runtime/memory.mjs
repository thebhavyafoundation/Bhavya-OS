/**
 * Bhavya OS — Memory Module
 * Persistent engineering memory.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export class Memory {
  constructor(memoryPath) {
    this.memoryPath = memoryPath;
    this.memory = {
      architectureDecisions: [],
      engineeringDecisions: [],
      completedWork: [],
      knownIssues: [],
      technicalDebt: [],
      releaseNotes: [],
      lessonsLearned: [],
    };
    this.load();
  }

  load() {
    if (existsSync(this.memoryPath)) {
      try {
        const data = readFileSync(this.memoryPath, "utf-8");
        this.memory = JSON.parse(data);
      } catch { /* use defaults */ }
    }
  }

  save() {
    mkdirSync(join(this.memoryPath, ".."), { recursive: true });
    writeFileSync(this.memoryPath, JSON.stringify(this.memory, null, 2));
  }

  addArchitectureDecision(decision) {
    this.memory.architectureDecisions.push({
      id: `adr-${Date.now()}`,
      ...decision,
      timestamp: new Date().toISOString(),
    });
    this.save();
  }

  addEngineeringDecision(decision) {
    this.memory.engineeringDecisions.push({
      id: `edr-${Date.now()}`,
      ...decision,
      timestamp: new Date().toISOString(),
    });
    this.save();
  }

  addCompletedWork(work) {
    this.memory.completedWork.push({
      id: `work-${Date.now()}`,
      ...work,
      timestamp: new Date().toISOString(),
    });
    this.save();
  }

  addKnownIssue(issue) {
    this.memory.knownIssues.push({
      id: `issue-${Date.now()}`,
      ...issue,
      timestamp: new Date().toISOString(),
    });
    this.save();
  }

  addTechnicalDebt(debt) {
    this.memory.technicalDebt.push({
      id: `debt-${Date.now()}`,
      ...debt,
      timestamp: new Date().toISOString(),
    });
    this.save();
  }

  addLessonLearned(lesson) {
    this.memory.lessonsLearned.push({
      id: `lesson-${Date.now()}`,
      ...lesson,
      timestamp: new Date().toISOString(),
    });
    this.save();
  }

  query(category, filter) {
    const items = this.memory[category] || [];
    if (!filter) return items;
    return items.filter(filter);
  }

  getStats() {
    return Object.entries(this.memory).reduce((acc, [key, val]) => {
      acc[key] = val.length;
      return acc;
    }, {});
  }
}
