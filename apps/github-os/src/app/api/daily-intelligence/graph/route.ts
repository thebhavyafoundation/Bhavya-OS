import { NextResponse } from "next/server";
import {
  persistIntelligenceGraph,
  getIntelligenceGraphSummary,
} from "@/lib/intelligence-graph";
import { withAuth } from "@/lib/api-auth";

/**
 * POST /api/daily-intelligence/graph — Build and persist intelligence graph
 */
export const POST = withAuth(async () => {
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
});

/**
 * GET /api/daily-intelligence/graph — Get intelligence graph summary
 */
export const GET = withAuth(async () => {
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
});
