"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (typeof document !== "undefined") {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}

export function MobileMenu({ items, currentPath }: { items: { id: string; label: string; href: string }[]; currentPath: string }) {
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => currentPath === href;

  return (
    <>
      <button className="mobile-nav-btn" onClick={() => setOpen(true)} aria-label="Open navigation menu">
        <Menu />
      </button>
      {open && (
        <div className="mobile-nav-overlay open" onClick={() => setOpen(false)}>
          <nav className="mobile-nav-panel" onClick={(e) => e.stopPropagation()} aria-label="Mobile navigation">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`mobile-nav-link${isActive(item.href) ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              className="mobile-nav-btn mobile-nav-btn--close"
              onClick={() => setOpen(false)}
              style={{ alignSelf: "flex-end", marginTop: 8 }}
              aria-label="Close navigation menu"
            >
              <X />
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

export { ThemeToggle };
