"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/", label: "Overview" },
  { href: "/tokens", label: "Tokens" },
  { href: "/components", label: "Components" },
  { href: "/icons", label: "Icons" },
  { href: "/typography", label: "Typography" },
  { href: "/patterns", label: "Patterns" },
  { href: "/playground", label: "Playground" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-[var(--border)] bg-[var(--bg-subtle)] p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-lg font-bold tracking-tight">Bhavya Design</h1>
        <p className="text-sm text-[var(--text-muted)]">v0.9.0</p>
      </div>

      <nav className="space-y-1">
        {sections.map((section) => {
          const isActive = pathname === section.href;
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white font-medium"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
              }`}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-subtle)]">
          Canonical reference for all
          <br />
          Bhavya Foundation apps
        </p>
      </div>
    </aside>
  );
}
