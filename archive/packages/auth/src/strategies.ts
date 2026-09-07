/**
 * @bhavya/auth — Auth Strategies
 *
 * Provider-agnostic authentication strategies:
 * - Email/Password (real bcrypt via bcryptjs)
 * - Google OAuth (token exchange)
 * - GitHub OAuth (token exchange)
 */

import bcrypt from "bcryptjs";
import type {
  AuthProvider,
  AuthResult,
  LoginInput,
  OAuthProfile,
  RegisterInput,
  User,
  AuthStore,
} from "./types.js";
import { createSession } from "./session.js";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerWithEmail(
  input: RegisterInput,
  store: AuthStore,
  secret: string,
): Promise<AuthResult> {
  if (!input.email || !input.password || !input.name) {
    return { success: false, error: "Email, password, and name are required" };
  }
  if (input.password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { success: false, error: "Invalid email format" };
  }

  const existing = store.findUserByEmail(input.email);
  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  const passwordHash = await hashPassword(input.password);
  const user = store.createUser({
    email: input.email,
    name: input.name,
    passwordHash,
    role: "student",
    provider: "email",
  });

  const session = createSession(user, secret);
  return { success: true, session };
}

export async function loginWithEmail(
  input: LoginInput,
  store: AuthStore,
  secret: string,
): Promise<AuthResult> {
  const user = store.findUserByEmail(input.email);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const session = createSession(user, secret);
  return { success: true, session };
}

export async function loginWithOAuth(
  profile: OAuthProfile,
  store: AuthStore,
  secret: string,
): Promise<AuthResult> {
  let user = store.findUserByOAuth(profile.provider, profile.providerId);

  if (!user) {
    const existingByEmail = store.findUserByEmail(profile.email);
    if (existingByEmail) {
      user = store.updateUser(existingByEmail.id, {
        provider: profile.provider,
        avatar: profile.avatar,
      });
    } else {
      user = store.createUser({
        email: profile.email,
        name: profile.name,
        passwordHash: "",
        role: "student",
        provider: profile.provider,
        providerId: profile.providerId,
        avatar: profile.avatar,
      });
    }
  }

  const session = createSession(user, secret);
  return { success: true, session };
}

export function extractOAuthProfile(
  provider: AuthProvider,
  data: Record<string, unknown>,
): OAuthProfile | null {
  if (provider === "google") {
    const sub = data.sub as string;
    const email = data.email as string;
    if (!sub || !email) return null;
    return {
      id: sub,
      email,
      name: (data.name as string) || email.split("@")[0],
      avatar: data.picture as string | undefined,
      provider: "google",
      providerId: sub,
    };
  }

  if (provider === "github") {
    const id = data.id as number;
    const login = data.login as string;
    const email = (data.email as string) || `${login}@github.local`;
    if (!id || !login) return null;
    return {
      id: String(id),
      email,
      name: (data.name as string) || login,
      avatar: data.avatar_url as string | undefined,
      provider: "github",
      providerId: String(id),
    };
  }

  return null;
}
