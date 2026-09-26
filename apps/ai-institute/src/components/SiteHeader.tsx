"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  TreePine,
  Brain,
  Landmark,
  HeartHandshake,
  Target,
  BookOpen,
  FlaskConical,
  Library,
  Download,
  Users,
  GraduationCap,
  Handshake,
  Heart,
  Eye,
  Scale,
  FileText,
  BarChart3,
  Mail,
  ArrowRight,
} from "lucide-react";
import { BhavyaLogo } from "./BhavyaLogo";
import { getPublicNavGroups, type NavGroup } from "@/lib/useNavigation";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TreePine,
  Brain,
  Landmark,
  HeartHandshake,
  Target,
  BookOpen,
  FlaskConical,
  Library,
  Download,
  Users,
  GraduationCap,
  Handshake,
  Heart,
  Eye,
  Scale,
  FileText,
  BarChart3,
  Mail,
};

interface SiteHeaderProps {
  activePillar?: string;
  variant?: "default" | "dark";
}

export function SiteHeader({
  activePillar,
  variant = "default",
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Read navigation groups from canonical registry
  const navGroups = getPublicNavGroups();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleDropdownEnter = useCallback((groupId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(groupId);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  const isDark = variant === "dark";

  return (
    <>
      <nav
        className={`site-nav ${scrolled ? "scrolled" : ""}`}
        style={
          isDark
            ? {
                background: "rgba(14, 56, 46, 0.85)",
                borderBottomColor: "rgba(247, 244, 236, 0.1)",
              }
            : undefined
        }
        aria-label="Primary navigation"
      >
        <div className="site-nav-inner">
          <BhavyaLogo size="sm" variant={isDark ? "dark" : "light"} />

          {/* Desktop Navigation — dropdown groups from registry */}
          <div className="nav-links">
            {navGroups.map((group) => (
              <div
                key={group.id}
                className="nav-dropdown"
                onMouseEnter={() => handleDropdownEnter(group.id)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className="nav-link nav-dropdown-trigger"
                  aria-expanded={activeDropdown === group.id}
                  aria-haspopup="true"
                  aria-controls={`menu-${group.id}`}
                  style={
                    isDark ? { color: "rgba(247, 244, 236, 0.7)" } : undefined
                  }
                >
                  {group.label}
                  <ChevronDown
                    size={12}
                    style={{
                      display: "inline-block",
                      marginLeft: "4px",
                      transition: "transform 150ms ease",
                      transform:
                        activeDropdown === group.id
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </button>
                <AnimatePresence>
                  {activeDropdown === group.id && (
                    <motion.div
                      id={`menu-${group.id}`}
                      className="nav-dropdown-menu"
                      role="menu"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      {group.items.map((item) => {
                        const ItemIcon = iconMap[item.icon] || Target;
                        return (
                          <a
                            key={item.id}
                            href={item.href}
                            className="nav-dropdown-item"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <ItemIcon className="w-4 h-4 shrink-0 text-text-muted" />
                            <div>
                              <div style={{ fontWeight: 500 }}>
                                {item.label}
                              </div>
                              {item.description && (
                                <div
                                  style={{
                                    fontSize: "var(--text-xs)",
                                    opacity: 0.6,
                                    marginTop: "2px",
                                  }}
                                >
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="nav-actions">
            <button
              className="nav-search"
              style={
                isDark
                  ? {
                      background: "rgba(247, 244, 236, 0.1)",
                      borderColor: "rgba(247, 244, 236, 0.15)",
                      color: "rgba(247, 244, 236, 0.7)",
                    }
                  : undefined
              }
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            <a
              href="/donate"
              className="nav-cta nav-cta-support"
              aria-label="Support our work"
            >
              Support Our Work
              <ArrowRight size={12} aria-hidden="true" />
            </a>
            <a
              href="/os"
              className="nav-cta nav-cta-os"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-full)",
                background: "transparent",
                border: "1px solid var(--color-border-primary)",
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.02em",
                textDecoration: "none",
                transition: "all var(--duration-normal) var(--ease-out)",
              }}
            >
              Bhavya OS
              <ArrowRight size={12} />
            </a>
            <button
              className="nav-mobile-trigger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-menu-header">
                <BhavyaLogo size="sm" />
                <button
                  className="mobile-menu-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-menu-nav">
                {navGroups.map((group) => (
                  <div key={group.id} className="mobile-menu-group">
                    <div className="mobile-menu-group-label">{group.label}</div>
                    {group.items.map((item) => {
                      const ItemIcon = iconMap[item.icon] || Target;
                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          className="mobile-menu-link"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ItemIcon className="w-4 h-4 text-text-muted" />
                          {item.label}
                        </a>
                      );
                    })}
                  </div>
                ))}

                <div className="mobile-menu-divider" />

                <a
                  href="/donate"
                  className="mobile-menu-link mobile-menu-cta"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    color: "var(--color-accent-gold)",
                  }}
                >
                  Support Our Work
                  <ArrowRight size={14} />
                </a>
                <a
                  href="/os"
                  className="mobile-menu-link mobile-menu-cta"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  Bhavya OS
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
