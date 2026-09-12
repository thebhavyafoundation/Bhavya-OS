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

import {
  getAdaptedDatabase,
  migrate,
  initAsyncAdapter,
  type AsyncDatabase,
} from "@bhavya/database";
import { isProduction } from "./sqlite";

let initialized = false;
let _asyncDb: AsyncDatabase | null = null;

/**
 * Initialize database. Safe to call multiple times (idempotent).
 * - Local: opens via @bhavya/database (resolves path by name)
 * - Production: initializes remote Turso connection, runs migrations
 */
export async function initDatabase(): Promise<void> {
  if (initialized) return;

  if (isProduction()) {
    _asyncDb = await initAsyncAdapter("ai-institute", () => {
      return getAdaptedDatabase("ai-institute");
    });
  } else {
    _asyncDb = await initAsyncAdapter("ai-institute", () => {
      return getAdaptedDatabase("ai-institute");
    });
    await migrate("ai-institute");
  }

  initialized = true;
}

/**
 * Get the async database adapter.
 * Works in both local and production modes.
 * Use this for all new code — it's compatible with Vercel serverless.
 */
export function getAsyncDb(): AsyncDatabase {
  if (!_asyncDb) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return _asyncDb;
}

/**
 * Synchronous database access (for legacy code in request handlers after init).
 * Returns a better-sqlite3 connection via @bhavya/database.
 * Only valid for local mode — remote mode requires async access.
 *
 * @deprecated Use getAsyncDb() for new code. This method will not work
 * in Vercel serverless environments.
 */
export function getDb() {
  return getAdaptedDatabase("ai-institute");
}
