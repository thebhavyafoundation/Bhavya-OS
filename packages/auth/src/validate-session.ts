/**
 * @bhavya/auth — Session Validation
 *
 * Validates session tokens against the canonical Bhavya Foundation database.
 * Use in API route handlers (Node.js runtime, not Edge middleware).
 *
 * Usage:
 *   import { requireAuth } from "@bhavya/auth/validate";
 *
 *   export async function GET(request: NextRequest) {
 *     const user = await requireAuth(request);
 *     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *     // user.id, user.email, user.name, user.role are available
 *   }
 */

import type { NextRequest } from "next/server";
import { findSession, findUser } from "./db.js";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Validate the session token from the request cookie.
 * Returns the authenticated user or null if the session is invalid/expired.
 *
 * Reads the `session-token` cookie, validates it against the canonical
 * database, checks expiry, and returns the user record.
 */
export async function validateSession(
  request: NextRequest,
): Promise<AuthUser | null> {
  const token = request.cookies.get("session-token")?.value;
  if (!token) return null;

  try {
    const session = await findSession(token);
    if (!session) return null;

    const user = await findUser(session.user_id);
    if (!user) return null;

    return user;
  } catch {
    // Database errors should not grant access
    return null;
  }
}

/**
 * Require an authenticated session. Returns the user or null.
 * Use in API route handlers to enforce authentication.
 *
 * @example
 *   export async function POST(request: NextRequest) {
 *     const user = await requireAuth(request);
 *     if (!user) {
 *       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
 *     }
 *     // Proceed with authenticated user
 *   }
 */
export async function requireAuth(
  request: NextRequest,
): Promise<AuthUser | null> {
  return validateSession(request);
}
