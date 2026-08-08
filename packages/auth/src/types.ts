/**
 * @bhavya/auth — Types
 *
 * Core authentication and authorization types.
 */

export type UserRole =
  | "guest"
  | "viewer"
  | "student"
  | "editor"
  | "mentor"
  | "instructor"
  | "admin"
  | "security"
  | "cto"
  | "founder";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  provider: AuthProvider;
  interests: string[];
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AuthProvider = "email" | "google" | "github";

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: AuthProvider;
  providerId: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthResult {
  success: boolean;
  session?: Session;
  error?: string;
}

export interface AuthStore {
  findUserByEmail(email: string): User | null;
  findUserById(id: string): User | null;
  findUserByOAuth(provider: AuthProvider, providerId: string): User | null;
  createUser(data: {
    email: string;
    name: string;
    passwordHash: string;
    role: UserRole;
    provider: AuthProvider;
    providerId?: string;
    avatar?: string;
  }): User;
  updateUser(id: string, data: Partial<User>): User;
  deleteUser(id: string): boolean;
  listUsers(options?: { limit?: number; offset?: number }): User[];
}
