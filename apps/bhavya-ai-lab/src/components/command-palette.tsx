"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface CommandItem {
  id: string;
  icon: string;
  label: string;
  description?: string;
  type: "page" | "knowledge" | "document" | "action";
  href?: string;
}

const ALL_ITEMS: CommandItem[] = [
  // Pages
  {
    id: "home",
    icon: "🏠",
    label: "Home",
    description: "Dashboard overview",
    type: "page",
    href: "/",
  },
  {
    id: "knowledge",
    icon: "📚",
    label: "Knowledge",
    description: "Knowledge objects",
    type: "page",
    href: "/knowledge",
  },
  {
    id: "courses",
    icon: "🎓",
    label: "Courses",
    description: "Course management",
    type: "page",
    href: "/courses",
  },
  {
    id: "lessons",
    icon: "📖",
    label: "Lessons",
    description: "Lesson builder",
    type: "page",
    href: "/lessons",
  },
  {
    id: "videos",
    icon: "🎥",
    label: "Videos",
    description: "Video studio",
    type: "page",
    href: "/videos",
  },
  {
    id: "runtime",
    icon: "⚡",
    label: "Runtime",
    description: "Runtime engine",
    type: "page",
    href: "/runtime",
  },
  {
    id: "observability",
    icon: "🛰",
    label: "Observability",
    description: "System monitoring",
    type: "page",
    href: "/observability",
  },
  {
    id: "search",
    icon: "🔍",
    label: "Search",
    description: "Global search",
    type: "page",
    href: "/search",
  },
  {
    id: "api-explorer",
    icon: "🔌",
    label: "API Explorer",
    description: "API documentation",
    type: "page",
    href: "/api-explorer",
  },
  {
    id: "forest",
    icon: "🌳",
    label: "Forest",
    description: "Forest domain",
    type: "page",
    href: "/forest",
  },
  {
    id: "heritage",
    icon: "🏛",
    label: "Heritage",
    description: "Heritage domain",
    type: "page",
    href: "/heritage",
  },
  {
    id: "volunteers",
    icon: "🙋",
    label: "Volunteers",
    description: "Volunteer management",
    type: "page",
    href: "/volunteers",
  },
  {
    id: "governance",
    icon: "⚖️",
    label: "Governance",
    description: "Governance rules",
    type: "page",
    href: "/governance",
  },
  {
    id: "playbooks",
    icon: "📝",
    label: "Playbooks",
    description: "Playbook library",
    type: "page",
    href: "/playbooks",
  },
  {
    id: "projects",
    icon: "🗂",
    label: "Projects",
    description: "Project tracker",
    type: "page",
    href: "/projects",
  },
  {
    id: "research",
    icon: "🔬",
    label: "Research",
    description: "Research notes",
    type: "page",
    href: "/research",
  },
  {
    id: "memory",
    icon: "🧠",
    label: "Memory",
    description: "Memory store",
    type: "page",
    href: "/memory",
  },
  // Knowledge objects (sample)
  {
    id: "ko-ai",
    icon: "🤖",
    label: "Introduction to AI",
    description: "AI fundamentals",
    type: "knowledge",
  },
  {
    id: "ko-ml",
    icon: "🧠",
    label: "Machine Learning Basics",
    description: "ML core concepts",
    type: "knowledge",
  },
  {
    id: "ko-dl",
    icon: "🔮",
    label: "Deep Learning",
    description: "Neural networks",
    type: "knowledge",
  },
  // Documents (sample)
  {
    id: "doc-1",
    icon: "📄",
    label: "Getting Started Guide",
    description: "Quick start for new users",
    type: "document",
  },
  {
    id: "doc-2",
    icon: "📄",
    label: "Architecture Overview",
    description: "System design docs",
    type: "document",
  },
  // Actions
  {
    id: "action-theme",
    icon: "🎨",
    label: "Toggle Theme",
    description: "Switch light/dark mode",
    type: "action",
  },
  {
    id: "action-new-ko",
    icon: "➕",
    label: "Create Knowledge Object",
    description: "New KO form",
    type: "action",
  },
  {
    id: "action-new-course",
    icon: "➕",
    label: "Create Course",
    description: "New course form",
    type: "action",
  },
  {
    id: "action-new-lesson",
    icon: "➕",
    label: "Create Lesson",
    description: "New lesson builder",
    type: "action",
  },
  {
    id: "action-pipeline",
    icon: "▶",
    label: "Run Pipeline",
    description: "Execute build pipeline",
    type: "action",
  },
];

const TYPE_LABELS: Record<string, string> = {
  page: "Pages",
  knowledge: "Knowledge",
  document: "Documents",
  action: "Actions",
};

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query) return ALL_ITEMS;
    return ALL_ITEMS.filter(
      (item) =>
        fuzzyMatch(query, item.label) ||
        fuzzyMatch(query, item.description || ""),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const key = item.type;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item?.href) {
        window.location.href = item.href;
      }
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
        zIndex: 100,
      }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          background: "rgba(24, 24, 27, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(63, 63, 70, 0.5)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(63, 63, 70, 0.4)",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 18, color: "#71717a" }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, knowledge, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fafafa",
              fontSize: 16,
              fontFamily: "inherit",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#52525b",
              background: "rgba(255, 255, 255, 0.06)",
              padding: "3px 8px",
              borderRadius: 4,
              fontFamily: "monospace",
            }}
          >
            ESC
          </span>
        </div>

        {/* Results */}
        <div
          style={{
            maxHeight: 400,
            overflowY: "auto",
            padding: "8px",
          }}
        >
          {filtered.length === 0 && (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#52525b",
                fontSize: 14,
              }}
            >
              No results found for &quot;{query}&quot;
            </div>
          )}
          {Array.from(grouped.entries()).map(([type, items]) => (
            <div key={type} style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#52525b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "8px 12px 4px",
                }}
              >
                {TYPE_LABELS[type] || type}
              </div>
              {items.map((item) => {
                const currentIndex = flatIndex++;
                const isActive = currentIndex === activeIndex;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: isActive
                        ? "rgba(255, 255, 255, 0.06)"
                        : "transparent",
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={() => setActiveIndex(currentIndex)}
                    onClick={() => {
                      if (item.href) window.location.href = item.href;
                      setOpen(false);
                    }}
                  >
                    <span
                      style={{ fontSize: 18, width: 24, textAlign: "center" }}
                    >
                      {item.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#fafafa",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.label}
                      </div>
                      {item.description && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#71717a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>
                    {item.href && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#52525b",
                          fontFamily: "monospace",
                          flexShrink: 0,
                        }}
                      >
                        {item.href}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid rgba(63, 63, 70, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#52525b",
          }}
        >
          <span>{filtered.length} results</span>
          <div style={{ display: "flex", gap: 12 }}>
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
