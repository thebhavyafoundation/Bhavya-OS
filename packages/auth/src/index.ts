/**
 * @bhavya/auth — Bhavya Foundation Session Validation
 *
 * Verifies session tokens against the canonical database.
 * Use in API route handlers (Node.js runtime).
 *
 * @example
 *   import { requireAuth } from "@bhavya/auth";
 *
 *   export async function GET(request: NextRequest) {
 *     const user = await requireAuth(request);
 *     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 */

export { validateSession, requireAuth } from "./validate-session";
export type { AuthUser } from "./validate-session";
export { findSession, findUser } from "./db";
export type { SessionRow, UserRow } from "./db";
