import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { User, CreateUserInput, UserRepository } from "./types";

const AUTH_DIR = join(process.cwd(), "bhavya-ai-lab", "data");
const USERS_FILE = join(AUTH_DIR, "users.json");

function ensureDir(): void {
  if (!existsSync(AUTH_DIR)) {
    mkdirSync(AUTH_DIR, { recursive: true });
  }
}

function loadUsers(): User[] {
  ensureDir();
  if (!existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  ensureDir();
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function generateId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export class FileUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const users = loadUsers();
    return users.find((u) => u.email === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const users = loadUsers();
    return users.find((u) => u.id === id) ?? null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const users = loadUsers();
    const existing = users.find((u) => u.email === data.email);
    if (existing) throw new Error("Email already registered");

    const now = new Date().toISOString();
    const user: User = {
      id: generateId(),
      email: data.email,
      name: data.name,
      role: data.role || "student",
      provider: data.provider || "email",
      interests: [],
      onboardingComplete: false,
      passwordHash: data.passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    users.push(user);
    saveUsers(users);
    return user;
  }
}
