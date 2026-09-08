/**
 * GitHub OS — API Authentication Guard
 *
 * Wraps route handlers with session validation against the canonical database.
 * Health endpoints remain public.
 *
 * Usage:
 *   import { withAuth } from "@/lib/api-auth";
 *   export const GET = withAuth(async (request, user) => {
 *     // user is authenticated: { id, email, name, role }
 *   });
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, type AuthUser } from "@bhavya/auth";

type AuthenticatedHandler = (
  request: NextRequest,
  user: AuthUser,
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap a route handler with session validation.
 * Returns 401 if the session is invalid or missing.
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    return handler(request, user);
  };
}
