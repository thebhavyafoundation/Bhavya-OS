import type { AIProvider, Experiment, ExperimentMetrics } from "../types";

let counter = 0;
function id(): string {
  return "exp-" + Date.now() + "-" + ++counter;
}

function scoreExperiment(prompt: string): number {
  const words = prompt.split(/\s+/).length;
  let score = 0;
  if (words >= 5) score += 20;
  if (/[.:;,]/.test(prompt)) score += 20;
  if (prompt.length > 60) score += 20;
  if (/explain to|for a|for someone/i.test(prompt)) score += 20;
  if (/step by step|json|list|format/i.test(prompt)) score += 10;
  if (/example|for instance|like as/i.test(prompt)) score += 10;
  return Math.min(score, 100);
}

export class ExperimentEngine {
  private experiments: Map<string, Experiment[]> = new Map();

  create(lessonId: string, prompt: string, context: string | undefined, output: string): Experiment {
    const existing = this.experiments.get(lessonId) || [];
    const exp: Experiment = {
      id: id(),
      lessonId,
      prompt,
      context,
      output,
      timestamp: Date.now(),
      version: existing.length + 1,
    };
    existing.push(exp);
    this.experiments.set(lessonId, existing);
    return exp;
  }

  update(id: string, updates: Partial<Experiment>): Experiment | null {
    for (const [, list] of this.experiments) {
      const found = list.find((e) => e.id === id);
      if (found) {
        Object.assign(found, updates);
        return found;
      }
    }
    return null;
  }

  getByLesson(lessonId: string): Experiment[] {
    return this.experiments.get(lessonId) || [];
  }

  getById(id: string): Experiment | null {
    for (const [, list] of this.experiments) {
      const found = list.find((e) => e.id === id);
      if (found) return found;
    }
    return null;
  }

  getBest(lessonId: string): Experiment | null {
    const list = this.experiments.get(lessonId) || [];
    if (list.length === 0) return null;
    return list.reduce((best, e) =>
      scoreExperiment(e.prompt) > scoreExperiment(best.prompt) ? e : best
    );
  }

  getMetrics(lessonId: string): ExperimentMetrics {
    const list = this.experiments.get(lessonId) || [];
    if (list.length === 0) {
      return { totalAttempts: 0, bestScore: 0, currentScore: 0, improvementRate: 0, trend: "stable" };
    }
    const scores = list.map((e) => scoreExperiment(e.prompt));
    const best = Math.max(...scores);
    const current = scores[scores.length - 1];
    const first = scores[0];
    const improvement = first > 0 ? ((best - first) / first) * 100 : best > 0 ? 100 : 0;
    let trend: "improving" | "stable" | "declining" = "stable";
    if (scores.length >= 2) {
      const lastTwo = scores.slice(-2);
      if (lastTwo[1] > lastTwo[0]) trend = "improving";
      else if (lastTwo[1] < lastTwo[0]) trend = "declining";
    }
    return {
      totalAttempts: list.length,
      bestScore: best,
      currentScore: current,
      improvementRate: Math.round(improvement),
      trend,
    };
  }

  clear(lessonId: string): void {
    this.experiments.delete(lessonId);
  }

  score(prompt: string): number {
    return scoreExperiment(prompt);
  }
}
