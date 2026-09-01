"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { getNavItems } from "@/lib/useNavigation";
import { OS_ROLES, type Role } from "@/lib/roles";
import {
  Home,
  BookOpen,
  Users,
  Compass,
  User,
  TreePine,
  FlaskConical,
  Award,
  Heart,
  LogOut,
  Terminal,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Home,
  BookOpen,
  Users,
  Compass,
  User,
  TreePine,
  FlaskConical,
  Award,
  Heart,
  Terminal,
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // Get nav items from canonical registry
  const userRoles = user ? [user.role as Role] : undefined;
  const appNavItems = getNavItems("app", userRoles);

  // Add OS link for users with OS access roles
  const userRole = user ? (user.role as Role) : undefined;
  const hasOsAccess = userRole ? OS_ROLES.includes(userRole) : false;
  const navItems = [
    ...appNavItems.map((item) => ({
      ...item,
      icon: iconMap[item.icon] || Home,
    })),
    ...(hasOsAccess
      ? [{ id: "os", label: "OS", href: "/os", icon: Terminal }]
      : []),
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          background: "var(--color-bg-elevated)",
          borderRight: "1px solid var(--color-border-primary)",
          padding: "var(--space-6) 0",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "0 var(--space-6)",
            marginBottom: "var(--space-8)",
            textDecoration: "none",
          }}
        >
          <img
            src="/brand/icon.svg"
            alt=""
            width="28"
            height="28"
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            My Bhavya
          </span>
        </Link>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-6)",
                  color: isActive ? "var(--color-brand-forest)" : "var(--color-text-secondary)",
                  background: isActive ? "var(--color-accent-green-glow)" : "transparent",
                  textDecoration: "none",
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? "3px solid var(--color-brand-forest)" : "3px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "0 var(--space-6)", borderTop: "1px solid var(--color-border-primary)", paddingTop: "var(--space-4)" }}>
          <button
            type="button"
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-3) 0",
              color: "var(--color-text-tertiary)",
              textDecoration: "none",
              fontSize: "var(--text-sm)",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: 240 }}>
        {children}
      </main>
    </div>
  );
}
