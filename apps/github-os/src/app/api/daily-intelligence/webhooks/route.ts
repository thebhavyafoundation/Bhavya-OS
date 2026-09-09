import { NextRequest, NextResponse } from "next/server";
import {
  getWebhookConfigs,
  storeWebhookConfig,
} from "@/lib/webhook-notifications";
import { withAuth } from "@/lib/api-auth";
import type { WebhookConfig } from "@/lib/webhook-notifications";

/**
 * GET /api/daily-intelligence/webhooks — List webhook configs
 */
export const GET = withAuth(async () => {
  try {
    const configs = getWebhookConfigs();
    return NextResponse.json({
      success: true,
      webhooks: configs.map((c) => ({
        url: c.url,
        type: c.type,
        enabled: c.enabled,
        min_relevance: c.min_relevance,
        min_confidence: c.min_confidence,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
});

/**
 * POST /api/daily-intelligence/webhooks — Add or update a webhook config
 */
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const config: WebhookConfig = {
      url: body.url,
      type: body.type ?? "generic",
      enabled: body.enabled ?? true,
      min_relevance: body.min_relevance ?? "high",
      min_confidence: body.min_confidence ?? "medium",
    };

    if (!config.url) {
      return NextResponse.json(
        { success: false, error: "url is required" },
        { status: 400 },
      );
    }

    storeWebhookConfig(config);

    return NextResponse.json({
      success: true,
      message: `Webhook configured for ${new URL(config.url).hostname}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
});
