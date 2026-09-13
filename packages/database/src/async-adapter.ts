/**
 * @bhavya/database — Async Database Adapter
 *
 * Provides a unified async interface for both:
 * - Local: better-sqlite3 (sync wrapped in promises)
 * - Production: @libsql/client (native async)
 *
 * This enables repositories to work in both local and Vercel serverless
 * environments without changing their async method signatures.
 */

import type { DatabaseName } from "./registry";
import type BetterSqlite3 from "better-sqlite3";

// ─── Async Query Result ──────────────────────────────────────────────────────

export interface QueryRow {
  [key: string]: unknown;
}

export interface QueryResult {
  rows: QueryRow[];
  rowsAffected: number;
  lastInsertRowid: string | number | bigint;
}

// ─── Async Database Interface ────────────────────────────────────────────────

export interface AsyncDatabase {
  /** Execute a SELECT query and return all matching rows */
  all<T = QueryRow>(sql: string, ...params: unknown[]): Promise<T[]>;
  /** Execute a SELECT query and return the first row, or null */
  get<T = QueryRow>(sql: string, ...params: unknown[]): Promise<T | null>;
  /** Execute an INSERT/UPDATE/DELETE and return result metadata */
  run(sql: string, ...params: unknown[]): Promise<QueryResult>;
  /** Execute raw SQL (for migrations, DDL) */
  exec(sql: string): Promise<void>;
}

// ─── Turso client shape (avoids importing @libsql/client types) ──────────────

interface TursoClient {
  execute: (args: { sql: string; args: unknown[] }) => Promise<{
    rows: QueryRow[];
    rowsAffected?: number;
    lastInsertRowid?: string | number | bigint;
  }>;
}

// ─── better-sqlite3 statement shape ──────────────────────────────────────────

interface SqliteStatement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  all: (...args: unknown[]) => any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (...args: unknown[]) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: (...args: unknown[]) => any;
}

type SqliteDb = BetterSqlite3.Database;

// ─── Production Adapter (Turso/libSQL) ───────────────────────────────────────

class TursoAdapter implements AsyncDatabase {
  private client: TursoClient;

  constructor(client: TursoClient) {
    this.client = client;
  }

  async all<T = QueryRow>(sql: string, ...params: unknown[]): Promise<T[]> {
    const result = await this.client.execute({ sql, args: params });
    return result.rows as T[];
  }

  async get<T = QueryRow>(
    sql: string,
    ...params: unknown[]
  ): Promise<T | null> {
    const result = await this.client.execute({ sql, args: params });
    return (result.rows[0] as T) ?? null;
  }

  async run(sql: string, ...params: unknown[]): Promise<QueryResult> {
    const result = await this.client.execute({ sql, args: params });
    return {
      rows: result.rows,
      rowsAffected: result.rowsAffected ?? 0,
      lastInsertRowid: result.lastInsertRowid ?? 0,
    };
  }

  async exec(sql: string): Promise<void> {
    await this.client.execute({ sql, args: [] });
  }
}

// ─── Local Adapter (better-sqlite3 wrapped async) ────────────────────────────

class LocalAdapter implements AsyncDatabase {
  private db: SqliteDb;

  constructor(db: SqliteDb) {
    this.db = db;
  }

  async all<T = QueryRow>(sql: string, ...params: unknown[]): Promise<T[]> {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  async get<T = QueryRow>(
    sql: string,
    ...params: unknown[]
  ): Promise<T | null> {
    const stmt = this.db.prepare(sql);
    return (stmt.get(...params) as T) ?? null;
  }

  async run(sql: string, ...params: unknown[]): Promise<QueryResult> {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...params);
    return {
      rows: [],
      rowsAffected: result.changes ?? 0,
      lastInsertRowid: result.lastInsertRowid ?? 0,
    };
  }

  async exec(sql: string): Promise<void> {
    this.db.exec(sql);
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _asyncAdapter: AsyncDatabase | null = null;

/**
 * Initialize the async adapter for the given database name.
 * Must be called once during startup.
 *
 * - Local: wraps better-sqlite3 from @bhavya/database
 * - Production: creates @libsql/client from TURSO_DATABASE_URL
 */
export async function initAsyncAdapter(
  name: DatabaseName,
  getLocalDb: () => SqliteDb,
): Promise<AsyncDatabase> {
  if (_asyncAdapter) return _asyncAdapter;

  const isProduction = !!process.env.TURSO_DATABASE_URL;

  if (isProduction) {
    const url = process.env.TURSO_DATABASE_URL!;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    // Dynamic import — only loaded when TURSO_DATABASE_URL is set
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    const client = createClient({ url, authToken });
    _asyncAdapter = new TursoAdapter(client);
  } else {
    const db = getLocalDb();
    _asyncAdapter = new LocalAdapter(db);
  }

  return _asyncAdapter;
}

/**
 * Get the initialized async adapter.
 * Must call initAsyncAdapter() first.
 */
export function getAsyncAdapter(): AsyncDatabase {
  if (!_asyncAdapter) {
    throw new Error(
      "Async adapter not initialized. Call initAsyncAdapter() first.",
    );
  }
  return _asyncAdapter;
}
