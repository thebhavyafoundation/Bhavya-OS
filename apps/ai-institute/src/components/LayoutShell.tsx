"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicHomepage = pathname === "/";

  if (isPublicHomepage) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
