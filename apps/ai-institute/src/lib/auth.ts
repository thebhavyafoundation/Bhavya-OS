import { createClient } from "./supabase/server";
import { NextRequest } from "next/server";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
}

export async function requireAuth(request: NextRequest): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email || "",
    fullName: profile?.full_name,
    role: profile?.role,
  };
}

export async function getOptionalUser(
  request: NextRequest,
): Promise<User | null> {
  try {
    return await requireAuth(request);
  } catch {
    return null;
  }
}

export function extractCorrelationId(request: NextRequest): string {
  return request.headers.get("x-correlation-id") || crypto.randomUUID();
}
