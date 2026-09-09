import { NextResponse } from "next/server";
import {
  emitInstitutionEvent,
  getRecentEvents,
  getUnprocessedEvents,
  getEventSummary,
  markEventsAggregated,
} from "@/intelligence/events";
import type { SystemName } from "@/lib/types";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "summary": {
      const summary = getEventSummary();
      return NextResponse.json({ summary });
    }
    case "unprocessed": {
      const events = getUnprocessedEvents();
      return NextResponse.json({ events });
    }
    case "by-source": {
      const source = searchParams.get("source") as SystemName;
      if (!source)
        return NextResponse.json({ error: "source required" }, { status: 400 });
      const events = getRecentEvents(50);
      return NextResponse.json({
        events: events.filter((e) => e.source === source),
      });
    }
    default: {
      const limit = Math.min(Number(searchParams.get("limit")) || 50, 1000);
      const events = getRecentEvents(limit);
      return NextResponse.json({ events });
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
    case "emit": {
      const { type, source, payload } = body;
      if (!type || !source)
        return NextResponse.json(
          { error: "type and source required" },
          { status: 400 },
        );
      const event = emitInstitutionEvent(type, source, payload || {});
      return NextResponse.json({ event }, { status: 201 });
    }
    case "aggregate": {
      const { eventIds } = body;
      if (!eventIds || !Array.isArray(eventIds))
        return NextResponse.json(
          { error: "eventIds array required" },
          { status: 400 },
        );
      markEventsAggregated(eventIds);
      return NextResponse.json({ success: true });
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});
