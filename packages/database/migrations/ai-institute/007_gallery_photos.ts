import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "007_gallery_photos",
  name: "Studio gallery photos — role-uploaded public gallery",
  up: `
-- Photos uploaded through the Studio gallery screen.
-- image_data holds a size-capped base64 data URL in the app's existing
-- store (no second data store is introduced); byte_size and mime_type let
-- the serving route send correct headers without decoding the payload.
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
  `,
  down: `
DROP TABLE IF EXISTS gallery_photos;
  `,
};
