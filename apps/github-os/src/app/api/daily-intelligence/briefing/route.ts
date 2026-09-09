import { NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";
import { withAuth } from "@/lib/api-auth";

/**
 * GET /api/daily-intelligence/briefing — Get latest daily briefing
 */
export const GET = withAuth(async () => {
  try {
    const orchestrator = new DailyIntelligenceOrchestrator();
    const briefing = orchestrator.getLatestBriefing();

    if (!briefing) {
      return NextResponse.json({
        success: true,
        has_briefing: false,
        message: "No daily briefings yet. Run daily intelligence first.",
      });
    }

    return NextResponse.json({
      success: true,
      has_briefing: true,
      briefing,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
});
