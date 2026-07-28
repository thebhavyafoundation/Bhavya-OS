"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "\u{1F4CA}" },
  { href: "/documents", label: "Documents", icon: "\u{1F4C4}" },
  { href: "/search", label: "Search", icon: "\u{1F50D}" },
  { href: "/graph", label: "Knowledge Graph", icon: "\u{1F578}" },
  { href: "/collections", label: "Collections", icon: "\u{1F4E6}" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: 240,
        background: "#0a0f1a",
        borderRight: "1px solid #1e293b",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: 24, padding: "0 8px" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc" }}>Knowledge</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Bhavya Foundation</div>
        </Link>
      </div>

      {/* Nav Links */}
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#10b981" : "#94a3b8",
              background: isActive ? "rgba(16,185,129,0.08)" : "transparent",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}

      {/* Footer */}
      <div style={{ marginTop: "auto", padding: "16px 8px", borderTop: "1px solid #1e293b" }}>
        <Link href="/" style={{ fontSize: 11, color: "#475569", textDecoration: "none" }}>
          &larr; Back to Platform
        </Link>
      </div>
    </nav>
  );
}
