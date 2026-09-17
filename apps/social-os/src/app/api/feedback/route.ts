import { NextRequest, NextResponse } from "next/server";
import {
  submitFeedback,
  listFeedback,
  getFeedbackIntelligence,
  processFeedback,
} from "@/campaign/community-intelligence";
import type { FeedbackSource, FeedbackClassification } from "@/lib/types";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "list": {
      const source = searchParams.get("source") as FeedbackSource | undefined;
      const classification = searchParams.get("classification") as
        FeedbackClassification | undefined;
      const campaignId = searchParams.get("campaignId");
      const limit = Math.min(Number(searchParams.get("limit")) || 50, 1000);
      const feedback = listFeedback({
        source,
        classification,
        campaignId: campaignId || undefined,
        limit,
      });
      return NextResponse.json({ feedback });
    }

    case "intelligence": {
      const intelligence = getFeedbackIntelligence();
      return NextResponse.json({ intelligence });
    }

    default: {
      const feedback = listFeedback({ limit: 20 });
      return NextResponse.json({ feedback });
    }
  }
});

export const POST = withAuth(async (request, _user) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { action } = body;

  switch (action) {
    case "submit": {
      const { source, content, author, url, knowledgePackageId, campaignId } =
        body;
      if (!source || !content)
        return NextResponse.json(
          { error: "source and content required" },
          { status: 400 },
        );
      const feedback = submitFeedback({
        source,
        content,
        author,
        url,
        knowledgePackageId,
        campaignId,
      });
      return NextResponse.json({ feedback }, { status: 201 });
    }

    case "process": {
      const { feedbackId } = body;
      if (!feedbackId)
        return NextResponse.json(
          { error: "feedbackId required" },
          { status: 400 },
        );
      processFeedback(feedbackId);
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});
