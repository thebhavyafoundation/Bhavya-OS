"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderGit2,
  BookOpen,
  GraduationCap,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  Command,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <Home size={18} />, href: "/" },
  {
    label: "Repositories",
    icon: <FolderGit2 size={18} />,
    href: "/repositories",
  },
  { label: "Knowledge", icon: <BookOpen size={18} />, href: "/knowledge" },
  { label: "Learning", icon: <GraduationCap size={18} />, href: "/learning" },
  { label: "Settings", icon: <Settings size={18} />, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <aside className="w-[240px] bg-[#111111] border-r border-[#27272a] h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-5 border-b border-[#27272a]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <div>
            <div className="text-sm font-semibold text-[#fafafa]">
              GitHub OS
            </div>
            <div className="text-[11px] text-[#71717a]">Engineering Mentor</div>
          </div>
        </Link>
      </div>

      <div className="px-3 py-3">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#71717a] bg-[#1a1a1a] border border-[#27272a] rounded-md hover:border-[#3f3f46] transition-colors"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="text-[10px] text-[#52525b] bg-[#27272a] px-1.5 py-0.5 rounded">
            <Command size={10} className="inline" /> K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-3">
        {navItems.map((item) => {
          const isActive = item.href
            ? pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))
            : false;

          return (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#1a1a1a] rounded-md transition-colors">
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight size={14} />
                  </button>
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "text-[#fafafa] bg-[#1a1a1a]"
                      : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#1a1a1a]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center text-[#a1a1aa] text-sm">
            BV
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[#fafafa] truncate">
              Bhavya Foundation
            </div>
            <div className="text-[11px] text-[#71717a]">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
