/**
 * @bhavya/platform-ui — PageLayout
 *
 * Standard page layout with sidebar, header, and content area.
 */

import React from "react";
import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  brand: string;
  sidebarItems: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    active?: boolean;
  }[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  brand,
  sidebarItems,
  title,
  subtitle,
  actions,
  children,
}: PageLayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar brand={brand} items={sidebarItems} />
      <main style={{ flex: 1, padding: "32px 40px", background: "#0f172a" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#f8fafc",
                margin: 0,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
        {children}
      </main>
    </div>
  );
}
