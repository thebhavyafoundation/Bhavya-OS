import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Users,
  TreePine,
  FlaskConical,
  Award,
  Heart,
  Calendar,
  Compass,
  Download,
} from "lucide-react";
import { getHomeModules, type Role } from "@/lib/roles";
import { requireSessionUser } from "@/lib/require-role";

export const metadata: Metadata = {
  title: "My Bhavya — Bhavya Foundation",
  description: "Your institutional home at Bhavya Foundation.",
};

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen,
  Users,
  TreePine,
  FlaskConical,
  Award,
  Heart,
  Calendar,
  Compass,
  Download,
  Home: BookOpen,
};

export default async function MyAppPage() {
  const user = await requireSessionUser("/app");
  const userRoles: Role[] = [user.role as Role];
  const modules = getHomeModules(userRoles);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
      <div
        style={{
          maxWidth: "var(--max-w)",
          margin: "0 auto",
          padding: "var(--space-12) var(--space-6)",
        }}
      >
        <header style={{ marginBottom: "var(--space-12)" }}>
          <h1
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            My Bhavya
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Your institutional home. Everything you need, one place.
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              marginTop: "var(--space-4)",
            }}
          >
            <span
              style={{
                padding: "var(--space-1) var(--space-3)",
                background: "var(--color-brand-forest)",
                color: "var(--color-text-inverse)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {user.role}
            </span>
            <span
              style={{
                padding: "var(--space-1) var(--space-3)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-secondary)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
              }}
            >
              {user.name}
            </span>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {modules.map((mod) => {
            const Icon = iconMap[mod.icon] || BookOpen;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                style={{
                  display: "block",
                  padding: "var(--space-6)",
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border-primary)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon
                  size={24}
                  style={{
                    color: "var(--color-brand-forest)",
                    marginBottom: "var(--space-3)",
                  }}
                />
                <h2
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {mod.title}
                </h2>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {mod.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
