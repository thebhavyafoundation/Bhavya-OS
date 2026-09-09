import { NextRequest, NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";

/**
 * GET /api/daily-intelligence/runs — Get run history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    const orchestrator = new DailyIntelligenceOrchestrator();
    const runs = orchestrator.getRunHistory(Math.min(limit, 50));

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
}
