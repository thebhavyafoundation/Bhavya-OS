"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicHomepage = pathname === "/";
  const isOsRoute = pathname === "/os" || pathname.startsWith("/os/");

  if (isPublicHomepage) {
    return <>{children}</>;
  }

  // OS routes have their own layout (os/layout.tsx) with OsSidebar — no top nav
  if (isOsRoute) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
