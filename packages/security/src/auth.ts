/**
 * @bhavya/security — Authentication
 *
 * Strategy-based authentication abstraction.
 */

export interface AuthStrategy {
  name: string;
  authenticate(credentials: AuthCredentials): Promise<AuthResult>;
  validate(token: string): Promise<AuthSession | null>;
  revoke?(tokenId: string): Promise<void>;
}

export interface AuthCredentials {
  email?: string;
  password?: string;
  token?: string;
  apiKey?: string;
}

export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name?: string;
  roles: string[];
  expiresAt: string;
}

/**
 * Simple API key authentication strategy.
 */
export class ApiKeyStrategy implements AuthStrategy {
  name = "api-key";
  private keys: Map<string, { userId: string; roles: string[] }> = new Map();

  registerKey(key: string, userId: string, roles: string[] = ["viewer"]) {
    this.keys.set(key, { userId, roles });
  }

  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    if (!credentials.apiKey)
      return { success: false, error: "No API key provided" };
    const entry = this.keys.get(credentials.apiKey);
    if (!entry) return { success: false, error: "Invalid API key" };
    return {
      success: true,
      session: {
        userId: entry.userId,
        email: "",
        roles: entry.roles,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  }

  async validate(token: string): Promise<AuthSession | null> {
    const entry = this.keys.get(token);
    if (!entry) return null;
    return {
      userId: entry.userId,
      email: "",
      roles: entry.roles,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}

/**
 * Composite authenticator that tries multiple strategies.
 */
export class Authenticator {
  private strategies: AuthStrategy[] = [];

  use(strategy: AuthStrategy) {
    this.strategies.push(strategy);
    return this;
  }

  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    for (const strategy of this.strategies) {
      const result = await strategy.authenticate(credentials);
      if (result.success) return result;
    }
    return { success: false, error: "No strategy could authenticate" };
  }

  async validate(token: string): Promise<AuthSession | null> {
    for (const strategy of this.strategies) {
      const session = await strategy.validate(token);
      if (session) return session;
    }
    return null;
  }
}
