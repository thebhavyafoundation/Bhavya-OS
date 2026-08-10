"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_SECTIONS = [
  {
    label: "Core",
    items: [
      { icon: "🏠", label: "Home", href: "/" },
      { icon: "📚", label: "Knowledge", href: "/knowledge" },
      { icon: "🎓", label: "Courses", href: "/courses" },
      { icon: "📖", label: "Lessons", href: "/lessons" },
      { icon: "🎥", label: "Videos", href: "/videos" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: "⚡", label: "Runtime", href: "/runtime" },
      { icon: "🛰", label: "Observability", href: "/observability" },
      { icon: "🔍", label: "Search", href: "/search" },
      { icon: "🔌", label: "API Explorer", href: "/api-explorer" },
    ],
  },
  {
    label: "Domains",
    items: [
      { icon: "🌳", label: "Forest", href: "/forest" },
      { icon: "🏛", label: "Heritage", href: "/heritage" },
      { icon: "🙋", label: "Volunteers", href: "/volunteers" },
      { icon: "⚖️", label: "Governance", href: "/governance" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: "📝", label: "Playbooks", href: "/playbooks" },
      { icon: "🗂", label: "Projects", href: "/projects" },
      { icon: "🔬", label: "Research", href: "/research" },
      { icon: "🧠", label: "Memory", href: "/memory" },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: collapsed ? 56 : 240,
        background: "rgba(9, 9, 11, 0.95)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(63, 63, 70, 0.5)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: collapsed ? "20px 12px" : "20px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(63, 63, 70, 0.3)",
          minHeight: 64,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 6px #22c55e",
            flexShrink: 0,
          }}
        />
        {!collapsed && (
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "0.05em",
              fontFamily: "monospace",
            }}
          >
            AI LAB
          </span>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: collapsed ? "12px 8px" : "16px 12px",
        }}
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 20 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#52525b",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "0 8px",
                  marginBottom: 6,
                }}
              >
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "8px 0" : "8px 12px",
                    borderRadius: 8,
                    background: isActive
                      ? "rgba(255, 255, 255, 0.06)"
                      : "transparent",
                    color: isActive ? "#fafafa" : "#a1a1aa",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: isActive ? 500 : 400,
                    transition: "background 0.15s, color 0.15s",
                    justifyContent: collapsed ? "center" : "flex-start",
                    marginBottom: 2,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.04)";
                      e.currentTarget.style.color = "#d4d4d8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#a1a1aa";
                    }
                  }}
                >
                  <span
                    style={{ fontSize: 16, width: 20, textAlign: "center" }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom controls */}
      <div
        style={{
          padding: collapsed ? "12px 8px" : "12px 16px",
          borderTop: "1px solid rgba(63, 63, 70, 0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {!collapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px",
              borderRadius: 6,
              background: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <span style={{ fontSize: 12, color: "#52525b" }}>Search</span>
            <span
              style={{
                fontSize: 11,
                color: "#52525b",
                background: "rgba(255, 255, 255, 0.06)",
                padding: "2px 6px",
                borderRadius: 4,
                fontFamily: "monospace",
              }}
            >
              ⌘K
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            borderRadius: 8,
            background: "transparent",
            border: "1px solid rgba(63, 63, 70, 0.4)",
            color: "#71717a",
            cursor: "pointer",
            fontSize: 14,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            e.currentTarget.style.color = "#d4d4d8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#71717a";
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
    </div>
  );
}
