import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "002_add_fk_indexes",
  name: "Add missing FK indexes for content package references",
  up: `
-- FK indexes for ioc_media_assets.kp_id -> ioc_content_packages(id)
CREATE INDEX IF NOT EXISTS idx_ioc_media_assets_kp ON ioc_media_assets(kp_id);

-- FK indexes for ioc_student_feedback.kp_id -> ioc_content_packages(id)
CREATE INDEX IF NOT EXISTS idx_ioc_student_feedback_kp ON ioc_student_feedback(kp_id);
`,
  down: `
DROP INDEX IF EXISTS idx_ioc_media_assets_kp;
DROP INDEX IF EXISTS idx_ioc_student_feedback_kp;
`,
};
