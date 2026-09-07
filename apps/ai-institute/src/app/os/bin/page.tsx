import Link from "next/link";

// ─── Bhavya Intelligence Network — Canonical Status Page ────────────────────
// BIN is a fully client-side in-memory orchestration engine.
// It runs as a standalone app and cannot be server-rendered here.
// This page provides status and navigation.

export default function BINPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Bhavya Intelligence Network
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Autonomous discovery, analysis, and recommendation engine
        </p>
      </div>

      {/* Status */}
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-[var(--accent-gold)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Network Status
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pipeline", value: "12-step loop", status: "active" },
            { label: "Data Store", value: "In-memory", status: "ephemeral" },
            { label: "Mode", value: "Standalone", status: "isolated" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded bg-[var(--bg-secondary)]">
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                {s.label}
              </p>
              <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                {s.value}
              </p>
              <span
                className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded ${
                  s.status === "active"
                    ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
                    : s.status === "ephemeral"
                      ? "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]"
                      : "bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]"
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="glass-card">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Discovery Loop Pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
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
            <div key={step} className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                {i + 1}. {step}
              </span>
              {i < 11 && <span className="text-[var(--text-muted)]">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="glass-card">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Access BIN
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          BIN runs as a standalone client-side application with in-memory state.
          Launch it in a separate tab to run the discovery loop.
        </p>
        <div className="flex gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[var(--accent-gold)] text-[var(--bg-primary)] text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Open BIN Dashboard ↗
          </a>
          <Link
            href="/os"
            className="px-4 py-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] text-xs font-medium hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Back to OS
          </Link>
        </div>
      </div>

      {/* Capabilities */}
      <div className="glass-card">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Engine Capabilities
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              name: "Discovery",
              desc: "Collects intelligence from multiple sources",
            },
            {
              name: "Normalization",
              desc: "Standardizes data into canonical format",
            },
            {
              name: "Deduplication",
              desc: "Removes redundant intelligence items",
            },
            {
              name: "Analysis",
              desc: "Classifies and scores intelligence value",
            },
            {
              name: "Knowledge Packages",
              desc: "Groups related intelligence into actionable packages",
            },
            {
              name: "Technology Radar",
              desc: "Tracks technology adoption across quadrants",
            },
            {
              name: "Capabilities",
              desc: "Registers and scores organizational capabilities",
            },
            {
              name: "Recommendations",
              desc: "Generates prioritized improvement suggestions",
            },
          ].map((cap) => (
            <div
              key={cap.name}
              className="p-3 rounded bg-[var(--bg-secondary)]"
            >
              <p className="text-xs font-medium text-[var(--text-primary)]">
                {cap.name}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
