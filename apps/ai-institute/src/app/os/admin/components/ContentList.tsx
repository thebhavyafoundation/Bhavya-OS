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
  published: { bg: "bg-green-900/30", text: "text-green-400" },
  draft: { bg: "bg-amber-900/30", text: "text-amber-400" },
  archived: { bg: "bg-bg-tertiary", text: "text-text-muted" },
};

export function ContentList() {
  const [items, setItems] = useState<ContentItem[]>(fallbackContent);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch("/os/admin/api/data?type=content");
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
          className={`px-3 py-1.5 rounded text-sm border transition-colors ${
            filter === "all"
              ? "border-accent-gold bg-accent-gold text-text-inverse"
              : "border-border-primary bg-transparent text-text-secondary hover:border-border-secondary"
          }`}
        >
          All ({items.length})
        </button>
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setFilter(domain)}
            className={`px-3 py-1.5 rounded text-sm border transition-colors ${
              filter === domain
                ? "border-accent-gold bg-accent-gold text-text-inverse"
                : "border-border-primary bg-transparent text-text-secondary hover:border-border-secondary"
            }`}
          >
            {domain} ({items.filter((i) => i.domain === domain).length})
          </button>
        ))}
      </div>
      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-tertiary">
                <th className="text-left px-4 py-2 font-medium text-text-secondary">Title</th>
                <th className="text-left px-4 py-2 font-medium text-text-secondary">Domain</th>
                <th className="text-left px-4 py-2 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-2 font-medium text-text-secondary">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-bg-tertiary transition-colors">
                  <td className="px-4 py-2 text-text-primary">{item.title}</td>
                  <td className="px-4 py-2 text-text-muted">{item.domain}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyles[item.status].bg} ${statusStyles[item.status].text}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-text-muted">{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
