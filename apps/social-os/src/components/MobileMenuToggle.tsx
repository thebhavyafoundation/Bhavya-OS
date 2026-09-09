"use client";

import { useState, useEffect, useCallback } from "react";

export default function MobileMenuToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        sidebar.setAttribute('data-open', String(next));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar) sidebar.setAttribute('data-open', 'false');
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <button
      onClick={toggle}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
      aria-controls="sidebar-nav"
      className="mobile-menu-toggle"
      style={{
        display: "none",
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 1001,
        background: "var(--color-sidebar-bg)",
        border: "1px solid var(--color-sidebar-border)",
        borderRadius: 6,
        padding: "8px 12px",
        color: "var(--color-sidebar-text)",
        cursor: "pointer",
        fontSize: 18,
      }}
    >
      {isOpen ? "✕" : "☰"}
    </button>
  );
}
