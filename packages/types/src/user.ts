/**
 * @bhavya/types — User Types
 *
 * Canonical user and authentication types.
 */

/** User entity */
export interface User {
  id: string;
  email: string;
  name?: string;
  roles: UserRole[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/** User role */
export type UserRole =
  "admin" | "editor" | "viewer" | "researcher" | "volunteer";

/** User session */
export interface Session {
  user: User;
  expiresAt: string;
}

/** Authentication credentials */
export interface AuthCredentials {
  email: string;
  password: string;
}

/** Registration data */
export interface RegistrationData extends AuthCredentials {
  name?: string;
}

/** Permission */
export interface Permission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
}
