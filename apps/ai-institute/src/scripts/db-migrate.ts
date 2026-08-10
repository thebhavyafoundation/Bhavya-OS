/**
 * AI Institute — Database Migration Script
 *
 * Usage: npx tsx src/scripts/db-migrate.ts
 */

import { join } from "path";
import {
  getDatabase,
  migrate,
  initLocalDatabase,
  initRemoteDatabase,
} from "../lib/sqlite";
import { aiInstituteMigrations } from "../lib/migrations";

async function main() {
  const isProd = !!process.env.TURSO_DATABASE_URL;

  if (isProd) {
    await initRemoteDatabase();
  } else {
    const dbPath = join(process.cwd(), "bhavya-ai-lab", "ai-institute.db");
    initLocalDatabase(dbPath);
  }

  const result = migrate(aiInstituteMigrations);

  if (result.applied.length === 0) {
    console.log("No pending migrations.");
  } else {
    console.log(`Applied ${result.applied.length} migration(s): ${result.applied.join(", ")}`);
  }

  // Verify tables
  const db = getDatabase();
  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_%' ORDER BY name"
  ).all() as { name: string }[];
  console.log("\nTables:");
  for (const t of tables) console.log(`  - ${t.name}`);
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
