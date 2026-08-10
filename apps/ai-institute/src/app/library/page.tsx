"use client";

import { useState, useEffect } from "react";

interface LibraryItem {
  id: string;
  title: string;
  type: string;
  description?: string;
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/library/items")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Library</h1>
          <p className="text-text-secondary">
            Browse our collection of knowledge objects, documents, and resources.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 bg-bg-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-accent-gold"
          />
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
      </div>
    </div>
  );
}
