"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/projects/new", label: "+ New Project" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: 220,
        background: "#fff",
        borderRight: "1px solid #e5e5e0",
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
      <div style={{ marginBottom: 24, padding: "0 8px" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0D503C" }}>
            Research
          </div>
          <div style={{ fontSize: 11, color: "#888" }}>Bhavya Foundation</div>
        </Link>
      </div>

      {NAV.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              padding: "7px 12px",
              borderRadius: 6,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#0D503C" : "#666",
              background: isActive ? "#f0f5f0" : "transparent",
            }}
          >
            {item.label}
          </Link>
        );
      })}

      <div
        style={{
          marginTop: "auto",
          padding: "16px 8px",
          borderTop: "1px solid #e5e5e0",
        }}
      >
        <Link
          href="/"
          style={{ fontSize: 11, color: "#aaa", textDecoration: "none" }}
        >
          &larr; Back to Platform
        </Link>
      </div>
    </nav>
  );
}
