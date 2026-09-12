import { getAsyncDb } from "../db";
import type { SessionRepository } from "./types";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function generateToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export class SqliteSessionRepository implements SessionRepository {
  async create(userId: string): Promise<{ token: string; expiresAt: string }> {
    const db = getAsyncDb();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    await db.run(
      `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
      token,
      userId,
      expiresAt,
    );

    return { token, expiresAt };
  }

  async findByToken(
    token: string,
  ): Promise<{ userId: string; expiresAt: string } | null> {
    const db = getAsyncDb();
    const row = await db.get<{ user_id: string; expires_at: string }>(
      "SELECT * FROM sessions WHERE token = ?",
      token,
    );

    if (!row) return null;

    if (new Date(row.expires_at) < new Date()) {
      await this.delete(token);
      return null;
    }

    return { userId: row.user_id, expiresAt: row.expires_at };
  }

  async delete(token: string): Promise<void> {
    const db = getAsyncDb();
    await db.run("DELETE FROM sessions WHERE token = ?", token);
  }

  async deleteAllForUser(userId: string): Promise<void> {
    const db = getAsyncDb();
    await db.run("DELETE FROM sessions WHERE user_id = ?", userId);
  }
}
