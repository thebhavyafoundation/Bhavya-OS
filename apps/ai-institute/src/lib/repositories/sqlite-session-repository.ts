import { getAdaptedDatabase } from "@bhavya/database";
import type { SessionRepository } from "./types";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function generateToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export class SqliteSessionRepository implements SessionRepository {
  async create(userId: string): Promise<{ token: string; expiresAt: string }> {
    const db = getAdaptedDatabase("ai-institute");
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    db.prepare(
      `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
    ).run(token, userId, expiresAt);

    return { token, expiresAt };
  }

  async findByToken(
    token: string,
  ): Promise<{ userId: string; expiresAt: string } | null> {
    const db = getAdaptedDatabase("ai-institute");
    const row = db
      .prepare("SELECT * FROM sessions WHERE token = ?")
      .get(token) as { user_id: string; expires_at: string } | undefined;

    if (!row) return null;

    if (new Date(row.expires_at) < new Date()) {
      await this.delete(token);
      return null;
    }

    return { userId: row.user_id, expiresAt: row.expires_at };
  }

  async delete(token: string): Promise<void> {
    const db = getAdaptedDatabase("ai-institute");
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }

  async deleteAllForUser(userId: string): Promise<void> {
    const db = getAdaptedDatabase("ai-institute");
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  }
}
