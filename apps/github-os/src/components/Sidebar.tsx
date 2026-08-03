"use client";

import { useState } from "react";
import {
  Home,
  FolderGit2,
  Brain,
  Wrench,
  BookOpen,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap,
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
    children: [
      { label: "All Repositories", href: "/repositories" },
      { label: "Starred", href: "/repositories/starred" },
    ],
  },
  {
    label: "Intelligence",
    icon: <Brain size={18} />,
    children: [
      { label: "Knowledge Base", href: "/knowledge" },
      { label: "Technology Radar", href: "/radar" },
      { label: "Recommendations", href: "/recommendations" },
    ],
  },
  {
    label: "Engineering",
    icon: <Wrench size={18} />,
    children: [
      { label: "Issues", href: "/issues" },
      { label: "Pull Requests", href: "/pull-requests" },
      { label: "Releases", href: "/releases" },
    ],
  },
  {
    label: "Automation",
    icon: <Zap size={18} />,
    children: [
      { label: "Workflows", href: "/workflows" },
      { label: "MCP Servers", href: "/mcp" },
      { label: "Actions Library", href: "/actions" },
    ],
  },
  {
    label: "Learning",
    icon: <BookOpen size={18} />,
    children: [
      { label: "Learning Paths", href: "/learning" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    label: "Analytics",
    icon: <BarChart3 size={18} />,
    children: [
      { label: "Engineering Metrics", href: "/analytics" },
      { label: "Team Performance", href: "/analytics/teams" },
    ],
  },
  { label: "Settings", icon: <Settings size={18} />, href: "/settings" },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Intelligence: true,
    Engineering: true,
  });

  return (
    <aside className="w-[240px] bg-[#111111] border-r border-[#27272a] h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-5 border-b border-[#27272a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <div>
            <div className="text-sm font-semibold text-[#fafafa]">
              GitHub OS
            </div>
            <div className="text-[11px] text-[#71717a]">
              Engineering Workspace
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() =>
                    setExpanded((p) => ({ ...p, [item.label]: !p[item.label] }))
                  }
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#1a1a1a] rounded-md transition-colors"
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {expanded[item.label] ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {expanded[item.label] && (
                  <div className="ml-4 mt-1">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-1.5 text-[13px] text-[#71717a] hover:text-[#fafafa] hover:bg-[#1a1a1a] rounded-md transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <a
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#1a1a1a] rounded-md transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            )}
          </div>
        ))}
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
