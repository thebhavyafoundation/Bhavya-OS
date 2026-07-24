"use client";

import { useState, useEffect } from "react";

interface ContentItem {
  id: string;
  title: string;
  domain: string;
  status: "published" | "draft" | "archived";
  updated: string;
}

const fallbackContent: ContentItem[] = [
  { id: "governance-constitution", title: "Constitution", domain: "governance", status: "published", updated: "2026-07-15" },
  { id: "governance-adr-0001", title: "ADR-0001: ADR Standard", domain: "governance", status: "published", updated: "2026-07-15" },
  { id: "governance-adr-0002", title: "ADR-0002: AI Gateway", domain: "governance", status: "published", updated: "2026-07-20" },
  { id: "governance-adr-0003", title: "ADR-0003: Release Train", domain: "governance", status: "published", updated: "2026-07-24" },
  { id: "policies-security", title: "Security Policy", domain: "policies", status: "published", updated: "2026-07-18" },
  { id: "policies-accessibility", title: "Accessibility Policy", domain: "policies", status: "published", updated: "2026-07-18" },
  { id: "releases-v1.0.0-rc2", title: "v1.0.0-rc2 Release Notes", domain: "releases", status: "draft", updated: "2026-07-24" },
  { id: "standards-bdl", title: "BDL — Bhavya Design Language", domain: "standards", status: "published", updated: "2026-07-15" },
];

const statusStyles: Record<string, { bg: string; text: string }> = {
  published: { bg: "#dcfce7", text: "#166534" },
  draft: { bg: "#fef9c3", text: "#854d0e" },
  archived: { bg: "#e2e8f0", text: "#475569" },
};

export function ContentList() {
  const [items, setItems] = useState<ContentItem[]>(fallbackContent);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch("/api/data?type=content");
        const data = await res.json();
        if (data.data?.length) {
          setItems(data.data.map((item: { id: string; title: string }) => ({
            id: item.id,
            title: item.title,
            domain: item.id.split("-")[0],
            status: "published" as const,
            updated: new Date().toISOString().split("T")[0],
          })));
        }
      } catch {
        // Use fallback
      }
    };
    loadContent();
  }, []);

  const filtered = filter === "all" ? items : items.filter((i) => i.domain === filter);
  const domains = [...new Set(items.map((i) => i.domain))];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className="px-3 py-1.5 rounded text-sm border transition-colors"
          style={{
            borderColor: filter === "all" ? "var(--admin-primary)" : "var(--admin-border)",
            backgroundColor: filter === "all" ? "var(--admin-primary)" : "transparent",
            color: filter === "all" ? "white" : "var(--admin-text-secondary)",
          }}
        >
          All ({items.length})
        </button>
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setFilter(domain)}
            className="px-3 py-1.5 rounded text-sm border transition-colors"
            style={{
              borderColor: filter === domain ? "var(--admin-primary)" : "var(--admin-border)",
              backgroundColor: filter === domain ? "var(--admin-primary)" : "transparent",
              color: filter === domain ? "white" : "var(--admin-text-secondary)",
            }}
          >
            {domain} ({items.filter((i) => i.domain === domain).length})
          </button>
        ))}
      </div>
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: "var(--admin-border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--admin-surface-hover)" }}>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Title</th>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Domain</th>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Status</th>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-t"
                style={{ borderColor: "var(--admin-border)" }}
              >
                <td className="px-4 py-2" style={{ color: "var(--admin-text)" }}>{item.title}</td>
                <td className="px-4 py-2" style={{ color: "var(--admin-text-muted)" }}>{item.domain}</td>
                <td className="px-4 py-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: statusStyles[item.status].bg,
                      color: statusStyles[item.status].text,
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2" style={{ color: "var(--admin-text-muted)" }}>{item.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
