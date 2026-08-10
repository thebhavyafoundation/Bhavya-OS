"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, ChevronRight } from "lucide-react";
import { BhavyaLogo } from "./BhavyaLogo";

const navLinks = [
  { label: "Forest", href: "/forest" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Heritage", href: "/heritage" },
  { label: "Community", href: "/community" },
];

interface SiteHeaderProps {
  activePillar?: string;
  variant?: "default" | "dark";
}

export function SiteHeader({ activePillar, variant = "default" }: SiteHeaderProps) {
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
      >
        <div className="site-nav-inner">
          <a href="/" className="nav-logo">
            <BhavyaLogo size="sm" />
            <div className="nav-logo-text">
              <span
                className="nav-logo-name"
                style={isDark ? { color: "var(--color-text-inverse)" } : undefined}
              >
                Bhavya
              </span>
              <span
                className="nav-logo-tagline"
                style={isDark ? { color: "var(--color-brand-gold)" } : undefined}
              >
                Nature. Knowledge. Heritage.
              </span>
            </div>
          </a>

          <div className="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  color:
                    activePillar === link.label.toLowerCase()
                      ? isDark
                        ? "var(--color-brand-gold)"
                        : "var(--color-brand-forest)"
                      : isDark
                        ? "rgba(247, 244, 236, 0.7)"
                        : undefined,
                }}
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
              <span>Search</span>
            </button>
            <a href="/app" className="nav-cta">
              My Bhavya
              <ChevronRight size={16} />
            </a>
            <button
              className="nav-mobile-trigger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

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
                {navLinks.map((link) => (
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
                  href="/app"
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bhavya
                </a>
                <a
                  href="/donate"
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
