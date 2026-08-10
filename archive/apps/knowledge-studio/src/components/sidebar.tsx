"use client";

import { usePathname } from "next/navigation";

const NAV = [
  { id: "home", label: "Home", href: "/" },
  { id: "ingest", label: "Ingest", href: "/ingest" },
  { id: "pipelines", label: "Pipelines", href: "/pipelines" },
  { id: "artifacts", label: "Artifacts", href: "/artifacts" },
  { id: "packages", label: "Packages", href: "/packages" },
];

export function Sidebar({ active }: { active?: string }) {
  const pathname = usePathname();
  const current = active || NAV.find((n) => n.href === pathname)?.id || "home";

  return (
    <nav
      style={{
        width: "220px",
        background: "#111",
        borderRight: "1px solid #262626",
        padding: "1.5rem 0",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div style={{ padding: "0 1rem", marginBottom: "2rem" }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#e5e5e5" }}>
          Knowledge Studio
        </div>
        <div
          style={{ fontSize: "0.7rem", color: "#737373", marginTop: "0.25rem" }}
        >
          Bhavya AI Lab OS
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: "0 0.5rem",
        }}
      >
        {NAV.map((item) => (
          <a
            key={item.id}
            href={item.href}
            style={{
              display: "block",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.85rem",
              color: current === item.id ? "#fff" : "#a3a3a3",
              background: current === item.id ? "#262626" : "transparent",
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
      <div style={{ marginTop: "auto", padding: "0 1rem" }}>
        <div
          style={{
            fontSize: "0.7rem",
            color: "#525252",
            borderTop: "1px solid #262626",
            paddingTop: "1rem",
          }}
        >
          BEE Engine v0.2 — Production Loop
        </div>
      </div>
    </nav>
  );
}
