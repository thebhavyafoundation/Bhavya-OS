"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "🏛️" },
  { href: "/okr", label: "OKRs", icon: "📊" },
  { href: "/production", label: "Production", icon: "🏭" },
  { href: "/risks", label: "Risks", icon: "⚠️" },
  { href: "/actions", label: "Actions", icon: "✅" },
  { href: "/health", label: "Health", icon: "🏥" },
  { href: "/reviews", label: "Reviews", icon: "📝" },
  { href: "/events", label: "Events", icon: "📡" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, close]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="sidebar-nav"
        className="ioc-mobile-toggle"
      >
        {isOpen ? "✕" : "☰"}
      </button>
      {isOpen && <div className="ioc-sidebar-overlay" onClick={close} />}
      <aside
        id="sidebar-nav"
        className={`w-64 bg-gray-950 border-r border-gray-800 min-h-screen p-4 flex flex-col ioc-sidebar ${isOpen ? "ioc-sidebar-open" : ""}`}
      >
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gold">IOC</h1>
          <p className="text-xs text-sage">Institution Operations Center</p>
        </div>
        <nav aria-label="IOC navigation" className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  ? "bg-gray-800 text-white"
                  : "text-sage hover:bg-gray-900 hover:text-white"
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        {/* Institutional Return Path */}
        <div className="mt-auto pt-4 border-t border-gray-800 space-y-1">
          <Link
            href="/os"
            className="flex items-center gap-3 px-3 py-2 rounded text-sm text-sage hover:bg-gray-900 hover:text-white transition"
          >
            <span aria-hidden="true">🏠</span>
            <span>Bhavya OS</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded text-xs text-gray-600 hover:text-sage transition"
          >
            <span>Bhavya Foundation</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
