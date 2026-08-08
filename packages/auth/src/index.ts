/**
 * @bhavya/auth
 *
 * Provider-agnostic authentication with email/password, Google OAuth,
 * GitHub OAuth, RBAC, session management, and file-based persistence.
 */

export type {
  User,
  UserRole,
  AuthProvider,
  RegisterInput,
  LoginInput,
  OAuthProfile,
  Session,
  AuthResult,
  AuthStore,
} from "./types.js";

export {
  registerWithEmail,
  loginWithEmail,
  loginWithOAuth,
  extractOAuthProfile,
  hashPassword,
  verifyPassword,
} from "./strategies.js";

export {
  createSession,
  isSessionValid,
  validateSessionToken,
} from "./session.js";

export { hasPermission, hasMinRole, getRolePermissions } from "./rbac.js";
export type { Permission } from "./rbac.js";

export { createFileStore } from "./store.js";
