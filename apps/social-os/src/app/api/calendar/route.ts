import { NextRequest, NextResponse } from "next/server";
import {
  createCalendarEntry,
  listCalendarEntries,
  updateCalendarEntryStatus,
  getUpcomingEntries,
  getCalendarStats,
} from "@/campaign/calendar.js";
import type {
  CalendarEntryType,
  CalendarStatus,
  PlatformType,
} from "@/lib/types.js";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "list": {
      const type = searchParams.get("type") as CalendarEntryType | undefined;
      const status = searchParams.get("status") as CalendarStatus | undefined;
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const limit = parseInt(searchParams.get("limit") || "50");
      const entries = listCalendarEntries({
        type,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        limit,
      });
      return NextResponse.json({ entries });
    }

    case "upcoming": {
      const days = parseInt(searchParams.get("days") || "7");
      const entries = getUpcomingEntries(days);
      return NextResponse.json({ entries });
    }

    case "stats": {
      const stats = getCalendarStats();
      return NextResponse.json({ stats });
    }

    default: {
      const entries = listCalendarEntries({ limit: 20 });
      return NextResponse.json({ entries });
    }
  }
});

export const POST = withAuth(async (request, _user) => {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "create": {
      const { campaignId, type, title, description, platforms, scheduledDate } =
        body;
      if (!type || !title || !scheduledDate) {
        return NextResponse.json(
          { error: "type, title, scheduledDate required" },
          { status: 400 },
        );
      }
      const entry = createCalendarEntry({
        campaignId,
        type,
        title,
        description,
        platforms,
        scheduledDate,
      });
      return NextResponse.json({ entry }, { status: 201 });
    }

    case "update-status": {
      const { entryId, status } = body;
      if (!entryId || !status)
        return NextResponse.json(
          { error: "entryId and status required" },
          { status: 400 },
        );
      const entry = updateCalendarEntryStatus(entryId, status);
      return NextResponse.json({ entry });
    }

    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});
