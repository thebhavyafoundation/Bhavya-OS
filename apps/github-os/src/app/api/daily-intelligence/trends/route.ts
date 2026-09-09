import { NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";

/**
 * GET /api/daily-intelligence/trends — Get detected trends
 */
export async function GET() {
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
}
