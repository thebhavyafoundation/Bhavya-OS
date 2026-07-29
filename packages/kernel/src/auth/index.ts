// Auth & Authorization
// Token-based authentication with role-based access control.

export interface AuthToken {
  id: string;
  subject: string; // agent/user ID
  roles: string[];
  permissions: string[];
  issuedAt: Date;
  expiresAt: Date;
  metadata: Record<string, unknown>;
}

export interface AuthConfig {
  secret: string;
  tokenExpiryMs: number;
  refreshExpiryMs: number;
  issuer: string;
}

export interface Role {
  name: string;
  permissions: string[];
  description: string;
}

export class Auth {
  private config: AuthConfig;
  private tokens = new Map<string, AuthToken>();
  private roles = new Map<string, Role>();
  private revoked = new Set<string>();

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Default roles
    this.roles.set('admin', {
      name: 'admin',
      permissions: ['*'],
      description: 'Full access',
    });

    this.roles.set('agent', {
      name: 'agent',
      permissions: ['read', 'write', 'execute'],
      description: 'Standard agent access',
    });

    this.roles.set('viewer', {
      name: 'viewer',
      permissions: ['read'],
      description: 'Read-only access',
    });
  }

  // Issue token
  async issueToken(subject: string, roles: string[], durationMs?: number): Promise<AuthToken> {
    const expiry = durationMs ?? this.config.tokenExpiryMs;
    const token: AuthToken = {
      id: `token:${crypto.randomUUID()}`,
      subject,
      roles,
      permissions: this.getPermissionsForRoles(roles),
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + expiry),
      metadata: { issuer: this.config.issuer },
    };

    this.tokens.set(token.id, token);
    return token;
  }

  // Validate token
  async validateToken(tokenId: string): Promise<{ valid: boolean; token?: AuthToken; reason?: string }> {
    if (this.revoked.has(tokenId)) {
      return { valid: false, reason: 'Token revoked' };
    }

    const token = this.tokens.get(tokenId);
    if (!token) {
      return { valid: false, reason: 'Token not found' };
    }

    if (token.expiresAt < new Date()) {
      return { valid: false, reason: 'Token expired' };
    }

    return { valid: true, token };
  }

  // Check permission
  async checkPermission(tokenId: string, permission: string): Promise<boolean> {
    const { valid, token } = await this.validateToken(tokenId);
    if (!valid || !token) return false;

    return token.permissions.includes('*') || token.permissions.includes(permission);
  }

  // Revoke token
  async revokeToken(tokenId: string): Promise<void> {
    this.revoked.add(tokenId);
    this.tokens.delete(tokenId);
  }

  // Refresh token
  async refreshToken(tokenId: string): Promise<AuthToken | null> {
    const { valid, token } = await this.validateToken(tokenId);
    if (!valid || !token) return null;

    // Revoke old
    await this.revokeToken(tokenId);

    // Issue new
    return this.issueToken(token.subject, token.roles, this.config.refreshExpiryMs);
  }

  // Define role
  defineRole(role: Role): void {
    this.roles.set(role.name, role);
  }

  // Get role
  getRole(name: string): Role | undefined {
    return this.roles.get(name);
  }

  private getPermissionsForRoles(roles: string[]): string[] {
    const perms = new Set<string>();
    for (const roleName of roles) {
      const role = this.roles.get(roleName);
      if (role) {
        role.permissions.forEach((p) => perms.add(p));
      }
    }
    return Array.from(perms);
  }

  async shutdown(): Promise<void> {
    this.tokens.clear();
    this.roles.clear();
    this.revoked.clear();
  }
}
