import { NextRequest, NextResponse } from "next/server";
import {
  createCampaign,
  getCampaign,
  listCampaigns,
  updateCampaignStatus,
  addCampaignObjective,
  addCampaignAudience,
  linkPublicationToCampaign,
  getCampaignAnalytics,
} from "@/campaign/engine";
import type {
  CampaignType,
  CampaignStatus,
  CommunicationChannel,
  AudienceType,
} from "@/lib/types";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "list": {
      const status = searchParams.get("status") as CampaignStatus | undefined;
      const type = searchParams.get("type") as CampaignType | undefined;
      const limit = Math.min(Number(searchParams.get("limit")) || 50, 1000);
      const campaigns = listCampaigns({ status, type, limit });
      return NextResponse.json({ campaigns });
    }

    case "get": {
      const id = searchParams.get("id");
      if (!id)
        return NextResponse.json({ error: "id required" }, { status: 400 });
      const campaign = getCampaign(id);
      if (!campaign)
        return NextResponse.json({ error: "not found" }, { status: 404 });
      return NextResponse.json({ campaign });
    }

    case "analytics": {
      const id = searchParams.get("id");
      if (!id)
        return NextResponse.json({ error: "id required" }, { status: 400 });
      const analytics = getCampaignAnalytics(id);
      return NextResponse.json({ analytics });
    }

    default: {
      const campaigns = listCampaigns({ limit: 20 });
      return NextResponse.json({ campaigns });
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
    case "create": {
      const {
        name,
        description,
        type,
        knowledgePackageId,
        channels,
        startDate,
        endDate,
      } = body;
      if (!name)
        return NextResponse.json({ error: "name required" }, { status: 400 });
      const campaign = createCampaign({
        name,
        description,
        type,
        knowledgePackageId,
        channels,
        startDate,
        endDate,
      });
      return NextResponse.json({ campaign }, { status: 201 });
    }

    case "update-status": {
      const { campaignId, status } = body;
      if (!campaignId || !status)
        return NextResponse.json(
          { error: "campaignId and status required" },
          { status: 400 },
        );
      const campaign = updateCampaignStatus(campaignId, status);
      if (!campaign)
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 },
        );
      return NextResponse.json({ campaign });
    }

    case "add-objective": {
      const { campaignId, description, targetMetric, targetValue, unit } = body;
      if (!campaignId)
        return NextResponse.json(
          { error: "campaignId required" },
          { status: 400 },
        );
      const objective = addCampaignObjective(campaignId, {
        description,
        targetMetric,
        targetValue,
        unit,
      });
      return NextResponse.json({ objective }, { status: 201 });
    }

    case "add-audience": {
      const { campaignId, name, type, size, channels } = body;
      if (!campaignId)
        return NextResponse.json(
          { error: "campaignId required" },
          { status: 400 },
        );
      const audience = addCampaignAudience(campaignId, {
        name,
        type,
        size,
        channels,
      });
      return NextResponse.json({ audience }, { status: 201 });
    }

    case "link-publication": {
      const { campaignId, publicationId } = body;
      if (!campaignId || !publicationId)
        return NextResponse.json(
          { error: "campaignId and publicationId required" },
          { status: 400 },
        );
      linkPublicationToCampaign(campaignId, publicationId);
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});
