"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { EmptyState } from "@bhavya/platform-ui";

interface SearchSection {
  label: string;
  icon: string;
  items: string[];
}

/**
 * Real client-side search over the record titles the server page loaded.
 * Filters the institutional records in this browser — no fake index,
 * no claims beyond the loaded titles.
 */
export function SearchBrowser({ sections }: { sections: SearchSection[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections.map((section) => ({
      ...section,
      matches:
        q === ""
          ? []
          : section.items.filter((t) => t.toLowerCase().includes(q)),
    }));
  }, [sections, query]);

  const totalMatches = results.reduce((n, s) => n + s.matches.length, 0);
  const totalRecords = sections.reduce((n, s) => n + s.items.length, 0);
  const searching = query.trim() !== "";

  return (
    <div>
      <div className="glass rounded-xl p-5 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search knowledge, documents, policies..."
            aria-label="Search institutional records"
            className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-accent-gold"
          />
        </div>
        <div className="mt-3 text-xs text-text-muted">
          {searching
            ? `${totalMatches} match${totalMatches === 1 ? "" : "es"} across ${totalRecords} records`
            : `Type to filter ${totalRecords} records by title`}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-text-primary mb-4">
        {searching ? "Results" : "Searchable Content"}
      </h2>
      {searching && totalMatches === 0 ? (
        <EmptyState
          title="No matches"
          description={`Nothing titled like “${query.trim()}” was found in the ${totalRecords} loaded records.`}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(searching
            ? results.filter((s) => s.matches.length > 0)
            : results
          ).map((section) => {
            const shown = searching
              ? section.matches
              : section.items.slice(0, 3);
            return (
              <div key={section.label} className="glass rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {section.label}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-green-900/30 text-green-400 font-medium">
                    {searching ? shown.length : section.items.length}
                  </span>
                </div>
                {shown.length > 0 ? (
                  <div className="flex flex-col gap-1 ml-7">
                    {shown.slice(0, 50).map((title) => (
                      <div key={title} className="text-xs text-text-tertiary">
                        {title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-text-muted ml-7">
                    No items available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
