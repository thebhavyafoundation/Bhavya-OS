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
  ArrowRight,
} from "lucide-react";
import { BhavyaLogo } from "./BhavyaLogo";

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

/* ============================================
   SIMPLIFIED PUBLIC NAV — per reference
   ============================================ */
const publicNavLinks = [
  { label: "About", href: "/about" },
  { label: "Missions", href: "/missions" },
  { label: "Our Work", href: "/programs" },
  { label: "Research", href: "/knowledge/research" },
  { label: "Get Involved", href: "/get-involved" },
];

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
                Foundation
              </span>
            </div>
          </a>

          {/* Desktop Navigation — simplified per reference */}
          <div className="nav-links">
            {publicNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                style={
                  isDark ? { color: "rgba(247, 244, 236, 0.7)" } : undefined
                }
              >
                {link.label}
              </a>
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
              href="/os"
              className="nav-cta nav-cta-os"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-full)",
                background: "var(--color-brand-forest)",
                color: "var(--color-text-inverse)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                textDecoration: "none",
                transition: "all var(--duration-normal) var(--ease-out)",
              }}
            >
              Enter Bhavya OS
              <ArrowRight size={14} />
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
                {publicNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="mobile-menu-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}

                <div className="mobile-menu-divider" />

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
                  Enter Bhavya OS
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
