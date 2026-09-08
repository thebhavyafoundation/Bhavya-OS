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

export { validateSession, requireAuth } from "./validate-session.js";
export type { AuthUser } from "./validate-session.js";
export { findSession, findUser } from "./db.js";
export type { SessionRow, UserRow } from "./db.js";
