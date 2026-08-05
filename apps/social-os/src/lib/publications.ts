import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db.js";
import type {
  Publication,
  PublicationStatus,
  Priority,
  ContentSource,
  PlatformType,
  PlatformContent,
} from "./types.js";

export function createPublication(input: {
  title: string;
  content: string;
  source: ContentSource;
  priority?: Priority;
  tags?: string[];
  campaign?: string;
  createdBy?: string;
}): Publication {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO publications (id, title, content, status, priority, source_type, source_knowledge_package_id, source_version, source_review_status, source_constitution_citation, created_at, updated_at, created_by, version, tags, campaign)
    VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `,
  ).run(
    id,
    input.title,
    input.content,
    input.priority || "normal",
    input.source.type,
    input.source.knowledgePackageId || null,
    input.source.version || null,
    input.source.reviewStatus || null,
    input.source.constitutionCitation || null,
    now,
    now,
    input.createdBy || "system",
    JSON.stringify(input.tags || []),
    input.campaign || null,
  );

  return getPublication(id)!;
}

export function getPublication(id: string): Publication | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM publications WHERE id = ?")
    .get(id) as any;
  if (!row) return null;
  return mapRowToPublication(row);
}

export function listPublications(filter?: {
  status?: PublicationStatus;
  limit?: number;
  offset?: number;
}): Publication[] {
  const db = getDb();
  let query = "SELECT * FROM publications";
  const params: any[] = [];

  if (filter?.status) {
    query += " WHERE status = ?";
    params.push(filter.status);
  }

  query += " ORDER BY created_at DESC";

  if (filter?.limit) {
    query += " LIMIT ?";
    params.push(filter.limit);
  }
  if (filter?.offset) {
    query += " OFFSET ?";
    params.push(filter.offset);
  }

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map(mapRowToPublication);
}

export function updatePublicationStatus(
  id: string,
  status: PublicationStatus,
): Publication | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE publications SET status = ?, updated_at = ? WHERE id = ?",
  ).run(status, now, id);
  return getPublication(id);
}

export function deletePublication(id: string): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM publications WHERE id = ?").run(id);
  return result.changes > 0;
}

function mapRowToPublication(row: any): Publication {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    platformContent: JSON.parse(row.platform_content || "{}"),
    status: row.status as PublicationStatus,
    priority: row.priority as Priority,
    source: {
      type: row.source_type,
      knowledgePackageId: row.source_knowledge_package_id,
      version: row.source_version,
      reviewStatus: row.source_review_status,
      constitutionCitation: row.source_constitution_citation,
    },
    scheduledAt: row.scheduled_at,
    publishedAt: row.published_at,
    metadata: {
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      version: row.version,
      tags: JSON.parse(row.tags || "[]"),
      campaign: row.campaign,
    },
  };
}
