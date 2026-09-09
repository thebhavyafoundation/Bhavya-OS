import { NextRequest, NextResponse } from "next/server";
import {
  persistIntelligenceGraph,
  getIntelligenceGraphSummary,
} from "@/lib/intelligence-graph";

/**
 * POST /api/daily-intelligence/graph — Build and persist intelligence graph
 */
export async function POST() {
  try {
    const result = persistIntelligenceGraph();
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/daily-intelligence/graph — Get intelligence graph summary
 */
export async function GET() {
  try {
    const summary = getIntelligenceGraphSummary();
    return NextResponse.json({
      success: true,
      ...summary,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
