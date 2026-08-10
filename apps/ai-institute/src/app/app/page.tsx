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

export const metadata: Metadata = {
  title: "My Bhavya — Bhavya Foundation",
  description: "Your institutional home at Bhavya Foundation.",
};

const iconMap: Record<string, any> = {
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

// Simulated user roles — in production, fetch from auth + database
const userRoles: Role[] = ["student", "volunteer"];

export default function MyAppPage() {
  const modules = getHomeModules(userRoles);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <header style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            My Bhavya
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: 12,
            }}
          >
            Your institutional home. Everything you need, one place.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {userRoles.map((role) => (
              <span
                key={role}
                style={{
                  padding: "4px 12px",
                  background: "var(--forest)",
                  color: "var(--bg)",
                  borderRadius: 6,
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
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
                  padding: 24,
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon
                  size={24}
                  style={{ color: "var(--forest)", marginBottom: 12 }}
                />
                <h2
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: 8,
                  }}
                >
                  {mod.title}
                </h2>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
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
