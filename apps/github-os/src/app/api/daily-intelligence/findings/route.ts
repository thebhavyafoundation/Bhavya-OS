import { NextRequest, NextResponse } from "next/server";
import { DailyIntelligenceOrchestrator } from "@/lib/daily-intelligence-engine";
import { withAuth } from "@/lib/api-auth";
import type { IntelligenceSearchQuery } from "@/lib/daily-intelligence-types";

const ALLOWED_FINDING_TYPES = [
  "engineering_practice",
  "architecture_lesson",
  "ai_technique",
  "design_principle",
  "visual_insight",
  "learning_lesson",
  "security_concern",
  "license_concern",
  "experiment_idea",
];

const ALLOWED_QUALITY_LEVELS = ["low", "medium", "high", "exceptional"];
const ALLOWED_CONFIDENCE_LEVELS = ["low", "medium", "high"];

/**
 * GET /api/daily-intelligence/findings — Search intelligence findings
 */
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);

    // Validate and sanitize limit/offset
    const rawLimit = parseInt(searchParams.get("limit") ?? "50", 10);
    const rawOffset = parseInt(searchParams.get("offset") ?? "0", 10);
    const limit = Math.max(1, Math.min(200, isNaN(rawLimit) ? 50 : rawLimit));
    const offset = Math.max(0, isNaN(rawOffset) ? 0 : rawOffset);

    // Validate enum fields
    const findingType = searchParams.get("finding_type");
    const qualityMin = searchParams.get("quality_min");
    const confidenceMin = searchParams.get("confidence_min");

    const query: IntelligenceSearchQuery = {
      repository: searchParams.get("repository") ?? undefined,
      technology: searchParams.get("technology") ?? undefined,
      language: searchParams.get("language") ?? undefined,
      topic: searchParams.get("topic") ?? undefined,
      recommendation: searchParams.get("recommendation") ?? undefined,
      finding_type:
        findingType && ALLOWED_FINDING_TYPES.includes(findingType)
          ? (findingType as IntelligenceSearchQuery["finding_type"])
          : undefined,
      quality_min:
        qualityMin && ALLOWED_QUALITY_LEVELS.includes(qualityMin)
          ? (qualityMin as IntelligenceSearchQuery["quality_min"])
          : undefined,
      confidence_min:
        confidenceMin && ALLOWED_CONFIDENCE_LEVELS.includes(confidenceMin)
          ? (confidenceMin as IntelligenceSearchQuery["confidence_min"])
          : undefined,
      date_from: searchParams.get("date_from") ?? undefined,
      date_to: searchParams.get("date_to") ?? undefined,
      limit,
      offset,
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
});
