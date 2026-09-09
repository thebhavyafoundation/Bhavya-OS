import { NextRequest, NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";
import { withAuth } from "@/lib/api-auth";

/**
 * GET /api/daily-intelligence/runs — Get run history
 */
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawLimit = parseInt(searchParams.get("limit") ?? "10", 10);
    const limit = Math.max(1, Math.min(50, isNaN(rawLimit) ? 10 : rawLimit));

    const orchestrator = new DailyIntelligenceOrchestrator();
    const runs = orchestrator.getRunHistory(limit);

    return NextResponse.json({
      success: true,
      runs,
      count: runs.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
});
