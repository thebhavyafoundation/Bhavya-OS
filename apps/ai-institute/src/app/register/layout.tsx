"use client";

import { AuthProvider } from "@/components/AuthProvider";
import type { ReactNode } from "react";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
