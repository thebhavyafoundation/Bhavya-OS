import { NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";
import { withAuth } from "@/lib/api-auth";

/**
 * GET /api/daily-intelligence/trends — Get detected trends
 */
export const GET = withAuth(async () => {
  try {
    const orchestrator = new DailyIntelligenceOrchestrator();
    const trends = orchestrator.detectTrends();

    return NextResponse.json({
      success: true,
      trends,
      count: trends.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
});
