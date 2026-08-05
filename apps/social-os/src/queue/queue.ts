import { getDb } from "../lib/db.js";
import {
  createPublication,
  updatePublicationStatus,
  getPublication,
} from "../lib/publications.js";
import { createApprovalRequest, approvePublication } from "../approval/gate.js";
import { formatForAllPlatforms } from "../lib/formatter.js";
import { emitEvent } from "../lib/events.js";
import type { PlatformType, ContentSource, Priority } from "../lib/types.js";

export interface QueueItem {
  id: string;
  publicationId: string;
  status: string;
  priority: string;
  createdAt: string;
}

export function addToQueue(input: {
  title: string;
  content: string;
  platforms: PlatformType[];
  source: ContentSource;
  priority?: Priority;
  hashtags?: string[];
  scheduledAt?: string;
}): QueueItem {
  const publication = createPublication({
    title: input.title,
    content: input.content,
    source: input.source,
    priority: input.priority,
    tags: input.hashtags,
  });

  const platformContent = formatForAllPlatforms(
    input.content,
    input.platforms,
    input.hashtags,
  );

  const db = getDb();
  for (const [platform, content] of Object.entries(platformContent)) {
    db.prepare(
      `
      INSERT INTO platform_content (id, publication_id, platform, text, media, hashtags, mentions, character_count, is_within_limits)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      crypto.randomUUID(),
      publication.id,
      platform,
      content.text,
      JSON.stringify(content.media),
      JSON.stringify(content.hashtags),
      JSON.stringify(content.mentions),
      content.characterCount,
      content.isWithinLimits ? 1 : 0,
    );
  }

  const approval = createApprovalRequest(publication.id);
  updatePublicationStatus(publication.id, "pending_approval");

  emitEvent("publication.created", {
    publicationId: publication.id,
    title: publication.title,
    platforms: input.platforms,
  });

  return {
    id: publication.id,
    publicationId: publication.id,
    status: "pending_approval",
    priority: input.priority || "normal",
    createdAt: publication.metadata.createdAt,
  };
}

export function getQueue(status?: string, limit: number = 50): QueueItem[] {
  const db = getDb();
  let query = "SELECT id, status, priority, created_at FROM publications";
  const params: any[] = [];

  if (status) {
    query += " WHERE status = ?";
    params.push(status);
  }

  query += " ORDER BY created_at DESC LIMIT ?";
  params.push(limit);

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((row) => ({
    id: row.id,
    publicationId: row.id,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
  }));
}

export function approveAndPublish(
  publicationId: string,
  reviewedBy: string,
): boolean {
  const approval = createApprovalRequest(publicationId);
  approvePublication(approval.id, reviewedBy, "Auto-approved via queue");

  const publication = getPublication(publicationId);
  if (!publication) return false;

  updatePublicationStatus(publicationId, "approved");
  emitEvent("publication.approved", { publicationId, reviewedBy });
  return true;
}
