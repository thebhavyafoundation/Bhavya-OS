/**
 * @bhavya/auth — RBAC
 *
 * Role-Based Access Control with 10 institutional roles.
 */

import type { UserRole } from "./types.js";

export type Permission =
  | "read"
  | "write"
  | "delete"
  | "manage_users"
  | "manage_content"
  | "manage_courses"
  | "manage_mentors"
  | "manage_research"
  | "manage_finance"
  | "manage_governance"
  | "admin";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  viewer: 1,
  student: 2,
  editor: 3,
  mentor: 4,
  instructor: 5,
  admin: 6,
  security: 7,
  cto: 8,
  founder: 9,
};

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: ["read"],
  viewer: ["read"],
  student: ["read", "write"],
  editor: ["read", "write", "manage_content"],
  mentor: ["read", "write", "manage_content", "manage_mentors"],
  instructor: [
    "read",
    "write",
    "manage_content",
    "manage_courses",
    "manage_mentors",
  ],
  admin: [
    "read",
    "write",
    "delete",
    "manage_users",
    "manage_content",
    "manage_courses",
    "manage_mentors",
    "manage_research",
  ],
  security: ["read", "manage_users", "admin"],
  cto: [
    "read",
    "write",
    "delete",
    "manage_users",
    "manage_content",
    "manage_courses",
    "manage_mentors",
    "manage_research",
    "manage_governance",
    "admin",
  ],
  founder: [
    "read",
    "write",
    "delete",
    "manage_users",
    "manage_content",
    "manage_courses",
    "manage_mentors",
    "manage_research",
    "manage_finance",
    "manage_governance",
    "admin",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return permissions.includes(permission);
}

export function hasMinRole(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
