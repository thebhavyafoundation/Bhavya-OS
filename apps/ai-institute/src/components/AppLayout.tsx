"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navItems = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/learn", label: "Learn", icon: BookOpen },
  { href: "/app/community", label: "Community", icon: Users },
  { href: "/app/knowledge", label: "Knowledge", icon: Compass },
  { href: "/app/missions", label: "Missions", icon: TreePine },
  { href: "/app/research", label: "Research", icon: FlaskConical },
  { href: "/app/credentials", label: "Credentials", icon: Award },
  { href: "/app/contributions", label: "Contributions", icon: Heart },
  { href: "/app/profile", label: "Profile", icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          background: "var(--bg-raised)",
          borderRight: "1px solid var(--border)",
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
              color: "var(--text)",
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
                  color: isActive ? "var(--forest)" : "var(--text-secondary)",
                  background: isActive ? "var(--forest-glow)" : "transparent",
                  textDecoration: "none",
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? "3px solid var(--forest)" : "3px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "0 var(--space-6)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-3) 0",
              color: "var(--text-tertiary)",
              textDecoration: "none",
              fontSize: "var(--text-sm)",
            }}
          >
            <LogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: 240 }}>
        {children}
      </main>
    </div>
  );
}
