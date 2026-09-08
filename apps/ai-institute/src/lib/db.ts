/**
 * AI Institute — Database Initialization
 *
 * Handles both local (better-sqlite3 via @bhavya/database) and
 * production (Turso/libSQL) databases.
 *
 * Migrations run via @bhavya/database's migrate() function,
 * which discovers and applies pending migrations from
 * packages/database/migrations/ai-institute/.
 */

import { getAdaptedDatabase, migrate } from "@bhavya/database";
import { initRemoteDatabase, isProduction } from "./sqlite";

let initialized = false;

/**
 * Initialize database. Safe to call multiple times (idempotent).
 * - Local: opens via @bhavya/database (resolves path by name)
 * - Production: initializes remote Turso connection, runs migrations
 */
export async function initDatabase(): Promise<void> {
  if (initialized) return;

  if (isProduction()) {
    await initRemoteDatabase();
  }

  // Run migrations via @bhavya/database (local mode only).
  // Remote migrations are handled separately in production.
  if (!isProduction()) {
    await migrate("ai-institute");
  }

  initialized = true;
}

/**
 * Synchronous database access (for use in request handlers after init).
 * Returns a better-sqlite3 connection via @bhavya/database.
 * Only valid for local mode — remote mode requires async access.
 */
export function getDb() {
  return getAdaptedDatabase("ai-institute");
}
