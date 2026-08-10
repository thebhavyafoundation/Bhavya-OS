import type { Experiment, Reflection, PortfolioArtifact, CapabilityScore, TimeDistribution } from "../types";

export class LearningAnalytics {
  private experimentTimes: Map<string, number[]> = new Map();
  private reflectionTimes: Map<string, number[]> = new Map();

  trackExperiment(lessonId: string, durationMs: number): void {
    const existing = this.experimentTimes.get(lessonId) || [];
    existing.push(durationMs);
    this.experimentTimes.set(lessonId, existing);
  }

  trackReflection(lessonId: string, durationMs: number): void {
    const existing = this.reflectionTimes.get(lessonId) || [];
    existing.push(durationMs);
    this.reflectionTimes.set(lessonId, existing);
  }

  getCapabilityScore(params: {
    experiments: Experiment[];
    reflections: Reflection[];
    artifacts: PortfolioArtifact[];
  }): CapabilityScore {
    const { experiments, reflections, artifacts } = params;
    const expCount = experiments.length;
    const avgIterations =
      experiments.length > 0
        ? Math.round(
            experiments.reduce((sum, e) => sum + (e.version || 1), 0) / experiments.length * 10
          ) / 10
        : 0;

    const reflectionScores = reflections.map((r) => {
      const len = r.whatChanged.length + r.whyChanged.length + r.surprised.length + r.improveNext.length;
      return len > 150 ? 100 : len > 50 ? 60 : 30;
    });
    const reflectionDepth =
      reflectionScores.length > 0
        ? Math.round(reflectionScores.reduce((a, b) => a + b, 0) / reflectionScores.length)
        : 0;

    const scores = experiments.map((e) => {
      const words = e.prompt.split(/\s+/).length;
      let s = 0;
      if (words >= 5) s += 20;
      if (/[.:;,]/.test(e.prompt)) s += 20;
      if (e.prompt.length > 60) s += 20;
      if (/explain to|for a/i.test(e.prompt)) s += 20;
      if (/step by step|json|list/i.test(e.prompt)) s += 10;
      if (/example|for instance/i.test(e.prompt)) s += 10;
      return Math.min(s, 100);
    });
    const firstScore = scores[0] || 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const promptImprovement = firstScore > 0 ? Math.round(((bestScore - firstScore) / firstScore) * 100) : 0;

    const experimentsScore = Math.min(expCount * 2, 30);
    const iterationsScore = Math.min(avgIterations * 5, 20);
    const reflectionScoreVal = Math.min(reflectionDepth * 0.2, 20);
    const improvementScore = Math.min(promptImprovement * 0.15, 15);
    const portfolioScore = Math.min(artifacts.length * 3, 15);
    const overall = Math.round(
      experimentsScore + iterationsScore + reflectionScoreVal + improvementScore + portfolioScore
    );

    let trend: "improving" | "stable" | "declining" = "stable";
    if (scores.length >= 2) {
      const lastTwo = scores.slice(-2);
      if (lastTwo[1] > lastTwo[0]) trend = "improving";
      else if (lastTwo[1] < lastTwo[0]) trend = "declining";
    }

    return {
      experimentsCompleted: expCount,
      totalIterations: experiments.reduce((s, e) => s + (e.version || 1), 0),
      averageIterations: avgIterations,
      reflectionDepth,
      promptImprovement,
      portfolioArtifacts: artifacts.length,
      overallScore: Math.min(overall, 100),
      trend,
    };
  }

  getTimeDistribution(lessonId: string): TimeDistribution {
    const expMs = (this.experimentTimes.get(lessonId) || []).reduce((a, b) => a + b, 0);
    const refMs = (this.reflectionTimes.get(lessonId) || []).reduce((a, b) => a + b, 0);
    const totalActive = expMs + refMs;
    const reading = 0;
    const totalPassive = reading;
    const total = totalActive + totalPassive || 1;
    return {
      experimenting: Math.round((expMs / total) * 100),
      reflecting: Math.round((refMs / total) * 100),
      building: 0,
      reading,
      totalActive,
      totalPassive,
      creationRatio: Math.round((totalActive / total) * 100),
    };
  }
}
