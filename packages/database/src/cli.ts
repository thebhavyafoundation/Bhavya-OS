/**
 * @bhavya/database — Migration CLI
 *
 * Usage:
 *   tsx src/cli.ts [database-name]        Run pending migrations
 *   tsx src/cli.ts status [database-name] Show migration status
 *   tsx src/cli.ts rollback [database-name] Rollback last migration
 *
 * If no database name is specified, migrates all databases.
 */

import { migrate, rollback, getMigrationStatus } from "./migrate";
import type { DatabaseName } from "./registry";

const ALL_DBS: DatabaseName[] = [
  "ai-institute",
  "github-os",
  "social-os",
  "ioc",
];

async function runMigrate(dbName?: DatabaseName) {
  const dbs = dbName ? [dbName] : ALL_DBS;

  for (const db of dbs) {
    console.log(`\nMigrating: ${db}`);
    try {
      const result = await migrate(db);
      if (result.applied.length === 0) {
        console.log(`  No pending migrations.`);
      } else {
        console.log(`  Applied ${result.applied.length} migration(s):`);
        for (const id of result.applied) {
          console.log(`    + ${id}`);
        }
      }
    } catch (err) {
      console.error(`  ERROR: ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  }
}

async function runStatus(dbName?: DatabaseName) {
  const dbs = dbName ? [dbName] : ALL_DBS;

  for (const db of dbs) {
    console.log(`\nStatus: ${db}`);
    try {
      const status = await getMigrationStatus(db);
      if (status.applied.length > 0) {
        console.log(`  Applied (${status.applied.length}):`);
        for (const r of status.applied) {
          console.log(`    ✓ ${r.id} — ${r.name} (${r.applied_at})`);
        }
      } else {
        console.log(`  No migrations applied.`);
      }
      if (status.pending.length > 0) {
        console.log(`  Pending (${status.pending.length}):`);
        for (const m of status.pending) {
          console.log(`    ○ ${m.id} — ${m.name}`);
        }
      } else {
        console.log(`  All migrations applied.`);
      }
    } catch (err) {
      console.error(`  ERROR: ${err instanceof Error ? err.message : err}`);
    }
  }
}

async function runRollback(dbName?: DatabaseName) {
  const dbs = dbName ? [dbName] : ALL_DBS;

  for (const db of dbs) {
    console.log(`\nRollback: ${db}`);
    try {
      const rolledBack = await rollback(db);
      if (rolledBack) {
        console.log(`  Rolled back: ${rolledBack}`);
      } else {
        console.log(`  Nothing to rollback.`);
      }
    } catch (err) {
      console.error(`  ERROR: ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  }
}

// ─── Parse args ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

function parseDbName(arg: string | undefined): DatabaseName | undefined {
  if (!arg) return undefined;
  const name = arg as DatabaseName;
  if (ALL_DBS.includes(name)) return name;
  console.error(`Unknown database: ${arg}. Valid: ${ALL_DBS.join(", ")}`);
  process.exit(1);
}

async function main() {
  if (command === "status") {
    await runStatus(parseDbName(args[1]));
  } else if (command === "rollback") {
    await runRollback(parseDbName(args[1]));
  } else if (command && ALL_DBS.includes(command as DatabaseName)) {
    await runMigrate(command as DatabaseName);
  } else if (!command) {
    await runMigrate();
  } else {
    console.error(`Unknown command: ${command}`);
    console.error(`Usage: tsx src/cli.ts [status|rollback] [database-name]`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
