export interface AuthProvider {
  getCurrentUser(): Promise<AuthUser | null>;
  login(credentials: AuthCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  refreshSession(): Promise<AuthSession>;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export class AuthService implements AuthProvider {
  async getCurrentUser(): Promise<AuthUser | null> {
    return null;
  }

  async login(credentials: AuthCredentials): Promise<AuthSession> {
    throw new Error("AuthService: no auth provider configured");
  }

  async logout(): Promise<void> {}

  async refreshSession(): Promise<AuthSession> {
    throw new Error("AuthService: no auth provider configured");
  }
}
