import type { AIProvider, Experiment, ExperimentMetrics } from "../types";

export interface MentorResponse {
  type: "question" | "challenge" | "encouragement" | "suggestion";
  content: string;
}

export class AIMentor {
  constructor(private provider: AIProvider) {}

  async coach(experiment: Experiment, metrics: ExperimentMetrics): Promise<MentorResponse> {
    const { prompt, output } = experiment;
    const { totalAttempts, improvementRate, trend } = metrics;

    if (totalAttempts <= 1) {
      return {
        type: "question",
        content:
          "Good first attempt. Now look at the output. Is this what you wanted? " +
          "What is missing? Try adding more detail about who this is for and what format you want.",
      };
    }

    if (improvementRate > 50) {
      return {
        type: "encouragement",
        content:
          "Excellent improvement! You went from " +
          metrics.bestScore +
          " to " +
          metrics.currentScore +
          ". " +
          "You are learning that specificity and structure matter. Keep iterating.",
      };
    }

    if (trend === "declining") {
      return {
        type: "challenge",
        content:
          "Your last attempt scored lower than your best. " +
          "What changed? Sometimes simpler is better. " +
          "Try going back to what worked before and making one small change.",
      };
    }

    if (prompt.length < 40) {
      return {
        type: "suggestion",
        content:
          "Your prompt is quite short. " +
          "Consider adding: who is the audience, what format you want, and what constraints to follow.",
      };
    }

    return {
      type: "question",
      content:
        "What would happen if you tried a completely different approach? " +
        "Sometimes the best prompts come from unexpected angles.",
    };
  }

  async review(prompt: string, output: string): Promise<{ score: number; feedback: string }> {
    const words = prompt.split(/\s+/).length;
    let score = 0;
    if (words >= 5) score += 20;
    if (/[.:;,]/.test(prompt)) score += 20;
    if (prompt.length > 60) score += 20;
    if (/explain to|for a|for someone/i.test(prompt)) score += 20;
    if (/step by step|json|list|format/i.test(prompt)) score += 10;
    if (/example|for instance/i.test(prompt)) score += 10;

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (words >= 5) strengths.push("Good detail level");
    else improvements.push("Add more detail");
    if (/[.:;,]/.test(prompt)) strengths.push("Clear structure");
    else improvements.push("Add punctuation for clarity");
    if (/explain to|for a/i.test(prompt)) strengths.push("Audience specified");
    else improvements.push("Specify who this is for");
    if (/step by step|json|list/i.test(prompt)) strengths.push("Format defined");
    else improvements.push("Request a specific format");

    return {
      score: Math.min(score, 100),
      feedback:
        (strengths.length > 0 ? "Strengths: " + strengths.join(", ") + ". " : "") +
        (improvements.length > 0 ? "To improve: " + improvements.join(", ") + "." : ""),
    };
  }
}
