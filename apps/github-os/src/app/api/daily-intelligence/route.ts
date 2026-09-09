import { NextRequest, NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";
import type { DailyRunConfig } from "@/lib/daily-intelligence-types";

/**
 * POST /api/daily-intelligence — Trigger a daily intelligence run
 * GET  /api/daily-intelligence — Get latest run status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const config: Partial<DailyRunConfig> = {
      max_candidates: body.max_candidates ?? 100,
      max_inspections: body.max_inspections ?? 30,
      max_api_requests: body.max_api_requests ?? 200,
      min_stars: body.min_stars ?? 10,
      categories: body.categories ?? [
        "ai",
        "developer-tools",
        "infrastructure",
        "web-experience",
        "education",
      ],
      languages: body.languages ?? [],
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
}

export async function GET() {
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
}
