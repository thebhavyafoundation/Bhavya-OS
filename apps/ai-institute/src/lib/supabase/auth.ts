"use client";

import { createClient } from "./client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const supabase = createClient();
  const router = useRouter();

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    role: "student" | "teacher" = "student",
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) throw error;
    return data;
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    router.push("/app");
    return data;
  }

  async function signInAnonymously() {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) throw error;
    router.push("/app");
    return data;
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/");
  }

  async function getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  async function updateProfile(updates: {
    full_name?: string;
    age_group?: string;
    avatar_url?: string;
  }) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  return {
    signUp,
    signIn,
    signInAnonymously,
    signInWithGoogle,
    signOut,
    getSession,
    getUser,
    updateProfile,
    supabase,
  };
}
