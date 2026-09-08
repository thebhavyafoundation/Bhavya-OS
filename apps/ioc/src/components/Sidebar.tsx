"use client";

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

  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gold">IOC</h1>
        <p className="text-xs text-sage">Institution Operations Center</p>
      </div>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
                ? "bg-gray-800 text-white"
                : "text-sage hover:bg-gray-900 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
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
          <span>🏠</span>
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
  );
}
