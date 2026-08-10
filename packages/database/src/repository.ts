/**
 * @bhavya/database — Repository Pattern
 *
 * Generic repository interface and base implementation for type-safe data access.
 */

import { getDatabase } from "./sqlite";

export interface Repository<T, TCreate = T> {
  findById(id: string): T | null;
  findAll(options?: {
    limit?: number;
    offset?: number;
    where?: string;
    params?: unknown[];
  }): T[];
  create(data: TCreate): T;
  update(id: string, data: Partial<TCreate>): T | null;
  delete(id: string): boolean;
  count(where?: string, params?: unknown[]): number;
}

/**
 * Base SQLite repository with CRUD operations.
 */
export abstract class SqliteRepository<T, TCreate = T> implements Repository<
  T,
  TCreate
> {
  protected abstract tableName: string;
  protected abstract rowToEntity(row: Record<string, unknown>): T;
  protected abstract entityToRow(data: TCreate): Record<string, unknown>;

  protected get db(): ReturnType<typeof getDatabase> {
    return getDatabase({ path: "" });
  }

  findById(id: string): T | null {
    const row = this.db
      .prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
      .get(id) as Record<string, unknown> | undefined;
    return row ? this.rowToEntity(row) : null;
  }

  findAll(options?: {
    limit?: number;
    offset?: number;
    where?: string;
    params?: unknown[];
  }): T[] {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: unknown[] = [];
    if (options?.where) {
      query += ` WHERE ${options.where}`;
      if (options.params) params.push(...options.params);
    }
    query += " ORDER BY created_at DESC";
    if (options?.limit) {
      query += " LIMIT ?";
      params.push(options.limit);
    }
    if (options?.offset) {
      query += " OFFSET ?";
      params.push(options.offset);
    }
    return this.db
      .prepare(query)
      .all(...params)
      .map((r) => this.rowToEntity(r as Record<string, unknown>));
  }

  create(data: TCreate): T {
    const row = this.entityToRow(data);
    const cols = Object.keys(row);
    const placeholders = cols.map(() => "?").join(", ");
    this.db
      .prepare(
        `INSERT INTO ${this.tableName} (${cols.join(", ")}) VALUES (${placeholders})`,
      )
      .run(...Object.values(row));
    return this.findById(row.id as string) as T;
  }

  update(id: string, data: Partial<TCreate>): T | null {
    const existing = this.findById(id);
    if (!existing) return null;
    const row = this.entityToRow(data as TCreate);
    const cols = Object.keys(row).filter((k) => k !== "id");
    const sets = cols.map((c) => `${c} = ?`).join(", ");
    const vals = cols.map((c) => row[c as keyof typeof row]);
    vals.push(id);
    this.db
      .prepare(`UPDATE ${this.tableName} SET ${sets} WHERE id = ?`)
      .run(...vals);
    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db
      .prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
      .run(id);
    return result.changes > 0;
  }

  count(where?: string, params?: unknown[]): number {
    let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    if (where) query += ` WHERE ${where}`;
    const row = this.db.prepare(query).get(...(params || [])) as {
      count: number;
    };
    return row.count;
  }
}
