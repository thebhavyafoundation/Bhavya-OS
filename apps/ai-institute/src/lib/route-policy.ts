/**
 * Canonical route policy — which roles may enter privileged pages.
 *
 * Single source of truth consumed by:
 * - pages, via `requirePolicy(pathname)` in lib/require-role.ts
 *   (server-side enforcement; anonymous → /login, unauthorized → /forbidden)
 * - navigation, via the roles arrays in navigation-registry.json
 *   (UX only — hiding a link never grants or denies access)
 * - tests in lib/__tests__/authorization-matrix.test.ts
 *
 * Public routes are intentionally absent: anything not listed here is
 * governed by middleware session rules (see ROUTE_PROTECTION_MATRIX.md).
 * Privileged roles are never self-assignable (see ONBOARDING_ROLES).
 */

import { OS_TOOL_ROLES, type Role } from "./roles";

export interface RoutePolicy {
  roles: Role[];
}

function tools(): RoutePolicy {
  return { roles: OS_TOOL_ROLES };
}

export const ROUTE_POLICIES: Record<string, RoutePolicy> = {
  // Institutional administration
  "/os": { roles: ["admin", "trustee", "staff"] },
  "/os/admin": { roles: ["admin"] },
  "/os/admin/users": { roles: ["admin"] },
  "/os/admin/audit": { roles: ["admin"] },
  "/os/admin/content": { roles: ["admin"] },
  "/os/admin/releases": { roles: ["admin"] },
  // Governance & knowledge
  "/os/governance": { roles: ["admin", "trustee", "staff"] },
  "/os/knowledge": { roles: ["admin", "trustee", "staff", "educator"] },
  "/os/docs": { roles: ["admin", "trustee", "staff"] },
  "/os/forest": { roles: ["admin", "trustee", "staff"] },
  // Role workspaces
  "/os/trustee": { roles: ["trustee", "admin"] },
  "/os/student": { roles: ["student", "builder", "researcher", "admin"] },
  "/os/volunteer": { roles: ["volunteer", "admin"] },
  "/os/donor": { roles: ["donor", "admin"] },
  // Content studio
  "/studio": { roles: ["admin", "educator", "instructor"] },
  // Operational tools
  "/os/runtime": tools(),
  "/os/observability": tools(),
  "/os/memory": tools(),
  "/os/api-explorer": tools(),
  "/os/github": tools(),
  "/os/ioc": tools(),
  "/os/social": tools(),
  "/os/videos": tools(),
};

/**
 * Pure access decision: can these roles enter this path?
 * Unknown paths are not denied here (middleware + API checks govern
 * everything else); only listed privileged paths are restricted.
 */
export function canAccess(pathname: string, roles: Role[]): boolean {
  const policy = ROUTE_POLICIES[pathname];
  if (!policy) return true;
  return policy.roles.some((role) => roles.includes(role));
}

export function policyFor(pathname: string): RoutePolicy | undefined {
  return ROUTE_POLICIES[pathname];
}
