/**
 * @bhavya/platform-ui — Sidebar
 *
 * Configurable sidebar navigation component.
 */

import React from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface SidebarProps {
  brand: string;
  items: SidebarItem[];
  footer?: React.ReactNode;
  collapsed?: boolean;
  width?: number;
}

export function Sidebar({
  brand,
  items,
  footer,
  collapsed = false,
  width = 260,
}: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? 64 : width,
        background: "#0f172a",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "auto",
        transition: "width 0.2s",
      }}
    >
      <div
        style={{
          padding: collapsed ? "16px 12px" : "16px 20px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>
          {collapsed ? brand.charAt(0) : brand}
        </span>
      </div>
      <nav style={{ flex: 1, padding: "8px 0" }}>
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? "10px 12px" : "10px 20px",
              color: item.active ? "#3b82f6" : "#94a3b8",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: item.active ? 600 : 400,
              background: item.active ? "rgba(59,130,246,0.1)" : "transparent",
              borderLeft: item.active
                ? "3px solid #3b82f6"
                : "3px solid transparent",
            }}
          >
            {item.icon && <span style={{ fontSize: 16 }}>{item.icon}</span>}
            {!collapsed && item.label}
          </a>
        ))}
      </nav>
      {footer && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid #1e293b" }}>
          {footer}
        </div>
      )}
    </aside>
  );
}
