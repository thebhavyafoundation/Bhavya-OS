import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";
import { AdminHeader } from "../components/AdminHeader";

export const metadata: Metadata = {
  title: "Admin — Bhavya Platform",
  description: "Internal administration and operations dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="min-h-screen flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main
              id="main-content"
              className="flex-1 p-6"
              role="main"
              aria-label="Admin dashboard"
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

function AdminSidebar() {
  const navItems = [
    { href: "/", label: "Dashboard", icon: "⬡" },
    { href: "/content", label: "Content", icon: "📄" },
    { href: "/releases", label: "Releases", icon: "🏷" },
    { href: "/audit", label: "Audit Log", icon: "🕐" },
    { href: "/users", label: "Users & Roles", icon: "👥" },
  ];

  return (
    <aside
      className="w-64 border-r flex flex-col admin-sidebar"
      style={{
        borderColor: "var(--admin-border)",
        backgroundColor: "var(--admin-surface)",
      }}
      role="navigation"
      aria-label="Admin navigation"
    >
      <div
        className="p-4 border-b"
        style={{ borderColor: "var(--admin-border)" }}
      >
        <h1
          className="text-lg font-bold"
          style={{ color: "var(--admin-text)" }}
        >
          Bhavya Admin
        </h1>
        <p
          className="text-xs mt-1"
          style={{ color: "var(--admin-text-muted)" }}
        >
          Platform Operations
        </p>
      </div>
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="admin-nav-link flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors"
          >
            <span className="w-4 h-4" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}
      </nav>
      <div
        className="p-4 border-t text-xs"
        style={{
          borderColor: "var(--admin-border)",
          color: "var(--admin-text-muted)",
        }}
      >
        v0.1.0 — Admin Platform
      </div>
    </aside>
  );
}
