"use client";

import { useState, useEffect, useRef } from "react";
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

  const navGroups = getPublicNavGroups();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  const isDark = variant === "dark";

  const handleDropdownEnter = (groupId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(groupId);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

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
      >
        <div className="site-nav-inner">
          <a href="/" className="nav-logo">
            <BhavyaLogo size="sm" />
            <div className="nav-logo-text">
              <span
                className="nav-logo-name"
                style={
                  isDark ? { color: "var(--color-text-inverse)" } : undefined
                }
              >
                Bhavya
              </span>
              <span
                className="nav-logo-tagline"
                style={
                  isDark ? { color: "var(--color-brand-gold)" } : undefined
                }
              >
                Nature. Knowledge. Heritage.
              </span>
            </div>
          </a>

          {/* Desktop Dropdown Navigation */}
          <div className="nav-links">
            {navGroups.map((group) => {
              const Icon = iconMap[group.items[0]?.icon] || Target;
              return (
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
                    style={{
                      color: isDark ? "rgba(247, 244, 236, 0.7)" : undefined,
                    }}
                  >
                    {group.label}
                    <ChevronDown
                      size={12}
                      className={`nav-dropdown-arrow ${
                        activeDropdown === group.id ? "rotated" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === group.id && (
                      <motion.div
                        className="nav-dropdown-menu"
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
                              <ItemIcon className="nav-dropdown-item-icon" />
                              <div className="nav-dropdown-item-content">
                                <span className="nav-dropdown-item-label">
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="nav-dropdown-item-desc">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </a>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
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
              <span>Search</span>
            </button>
            <a href="/login" className="nav-cta nav-cta-secondary">
              Sign In
            </a>
            <a href="/app" className="nav-cta">
              My Bhavya
              <ChevronRight size={16} />
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
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
                    {group.items.map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        className="mobile-menu-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ))}

                <div className="mobile-menu-divider" />

                <a
                  href="/app"
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bhavya
                </a>
                <a
                  href="/login"
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="mobile-menu-link mobile-menu-cta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
