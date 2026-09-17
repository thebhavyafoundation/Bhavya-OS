import { getAnalyticsSummary, saveAnalytics } from "../analytics/collector";
import { emitEvent, getRecentEvents } from "../lib/events";
import type { PlatformMetrics } from "../lib/types";

export interface GitHubOSFeedback {
  repository: string;
  metrics: {
    stars: number;
    forks: number;
    issues: number;
    pullRequests: number;
    contributors: number;
  };
  socialImpact: {
    totalImpressions: number;
    totalEngagement: number;
    topPost: string;
  };
}

export function getGitHubOSFeedback(): GitHubOSFeedback {
  const summary = getAnalyticsSummary();

  return {
    repository: "thebhavyafoundation/Bhavya-OS",
    metrics: {
      stars: 0,
      forks: 0,
      issues: 0,
      pullRequests: 0,
      contributors: 0,
    },
    socialImpact: {
      totalImpressions: summary.totalImpressions,
      totalEngagement: summary.totalEngagement,
      topPost: "",
    },
  };
}

export function publishAnalyticsToGitHub(): void {
  const feedback = getGitHubOSFeedback();
  emitEvent("analytics.feed", {
    repository: feedback.repository,
    socialImpact: feedback.socialImpact,
    timestamp: new Date().toISOString(),
  });
}

export function collectAndReportAnalytics(): {
  publications: number;
  impressions: number;
  engagement: number;
  eventsProcessed: number;
} {
  const summary = getAnalyticsSummary();
  const events = getRecentEvents(100);
  const analyticsEvents = events.filter((e) => e.type === "analytics.feed");

  return {
    publications: summary.publishedCount,
    impressions: summary.totalImpressions,
    engagement: summary.totalEngagement,
    eventsProcessed: analyticsEvents.length,
  };
}
