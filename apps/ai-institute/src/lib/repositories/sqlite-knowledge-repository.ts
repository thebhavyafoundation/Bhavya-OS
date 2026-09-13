/**
 * SQLite/Turso Knowledge Repository Implementation
 *
 * Uses the async database adapter — works in both local (better-sqlite3)
 * and production (Turso/libSQL) modes.
 */

import { getAsyncDb } from "../db";
import type {
  KnowledgeRepository,
  KnowledgeObject,
  KOListSummary,
  KOProvenance,
  KOStatus,
} from "./knowledge-repository";

function generateId(): string {
  return `ko-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function rowToKO(row: Record<string, unknown>): KnowledgeObject {
  return {
    id: row.id as string,
    domain: row.domain as string,
    title: row.title as string,
    description: row.description as string,
    grade: row.grade as number,
    subject: row.subject as string,
    concepts: JSON.parse((row.concepts as string) ?? "[]"),
    definitions: JSON.parse((row.definitions as string) ?? "[]"),
    examples: JSON.parse((row.examples as string) ?? "[]"),
    misconceptions: JSON.parse((row.misconceptions as string) ?? "[]"),
    exercises: JSON.parse((row.exercises as string) ?? "[]"),
    references: JSON.parse((row.references as string) ?? "[]"),
    prerequisites: JSON.parse((row.prerequisites as string) ?? "[]"),
    related: JSON.parse((row.related as string) ?? "[]"),
    metadata: JSON.parse((row.metadata as string) ?? "{}"),
    provenance: (row.provenance as KOProvenance) ?? "institutional",
    status: (row.status as KOStatus) ?? "draft",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    version: row.version as string,
  };
}

function rowToListSummary(row: Record<string, unknown>): KOListSummary {
  return {
    id: row.id as string,
    title: row.title as string,
    domain: row.domain as string,
    provenance: (row.provenance as KOProvenance) ?? "institutional",
    status: (row.status as KOStatus) ?? "draft",
  };
}

export class SqliteKnowledgeRepository implements KnowledgeRepository {
  async get(id: string): Promise<KnowledgeObject | null> {
    const db = getAsyncDb();
    const row = await db.get<Record<string, unknown>>(
      "SELECT * FROM knowledge_objects WHERE id = ?",
      id,
    );
    return row ? rowToKO(row) : null;
  }

  async list(): Promise<KOListSummary[]> {
    const db = getAsyncDb();
    const rows = await db.all<Record<string, unknown>>(
      "SELECT id, title, domain, provenance, status FROM knowledge_objects ORDER BY updated_at DESC",
    );
    return rows.map(rowToListSummary);
  }

  async create(data: Partial<KnowledgeObject>): Promise<KnowledgeObject> {
    const db = getAsyncDb();
    const now = new Date().toISOString();
    const id = data.id || generateId();

    await db.run(
      `INSERT INTO knowledge_objects (id, domain, title, description, grade, subject, concepts, definitions, examples, misconceptions, exercises, "references", prerequisites, related, metadata, provenance, status, version, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.domain ?? "",
      data.title ?? "Untitled",
      data.description ?? "",
      data.grade ?? 9,
      data.subject ?? "AI",
      JSON.stringify(data.concepts ?? []),
      JSON.stringify(data.definitions ?? []),
      JSON.stringify(data.examples ?? []),
      JSON.stringify(data.misconceptions ?? []),
      JSON.stringify(data.exercises ?? []),
      JSON.stringify(data.references ?? []),
      JSON.stringify(data.prerequisites ?? []),
      JSON.stringify(data.related ?? []),
      JSON.stringify(data.metadata ?? {}),
      data.provenance ?? "institutional",
      data.status ?? "draft",
      data.version ?? "0.1.0",
      now,
      now,
    );

    return this.get(id) as Promise<KnowledgeObject>;
  }

  async update(
    id: string,
    patch: Partial<KnowledgeObject>,
  ): Promise<KnowledgeObject | null> {
    const db = getAsyncDb();
    const existing = await this.get(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: KnowledgeObject = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    await db.run(
      `UPDATE knowledge_objects SET
        domain = ?, title = ?, description = ?, grade = ?, subject = ?,
        concepts = ?, definitions = ?, examples = ?, misconceptions = ?,
        exercises = ?, "references" = ?, prerequisites = ?, related = ?,
        metadata = ?, provenance = ?, status = ?, version = ?, updated_at = ?
      WHERE id = ?`,
      updated.domain,
      updated.title,
      updated.description,
      updated.grade,
      updated.subject,
      JSON.stringify(updated.concepts),
      JSON.stringify(updated.definitions),
      JSON.stringify(updated.examples),
      JSON.stringify(updated.misconceptions),
      JSON.stringify(updated.exercises),
      JSON.stringify(updated.references),
      JSON.stringify(updated.prerequisites),
      JSON.stringify(updated.related),
      JSON.stringify(updated.metadata),
      updated.provenance,
      updated.status,
      updated.version,
      now,
      id,
    );

    return this.get(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = getAsyncDb();
    const result = await db.run(
      "DELETE FROM knowledge_objects WHERE id = ?",
      id,
    );
    return result.rowsAffected > 0;
  }
}
