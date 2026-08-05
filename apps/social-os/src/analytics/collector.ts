import { getDb } from "../lib/db.js";
import { getRecentEvents, markEventProcessed } from "../lib/events.js";
import type { PlatformMetrics, AnalyticsSnapshot } from "../lib/types.js";
import { v4 as uuidv4 } from "uuid";

export function collectAnalytics(
  publicationId: string,
): AnalyticsSnapshot | null {
  const db = getDb();
  const now = new Date().toISOString();

  const metricsRow = db
    .prepare(
      "SELECT * FROM analytics_snapshots WHERE publication_id = ? ORDER BY collected_at DESC LIMIT 1",
    )
    .get(publicationId) as any;

  if (metricsRow) {
    return {
      publicationId,
      collectedAt: metricsRow.collected_at,
      metrics: JSON.parse(metricsRow.metrics || "{}"),
    };
  }

  return null;
}

export function saveAnalytics(
  publicationId: string,
  metrics: Record<string, PlatformMetrics>,
): AnalyticsSnapshot {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO analytics_snapshots (id, publication_id, collected_at, metrics)
    VALUES (?, ?, ?, ?)
  `,
  ).run(id, publicationId, now, JSON.stringify(metrics));

  return {
    publicationId,
    collectedAt: now,
    metrics: metrics as Record<string, PlatformMetrics>,
  };
}

export function getAnalyticsSummary(): {
  totalPublications: number;
  publishedCount: number;
  totalImpressions: number;
  totalEngagement: number;
  topPlatform: string;
} {
  const db = getDb();

  const total = (
    db.prepare("SELECT COUNT(*) as count FROM publications").get() as any
  ).count;
  const published = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM publications WHERE status = 'published'",
      )
      .get() as any
  ).count;

  const analyticsRows = db
    .prepare("SELECT metrics FROM analytics_snapshots")
    .all() as any[];
  let totalImpressions = 0;
  let totalEngagement = 0;

  for (const row of analyticsRows) {
    const metrics = JSON.parse(row.metrics || "{}");
    for (const platform of Object.values(metrics) as PlatformMetrics[]) {
      totalImpressions += platform.impressions;
      totalEngagement += platform.engagement;
    }
  }

  return {
    totalPublications: total,
    publishedCount: published,
    totalImpressions,
    totalEngagement,
    topPlatform: "linkedin",
  };
}

export function processAnalyticsEvents(): number {
  const events = getRecentEvents();
  let processed = 0;

  for (const event of events) {
    if (event.type === "analytics.feed") {
      const { publicationId, metrics } = event.payload;
      if (publicationId && metrics) {
        saveAnalytics(publicationId, metrics);
        markEventProcessed(event.id);
        processed++;
      }
    }
  }

  return processed;
}
