"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderGit2,
  Globe,
  Dna,
  Radar,
  BookOpen,
  GitCompare,
  Network,
  Lightbulb,
  HeartPulse,
  Shield,
  FileSearch,
  Hammer,
  GraduationCap,
  Users,
  FileText,
  Leaf,
  Brain,
  History,
  ChevronDown,
  ChevronRight,
  Search,
  Command,
} from "lucide-react";
import { Avatar } from "@bhavya/platform-ui";
import { useState } from "react";

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
}

const navGroups: NavGroup[] = [
  {
    label: "RESEARCH",
    items: [
      { label: "Repositories", icon: FolderGit2, href: "/repositories" },
      { label: "Websites", icon: Globe, href: "/websites" },
      { label: "Design Genome", icon: Dna, href: "/design-genome" },
      { label: "Technology Radar", icon: Radar, href: "/knowledge" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { label: "Knowledge", icon: BookOpen, href: "/knowledge" },
      { label: "Patterns", icon: Lightbulb, href: "/patterns" },
      { label: "Comparisons", icon: GitCompare, href: "/comparisons" },
      { label: "Knowledge Graph", icon: Network, href: "/knowledge-graph" },
      { label: "Recommendations", icon: FileText, href: "/knowledge" },
    ],
  },
  {
    label: "ENGINEERING",
    items: [
      { label: "Architecture", icon: Hammer, href: "/repositories" },
      { label: "Health", icon: HeartPulse, href: "/repositories" },
      { label: "Technical Debt", icon: Shield, href: "/repositories" },
      { label: "Reviews", icon: FileSearch, href: "/repositories" },
      { label: "Fitness", icon: HeartPulse, href: "/repositories" },
      { label: "Blueprints", icon: Hammer, href: "/repositories" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { label: "Learning Paths", icon: GraduationCap, href: "/learning" },
      { label: "Student Mode", icon: Users, href: "/repositories" },
      { label: "Educational Exports", icon: FileText, href: "/educational" },
    ],
  },
  {
    label: "BHAVYA",
    items: [
      { label: "Workbench", icon: Hammer, href: "/workbench" },
      { label: "Bhavya Relevance", icon: Leaf, href: "/design-genome" },
      { label: "Institutional Memory", icon: Brain, href: "/repositories" },
      { label: "Evolution", icon: History, href: "/elite" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className="w-[240px] h-screen fixed left-0 top-0 flex flex-col"
      style={{
        background: "var(--color-surface-forest)",
        borderRight: "1px solid var(--color-border-primary)",
      }}
    >
      {/* Brand */}
      <div
        className="p-5"
        style={{ borderBottom: "1px solid var(--color-border-primary)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent-green), var(--color-accent-gold))",
              color: "var(--color-text-inverse)",
            }}
          >
            B
          </div>
          <div>
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-inverse)" }}
            >
              Bhavya OS
            </div>
            <div
              className="text-[11px]"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Design & Web Intelligence
            </div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors"
          style={{
            color: "var(--color-text-tertiary)",
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search...</span>
          <kbd
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{
              color: "var(--color-text-muted)",
              background: "var(--color-bg-secondary)",
            }}
          >
            <Command size={10} className="inline" /> K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-3">
        {navGroups.map((group) => {
          const isCollapsed = collapsed[group.label] === true;
          return (
            <div key={group.label} className="mb-2">
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase transition-colors"
                style={{ color: "var(--color-text-muted)" }}
              >
                {group.label}
                {isCollapsed ? (
                  <ChevronRight size={10} />
                ) : (
                  <ChevronDown size={10} />
                )}
              </button>
              {!isCollapsed &&
                group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-1.5 text-sm rounded-md transition-colors"
                      style={{
                        color: isActive
                          ? "var(--color-text-inverse)"
                          : "var(--color-text-tertiary)",
                        background: isActive
                          ? "var(--color-bg-primary)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color =
                            "var(--color-text-inverse)";
                          e.currentTarget.style.background =
                            "var(--color-bg-primary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color =
                            "var(--color-text-tertiary)";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </nav>

      {/* Footer — Institutional Return Path */}
      <div
        className="p-4 space-y-2"
        style={{ borderTop: "1px solid var(--color-border-primary)" }}
      >
        <Link
          href="/os"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors"
          style={{
            color: "var(--color-text-tertiary)",
            background: "var(--color-bg-primary)",
          }}
        >
          <Home size={14} />
          <span>Bhavya OS</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span className="text-[11px]">Bhavya Foundation</span>
        </Link>
      </div>
    </aside>
  );
}
