"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard", icon: "\u{1F3DB}" },
  { href: "/missions", label: "Missions", icon: "\u{1F30D}" },
  { href: "/missions/new", label: "+ New Mission", icon: "\u2795" },
  { href: "/assets", label: "Assets", icon: "\u{1F3F0}" },
  { href: "/assessments", label: "Assessments", icon: "\u{1F50D}" },
  { href: "/conservation", label: "Conservation", icon: "\u{1F6E1}" },
  { href: "/impact", label: "Impact", icon: "\u{1F4C8}" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav style={{
      width: 240, background: "#0f0a05", borderRight: "1px solid #2a1f10",
      padding: "24px 16px", display: "flex", flexDirection: "column",
      gap: 4, position: "sticky", top: 0, height: "100vh", overflowY: "auto",
    }}>
      <div style={{ marginBottom: 24, padding: "0 8px" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#c9a84c" }}>Heritage</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Bhavya Foundation</div>
        </Link>
      </div>

      {NAV.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", borderRadius: 8,
              textDecoration: "none", fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#c9a84c" : "#94a3b8",
              background: isActive ? "rgba(201,168,76,0.08)" : "transparent",
              transition: "all 0.15s",
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}

      <div style={{ marginTop: "auto", padding: "16px 8px", borderTop: "1px solid #2a1f10" }}>
        <Link href="/" style={{ fontSize: 11, color: "#475569", textDecoration: "none" }}>
          &larr; Back to Platform
        </Link>
      </div>
    </nav>
  );
}
