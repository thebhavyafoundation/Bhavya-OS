import { NextRequest, NextResponse } from "next/server";
import {
  getInstitutionPulse,
  getMissionMetrics,
  collectInstitutionalMetrics,
  getInstitutionMetrics,
} from "@/analytics/institution.js";
import { getAnalyticsSummary } from "@/analytics/collector.js";
import {
  getGitHubOSFeedback,
  collectAndReportAnalytics,
} from "@/lib/github-integration.js";
import { getFeedbackIntelligence } from "@/campaign/community-intelligence.js";
import { getCalendarStats } from "@/campaign/calendar.js";
import { listCampaigns } from "@/campaign/engine.js";
import { listPublications, getPendingApprovals } from "@/lib/publications.js";

export async function GET() {
  const pulse = getInstitutionPulse();
  const mission = getMissionMetrics();
  const analytics = getAnalyticsSummary();
  const calendar = getCalendarStats();
  const feedback = getFeedbackIntelligence();
  const campaigns = listCampaigns({ limit: 10 });
  const publications = listPublications({ limit: 10 });
  const approvals = getPendingApprovals();
  const github = getGitHubOSFeedback();
  const allMetrics = getInstitutionMetrics();

  return NextResponse.json({
    institutionPulse: pulse,
    missionMetrics: mission,
    platformAnalytics: analytics,
    calendarStats: calendar,
    feedbackIntelligence: feedback,
    activeCampaigns: campaigns.length,
    recentPublications: publications.length,
    pendingApprovals: approvals.length,
    githubOS: github,
    allMetrics,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "collect-metrics": {
      collectInstitutionalMetrics();
      return NextResponse.json({ success: true });
    }

    case "collect-analytics": {
      const report = collectAndReportAnalytics();
      return NextResponse.json({ report });
    }

    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
}
