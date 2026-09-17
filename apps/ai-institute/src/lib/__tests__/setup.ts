/**
 * ai-institute vitest setup — test database isolation.
 *
 * Points BHAVYA_DB_PATH at a per-worker temp SQLite file and runs
 * initDatabase() (migrations included) so DB-backed tests never touch the
 * tracked seed database at packages/database/data/bhavya.db.
 *
 * Runs once per worker before any test file in that worker.
 */

import { mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { initDatabase } from "@/lib/db";

const worker = process.env.VITEST_WORKER_ID ?? "main";
const dir = join(tmpdir(), "bhavya-ai-institute-test", worker);
mkdirSync(dir, { recursive: true });
process.env.BHAVYA_DB_PATH = join(dir, "test.db");

// Isolate @bhavya/content-core file writes (missions, sites, …) the same
// way: wipe + redirect per worker so route-level tests cannot mutate the
// tracked content/ tree.
//
// BHAVYA_CONTENT_ROOT must point at a repo-root EQUIVALENT (not at a
// ".../content" dir), because content-core joins it with
// "content/forest" / "content/knowledge" internally. Pointing it at a
// ".../content" dir would produce "<tmp>/content/content/forest".
rmSync(dir, { recursive: true, force: true });
mkdirSync(join(dir, "content", "forest"), { recursive: true });
mkdirSync(join(dir, "content", "knowledge"), { recursive: true });
process.env.BHAVYA_CONTENT_ROOT = dir;

// Drop any content-core filesystem caches populated before the redirect so
// the first read in each worker comes from the isolated temp tree.
try {
  const forest = await import("@bhavya/content-core");
  (
    forest as { resetForestCachesForTests?: () => void }
  ).resetForestCachesForTests?.();
} catch {
  /* content-core not resolvable here — lazy ROOT still isolates writes */
}

await initDatabase();
