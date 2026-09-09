/**
 * @bhavya/auth — Database Adapter
 *
 * Connects to the canonical Bhavya Foundation database for session validation.
 * Local: better-sqlite3 via @bhavya/database (file-based)
 * Production: @libsql/client (Turso/libSQL) — kept separate due to async API
 *
 * The canonical database path is resolved via:
 *   1. AUTH_DATABASE_URL env var (production Turso)
 *   2. @bhavya/database registry (ai-institute → bhavya.db)
 */

import { getAdaptedDatabase } from "@bhavya/database";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SessionRow {
  token: string;
  user_id: string;
  expires_at: string;
}

export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
}

// ─── Local Adapter (better-sqlite3 via @bhavya/database) ────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _localDb: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLocalDb(): any {
  if (_localDb) return _localDb;

  // Always use the canonical adapter (WAL, FK enforcement, busy_timeout
  // are configured by the registry — no duplicate pragma setup needed).
  _localDb = getAdaptedDatabase("ai-institute");
  return _localDb;
}

// ─── Production Adapter (Turso) ──────────────────────────────────────────────

let _remoteDb: {
  execute: (params: {
    sql: string;
    args: unknown[];
  }) => Promise<{ rows: unknown[] }>;
} | null = null;

async function getRemoteDb(): Promise<{
  execute: (params: {
    sql: string;
    args: unknown[];
  }) => Promise<{ rows: unknown[] }>;
}> {
  if (_remoteDb) return _remoteDb;

  const url = process.env.AUTH_DATABASE_URL || process.env.TURSO_DATABASE_URL;
  const authToken =
    process.env.AUTH_DATABASE_TOKEN || process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "No database URL configured. Set AUTH_DATABASE_URL or TURSO_DATABASE_URL.",
    );
  }

  // Dynamic import — only loaded when remote URL is set
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@libsql/client");
  _remoteDb = createClient({ url, authToken });
  return _remoteDb!;
}

// ─── Public API ──────────────────────────────────────────────────────────────

function isProduction(): boolean {
  return !!(process.env.AUTH_DATABASE_URL || process.env.TURSO_DATABASE_URL);
}

/**
 * Find a session by token. Returns null if not found or expired.
 * Handles both local SQLite and remote Turso.
 */
export async function findSession(token: string): Promise<SessionRow | null> {
  if (isProduction()) {
    return findSessionRemote(token);
  }
  return findSessionLocal(token);
}

/**
 * Find a user by ID. Returns null if not found.
 */
export async function findUser(userId: string): Promise<UserRow | null> {
  if (isProduction()) {
    return findUserRemote(userId);
  }
  return findUserLocal(userId);
}

// ─── Local implementations ───────────────────────────────────────────────────

function findSessionLocal(token: string): SessionRow | null {
  const db = getLocalDb();
  const row = db
    .prepare("SELECT token, user_id, expires_at FROM sessions WHERE token = ?")
    .get(token) as
    { token: string; user_id: string; expires_at: string } | undefined;

  if (!row) return null;

  // Check expiry
  if (new Date(row.expires_at) < new Date()) {
    // Clean up expired session
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }

  return row;
}

function findUserLocal(userId: string): UserRow | null {
  const db = getLocalDb();
  const row = db
    .prepare("SELECT id, email, name, role FROM users WHERE id = ?")
    .get(userId) as
    { id: string; email: string; name: string; role: string } | undefined;

  return row ?? null;
}

// ─── Remote implementations ──────────────────────────────────────────────────

async function findSessionRemote(token: string): Promise<SessionRow | null> {
  const db = await getRemoteDb();
  const result = await db.execute({
    sql: "SELECT token, user_id, expires_at FROM sessions WHERE token = ?",
    args: [token],
  });

  // libSQL returns rows as arrays of objects
  const rows = result.rows as unknown as Record<string, unknown>[];
  if (!rows || rows.length === 0) return null;

  const row = rows[0];
  const session: SessionRow = {
    token: String(row.token),
    user_id: String(row.user_id),
    expires_at: String(row.expires_at),
  };

  // Check expiry
  if (new Date(session.expires_at) < new Date()) {
    await db.execute({
      sql: "DELETE FROM sessions WHERE token = ?",
      args: [token],
    });
    return null;
  }

  return session;
}

async function findUserRemote(userId: string): Promise<UserRow | null> {
  const db = await getRemoteDb();
  const result = await db.execute({
    sql: "SELECT id, email, name, role FROM users WHERE id = ?",
    args: [userId],
  });

  const rows = result.rows as unknown as Record<string, unknown>[];
  if (!rows || rows.length === 0) return null;

  const row = rows[0];
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    role: String(row.role),
  };
}
