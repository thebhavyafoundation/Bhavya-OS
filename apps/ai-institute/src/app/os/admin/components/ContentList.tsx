"use client";

import { useState, useEffect } from "react";
import { EmptyState } from "@bhavya/platform-ui";

interface ContentItem {
  id: string;
  title: string;
  domain: string;
}

export function ContentList() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch("/os/admin/api/data?type=content");
        const data = await res.json();
        // The content endpoint only reports items backed by real
        // content/*/index.json files. Anything else is not shown —
        // this list never invents entries or dates.
        const list = Array.isArray(data.data) ? data.data : [];
        setItems(
          list.map((item: { id: string; title: string; domain?: string }) => ({
            id: item.id,
            title: item.title,
            domain: item.domain ?? String(item.id).split("-")[0] ?? "unknown",
          })),
        );
      } catch {
        setItems([]);
      } finally {
        setLoaded(true);
      }
    };
    loadContent();
  }, []);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.domain === filter);
  const domains = [...new Set(items.map((i) => i.domain))];

  if (loaded && items.length === 0) {
    return (
      <EmptyState
        title="No content index available"
        description="Content indexes (content/*/index.json) are absent, so there is nothing to list. No entries are fabricated."
      />
    );
  }

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
                <th className="text-left px-4 py-2 font-medium text-text-secondary">
                  Title
                </th>
                <th className="text-left px-4 py-2 font-medium text-text-secondary">
                  Domain
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-bg-tertiary transition-colors"
                >
                  <td className="px-4 py-2 text-text-primary">{item.title}</td>
                  <td className="px-4 py-2 text-text-muted">{item.domain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
