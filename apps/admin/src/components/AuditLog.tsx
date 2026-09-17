"use client";

import { useState } from "react";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  type: "release" | "governance" | "security" | "content" | "system";
}

const auditData: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2026-07-24T10:08:00Z",
    actor: "Governance Agent",
    action: "Tagged release",
    target: "v1.0.0-rc2",
    type: "release",
  },
  {
    id: "2",
    timestamp: "2026-07-24T09:53:00Z",
    actor: "Governance Agent",
    action: "Created ADR",
    target: "ADR-009",
    type: "governance",
  },
  {
    id: "3",
    timestamp: "2026-07-24T09:00:00Z",
    actor: "Platform Agent",
    action: "Fixed CSP headers",
    target: "website",
    type: "security",
  },
  {
    id: "4",
    timestamp: "2026-07-24T08:30:00Z",
    actor: "Platform Agent",
    action: "Added accessibility fixes",
    target: "docs",
    type: "content",
  },
  {
    id: "5",
    timestamp: "2026-07-24T08:00:00Z",
    actor: "Platform Agent",
    action: "Updated lock file",
    target: "pnpm-lock.yaml",
    type: "system",
  },
  {
    id: "6",
    timestamp: "2026-07-23T22:00:00Z",
    actor: "Platform Agent",
    action: "Created APP-002",
    target: "docs platform",
    type: "content",
  },
  {
    id: "7",
    timestamp: "2026-07-23T18:00:00Z",
    actor: "Platform Agent",
    action: "Tagged release",
    target: "v0.9.0-rc1",
    type: "release",
  },
  {
    id: "8",
    timestamp: "2026-07-23T12:00:00Z",
    actor: "Platform Agent",
    action: "Created APP-000",
    target: "design system",
    type: "content",
  },
  {
    id: "9",
    timestamp: "2026-07-22T16:00:00Z",
    actor: "Platform Agent",
    action: "Deployed infrastructure",
    target: "Docker, Nginx, CI/CD",
    type: "system",
  },
  {
    id: "10",
    timestamp: "2026-07-20T10:00:00Z",
    actor: "Governance Agent",
    action: "Created ADR",
    target: "ADR-008",
    type: "governance",
  },
];

const typeColors: Record<string, string> = {
  release: "var(--admin-success)",
  governance: "var(--admin-primary)",
  security: "var(--admin-danger)",
  content: "var(--admin-info)",
  system: "var(--admin-text-muted)",
};

export function AuditLog() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = auditData.filter((entry) => {
    const matchesSearch =
      search === "" ||
      entry.action.toLowerCase().includes(search.toLowerCase()) ||
      entry.target.toLowerCase().includes(search.toLowerCase()) ||
      entry.actor.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <input
          type="search"
          placeholder="Search audit log..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 rounded text-sm border flex-1 min-w-64"
          style={{
            borderColor: "var(--admin-border)",
            backgroundColor: "var(--admin-surface)",
            color: "var(--admin-text)",
          }}
          aria-label="Search audit log"
        />
        <div className="flex gap-2">
          {[
            "all",
            "release",
            "governance",
            "security",
            "content",
            "system",
          ].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className="px-3 py-1.5 rounded text-sm border transition-colors"
              style={{
                borderColor:
                  typeFilter === type
                    ? "var(--admin-primary)"
                    : "var(--admin-border)",
                backgroundColor:
                  typeFilter === type ? "var(--admin-primary)" : "transparent",
                color:
                  typeFilter === type ? "white" : "var(--admin-text-secondary)",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: "var(--admin-border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--admin-surface-hover)" }}>
              <th
                className="text-left px-4 py-2 font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Time
              </th>
              <th
                className="text-left px-4 py-2 font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Actor
              </th>
              <th
                className="text-left px-4 py-2 font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Action
              </th>
              <th
                className="text-left px-4 py-2 font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Target
              </th>
              <th
                className="text-left px-4 py-2 font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr
                key={entry.id}
                className="border-t"
                style={{ borderColor: "var(--admin-border)" }}
              >
                <td
                  className="px-4 py-2 font-mono text-xs"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td
                  className="px-4 py-2"
                  style={{ color: "var(--admin-text)" }}
                >
                  {entry.actor}
                </td>
                <td
                  className="px-4 py-2"
                  style={{ color: "var(--admin-text)" }}
                >
                  {entry.action}
                </td>
                <td
                  className="px-4 py-2 font-mono text-xs"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  {entry.target}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: typeColors[entry.type] }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {entry.type}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
