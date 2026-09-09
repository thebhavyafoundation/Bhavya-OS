import { NextRequest, NextResponse } from "next/server";
import {
  createPublication,
  listPublications,
  getPublication,
  updatePublicationStatus,
  deletePublication,
} from "@/lib/publications.js";
import { addToQueue, getQueue } from "@/queue/queue.js";
import {
  getPendingApprovals,
  approvePublication,
  rejectPublication,
} from "@/approval/gate.js";
import { getAnalyticsSummary } from "@/analytics/collector.js";
import { emitEvent, getRecentEvents } from "@/lib/events.js";
import type { PlatformType, ContentSource } from "@/lib/types.js";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const status = searchParams.get("status");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 1000);

  switch (action) {
    case "list": {
      const publications = listPublications({
        status: status as any,
        limit,
      });
      return NextResponse.json({ publications });
    }

    case "get": {
      const id = searchParams.get("id");
      if (!id)
        return NextResponse.json({ error: "id required" }, { status: 400 });
      const publication = getPublication(id);
      if (!publication)
        return NextResponse.json({ error: "not found" }, { status: 404 });
      return NextResponse.json({ publication });
    }

    case "queue": {
      const queue = getQueue(status || undefined, limit);
      return NextResponse.json({ queue });
    }

    case "approvals": {
      const approvals = getPendingApprovals();
      return NextResponse.json({ approvals });
    }

    case "analytics": {
      const summary = getAnalyticsSummary();
      return NextResponse.json({ summary });
    }

    case "events": {
      const events = getRecentEvents(limit);
      return NextResponse.json({ events });
    }

    default: {
      const publications = listPublications({ limit: 20 });
      return NextResponse.json({ publications });
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
      const { title, content, source, priority, tags, campaign } = body;
      if (!title || !content) {
        return NextResponse.json(
          { error: "title and content required" },
          { status: 400 },
        );
      }
      const publication = createPublication({
        title,
        content,
        source: source || { type: "blog" },
        priority,
        tags,
        campaign,
      });
      return NextResponse.json({ publication }, { status: 201 });
    }

    case "queue": {
      const {
        title,
        content,
        platforms,
        source,
        priority,
        hashtags,
        scheduledAt,
      } = body;
      if (!title || !content || !platforms) {
        return NextResponse.json(
          { error: "title, content, platforms required" },
          { status: 400 },
        );
      }
      const item = addToQueue({
        title,
        content,
        platforms: platforms as PlatformType[],
        source: source || { type: "blog" },
        priority,
        hashtags,
        scheduledAt,
      });
      return NextResponse.json({ item }, { status: 201 });
    }

    case "approve": {
      const { publicationId, reviewedBy, notes } = body;
      if (!publicationId || !reviewedBy) {
        return NextResponse.json(
          { error: "publicationId and reviewedBy required" },
          { status: 400 },
        );
      }
      const approval = approvePublication(publicationId, reviewedBy, notes);
      if (approval) {
        updatePublicationStatus(publicationId, "approved");
        emitEvent("publication.approved", { publicationId, reviewedBy });
      }
      return NextResponse.json({ approval });
    }

    case "reject": {
      const { publicationId, reviewedBy, notes } = body;
      if (!publicationId || !reviewedBy) {
        return NextResponse.json(
          { error: "publicationId and reviewedBy required" },
          { status: 400 },
        );
      }
      const approval = rejectPublication(publicationId, reviewedBy, notes);
      if (approval) {
        updatePublicationStatus(publicationId, "rejected");
        emitEvent("publication.rejected", { publicationId, reviewedBy, notes });
      }
      return NextResponse.json({ approval });
    }

    case "publish": {
      const { publicationId } = body;
      if (!publicationId) {
        return NextResponse.json(
          { error: "publicationId required" },
          { status: 400 },
        );
      }
      updatePublicationStatus(publicationId, "published");
      emitEvent("publication.published", { publicationId });
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});

export const DELETE = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const deleted = deletePublication(id);
  return NextResponse.json({ deleted });
});
