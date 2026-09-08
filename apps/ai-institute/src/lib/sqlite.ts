/**
 * AI Institute — Database Adapter
 *
 * Local mode: delegates to @bhavya/database (getAdaptedDatabase).
 * Production mode: initializes Turso/libSQL remote client.
 *
 * The remote client is async and has an incompatible API with
 * better-sqlite3. It is NOT wrapped in a sync interface — that
 * was a correctness bug in the previous implementation.
 */

// ─── Local Adapter ───────────────────────────────────────────────────────────
// Local connections go through @bhavya/database.
// Import getAdaptedDatabase from @bhavya/database directly in consumers.

// ─── Production Adapter (Turso/libSQL) ───────────────────────────────────────

let _remoteClient: unknown = null;

/**
 * Initialize the remote Turso client (async). Called once during startup.
 * Returns the raw @libsql/client instance for async query use.
 */
export async function initRemoteDatabase(): Promise<void> {
  if (_remoteClient) return;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL not set. Cannot initialize production database.",
    );
  }

  // Dynamic import — only loaded when TURSO_DATABASE_URL is set
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@libsql/client");
  _remoteClient = createClient({ url, authToken });
}

/**
 * Get the raw remote client. Must call initRemoteDatabase() first.
 * Returns null if not initialized or not in production.
 */
export function getRemoteClient(): unknown {
  return _remoteClient;
}

/**
 * Check if running in production mode (remote Turso).
 */
export function isProduction(): boolean {
  return !!process.env.TURSO_DATABASE_URL;
}
