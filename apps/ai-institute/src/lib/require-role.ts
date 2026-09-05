/**
 * Server-side authorization primitive for pages and route handlers.
 *
 * Binds the session cookie to the canonical role model in `./roles`
 * (one account, many roles; `users.role` column is the source).
 *
 * Rules:
 * - Client-side role checks are UX only. Every protected server surface
 *   must call one of these helpers.
 * - Pages: use `requireRoles` (redirects: sign-in for 401, /forbidden
 *   for 403). Never render privileged content before the gate resolves.
 * - Route handlers: use `getSessionUser` + `roleIsAllowed`/`hasPermission`
 *   and return JSON 401/403 (see /os/admin/api/data for the pattern).
 *
 * Server-only: imports database-backed repositories. Never import from
 * client components.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findSessionByToken, findUserById, stripSensitive } from "./api-auth";
import { roleIsAllowed, hasPermission, type Role } from "./roles";
import { policyFor } from "./route-policy";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Resolve the current session to a safe user object.
 * Returns null when there is no session, it expired, or the user is gone.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get("session-token")?.value;
  if (!token) return null;
  const session = await findSessionByToken(token);
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) return null;
  const user = await findUserById(session.userId);
  if (!user) return null;
  return stripSensitive(user) as SessionUser;
}

/**
 * Page gate: require an authenticated session.
 * Redirects anonymous visitors to /login, preserving the destination.
 */
export async function requireSessionUser(
  redirectTo?: string,
): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect(
      redirectTo
        ? `/login?redirect=${encodeURIComponent(redirectTo)}`
        : "/login",
    );
  }
  return user;
}

/**
 * Page gate: require one of the allowed roles.
 * Anonymous → /login. Authenticated but unauthorized → /forbidden.
 * Privileged roles (admin, trustee) are never self-assignable: registration
 * and self-service updates only permit ONBOARDING_ROLES (see
 * app/api/student/route.ts), so reaching here with such a role means it was
 * assigned through an approved path.
 */
export async function requireRoles(
  allowed: Role[],
  redirectTo?: string,
): Promise<SessionUser> {
  const user = await requireSessionUser(redirectTo);
  if (!roleIsAllowed(user.role as Role, allowed)) {
    redirect("/forbidden");
  }
  return user;
}

/**
 * Page gate: require the canonical policy for a path.
 * Looks up ROUTE_POLICIES (exact match) and enforces it.
 * Paths without a policy fall back to session-only.
 */
export async function requirePolicy(pathname: string): Promise<SessionUser> {
  const policy = policyFor(pathname);
  if (!policy) return requireSessionUser(pathname);
  return requireRoles(policy.roles, pathname);
}

/**
 * Page gate: require a specific permission id from the role model.
 */
export async function requirePermission(
  permissionId: string,
  redirectTo?: string,
): Promise<SessionUser> {
  const user = await requireSessionUser(redirectTo);
  if (!hasPermission([user.role as Role], permissionId)) {
    redirect("/forbidden");
  }
  return user;
}
