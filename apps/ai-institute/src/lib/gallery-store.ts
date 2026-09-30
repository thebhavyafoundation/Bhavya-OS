/**
 * AI Institute — Studio gallery persistence.
 *
 * Server-only. Photos live in the app's existing SQLite/Turso store as
 * size-capped data URLs: no object storage, no second data plane. Rows are
 * append-only (no update or delete path), so what a visitor sees is exactly
 * what a content manager uploaded.
 */

import { initDatabase, getAsyncDb } from "./db";

const GALLERY_DDL = `
CREATE TABLE IF NOT EXISTS gallery_photos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  mime_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  image_data TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created ON gallery_photos(created_at);
`;

export interface GalleryPhotoMeta {
  id: string;
  title: string;
  description: string;
  mimeType: string;
  byteSize: number;
  uploadedBy: string;
  createdAt: string;
}

export interface GalleryPhoto extends GalleryPhotoMeta {
  imageData: string;
}

interface GalleryPhotoRow {
  id: string;
  title: string;
  description: string;
  mime_type: string;
  byte_size: number;
  image_data: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

let ensured = false;

export async function ensureGalleryTable(): Promise<void> {
  if (ensured) return;
  await initDatabase();
  await getAsyncDb().exec(GALLERY_DDL);
  ensured = true;
}

function toMeta(row: GalleryPhotoRow): GalleryPhotoMeta {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    mimeType: row.mime_type,
    byteSize: row.byte_size,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
  };
}

export interface InsertGalleryPhotoInput {
  title: string;
  description: string;
  mimeType: string;
  byteSize: number;
  imageData: string;
  uploadedBy: string;
}

export async function insertGalleryPhoto(
  input: InsertGalleryPhotoInput,
): Promise<GalleryPhotoMeta> {
  await ensureGalleryTable();
  const db = getAsyncDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO gallery_photos
       (id, title, description, mime_type, byte_size, image_data, uploaded_by,
        created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.title,
    input.description,
    input.mimeType,
    input.byteSize,
    input.imageData,
    input.uploadedBy,
    now,
    now,
  );

  const row = await db.get<GalleryPhotoRow>(
    "SELECT * FROM gallery_photos WHERE id = ?",
    id,
  );
  if (!row) throw new Error("Gallery photo insert failed");
  return toMeta(row);
}

/** Newest first. Metadata only — image bytes stay on the serving route. */
export async function listGalleryPhotos(
  limit = 60,
): Promise<GalleryPhotoMeta[]> {
  await ensureGalleryTable();
  const rows = await getAsyncDb().all<GalleryPhotoRow>(
    "SELECT * FROM gallery_photos ORDER BY created_at DESC, id LIMIT ?",
    Math.max(1, Math.min(limit, 200)),
  );
  return rows.map(toMeta);
}

export async function getGalleryPhoto(
  id: string,
): Promise<GalleryPhoto | null> {
  await ensureGalleryTable();
  const row = await getAsyncDb().get<GalleryPhotoRow>(
    "SELECT * FROM gallery_photos WHERE id = ?",
    id,
  );
  if (!row) return null;
  return { ...toMeta(row), imageData: row.image_data };
}

export async function countGalleryPhotos(): Promise<number> {
  await ensureGalleryTable();
  const row = await getAsyncDb().get<{ total: number }>(
    "SELECT COUNT(*) AS total FROM gallery_photos",
  );
  return row?.total ?? 0;
}
