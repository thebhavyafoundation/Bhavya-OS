/**
 * @bhavya/auth — Authentication Module
 *
 * Exports the authentication strategies and initialization functions.
 * Provides a unified interface for Supabase-based authentication
 * and the authenticator composite pattern.
 */

import { Authenticator } from "@bhavya/security";
import {
  initSupabaseStrategy,
  getSupabaseConfig,
  SupabaseStrategy,
} from "./supabase-strategy";
import type {
  AuthStrategy,
  AuthCredentials,
  AuthResult,
  AuthSession,
} from "@bhavya/security";

/**
 * Initialize the Authenticator with Supabase strategy
 *
 * @returns Configured Authentrator instance with Supabase strategy added
 */
export function initAuthenticator(): Authenticator {
  const authenticator = new Authenticator();
  initSupabaseStrategy(authenticator);
  return authenticator;
}

/**
 * Get Supabase configuration safe for client-side use
 *
 * Returns the URL and anon key that can be embedded in the browser
 * without security risks (the anon key only allows read operations).
 *
 * @returns Object with Supabase URL and anon key
 */
export function getAuthConfig() {
  return getSupabaseConfig();
}

/**
 * Type for auth initialization options
 */
export type InitAuthOptions = {
  /** Redirect URL after auth */
  redirectUrl?: string;
  /** Additional strategy to add */
  additionalStrategies?: AuthStrategy[];
};

/**
 * Full authentication initialization
 *
 * Sets up the authenticator with all strategies and returns
 * the config for use in the app.
 *
 * @returns Object with authenticator and config
 */
export function useAuth(): {
  authenticator: Authenticator;
  config: ReturnType<typeof getAuthConfig>;
  initStrategies: AuthStrategy[];
  strategies: AuthStrategy[];
} {
  const authenticator = initAuthenticator();
  const config = getAuthConfig();
  const strategies: AuthStrategy[] = [new SupabaseStrategy()];

  return { authenticator, config, initStrategies: strategies, strategies };
}

export default initAuthenticator;
