/**
 * Intelligence Network — Authentication Helper
 *
 * Wraps @bhavya/auth requireAuth with role-based access control.
 * Routes are classified as OPERATOR (admin/operator) or AUTHENTICATED (any user).
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth, type AuthUser } from "@bhavya/auth";

type AuthResult =
  | { user: AuthUser; error?: never }
  | { user?: never; error: NextResponse };

/**
 * Require an authenticated user (any role).
 */
export async function requireAuthenticated(request: NextRequest): Promise<AuthResult> {
  const user = await requireAuth(request);
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  }
  return { user };
}

/**
 * Require an operator-level user (admin or operator role).
 */
export async function requireOperator(request: NextRequest): Promise<AuthResult> {
  const user = await requireAuth(request);
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  }
  if (user.role !== "admin" && user.role !== "operator") {
    return {
      error: NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      ),
    };
  }
  return { user };
}
