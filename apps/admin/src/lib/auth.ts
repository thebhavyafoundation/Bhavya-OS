/**
 * Admin App — Authentication Helper
 *
 * Wraps @bhavya/auth requireAuth with admin role enforcement.
 * All admin API routes should use requireAdminAuth.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth, type AuthUser } from "@bhavya/auth";

/**
 * Require an authenticated admin user.
 * Returns the user if authenticated and authorized, or sends an error response.
 *
 * Usage:
 *   const result = await requireAdminAuth(request);
 *   if (result.error) return result.error;
 *   const user = result.user;
 */
export async function requireAdminAuth(request: NextRequest): Promise<
  | { user: AuthUser; error?: never }
  | { user?: never; error: NextResponse }
> {
  const user = await requireAuth(request);

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  }

  if (user.role !== "admin") {
    return {
      error: NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      ),
    };
  }

  return { user };
}
