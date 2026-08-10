import type { Reflection } from "../types";

const counter = 0;

export class ReflectionEngine {
  private reflections: Map<string, Reflection[]> = new Map();

  submit(experimentId: string, reflection: Omit<Reflection, "timestamp">): Reflection {
    const full: Reflection = { ...reflection, timestamp: Date.now() };
    const existing = this.reflections.get(experimentId) || [];
    existing.push(full);
    this.reflections.set(experimentId, existing);
    return full;
  }

  getByExperiment(experimentId: string): Reflection[] {
    return this.reflections.get(experimentId) || [];
  }

  getAll(): Reflection[] {
    const all: Reflection[] = [];
    for (const list of this.reflections.values()) {
      all.push(...list);
    }
    return all;
  }

  assessDepth(reflection: Reflection): "surface" | "moderate" | "deep" {
    const totalLength =
      reflection.whatChanged.length +
      reflection.whyChanged.length +
      reflection.surprised.length +
      reflection.improveNext.length;
    if (totalLength < 50) return "surface";
    if (totalLength < 150) return "moderate";
    return "deep";
  }

  getAverageDepth(): number {
    const all = this.getAll();
    if (all.length === 0) return 0;
    const scores = all.map((r) => {
      const d = this.assessDepth(r);
      return d === "deep" ? 100 : d === "moderate" ? 60 : 30;
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  clear(experimentId: string): void {
    this.reflections.delete(experimentId);
  }
}
