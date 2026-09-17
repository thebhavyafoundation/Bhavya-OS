"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface LoopRun {
  id: string;
  status: "running" | "completed" | "failed" | "paused";
  startedAt: string;
  completedAt: string | null;
  stats: {
    discovered: number;
    normalized: number;
    deduplicated: number;
    analyzed: number;
    knowledgePackages: number;
    radarUpdates: number;
    capabilities: number;
    recommendations: number;
    errors: number;
  };
  error?: string;
}

interface BinEvent {
  type: string;
  timestamp: string;
  [key: string]: unknown;
}

interface PendingApproval {
  id: string;
  title: string;
  description: string;
  requestedAt: string;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export default function BINDashboard() {
  const [runs, setRuns] = useState<LoopRun[]>([]);
  const [events, setEvents] = useState<BinEvent[]>([]);
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "approvals" | "radar"
  >("overview");

  const fetchRuns = useCallback(async () => {
    try {
      const res = await fetch("/api/loop");
      const data = await res.json();
      if (data.ok) setRuns(data.runs);
    } catch {
      /* network error — ignore */
    }
  }, []);

  const fetchApprovals = useCallback(async () => {
    try {
      const res = await fetch("/api/approval");
      const data = await res.json();
      if (data.ok) setApprovals(data.approvals);
    } catch {
      /* network error — ignore */
    }
  }, []);

  useEffect(() => {
    fetchRuns();
    fetchApprovals();
  }, [fetchRuns, fetchApprovals]);

  const triggerLoop = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/loop", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setRuns((prev) => [data.run, ...prev]);
        setEvents((prev) =>
          [...(data.run.events || []), ...prev].slice(0, 100),
        );
      }
    } finally {
      setRunning(false);
    }
  };

  const handleApproval = async (id: string, action: "approve" | "deny") => {
    await fetch("/api/approval", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, approvedBy: "dashboard" }),
    });
    fetchApprovals();
  };

  const latestRun = runs[0];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 glass border-r border-[var(--border)] p-3 flex flex-col">
        <div className="mb-6 p-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="pulse-dot" />
            <h1 className="text-base font-bold">BIN</h1>
          </div>
          <p className="text-[10px] text-[var(--text-secondary)]">
            Bhavya Intelligence Network
          </p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { id: "overview", label: "Overview", icon: "◉" },
            { id: "events", label: "Event Stream", icon: "▸" },
            { id: "approvals", label: "Approvals", icon: "◈" },
            { id: "radar", label: "Radar", icon: "◎" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`text-left px-2 py-1.5 rounded text-xs transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              <span className="mr-1.5 opacity-60">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={triggerLoop}
          disabled={running}
          className="mt-4 w-full py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-medium disabled:opacity-50 hover:bg-[var(--accent-hover)] transition-all"
        >
          {running ? "Running..." : "Trigger Loop"}
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Intelligence Network</h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Autonomous daily loop — discover, analyze, recommend, apply
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="pulse-dot" />
              <span className="text-xs text-[var(--text-secondary)]">
                {latestRun?.status === "running"
                  ? "Loop running..."
                  : `Last run: ${latestRun ? new Date(latestRun.completedAt || latestRun.startedAt).toLocaleTimeString() : "never"}`}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { label: "Discovered", value: latestRun?.stats.discovered || 0 },
              {
                label: "Knowledge Pkgs",
                value: latestRun?.stats.knowledgePackages || 0,
              },
              {
                label: "Radar Updates",
                value: latestRun?.stats.radarUpdates || 0,
              },
              {
                label: "Recommendations",
                value: latestRun?.stats.recommendations || 0,
              },
              { label: "Pending Approvals", value: approvals.length },
            ].map((s) => (
              <div key={s.label} className="glass-card">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="stat-glow">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Loop Pipeline Visualization */}
          <div className="glass-card mb-6">
            <h2 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-secondary)]">
              Loop Pipeline
            </h2>
            <div className="flex items-center gap-1 text-[10px]">
              {[
                "Discover",
                "Normalize",
                "Dedup",
                "Analyze",
                "Patterns",
                "Knowledge",
                "Radar",
                "Capabilities",
                "Recommend",
                "Notify",
                "Approve",
                "Apply",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <span
                    className={`px-2 py-1 rounded ${
                      latestRun?.status === "completed"
                        ? "bg-[var(--success)]/10 text-[var(--success)]"
                        : latestRun?.status === "running"
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {step}
                  </span>
                  {i < 11 && (
                    <span className="text-[var(--text-secondary)]">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Recent Runs */}
              <div className="glass-card">
                <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-secondary)]">
                  Recent Runs
                </h3>
                <div className="space-y-2">
                  {runs.slice(0, 5).map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center justify-between p-2 rounded bg-[var(--bg-secondary)]"
                    >
                      <div>
                        <p className="text-xs font-mono">{run.id}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">
                          {new Date(run.startedAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`badge ${
                          run.status === "completed"
                            ? "badge-success"
                            : run.status === "running"
                              ? "badge-info"
                              : "badge-danger"
                        }`}
                      >
                        {run.status}
                      </span>
                    </div>
                  ))}
                  {runs.length === 0 && (
                    <p className="text-xs text-[var(--text-secondary)]">
                      No runs yet. Trigger the loop.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-card">
                <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-secondary)]">
                  All-Time Stats
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Total Runs", value: runs.length },
                    {
                      label: "Successful",
                      value: runs.filter((r) => r.status === "completed")
                        .length,
                    },
                    {
                      label: "Failed",
                      value: runs.filter((r) => r.status === "failed").length,
                    },
                    {
                      label: "Total Discovered",
                      value: runs.reduce((s, r) => s + r.stats.discovered, 0),
                    },
                    {
                      label: "Total Knowledge Pkgs",
                      value: runs.reduce(
                        (s, r) => s + r.stats.knowledgePackages,
                        0,
                      ),
                    },
                    {
                      label: "Total Recommendations",
                      value: runs.reduce(
                        (s, r) => s + r.stats.recommendations,
                        0,
                      ),
                    },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">
                        {s.label}
                      </span>
                      <span className="font-mono">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="glass-card">
              <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-secondary)]">
                Event Stream
              </h3>
              <div className="event-stream space-y-1">
                {events.length === 0 && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    No events yet.
                  </p>
                )}
                {events.map((event, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs p-1.5 rounded hover:bg-[var(--bg-secondary)]"
                  >
                    <span className="text-[var(--text-secondary)] font-mono text-[10px] w-40">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`badge ${
                        String(event.type).includes("error")
                          ? "badge-danger"
                          : String(event.type).includes("completed")
                            ? "badge-success"
                            : String(event.type).includes("started")
                              ? "badge-info"
                              : "badge-warning"
                      }`}
                    >
                      {String(event.type).split(":").pop()}
                    </span>
                    <span className="truncate">
                      {JSON.stringify(
                        Object.fromEntries(
                          Object.entries(event)
                            .filter(([k]) => !["type", "timestamp"].includes(k))
                            .slice(0, 3),
                        ),
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="glass-card">
              <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-secondary)]">
                Pending Approvals
              </h3>
              {approvals.length === 0 && (
                <p className="text-xs text-[var(--text-secondary)]">
                  No pending approvals.
                </p>
              )}
              <div className="space-y-2">
                {approvals.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded bg-[var(--bg-secondary)]"
                  >
                    <div>
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        {a.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproval(a.id, "approve")}
                        className="px-3 py-1 rounded text-[10px] bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(a.id, "deny")}
                        className="px-3 py-1 rounded text-[10px] bg-[var(--danger)]/10 text-[var(--danger)] hover:bg-[var(--danger)]/20"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "radar" && (
            <div className="glass-card">
              <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-secondary)]">
                Technology Radar
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(["adopt", "trial", "assess", "hold"] as const).map(
                  (quadrant) => (
                    <div
                      key={quadrant}
                      className="p-3 rounded bg-[var(--bg-secondary)]"
                    >
                      <h4 className="text-xs font-semibold uppercase mb-2 text-[var(--accent)]">
                        {quadrant}
                      </h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        {quadrant === "adopt" && "Actively use in production"}
                        {quadrant === "trial" &&
                          "Evaluate in non-critical projects"}
                        {quadrant === "assess" && "Research and understand"}
                        {quadrant === "hold" && "Do not adopt, monitor only"}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
