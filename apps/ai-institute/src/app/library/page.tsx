"use client";

import { useState, useEffect } from "react";

interface LibraryItem {
  id: string;
  title: string;
  type: string;
  description?: string;
  source?: "bhavya" | "external";
  provider?: string;
  license?: string;
  strand?: string;
}

type SourceFilter = "all" | "bhavya" | "external";

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SourceFilter>("all");

  useEffect(() => {
    fetch("/api/library/items")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  const filtered = items.filter(
    (item) =>
      (filter === "all" || (item.source ?? "bhavya") === filter) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()))
  );

  const externalCount = items.filter((i) => i.source === "external").length;

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Library</h1>
          <p className="text-text-secondary">
            Browse our collection of knowledge objects, documents, and resources.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 bg-bg-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-accent-gold"
          />
          <div className="flex gap-2 text-xs">
            {(["all", "bhavya", "external"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full border transition-colors ${
                  filter === f
                    ? "border-accent-gold text-accent-gold"
                    : "border-border-primary text-text-secondary"
                }`}
              >
                {f === "all" ? "All" : f === "bhavya" ? "Bhavya" : "External"}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-12 text-center">
            <p className="text-text-secondary">
              {search ? "No results found." : "Library items will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-bg-secondary border border-border-primary rounded-xl p-5 hover:border-accent-gold/30 transition-colors"
              >
                <div className="text-xs text-accent-gold uppercase tracking-wider mb-2">
                  {item.type}
                  {item.source === "external" && (
                    <span className="ml-2 normal-case tracking-normal border border-border-primary rounded-full px-2 py-0.5 text-text-secondary">
                      External · {item.provider}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-text-primary mb-1">
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-xs text-text-secondary line-clamp-2">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {externalCount > 0 && (
          <p className="mt-8 text-xs text-text-secondary">
            External resources are provided by the Raspberry Pi Foundation
            (“Experience AI”, CC BY-NC-ND 4.0) and listed here as references.
            Lesson content remains with the provider and is not republished by
            Bhavya Foundation.
          </p>
        )}
      </div>
    </div>
  );
}
