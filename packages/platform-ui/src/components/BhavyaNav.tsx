"use client";

/**
 * Bhavya Navigation Component
 *
 * Canonical top navigation for all Bhavya Foundation apps.
 * Configurable via props, auth-aware, responsive (desktop + mobile).
 *
 * Usage:
 *   <BhavyaNav
 *     items={[{ label: "Courses", href: "/courses" }]}
 *     user={{ name: "Student", email: "student@ai-institute.com" }}
 *   />
 *
 * @module platform-ui/components/BhavyaNav
 */

import React, { useState, useEffect, useCallback } from "react";

// ───────────────────────────────────────────────────────────────────
// TYPES
// ───────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

export interface BhavyaNavUser {
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface BhavyaNavProps {
  /** Navigation items */
  items?: NavItem[];
  /** Current user (null = logged out) */
  user?: BhavyaNavUser | null;
  /** App name shown in logo area */
  appName?: string;
  /** Logo element (defaults to Bhavya mark) */
  logo?: React.ReactNode;
  /** Show search bar */
  showSearch?: boolean;
  /** Search callback */
  onSearch?: (query: string) => void;
  /** Active route (for highlighting) */
  activeRoute?: string;
  /** Custom CSS class */
  className?: string;
  /** Callback for nav item clicks */
  onNavigate?: (href: string) => void;
  /** Callback for sign in */
  onSignIn?: () => void;
  /** Callback for sign out */
  onSignOut?: () => void;
}

// ───────────────────────────────────────────────────────────────────
// DEFAULT ITEMS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Lab", href: "/courses/foundations/lab" },
  { label: "Knowledge", href: "/knowledge-graph" },
  { label: "Mentor", href: "/mentor" },
  { label: "Dashboard", href: "/dashboard" },
];

// ───────────────────────────────────────────────────────────────────
// BRAND TOKENS
// ───────────────────────────────────────────────────────────────────

const BRAND = {
  forest: "#1a3a2a",
  gold: "#c9a227",
  earth: "#8a7359",
  cream: "#f5f1e6",
  darkBg: "#0a0f0d",
  darkSurface: "#111916",
  darkBorder: "rgba(245,241,230,0.08)",
  textPrimary: "#f5f1e6",
  textSecondary: "#b8b0a0",
  textMuted: "#7a7268",
};

// ───────────────────────────────────────────────────────────────────
// COMPONENT
// ───────────────────────────────────────────────────────────────────

export function BhavyaNav({
  items = DEFAULT_ITEMS,
  user = null,
  appName = "Bhavya Foundation",
  logo,
  showSearch = true,
  onSearch,
  activeRoute,
  onNavigate,
  onSignIn,
  onSignOut,
}: BhavyaNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Track scroll position for backdrop blur effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      if (onNavigate) {
        onNavigate(href);
      } else if (typeof window !== "undefined") {
        window.location.href = href;
      }
    },
    [onNavigate],
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    },
    [onSearch, searchQuery],
  );

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: "-100px",
          left: "16px",
          background: BRAND.forest,
          color: BRAND.cream,
          padding: "8px 16px",
          borderRadius: "0 0 8px 8px",
          zIndex: 9999,
          fontSize: "14px",
          textDecoration: "none",
        }}
      >
        Skip to content
      </a>

      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          background: scrolled ? "rgba(10,15,13,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? BRAND.darkBorder : "transparent"}`,
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => handleNavClick("/")}
        >
          {logo ?? (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.earth})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
                color: BRAND.forest,
              }}
            >
              B
            </div>
          )}
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: BRAND.textPrimary,
              letterSpacing: "-0.01em",
            }}
          >
            {appName}
          </span>
        </div>

        {/* Desktop nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginLeft: "40px",
            flex: 1,
          }}
          className="bhavya-nav-desktop"
        >
          {items.map((item) => {
            const isActive =
              activeRoute === item.href ||
              activeRoute?.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? BRAND.gold : BRAND.textSecondary,
                  background: isActive ? `${BRAND.gold}12` : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = BRAND.textPrimary;
                    e.currentTarget.style.background = `${BRAND.cream}08`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = BRAND.textSecondary;
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: "10px",
                      background: BRAND.gold,
                      color: BRAND.forest,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right side: search + auth */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          {/* Search */}
          {showSearch && (
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: `1px solid ${BRAND.darkBorder}`,
                background: `${BRAND.cream}06`,
                transition: "border-color 0.15s ease",
              }}
              className="bhavya-nav-search"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={BRAND.textMuted}
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: BRAND.textPrimary,
                  fontSize: "14px",
                  outline: "none",
                  width: "120px",
                }}
              />
              <kbd
                style={{
                  fontSize: "11px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: `${BRAND.cream}10`,
                  color: BRAND.textMuted,
                  border: `1px solid ${BRAND.darkBorder}`,
                }}
              >
                /
              </kbd>
            </form>
          )}

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <a
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/dashboard");
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: BRAND.textSecondary,
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = BRAND.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = BRAND.textSecondary;
                }}
              >
                Dashboard
              </a>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.earth})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: BRAND.forest,
                  cursor: "pointer",
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                background: BRAND.gold,
                color: BRAND.forest,
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Sign In
            </button>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              padding: "8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: BRAND.textPrimary,
            }}
            className="bhavya-nav-mobile-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            bottom: 0,
            background: BRAND.darkSurface,
            zIndex: 999,
            padding: "24px",
            overflowY: "auto",
          }}
          className="bhavya-nav-mobile"
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {items.map((item) => {
              const isActive = activeRoute === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? BRAND.gold : BRAND.textSecondary,
                    background: isActive ? `${BRAND.gold}12` : "transparent",
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: "64px" }} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .bhavya-nav-desktop { display: none !important; }
          .bhavya-nav-search { display: none !important; }
          .bhavya-nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}

export default BhavyaNav;
