import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "002_add_fk_indexes",
  name: "Add missing FK indexes for repository comparison references",
  up: `
-- FK indexes for repository_comparisons.repo_a_id -> repositories(id)
CREATE INDEX IF NOT EXISTS idx_repo_comparisons_a ON repository_comparisons(repo_a_id);

-- FK indexes for repository_comparisons.repo_b_id -> repositories(id)
CREATE INDEX IF NOT EXISTS idx_repo_comparisons_b ON repository_comparisons(repo_b_id);
`,
  down: `
DROP INDEX IF EXISTS idx_repo_comparisons_a;
DROP INDEX IF EXISTS idx_repo_comparisons_b;
`,
};
