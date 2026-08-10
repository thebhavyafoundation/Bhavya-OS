"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderGit2,
  BookOpen,
  GraduationCap,
  Settings,
  Search,
  Command,
} from "lucide-react";
import { Avatar } from "@bhavya/platform-ui";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Repositories", icon: FolderGit2, href: "/repositories" },
  { label: "Knowledge", icon: BookOpen, href: "/knowledge" },
  { label: "Learning", icon: GraduationCap, href: "/learning" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-bg-secondary border-r border-border-primary h-screen fixed left-0 top-0 flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-border-primary">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">
              GitHub OS
            </div>
            <div className="text-[11px] text-text-tertiary">
              Engineering Mentor
            </div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary bg-bg-tertiary border border-border-primary rounded-md hover:border-border-secondary transition-colors">
          <Search size={14} />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="text-[10px] text-text-muted bg-bg-hover px-1.5 py-0.5 rounded">
            <Command size={10} className="inline" /> K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
                ${
                  isActive
                    ? "text-text-primary bg-bg-tertiary"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-primary">
        <div className="flex items-center gap-3">
          <Avatar name="Bhavya Foundation" size="md" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text-primary truncate">
              Bhavya Foundation
            </div>
            <div className="text-[11px] text-text-tertiary">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
