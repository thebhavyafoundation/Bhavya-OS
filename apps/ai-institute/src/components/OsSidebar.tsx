"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Brain,
  Scale,
  Zap,
  FlaskConical,
  Settings,
  BookOpen,
  Users,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Eye,
  Network,
  Menu,
  X,
  TreePine,
  Landmark,
  Target,
  Globe,
  BarChart3,
  Shield,
  MessageSquare,
  Video,
  GraduationCap,
  HeartHandshake,
  Heart,
  Download,
  Library,
  Handshake,
  Mail,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { OS_ROLES, type Role } from "@/lib/roles";
import { getOsSections, type OsSection } from "@/lib/useNavigation";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Brain,
  Scale,
  Zap,
  FlaskConical,
  Settings,
  BookOpen,
  Users,
  FileText,
  Search,
  Terminal,
  Eye,
  Network,
  TreePine,
  Landmark,
  Target,
  Globe,
  BarChart3,
  Shield,
  MessageSquare,
  Video,
  GraduationCap,
  HeartHandshake,
  Heart,
  Download,
  Library,
  Handshake,
  Mail,
};

export function OsSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const userRole = (user?.role || "student") as Role;
  const hasOsAccess = OS_ROLES.includes(userRole);

  // Get OS sections from canonical registry, filtered by user roles
  const sections = getOsSections([userRole]);

  const isActive = (href: string) => {
    if (href === "/os") return pathname === "/os";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(10, 31, 26, 0.95)" }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "var(--space-5) var(--space-4)",
          borderBottom: "1px solid rgba(247, 244, 236, 0.06)",
        }}
      >
        <Link
          href="/os"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "var(--radius-md)",
              background:
                "linear-gradient(135deg, var(--color-brand-gold), var(--color-brand-earth))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: "10px",
                letterSpacing: "0.05em",
              }}
            >
              OS
            </span>
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-inverse)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Bhavya OS
              </div>
              <div
                style={{
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgba(247, 244, 236, 0.4)",
                }}
              >
                Institutional Operations
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "var(--space-3)" }}>
        {!hasOsAccess ? (
          <div
            style={{
              padding: "var(--space-6) var(--space-4)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "rgba(247, 244, 236, 0.4)",
              }}
            >
              You don&apos;t have access to Bhavya OS.
            </p>
          </div>
        ) : (
          sections.map((section) => {
            if (section.items.length === 0) return null;
            return (
              <div key={section.id} style={{ marginBottom: "var(--space-4)" }}>
                {!collapsed && (
                  <div
                    style={{
                      padding: "0 var(--space-2)",
                      marginBottom: "var(--space-1)",
                      fontSize: "9px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "rgba(247, 244, 236, 0.3)",
                    }}
                  >
                    {section.label}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1px",
                  }}
                >
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    const ItemIcon = iconMap[item.icon] || Target;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-2)",
                          padding: "var(--space-2) var(--space-3)",
                          borderRadius: "var(--radius-md)",
                          fontSize: "13px",
                          fontWeight: 500,
                          textDecoration: "none",
                          background: active
                            ? "rgba(212, 175, 55, 0.1)"
                            : "transparent",
                          color: active
                            ? "var(--color-text-inverse)"
                            : "rgba(247, 244, 236, 0.5)",
                          border: active
                            ? "1px solid rgba(212, 175, 55, 0.2)"
                            : "1px solid transparent",
                          transition: "all var(--duration-fast) ease",
                        }}
                        title={collapsed ? item.label : undefined}
                      >
                        <ItemIcon
                          className={`w-4 h-4 shrink-0 ${active ? "text-accent-gold" : ""}`}
                        />
                        {!collapsed && (
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "var(--space-3)",
          borderTop: "1px solid rgba(247, 244, 236, 0.06)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            color: "rgba(247, 244, 236, 0.4)",
            textDecoration: "none",
            transition: "all var(--duration-fast) ease",
          }}
        >
          <ChevronLeft
            style={{ width: "16px", height: "16px", flexShrink: 0 }}
          />
          {!collapsed && <span>Back to Bhavya</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        style={{
          display: "none",
          position: "fixed",
          top: "var(--space-3)",
          left: "var(--space-3)",
          zIndex: 50,
          padding: "var(--space-2)",
          borderRadius: "var(--radius-md)",
          background: "rgba(10, 31, 26, 0.9)",
          border: "1px solid rgba(247, 244, 236, 0.1)",
          color: "var(--color-text-inverse)",
          cursor: "pointer",
        }}
        className="lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle OS navigation"
      >
        {mobileOpen ? (
          <X style={{ width: "20px", height: "20px" }} />
        ) : (
          <Menu style={{ width: "20px", height: "20px" }} />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          width: "256px",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 200ms ease",
        }}
        className="lg:hidden"
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          width: collapsed ? "64px" : "256px",
          borderRight: "1px solid rgba(247, 244, 236, 0.06)",
          transition: "width 200ms ease",
        }}
        className="hidden lg:flex"
      >
        {sidebarContent}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            top: "20px",
            right: "-12px",
            width: "24px",
            height: "24px",
            borderRadius: "var(--radius-full)",
            background: "rgba(10, 31, 26, 0.9)",
            border: "1px solid rgba(247, 244, 236, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(247, 244, 236, 0.4)",
            cursor: "pointer",
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight style={{ width: "12px", height: "12px" }} />
          ) : (
            <ChevronLeft style={{ width: "12px", height: "12px" }} />
          )}
        </button>
      </aside>
    </>
  );
}
