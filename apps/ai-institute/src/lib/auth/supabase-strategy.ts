/**
 * @bhavya/auth — Supabase Authentication Strategy
 *
 * Strategy for authenticating via Supabase JWT-based authentication.
 * Compatible with the @bhavya/security AuthStrategy interface.
 *
 * Uses the Supabase JavaScript client with the anon/public key for
 * signInWithPassword, signUp, and session management.
 *
 * **Important:** The Supabase anon key should be the public (read-only) key,
 * not the service_role key. The service_role key should only be used on
 * the server-side, never exposed to the browser.
 */

import {
  AuthStrategy,
  AuthCredentials,
  AuthResult,
  AuthSession,
} from "@bhavya/security";

// Supabase configuration from environment variables
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https:// YOUR_SUPABASE_PROJECT_URL.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// NOTE: This strategy is currently a development stub. It is not wired into
// the live auth path — `lib/auth.ts` calls Supabase directly via
// `supabase.auth.getUser()`. Do not use `validate()` in production: it accepts
// the literal token "test-token" and returns a fabricated session.

/**
 * Supabase Auth Strategy
 *
 * Implements the AuthStrategy interface using Supabase authentication.
 * Supports password-based auth, magic links, and session management.
 */
export class SupabaseStrategy implements AuthStrategy {
  name = "supabase";

  /**
   * Authenticate user with Supabase
   *
   * @param credentials - Email and password for sign in
   * @returns AuthResult with session or error
   */
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    // TODO: Replace with supabase.auth.signInWithPassword({ email, password })
    // and persist the returned session for cross-session continuity.

    // Development-only fixed credential; rejected for every other input.
    if (
      credentials.email === "test@bhavya.foundation" &&
      credentials.password === "test"
    ) {
      return {
        success: true,
        session: {
          userId: "user-12345",
          email: "test@bhavya.foundation",
          name: "Test User",
          roles: ["user"],
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      };
    }

    return {
      success: false,
      error: "Invalid email or password. Did you set up Supabase auth?",
    };
  }

  /**
   * Validate a Supabase JWT token
   *
   * @param token - The JWT token to validate
   * @returns AuthSession if valid, null if invalid
   */
  async validate(token: string): Promise<AuthSession | null> {
    // TODO: Replace with supabase.auth.getUser(token). The anon key can
    // validate JWTs, but production verification belongs server-side using
    // the service_role key (never exposed to the browser).

    // Development-only fixed token.
    if (token === "test-token") {
      return {
        userId: "user-12345",
        email: "test@bhavya.foundation",
        name: "Test User",
        roles: ["user"],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    return null;
  }

  /**
   * Revoke a session token
   *
   * @param tokenId - The session token to revoke
   * @returns Promise<void>
   */
  async revoke(tokenId: string): Promise<void> {
    // TODO: Implement Supabase session revocation
    // const { error } = await supabase.auth.signOut({ token: tokenId });
    // if (error) throw error;
    // For now, just mark as revoked in SQLite if applicable
    // const db = getNamedDatabase("auth", { path: "./auth.db" });
    // await db.exec(`DELETE FROM sessions WHERE session_token = '${tokenId}'`);
  }
}

/**
 * Initialize Supabase strategy with the authenticator
 *
 * @param authenticator - The Authenticator to add the strategy to
 * @returns The authenticator with Supabase strategy added
 */
export function initSupabaseStrategy(
  authenticator: import("@bhavya/security").Authenticator,
) {
  const strategy = new SupabaseStrategy();
  authenticator.use(strategy);
  return authenticator;
}

/**
 * Get Supabase configuration
 *
 * @returns Object with Supabase URL and anon key (safe for client-side)
 */
export function getSupabaseConfig() {
  // Return only safe config for client-side use
  // The anon key is designed to be exposed to the browser
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  };
}

export default SupabaseStrategy;
