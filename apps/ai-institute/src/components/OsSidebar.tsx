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
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { OS_ROLES, type Role } from "@/lib/roles";

interface OsNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
  roles?: Role[];
}

const osNavItems: OsNavItem[] = [
  // Institution
  { id: "overview", label: "Overview", href: "/os", icon: LayoutDashboard, section: "Institution" },
  { id: "knowledge", label: "Knowledge", href: "/os/knowledge", icon: Brain, section: "Institution" },
  { id: "forest", label: "Forest", href: "/os/forest", icon: TreePine, section: "Institution" },
  { id: "governance", label: "Governance", href: "/os/governance", icon: Scale, section: "Institution" },
  { id: "memory", label: "Memory", href: "/os/memory", icon: FileText, section: "Institution" },

  // Operations
  { id: "runtime", label: "Runtime", href: "/os/runtime", icon: Zap, section: "Operations" },
  { id: "observability", label: "Observability", href: "/os/observability", icon: Eye, section: "Operations" },
  { id: "api-explorer", label: "API Explorer", href: "/os/api-explorer", icon: Terminal, section: "Operations" },

  // Studio
  { id: "studio", label: "Studio", href: "/studio", icon: FlaskConical, section: "Content", roles: ["educator", "instructor", "admin"] },

  // Administration
  { id: "admin", label: "Admin", href: "/os/admin", icon: Settings, section: "Administration", roles: ["admin"] },
  { id: "docs", label: "Docs", href: "/os/docs", icon: BookOpen, section: "Administration" },
  { id: "github", label: "GitHub", href: "/os/github", icon: Network, section: "Administration" },
];

const sections = ["Institution", "Operations", "Content", "Administration"];

export function OsSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  // Get user's role, default to student
  const userRole = (user?.role || "student") as Role;
  const hasOsAccess = OS_ROLES.includes(userRole);

  // Filter nav items by role
  const filteredNavItems = osNavItems.filter((item) => {
    if (!item.roles) return true; // No role restriction
    return item.roles.includes(userRole);
  });

  const isActive = (href: string) => {
    if (href === "/os") return pathname === "/os";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-border-primary">
        <Link href="/os" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-gold to-accent-earth flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs tracking-tight">OS</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold text-text-primary tracking-tight truncate">
                Bhavya OS
              </div>
              <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                Institutional Operations
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {!hasOsAccess ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-text-muted">
              You don&apos;t have access to Bhavya OS. Contact an administrator
              to request access.
            </p>
          </div>
        ) : (
          sections.map((section) => {
            const items = filteredNavItems.filter((item) => item.section === section);
            if (items.length === 0) return null;
            return (
              <div key={section}>
                {!collapsed && (
                  <div className="px-2 mb-1.5 text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                    {section}
                  </div>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
                          active
                            ? "bg-accent-gold/10 text-text-primary border border-accent-gold/20"
                            : "text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary border border-transparent"
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-accent-gold" : ""}`} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
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
      <div className="px-3 py-3 border-t border-border-primary">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary transition-colors"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
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
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-bg-secondary border border-border-primary text-text-secondary hover:text-text-primary transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle OS navigation"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-bg-secondary border-r border-border-primary transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col bg-bg-secondary border-r border-border-primary transition-all duration-200 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarContent}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-bg-secondary border border-border-primary flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>
    </>
  );
}
