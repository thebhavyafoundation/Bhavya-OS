// ─── Webhook Notifications ──────────────────────────────────────────────────
// Sends notifications for high-relevance intelligence findings.
// Supports Discord webhooks and generic HTTP webhooks.

import { getDb } from "./db";
import type {
  IntelligenceFinding,
  DailyBriefing,
} from "./daily-intelligence-types";

export interface WebhookConfig {
  url: string;
  type: "discord" | "generic";
  enabled: boolean;
  min_relevance: "high" | "medium" | "low";
  min_confidence: "high" | "medium" | "low";
}

export interface NotificationPayload {
  title: string;
  description: string;
  findings: IntelligenceFinding[];
  briefing: DailyBriefing | null;
  timestamp: string;
}

const RELEVANCE_RANK = { low: 0, medium: 1, high: 2 };
const CONFIDENCE_RANK = { low: 0, medium: 1, high: 2 };

function meetsThreshold(
  actual: string,
  threshold: string,
  rankMap: Record<string, number>,
): boolean {
  return (rankMap[actual] ?? 0) >= (rankMap[threshold] ?? 0);
}

/**
 * Format findings into a Discord webhook payload
 */
function formatDiscordPayload(payload: NotificationPayload): object {
  const findingCount = payload.findings.length;
  const highRelevance = payload.findings.filter(
    (f) => f.relevance_to_bhavya === "high",
  );

  const embeds = [
    {
      title: payload.title,
      description: payload.description,
      color: 0x22c55e, // green
      fields: [
        {
          name: "Findings",
          value: `${findingCount} total, ${highRelevance.length} high-relevance`,
          inline: true,
        },
        {
          name: "Time",
          value: new Date(payload.timestamp).toLocaleString(),
          inline: true,
        },
      ],
      footer: {
        text: "Bhavya Foundation — Daily Intelligence Loop",
      },
    },
  ];

  // Add top findings as fields
  for (const finding of payload.findings.slice(0, 5)) {
    embeds[0].fields.push({
      name: `${finding.title} (${finding.confidence} confidence)`,
      value: finding.description.slice(0, 200),
      inline: false,
    });
  }

  return { embeds };
}

/**
 * Format findings into a generic HTTP webhook payload
 */
function formatGenericPayload(payload: NotificationPayload): object {
  return {
    event: "daily_intelligence",
    timestamp: payload.timestamp,
    title: payload.title,
    description: payload.description,
    findings_count: payload.findings.length,
    findings: payload.findings.map((f) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      type: f.finding_type,
      category: f.category,
      confidence: f.confidence,
      relevance: f.relevance_to_bhavya,
      tags: f.tags,
    })),
    briefing: payload.briefing
      ? {
          summary: payload.briefing.summary,
          top_discoveries: payload.briefing.top_discoveries.length,
        }
      : null,
  };
}

/**
 * Send a webhook notification
 */
async function sendWebhook(
  config: WebhookConfig,
  payload: NotificationPayload,
): Promise<{ success: boolean; error?: string }> {
  if (!config.enabled) return { success: false, error: "Webhook disabled" };

  const body =
    config.type === "discord"
      ? formatDiscordPayload(payload)
      : formatGenericPayload(payload);

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Get webhook configurations from the database
 */
export function getWebhookConfigs(): WebhookConfig[] {
  const db = getDb();
  try {
    const rows = db
      .prepare(
        "SELECT * FROM daily_intelligence_config WHERE type = 'webhook' AND enabled = 1",
      )
      .all() as Array<{
      key: string;
      value: string;
      type: string;
      enabled: number;
    }>;

    return rows.map((row) => {
      const config = JSON.parse(row.value) as WebhookConfig;
      return { ...config, enabled: row.enabled === 1 };
    });
  } catch {
    return [];
  }
}

/**
 * Notify for high-relevance findings after a daily run
 */
export async function notifyHighRelevanceFindings(
  findings: IntelligenceFinding[],
  briefing: DailyBriefing | null,
): Promise<{
  notificationsSent: number;
  results: Array<{ url: string; success: boolean; error?: string }>;
}> {
  const configs = getWebhookConfigs();
  if (configs.length === 0) {
    return { notificationsSent: 0, results: [] };
  }

  // Filter findings by thresholds
  const relevantFindings = findings.filter(
    (f) =>
      meetsThreshold(
        f.relevance_to_bhavya,
        configs[0].min_relevance,
        RELEVANCE_RANK,
      ) &&
      meetsThreshold(f.confidence, configs[0].min_confidence, CONFIDENCE_RANK),
  );

  if (relevantFindings.length === 0) {
    return { notificationsSent: 0, results: [] };
  }

  const payload: NotificationPayload = {
    title: `🧠 Daily Intelligence: ${relevantFindings.length} relevant findings`,
    description: `High-relevance discoveries from today's intelligence scan across ${new Set(relevantFindings.map((f) => f.finding_type)).size} categories.`,
    findings: relevantFindings,
    briefing,
    timestamp: new Date().toISOString(),
  };

  const results = await Promise.all(
    configs.map(async (config) => {
      const result = await sendWebhook(config, payload);
      return { url: config.url, ...result };
    }),
  );

  return {
    notificationsSent: results.filter((r) => r.success).length,
    results,
  };
}

/**
 * Store a webhook configuration
 */
export function storeWebhookConfig(config: WebhookConfig): void {
  const db = getDb();
  db.prepare(
    `INSERT OR REPLACE INTO daily_intelligence_config (key, value, type, enabled, updated_at)
     VALUES (?, ?, 'webhook', ?, datetime('now'))`,
  ).run(
    `webhook:${new URL(config.url).hostname}`,
    JSON.stringify(config),
    config.enabled ? 1 : 0,
  );
}
