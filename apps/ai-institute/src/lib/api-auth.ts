/**
 * AI Institute — Authentication Layer
 *
 * All persistence goes through repository interfaces.
 * No direct database access.
 */

import type { NextRequest } from "next/server";
import { initDatabase } from "./db";
import { getUserRepository, getSessionRepository } from "./repositories";
import type { CreateUserInput } from "./repositories";

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  provider: string;
  interests: string[];
  onboardingComplete: boolean;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSession {
  userId: string;
  token: string;
  expiresAt: string;
}

async function ensureDb(): Promise<void> {
  await initDatabase();
}

export async function hashPassword(password: string): Promise<string> {
  const { default: bcrypt } = await import("bcryptjs");
  return bcrypt.hashSync(password, 12);
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const { default: bcrypt } = await import("bcryptjs");
  return bcrypt.compareSync(password, stored);
}

export async function findUserByEmail(email: string): Promise<ApiUser | null> {
  await ensureDb();
  const userRepo = getUserRepository();
  const user = await userRepo.findByEmail(email);
  return user as unknown as ApiUser | null;
}

export async function findUserById(id: string): Promise<ApiUser | null> {
  await ensureDb();
  const userRepo = getUserRepository();
  const user = await userRepo.findById(id);
  return user as unknown as ApiUser | null;
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  role?: string;
  provider?: string;
}): Promise<ApiUser> {
  await ensureDb();
  const userRepo = getUserRepository();
  const input: CreateUserInput = {
    email: data.email,
    name: data.name,
    passwordHash: data.passwordHash,
    role: data.role,
    provider: data.provider,
  };
  const user = await userRepo.create(input);
  return user as unknown as ApiUser;
}

export async function createSession(user: ApiUser): Promise<ApiSession> {
  await ensureDb();
  const sessionRepo = getSessionRepository();
  const session = await sessionRepo.create(user.id);
  return { userId: user.id, token: session.token, expiresAt: session.expiresAt };
}

export async function findSessionByToken(token: string): Promise<ApiSession | null> {
  await ensureDb();
  const sessionRepo = getSessionRepository();
  const session = await sessionRepo.findByToken(token);
  if (!session) return null;
  return { userId: session.userId, token, expiresAt: session.expiresAt };
}

export async function deleteSession(token: string): Promise<void> {
  await ensureDb();
  const sessionRepo = getSessionRepository();
  await sessionRepo.delete(token);
}

export function stripSensitive(user: ApiUser) {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

/**
 * Server-side auth helper for API routes.
 * Returns the authenticated user or null if session is invalid/expired.
 * Usage: const user = await requireAuth(request);
 * if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function requireAuth(request: NextRequest): Promise<ApiUser | null> {
  const token = request.cookies.get("session-token")?.value;
  if (!token) return null;
  const session = await findSessionByToken(token);
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) return null;
  const user = await findUserById(session.userId);
  return user;
}
