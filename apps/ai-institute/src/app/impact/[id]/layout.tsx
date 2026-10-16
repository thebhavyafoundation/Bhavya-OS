"use client";

import { AuthProvider } from "@/components/AuthProvider";
import type { ReactNode } from "react";

export default function ImpactIdLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
