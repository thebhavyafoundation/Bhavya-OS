"use client";

import { useState, useEffect } from "react";
import { EmptyState } from "@bhavya/platform-ui";

interface AuditEntry {
  id: string;
  actorEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  result: "success" | "failure";
  createdAt: string;
}

const resultColors: Record<string, string> = {
  success: "text-green-400",
  failure: "text-red-400",
};

/**
 * Real audit events from GET /os/admin/api/audit, recorded by
 * recordAuditEvent on sensitive actions (login, logout, register,
 * role change, publication). An empty log renders an honest empty
 * state — events are never invented.
 */
export function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/os/admin/api/audit");
        const body = await res.json();
        setEntries(Array.isArray(body.events) ? body.events : []);
      } catch {
        setEntries([]);
      }
    };
    load();
  }, []);

  const filtered = (entries ?? []).filter((entry) => {
    if (search === "") return true;
    const q = search.toLowerCase();
    return (
      entry.action.toLowerCase().includes(q) ||
      entry.actorEmail.toLowerCase().includes(q) ||
      entry.resource.toLowerCase().includes(q)
    );
  });

  if (entries !== null && entries.length === 0) {
    return (
      <EmptyState
        title="No audit events recorded"
        description="Sensitive actions (login, role changes, publications) are recorded here as they happen."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <input
          type="search"
          placeholder="Search audit log..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 rounded text-sm border border-border-primary bg-bg-secondary text-text-primary flex-1 min-w-64 focus:outline-none focus:border-accent-gold"
          aria-label="Search audit log"
        />
      </div>
      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="divide-y divide-border-primary">
          {filtered.map((entry) => (
            <div key={entry.id} className="px-4 py-3 flex items-start gap-3">
              <span
                className={`mt-0.5 text-xs font-mono ${resultColors[entry.result]}`}
              >
                {entry.result}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">
                  {entry.action}
                  {entry.resource ? ` · ${entry.resource}` : ""}
                  {entry.resourceId ? ` · ${entry.resourceId}` : ""}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {entry.actorEmail || "anonymous"} · {entry.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
