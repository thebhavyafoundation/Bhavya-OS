/**
 * @bhavya/auth — File Store
 *
 * JSON file-based auth store for local development.
 * Production should use a database adapter.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import type { AuthStore, User, AuthProvider, UserRole } from "./types.js";

interface StoredUser extends User {
  passwordHash: string;
  providerId?: string;
}

export function createFileStore(dbPath: string): AuthStore {
  const dir = dirname(dbPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  function loadUsers(): StoredUser[] {
    if (!existsSync(dbPath)) return [];
    try {
      return JSON.parse(readFileSync(dbPath, "utf-8"));
    } catch {
      return [];
    }
  }

  function saveUsers(users: StoredUser[]): void {
    writeFileSync(dbPath, JSON.stringify(users, null, 2));
  }

  return {
    findUserByEmail(email: string): User | null {
      const users = loadUsers();
      const found = users.find((u) => u.email === email);
      return found ? stripSensitive(found) : null;
    },

    findUserById(id: string): User | null {
      const users = loadUsers();
      const found = users.find((u) => u.id === id);
      return found ? stripSensitive(found) : null;
    },

    findUserByOAuth(provider: AuthProvider, providerId: string): User | null {
      const users = loadUsers();
      const found = users.find(
        (u) => u.provider === provider && u.providerId === providerId,
      );
      return found ? stripSensitive(found) : null;
    },

    createUser(data: {
      email: string;
      name: string;
      passwordHash: string;
      role: UserRole;
      provider: AuthProvider;
      providerId?: string;
      avatar?: string;
    }): User {
      const users = loadUsers();
      const now = new Date().toISOString();
      const user: StoredUser = {
        id: generateId(),
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        role: data.role,
        provider: data.provider,
        providerId: data.providerId,
        interests: [],
        onboardingComplete: false,
        passwordHash: data.passwordHash,
        createdAt: now,
        updatedAt: now,
      };
      users.push(user);
      saveUsers(users);
      return stripSensitive(user);
    },

    updateUser(id: string, data: Partial<User>): User {
      const users = loadUsers();
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error("User not found");
      users[idx] = {
        ...users[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveUsers(users);
      return stripSensitive(users[idx]);
    },

    deleteUser(id: string): boolean {
      const users = loadUsers();
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return false;
      users.splice(idx, 1);
      saveUsers(users);
      return true;
    },

    listUsers(options?: { limit?: number; offset?: number }): User[] {
      const users = loadUsers();
      const start = options?.offset ?? 0;
      const end = options?.limit ? start + options.limit : undefined;
      return users.slice(start, end).map(stripSensitive);
    },
  };
}

function stripSensitive(user: StoredUser): User {
  const { passwordHash, providerId, ...safe } = user;
  return safe;
}

function generateId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
