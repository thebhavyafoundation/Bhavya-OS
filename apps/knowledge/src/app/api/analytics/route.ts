import { NextRequest, NextResponse } from "next/server";
import {
  getOperationalMetrics,
  getKnowledgeMetrics,
  getDomainCoverage,
} from "@bhavya/intelligence";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") || "all";

  switch (view) {
    case "operational":
      return NextResponse.json({
        success: true,
        data: getOperationalMetrics(),
      });

    case "knowledge":
      return NextResponse.json({
        success: true,
        data: getKnowledgeMetrics(),
      });

    case "coverage":
      return NextResponse.json({
        success: true,
        data: getDomainCoverage(),
      });

    case "all":
    default:
      return NextResponse.json({
        success: true,
        data: {
          operational: getOperationalMetrics(),
          knowledge: getKnowledgeMetrics(),
          coverage: getDomainCoverage(),
        },
      });
  }
}
