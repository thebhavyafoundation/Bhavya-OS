import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "002_add_fk_indexes",
  name: "Add missing FK indexes for publication and campaign references",
  up: `
-- FK indexes for analytics_snapshots.publication_id -> publications(id)
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_publication ON analytics_snapshots(publication_id);

-- FK indexes for approval_records.publication_id -> publications(id)
CREATE INDEX IF NOT EXISTS idx_approval_records_publication ON approval_records(publication_id);

-- FK indexes for brand_reviews.publication_id -> publications(id)
CREATE INDEX IF NOT EXISTS idx_brand_reviews_publication ON brand_reviews(publication_id);

-- FK indexes for editorial_calendar.campaign_id -> campaigns(id)
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_campaign ON editorial_calendar(campaign_id);

-- FK indexes for platform_content.publication_id -> publications(id)
CREATE INDEX IF NOT EXISTS idx_platform_content_publication ON platform_content(publication_id);
`,
  down: `
DROP INDEX IF EXISTS idx_analytics_snapshots_publication;
DROP INDEX IF EXISTS idx_approval_records_publication;
DROP INDEX IF EXISTS idx_brand_reviews_publication;
DROP INDEX IF EXISTS idx_editorial_calendar_campaign;
DROP INDEX IF EXISTS idx_platform_content_publication;
`,
};
