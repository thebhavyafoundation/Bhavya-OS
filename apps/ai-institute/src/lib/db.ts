/**
 * AI Institute — Database Initialization
 *
 * Handles both local (better-sqlite3) and production (Turso/libSQL) databases.
 * Migrations run once on first access, not on every request.
 */

import { join } from "path";
import {
  getDatabase,
  migrate,
  initLocalDatabase,
  initRemoteDatabase,
} from "./sqlite";
import { aiInstituteMigrations } from "./migrations";

let initialized = false;

/**
 * Initialize database. Safe to call multiple times (idempotent).
 * - Local: creates file at bhavya-ai-lab/ai-institute.db
 * - Production: connects to Turso via TURSO_DATABASE_URL
 */
export async function initDatabase(): Promise<void> {
  if (initialized) return;

  if (process.env.TURSO_DATABASE_URL) {
    // Production: initialize remote connection
    await initRemoteDatabase();
  } else {
    // Local: initialize file-based SQLite
    const dbPath = join(process.cwd(), "bhavya-ai-lab", "ai-institute.db");
    initLocalDatabase(dbPath);
  }

  // Run migrations (idempotent — only applies pending migrations)
  migrate(aiInstituteMigrations);
  initialized = true;
}

/**
 * Synchronous database access (for use in request handlers after init).
 */
export function getDb() {
  return getDatabase();
}
