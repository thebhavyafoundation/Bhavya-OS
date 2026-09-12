import { getAsyncDb } from "../db";
import type { User, CreateUserInput, UserRepository } from "./types";

function generateId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    avatar: (row.avatar as string) ?? undefined,
    role: row.role as string,
    provider: row.provider as string,
    interests: JSON.parse((row.interests as string) ?? "[]"),
    onboardingComplete: (row.onboarding_complete as number) === 1,
    passwordHash: row.password_hash as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export class SqliteUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const db = getAsyncDb();
    const row = await db.get<Record<string, unknown>>(
      "SELECT * FROM users WHERE email = ?",
      email,
    );
    return row ? rowToUser(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const db = getAsyncDb();
    const row = await db.get<Record<string, unknown>>(
      "SELECT * FROM users WHERE id = ?",
      id,
    );
    return row ? rowToUser(row) : null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const db = getAsyncDb();
    const now = new Date().toISOString();
    const id = generateId();

    await db.run(
      `INSERT INTO users (id, email, name, role, provider, interests, onboarding_complete, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.email,
      data.name,
      data.role ?? "student",
      data.provider ?? "email",
      "[]",
      0,
      data.passwordHash,
      now,
      now,
    );

    return this.findById(id) as Promise<User>;
  }

  async updateRole(userId: string, role: string): Promise<User | null> {
    const db = getAsyncDb();
    const now = new Date().toISOString();
    await db.run(
      "UPDATE users SET role = ?, updated_at = ? WHERE id = ?",
      role,
      now,
      userId,
    );
    return this.findById(userId);
  }

  async updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<User | null> {
    const db = getAsyncDb();
    const now = new Date().toISOString();
    await db.run(
      "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
      passwordHash,
      now,
      userId,
    );
    return this.findById(userId);
  }

  async findAll(): Promise<User[]> {
    const db = getAsyncDb();
    const rows = await db.all<Record<string, unknown>>(
      "SELECT * FROM users ORDER BY created_at DESC",
    );
    return rows.map(rowToUser);
  }
}
