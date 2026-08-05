import { v4 as uuidv4 } from "uuid";
import { getDb } from "../lib/db.js";
import { emitEvent } from "../lib/events.js";
import type {
  EditorialCalendarEntry,
  CalendarEntryType,
  CalendarStatus,
  PlatformType,
} from "../lib/types.js";

export function createCalendarEntry(input: {
  campaignId?: string;
  type: CalendarEntryType;
  title: string;
  description?: string;
  platforms?: PlatformType[];
  scheduledDate: string;
}): EditorialCalendarEntry {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO editorial_calendar (id, campaign_id, type, title, description, platforms, scheduled_date, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
  `,
  ).run(
    id,
    input.campaignId || null,
    input.type,
    input.title,
    input.description || "",
    JSON.stringify(input.platforms || []),
    input.scheduledDate,
    now,
    now,
  );

  emitEvent("calendar.entry_created", {
    entryId: id,
    type: input.type,
    scheduledDate: input.scheduledDate,
  });
  return getCalendarEntry(id)!;
}

export function getCalendarEntry(id: string): EditorialCalendarEntry | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM editorial_calendar WHERE id = ?")
    .get(id) as any;
  if (!row) return null;
  return mapRowToEntry(row);
}

export function listCalendarEntries(filter?: {
  campaignId?: string;
  type?: CalendarEntryType;
  status?: CalendarStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): EditorialCalendarEntry[] {
  const db = getDb();
  let query = "SELECT * FROM editorial_calendar";
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.campaignId) {
    conditions.push("campaign_id = ?");
    params.push(filter.campaignId);
  }
  if (filter?.type) {
    conditions.push("type = ?");
    params.push(filter.type);
  }
  if (filter?.status) {
    conditions.push("status = ?");
    params.push(filter.status);
  }
  if (filter?.startDate) {
    conditions.push("scheduled_date >= ?");
    params.push(filter.startDate);
  }
  if (filter?.endDate) {
    conditions.push("scheduled_date <= ?");
    params.push(filter.endDate);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY scheduled_date ASC";

  if (filter?.limit) {
    query += " LIMIT ?";
    params.push(filter.limit);
  }

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map(mapRowToEntry);
}

export function updateCalendarEntryStatus(
  id: string,
  status: CalendarStatus,
): EditorialCalendarEntry | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE editorial_calendar SET status = ?, updated_at = ? WHERE id = ?",
  ).run(status, now, id);
  return getCalendarEntry(id);
}

export function linkCalendarToPublication(
  entryId: string,
  publicationId: string,
): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE editorial_calendar SET publication_id = ?, status = ?, updated_at = ? WHERE id = ?",
  ).run(publicationId, "published", now, entryId);
}

export function getUpcomingEntries(days: number = 7): EditorialCalendarEntry[] {
  const db = getDb();
  const now = new Date().toISOString();
  const future = new Date(Date.now() + days * 86400000).toISOString();

  const rows = db
    .prepare(
      `
    SELECT * FROM editorial_calendar
    WHERE scheduled_date >= ? AND scheduled_date <= ?
    ORDER BY scheduled_date ASC
  `,
    )
    .all(now, future) as any[];

  return rows.map(mapRowToEntry);
}

export function getCalendarStats(): {
  total: number;
  draft: number;
  scheduled: number;
  published: number;
  completed: number;
  thisWeek: number;
  thisMonth: number;
} {
  const db = getDb();
  const now = new Date().toISOString();
  const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString();
  const monthFromNow = new Date(Date.now() + 30 * 86400000).toISOString();

  const total = (
    db.prepare("SELECT COUNT(*) as c FROM editorial_calendar").get() as any
  ).c;
  const draft = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM editorial_calendar WHERE status = 'draft'",
      )
      .get() as any
  ).c;
  const scheduled = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM editorial_calendar WHERE status = 'scheduled'",
      )
      .get() as any
  ).c;
  const published = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM editorial_calendar WHERE status = 'published'",
      )
      .get() as any
  ).c;
  const completed = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM editorial_calendar WHERE status = 'completed'",
      )
      .get() as any
  ).c;
  const thisWeek = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM editorial_calendar WHERE scheduled_date >= ? AND scheduled_date <= ?",
      )
      .get(now, weekFromNow) as any
  ).c;
  const thisMonth = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM editorial_calendar WHERE scheduled_date >= ? AND scheduled_date <= ?",
      )
      .get(now, monthFromNow) as any
  ).c;

  return { total, draft, scheduled, published, completed, thisWeek, thisMonth };
}

function mapRowToEntry(row: any): EditorialCalendarEntry {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    type: row.type as CalendarEntryType,
    title: row.title,
    description: row.description,
    platforms: JSON.parse(row.platforms || "[]"),
    scheduledDate: row.scheduled_date,
    status: row.status as CalendarStatus,
    publicationId: row.publication_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
