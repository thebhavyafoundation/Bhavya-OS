import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { SessionRepository } from "./types";

interface StoredSession {
  userId: string;
  token: string;
  expiresAt: string;
}

const AUTH_DIR = join(process.cwd(), "bhavya-ai-lab", "data");
const SESSIONS_FILE = join(AUTH_DIR, "sessions.json");
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function ensureDir(): void {
  if (!existsSync(AUTH_DIR)) {
    mkdirSync(AUTH_DIR, { recursive: true });
  }
}

function loadSessions(): StoredSession[] {
  ensureDir();
  if (!existsSync(SESSIONS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(SESSIONS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveSessions(sessions: StoredSession[]): void {
  ensureDir();
  writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

function generateToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export class FileSessionRepository implements SessionRepository {
  async create(userId: string): Promise<{ token: string; expiresAt: string }> {
    const sessions = loadSessions();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    const session: StoredSession = { userId, token, expiresAt };

    sessions.push(session);
    saveSessions(sessions);
    return { token, expiresAt };
  }

  async findByToken(token: string): Promise<{ userId: string; expiresAt: string } | null> {
    const sessions = loadSessions();
    const session = sessions.find((s) => s.token === token);
    if (!session) return null;
    if (new Date(session.expiresAt) < new Date()) {
      await this.delete(token);
      return null;
    }
    return { userId: session.userId, expiresAt: session.expiresAt };
  }

  async delete(token: string): Promise<void> {
    const sessions = loadSessions();
    const filtered = sessions.filter((s) => s.token !== token);
    saveSessions(filtered);
  }
}
