/**
 * @bhavya/ai-institute — App Providers
 *
 * Client-side providers for authentication and storage.
 * Wraps the auth/storage strategies in React context for use throughout the app.
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { initAuthenticator, getAuthConfig, useAuth } from "@/lib/auth/index";
import { useStorage, isStorageConfigured } from "@/lib/storage/index";

// =============================================================================
// AUTH PROVIDER
// =============================================================================

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    roles: string[];
  } | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const { authenticator } = useAuth();

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session (from Supabase or localStorage)
        const storedSession = localStorage.getItem("bhavya-auth-session");
        if (storedSession) {
          const session = JSON.parse(storedSession);
          const validated = await authenticator.validate(session.token);
          if (validated) {
            setUser({
              id: validated.userId,
              email: validated.email,
              name: validated.name,
              roles: validated.roles,
            });
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("bhavya-auth-session");
          }
        }
      } catch (error) {
        console.error("Auth init failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [authenticator]);

  const signIn = async (email: string, password: string) => {
    const result = await authenticator.authenticate({ email, password });
    if (!result.success || !result.session) {
      throw new Error(result.error || "Sign in failed");
    }
    localStorage.setItem(
      "bhavya-auth-session",
      JSON.stringify({ token: result.session.expiresAt }),
    );
    setUser({
      id: result.session.userId,
      email: result.session.email,
      name: result.session.name,
      roles: result.session.roles,
    });
    setIsAuthenticated(true);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // For Supabase, use the existing supabase auth client
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    // Sign in automatically after signup
    await signIn(email, password);
  };

  const signOut = async () => {
    localStorage.removeItem("bhavya-auth-session");
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshSession = async () => {
    // Re-validate current session
    const storedSession = localStorage.getItem("bhavya-auth-session");
    if (storedSession) {
      const session = JSON.parse(storedSession);
      const validated = await authenticator.validate(session.token);
      if (validated) {
        setUser({
          id: validated.userId,
          email: validated.email,
          name: validated.name,
          roles: validated.roles,
        });
        setIsAuthenticated(true);
      } else {
        await signOut();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

// =============================================================================
// STORAGE PROVIDER
// =============================================================================

interface StorageContextValue {
  isConfigured: boolean;
  health: { healthy: boolean; latencyMs: number } | null;
  upload: (
    file: File,
    path: string,
    options?: { contentType?: string },
  ) => Promise<{ url: string; key: string }>;
  download: (key: string) => Promise<Blob | null>;
  delete: (key: string) => Promise<void>;
  list: (
    prefix?: string,
  ) => Promise<Array<{ key: string; size: number; url: string }>>;
  getSignedUrl: (key: string, expiresIn?: number) => Promise<string>;
}

const StorageContext = createContext<StorageContextValue | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [health, setHealth] = useState<StorageContextValue["health"]>(null);
  const storage = useStorage();
  const isConfiguredNow = isStorageConfigured();

  // Configuration and a single health probe, ONCE on mount.
  //
  // Two invariants (incident 2026-10-28 — see
  // docs/incidents/2026-10-28-homepage-freeze-storage-health-loop.md):
  //
  // 1. No network attempt unless storage is genuinely configured. The client
  //    bundle cannot see S3_* env vars, so it always holds placeholder
  //    values; a request built from them is blocked by our own CSP and used
  //    to feed an infinite loop that froze low-end devices on every page.
  // 2. `useStorage()` is memoized, so `[storage]` is stable and this effect
  //    runs once per mount. State updates are guarded and use primitives or
  //    a single object written once — never a fresh object per cycle.
  useEffect(() => {
    if (!isConfiguredNow) {
      setIsConfigured(false);
      return;
    }

    setIsConfigured(true);
    let cancelled = false;

    storage
      .health()
      .then((h) => {
        if (!cancelled) {
          setHealth({
            healthy: h.status === "healthy",
            latencyMs: h.latencyMs,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHealth({ healthy: false, latencyMs: 0 });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [storage, isConfiguredNow]);

  const handleUpload = async (
    file: File,
    path: string,
    options?: { contentType?: string },
  ) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await storage.upload({
      path,
      content: new Uint8Array(arrayBuffer),
      mimeType: options?.contentType || file.type,
    });
    return { url: result.url, key: result.path };
  };

  const handleDownload = async (key: string) => {
    const file = await storage.download(key);
    return file.content ? new Blob([file.content as BlobPart]) : null;
  };

  const handleList = async (prefix?: string) => {
    const result = await storage.list(prefix || "");
    return result.files.map((f) => ({
      key: f.path,
      size: f.size,
      url: `${storage.endpoint}/${storage.bucket}/${f.path}`,
    }));
  };

  const handleGetSignedUrl = async (key: string, expiresIn = 3600) => {
    return storage.getSignedUrl(key, expiresIn);
  };

  // Access the underlying provider for delete
  const provider = storage.provider;

  return (
    <StorageContext.Provider
      value={{
        isConfigured,
        health,
        upload: handleUpload,
        download: handleDownload,
        delete: (key: string) => provider.delete(key),
        list: handleList,
        getSignedUrl: handleGetSignedUrl,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageContext() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorageContext must be used within StorageProvider");
  }
  return context;
}

// =============================================================================
// COMBINED PROVIDER
// =============================================================================

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StorageProvider>{children}</StorageProvider>
    </AuthProvider>
  );
}
