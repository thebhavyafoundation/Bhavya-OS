"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BhavyaLogo } from "./BhavyaLogo";

const navItems = [
  { label: "Mission", href: "/mission" },
  { label: "Academy", href: "/academy" },
  { label: "Knowledge", href: "/knowledge-graph" },
  { label: "Research", href: "/research" },
  { label: "Community", href: "/community" },
  { label: "Transparency", href: "/transparency" },
  { label: "About", href: "/about" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, close]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--color-text-primary)",
          padding: "var(--space-2)",
        }}
        className="mobile-menu-trigger"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.4)",
                zIndex: 90,
              }}
              aria-hidden="true"
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(320px, 85vw)",
                background: "var(--color-surface)",
                borderLeft: "1px solid var(--color-border-primary)",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                padding: "var(--space-6)",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--space-8)",
                }}
              >
                <BhavyaLogo size="sm" />
                <button
                  onClick={close}
                  aria-label="Close navigation menu"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    padding: "var(--space-2)",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    style={{
                      display: "block",
                      padding: "var(--space-3) var(--space-4)",
                      fontSize: "var(--text-base)",
                      color: "var(--color-text-primary)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: 500,
                      transition: "background var(--duration-fast) ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-bg-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "var(--space-6)",
                  borderTop: "1px solid var(--color-border-primary)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                <a
                  href="/app"
                  onClick={close}
                  style={{
                    display: "block",
                    padding: "var(--space-3) var(--space-4)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  My Bhavya
                </a>
                <a
                  href="/login"
                  onClick={close}
                  style={{
                    display: "block",
                    padding: "var(--space-3) var(--space-4)",
                    fontSize: "var(--text-sm)",
                    background: "var(--color-accent-green)",
                    color: "var(--color-text-inverse)",
                    textDecoration: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Start Learning
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
