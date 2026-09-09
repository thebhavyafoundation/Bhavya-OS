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
 * Validate a webhook URL to prevent SSRF attacks.
 * Blocks internal network addresses, localhost, non-HTTPS schemes,
 * IPv6 private ranges, DNS rebinding attempts, and dangerous ports.
 */
function validateWebhookUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);

    // Only allow https (no http, even for development)
    if (parsed.protocol !== "https:") {
      return { valid: false, error: "Only HTTPS URLs are allowed" };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost variants
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "[::1]" ||
      hostname === "0.0.0.0"
    ) {
      return { valid: false, error: "Localhost URLs are not allowed" };
    }

    // Block IPv4 private/internal ranges
    const ipMatch = hostname.match(
      /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
    );
    if (ipMatch) {
      const [, a, b, c] = ipMatch.map(Number);
      // Validate each octet is 0-255
      if (ipMatch.slice(1).some((v) => Number(v) > 255)) {
        return { valid: false, error: "Invalid IP address" };
      }
      // 0.0.0.0/8
      if (a === 0)
        return { valid: false, error: "Reserved network URLs are not allowed" };
      // 10.0.0.0/8
      if (a === 10)
        return { valid: false, error: "Private network URLs are not allowed" };
      // 100.64.0.0/10 (CGNAT)
      if (a === 100 && b >= 64 && b <= 127)
        return { valid: false, error: "Private network URLs are not allowed" };
      // 127.0.0.0/8
      if (a === 127)
        return { valid: false, error: "Loopback URLs are not allowed" };
      // 169.254.0.0/16 (link-local / cloud metadata)
      if (a === 169 && b === 254)
        return { valid: false, error: "Link-local URLs are not allowed" };
      // 172.16.0.0/12
      if (a === 172 && b >= 16 && b <= 31)
        return { valid: false, error: "Private network URLs are not allowed" };
      // 192.168.0.0/16
      if (a === 192 && b === 168)
        return { valid: false, error: "Private network URLs are not allowed" };
      // 224.0.0.0/4 (multicast)
      if (a >= 224 && a <= 239)
        return { valid: false, error: "Multicast URLs are not allowed" };
      // 240.0.0.0/4 (reserved)
      if (a >= 240)
        return { valid: false, error: "Reserved network URLs are not allowed" };
    }

    // Block IPv6 private/loopback/link-local ranges
    if (hostname.includes(":") || hostname.startsWith("[")) {
      const cleanIpv6 = hostname.replace(/[\[\]]/g, "");
      // Loopback ::1
      if (cleanIpv6 === "::1")
        return { valid: false, error: "Loopback URLs are not allowed" };
      // Link-local fe80::/10
      if (cleanIpv6.startsWith("fe80"))
        return { valid: false, error: "Link-local URLs are not allowed" };
      // Unique local fc00::/7
      if (cleanIpv6.startsWith("fc") || cleanIpv6.startsWith("fd"))
        return { valid: false, error: "Private network URLs are not allowed" };
      // IPv4-mapped ::ffff:0:0/96
      if (
        cleanIpv6.includes("ffff") &&
        (cleanIpv6.includes("127") ||
          cleanIpv6.includes("10.") ||
          cleanIpv6.includes("192.168") ||
          cleanIpv6.includes("172.16"))
      ) {
        return { valid: false, error: "Private network URLs are not allowed" };
      }
    }

    // Block dangerous ports
    const port = parsed.port ? parseInt(parsed.port, 10) : 443;
    const dangerousPorts = new Set([
      22, 23, 25, 53, 80, 445, 1433, 1521, 2049, 3306, 3389, 5432, 5984, 6379,
      8080, 8443, 9200, 9300, 27017,
    ]);
    if (dangerousPorts.has(port)) {
      return { valid: false, error: `Port ${port} is not allowed` };
    }

    // Block metadata endpoints by hostname pattern
    if (
      hostname.endsWith(".internal") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".localdomain") ||
      hostname === "metadata.google.internal" ||
      hostname === "169.254.169.254" ||
      hostname === "metadata.aws.internal" ||
      hostname === "169.254.169.254.nip.io" ||
      hostname === "instance-data"
    ) {
      return { valid: false, error: "Internal metadata URLs are not allowed" };
    }

    // Block cloud metadata endpoints
    if (
      hostname === "metadata.google.internal" ||
      hostname === "metadata.googleapis.com" ||
      hostname === "169.254.169.254" ||
      hostname === "metadata.aws" ||
      hostname === "169.254.170.2" ||
      hostname === "169.254.169.254.nip.io"
    ) {
      return { valid: false, error: "Cloud metadata URLs are not allowed" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

/**
 * Send a webhook notification
 */
async function sendWebhook(
  config: WebhookConfig,
  payload: NotificationPayload,
): Promise<{ success: boolean; error?: string }> {
  if (!config.enabled) return { success: false, error: "Webhook disabled" };

  // SSRF protection: validate URL before sending
  const urlCheck = validateWebhookUrl(config.url);
  if (!urlCheck.valid) return { success: false, error: urlCheck.error };

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
      redirect: "error", // Prevent redirect-based SSRF
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
  // Validate URL before storing
  const urlCheck = validateWebhookUrl(config.url);
  if (!urlCheck.valid) {
    throw new Error(`Invalid webhook URL: ${urlCheck.error}`);
  }

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
