"use client";

import { useState, useEffect } from "react";

export function AdminHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as "light" | "dark" | null;
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (preferDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("admin-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <header
      className="h-14 border-b flex items-center justify-between px-6"
      style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-surface)" }}
      role="banner"
    >
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>
          Internal Administration
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded text-sm border transition-colors"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-secondary)" }}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
          style={{ backgroundColor: "var(--admin-primary)" }}
          aria-label="Admin user"
        >
          A
        </div>
      </div>
    </header>
  );
}
