/**
 * AI Institute — Database Migration Script
 *
 * Usage: npx tsx src/scripts/db-migrate.ts
 *
 * Delegates to @bhavya/database's migration engine.
 * Migrations are discovered from packages/database/migrations/ai-institute/.
 */

import { migrate, getMigrationStatus } from "@bhavya/database";

async function main() {
  const result = await migrate("ai-institute");

  if (result.applied.length === 0) {
    console.log("No pending migrations.");
  } else {
    console.log(
      `Applied ${result.applied.length} migration(s): ${result.applied.join(", ")}`,
    );
  }

  // Verify tables
  const status = await getMigrationStatus("ai-institute");
  console.log(
    `\nMigration status: ${status.applied.length} applied, ${status.pending.length} pending`,
  );

  for (const m of status.applied) {
    console.log(`  ✓ ${m.id} (${m.name})`);
  }
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
