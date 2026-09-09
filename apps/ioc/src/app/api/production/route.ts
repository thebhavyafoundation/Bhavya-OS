import { NextResponse } from "next/server";
import {
  createKP,
  listKPs,
  updateKPStatus,
  advanceKP,
  createMediaAsset,
  listMediaAssets,
  createCommunityRequest,
  addStudentFeedback,
  getProductionMetrics,
} from "@/lib/production";
import type { KPStatus, ProductionStage, MediaAssetType } from "@/lib/types";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "metrics": {
      return NextResponse.json({ metrics: getProductionMetrics() });
    }
    case "list": {
      const status = searchParams.get("status") as KPStatus | undefined;
      const level = searchParams.get("level") || undefined;
      const stage = searchParams.get("stage") as ProductionStage | undefined;
      return NextResponse.json({ kps: listKPs({ status, level, stage }) });
    }
    case "media": {
      const kpId = searchParams.get("kpId") || undefined;
      const type = searchParams.get("type") as MediaAssetType | undefined;
      return NextResponse.json({ assets: listMediaAssets({ kpId, type }) });
    }
    default:
      return NextResponse.json({ metrics: getProductionMetrics() });
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
    case "create-kp": {
      const { title, level, domain, assignee, dueDate, concepts } = body;
      if (!title)
        return NextResponse.json({ error: "title required" }, { status: 400 });
      const kp = createKP({
        title,
        level,
        domain,
        assignee,
        dueDate,
        concepts,
      });
      return NextResponse.json({ kp }, { status: 201 });
    }
    case "update-status": {
      const { kpId, status, stage } = body;
      if (!kpId || !status)
        return NextResponse.json(
          { error: "kpId and status required" },
          { status: 400 },
        );
      const kp = updateKPStatus(
        kpId,
        status as KPStatus,
        stage as ProductionStage | undefined,
      );
      if (!kp)
        return NextResponse.json(
          { error: "Knowledge Package not found" },
          { status: 404 },
        );
      return NextResponse.json({ kp });
    }
    case "advance": {
      const { kpId } = body;
      if (!kpId)
        return NextResponse.json({ error: "kpId required" }, { status: 400 });
      const kp = advanceKP(kpId);
      return NextResponse.json({ kp });
    }
    case "create-media": {
      const { kpId, type, title, platform } = body;
      if (!kpId || !type || !title)
        return NextResponse.json(
          { error: "kpId, type, and title required" },
          { status: 400 },
        );
      const asset = createMediaAsset({
        kpId,
        type: type as MediaAssetType,
        title,
        platform,
      });
      return NextResponse.json({ asset }, { status: 201 });
    }
    case "community-request": {
      const { title, description, requestedBy } = body;
      if (!title)
        return NextResponse.json({ error: "title required" }, { status: 400 });
      const request = createCommunityRequest({
        title,
        description,
        requestedBy,
      });
      return NextResponse.json({ request }, { status: 201 });
    }
    case "student-feedback": {
      const { kpId, score, comment } = body;
      if (!kpId || score === undefined)
        return NextResponse.json(
          { error: "kpId and score required" },
          { status: 400 },
        );
      addStudentFeedback(kpId, score, comment);
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});
