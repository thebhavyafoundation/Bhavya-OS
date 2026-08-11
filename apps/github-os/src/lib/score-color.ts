/**
 * Shared score-to-color mapping using Bhavya design tokens.
 * Used across workbench, websites, design-genome, and patterns pages.
 */

export function scoreToColor(score: number): string {
  if (score >= 80) return "var(--color-score-excellent)";
  if (score >= 60) return "var(--color-score-good)";
  if (score >= 40) return "var(--color-score-moderate)";
  return "var(--color-score-poor)";
}

export function scoreToBg(score: number): string {
  if (score >= 80) return "var(--color-score-excellent-bg)";
  if (score >= 60) return "var(--color-score-good-bg)";
  if (score >= 40) return "var(--color-score-moderate-bg)";
  return "var(--color-score-poor-bg)";
}

export function scoreToBorder(score: number): string {
  if (score >= 80) return "var(--color-score-excellent-border)";
  if (score >= 60) return "var(--color-score-good-border)";
  if (score >= 40) return "var(--color-score-moderate-border)";
  return "var(--color-score-poor-border)";
}

export function severityToColor(severity: string): string {
  if (severity === "critical" || severity === "error")
    return "var(--color-status-error)";
  if (severity === "major" || severity === "warning")
    return "var(--color-score-good)";
  return "var(--color-score-excellent)";
}

export function priorityToColor(priority: string): string {
  if (priority === "high") return "var(--color-status-error)";
  if (priority === "medium") return "var(--color-score-good)";
  return "var(--color-score-excellent)";
}
