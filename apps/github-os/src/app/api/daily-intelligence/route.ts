import { NextRequest, NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";
import { withAuth } from "@/lib/api-auth";
import type { DailyRunConfig } from "@/lib/daily-intelligence-types";

/**
 * POST /api/daily-intelligence — Trigger a daily intelligence run
 * GET  /api/daily-intelligence — Get latest run status
 */
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json().catch(() => ({}));

    // Validate and sanitize config parameters
    const max_candidates = Math.max(
      1,
      Math.min(500, Number(body.max_candidates) || 100),
    );
    const max_inspections = Math.max(
      1,
      Math.min(100, Number(body.max_inspections) || 30),
    );
    const max_api_requests = Math.max(
      1,
      Math.min(1000, Number(body.max_api_requests) || 200),
    );
    const min_stars = Math.max(
      0,
      Math.min(10000, Number(body.min_stars) || 10),
    );

    const config: Partial<DailyRunConfig> = {
      max_candidates,
      max_inspections,
      max_api_requests,
      min_stars,
      categories: Array.isArray(body.categories)
        ? body.categories
            .filter((c: unknown) => typeof c === "string")
            .slice(0, 20)
        : [
            "ai",
            "developer-tools",
            "infrastructure",
            "web-experience",
            "education",
          ],
      languages: Array.isArray(body.languages)
        ? body.languages
            .filter((l: unknown) => typeof l === "string")
            .slice(0, 20)
        : [],
    };

    const orchestrator = new DailyIntelligenceOrchestrator(
      process.env.GITHUB_TOKEN ?? null,
    );
    const run = await orchestrator.runDailyIntelligence(config);

    return NextResponse.json({
      success: true,
      run,
      message: `Daily intelligence run ${run.status}: ${run.findings_count} findings from ${run.inspected_count} repos`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
});

export const GET = withAuth(async () => {
  try {
    const orchestrator = new DailyIntelligenceOrchestrator();
    const runs = orchestrator.getRunHistory(1);
    const latest = runs[0] ?? null;
    const briefing = orchestrator.getLatestBriefing();

    return NextResponse.json({
      success: true,
      latest_run: latest,
      latest_briefing: briefing,
      has_run: latest !== null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
});
