"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

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
    <header className="h-14 border-b border-border-primary bg-bg-secondary flex items-center justify-between px-6" role="banner">
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary">Internal Administration</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md border border-border-primary text-text-secondary hover:bg-bg-tertiary transition-colors"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center text-xs font-medium text-white" aria-label="Admin user">
          A
        </div>
      </div>
    </header>
  );
}
