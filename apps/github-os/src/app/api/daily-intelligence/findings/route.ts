import { NextRequest, NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";
import type { IntelligenceSearchQuery } from "@/lib/daily-intelligence-types";

/**
 * GET /api/daily-intelligence/findings — Search intelligence findings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query: IntelligenceSearchQuery = {
      repository: searchParams.get("repository") ?? undefined,
      technology: searchParams.get("technology") ?? undefined,
      language: searchParams.get("language") ?? undefined,
      topic: searchParams.get("topic") ?? undefined,
      recommendation: searchParams.get("recommendation") ?? undefined,
      finding_type:
        (searchParams.get(
          "finding_type",
        ) as IntelligenceSearchQuery["finding_type"]) ?? undefined,
      quality_min:
        (searchParams.get(
          "quality_min",
        ) as IntelligenceSearchQuery["quality_min"]) ?? undefined,
      confidence_min:
        (searchParams.get(
          "confidence_min",
        ) as IntelligenceSearchQuery["confidence_min"]) ?? undefined,
      date_from: searchParams.get("date_from") ?? undefined,
      date_to: searchParams.get("date_to") ?? undefined,
      limit: parseInt(searchParams.get("limit") ?? "50", 10),
      offset: parseInt(searchParams.get("offset") ?? "0", 10),
    };

    const orchestrator = new DailyIntelligenceOrchestrator();
    const findings = orchestrator.searchFindings(query);

    // Get repository-specific findings if repository param provided
    const repoFindings = query.repository
      ? orchestrator.getFindingsByRepository(query.repository)
      : [];

    return NextResponse.json({
      success: true,
      findings: query.repository ? repoFindings : findings,
      count: query.repository ? repoFindings.length : findings.length,
      query,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
