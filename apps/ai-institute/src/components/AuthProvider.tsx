"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  interests: string[];
  onboardingComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithProvider: (provider: "google" | "github") => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "ai-institute-auth";

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storeUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (
      email: string,
      _password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      const stored = getStoredUser();
      if (stored && stored.email === email) {
        setUser(stored);
        storeUser(stored);
        return { success: true };
      }

      const newUser: User = {
        id: `u_${Date.now().toString(36)}`,
        email,
        name: email.split("@")[0],
        role: "student",
        interests: [],
        onboardingComplete: false,
      };
      setUser(newUser);
      storeUser(newUser);
      return { success: true };
    },
    [],
  );

  const register = useCallback(
    async (
      email: string,
      _password: string,
      name: string,
    ): Promise<{ success: boolean; error?: string }> => {
      const newUser: User = {
        id: `u_${Date.now().toString(36)}`,
        email,
        name,
        role: "student",
        interests: [],
        onboardingComplete: false,
      };
      setUser(newUser);
      storeUser(newUser);
      return { success: true };
    },
    [],
  );

  const loginWithProvider = useCallback((provider: "google" | "github") => {
    const mockUser: User = {
      id: `u_${provider}_${Date.now().toString(36)}`,
      email: `learner@${provider}.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Learner`,
      role: "student",
      interests: [],
      onboardingComplete: false,
    };
    setUser(mockUser);
    storeUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storeUser(null);
  }, []);

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      setUser(updated);
      storeUser(updated);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithProvider,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
