"use client";

import { useState } from "react";

const CAPABILITY_TYPES = [
  { type: "mcp_server", label: "MCP Servers", count: 156, icon: "🔌" },
  { type: "cli_tool", label: "CLI Tools", count: 89, icon: "⌨️" },
  {
    type: "browser_automation",
    label: "Browser Automation",
    count: 12,
    icon: "🌐",
  },
  { type: "plugin", label: "Plugins", count: 67, icon: "🧩" },
  { type: "github_action", label: "GitHub Actions", count: 34, icon: "⚡" },
  { type: "node_package", label: "Node Packages", count: 234, icon: "📦" },
  { type: "python_package", label: "Python Packages", count: 178, icon: "🐍" },
  { type: "docker_service", label: "Docker Services", count: 45, icon: "🐳" },
];

const TOP_CAPABILITIES = [
  {
    name: "Playwright",
    type: "mcp_server",
    bhavyaScore: 95,
    status: "active",
    recommendation: "install_immediately",
    stars: 72000,
    integration: "mcp + cli + browser",
  },
  {
    name: "MCP Filesystem",
    type: "mcp_server",
    bhavyaScore: 92,
    status: "active",
    recommendation: "install_immediately",
    stars: 0,
    integration: "mcp",
  },
  {
    name: "ripgrep",
    type: "cli_tool",
    bhavyaScore: 90,
    status: "active",
    recommendation: "install_immediately",
    stars: 48000,
    integration: "cli",
  },
  {
    name: "GitHub MCP",
    type: "mcp_server",
    bhavyaScore: 88,
    status: "active",
    recommendation: "install_immediately",
    stars: 0,
    integration: "mcp",
  },
  {
    name: "LangGraph",
    type: "python_package",
    bhavyaScore: 85,
    status: "active",
    recommendation: "pilot",
    stars: 8200,
    integration: "library",
  },
  {
    name: "Mastra",
    type: "node_package",
    bhavyaScore: 82,
    status: "active",
    recommendation: "pilot",
    stars: 5600,
    integration: "library",
  },
  {
    name: "Docker MCP",
    type: "mcp_server",
    bhavyaScore: 80,
    status: "active",
    recommendation: "install_immediately",
    stars: 0,
    integration: "mcp + docker",
  },
  {
    name: "PydanticAI",
    type: "python_package",
    bhavyaScore: 78,
    status: "active",
    recommendation: "pilot",
    stars: 6800,
    integration: "library",
  },
  {
    name: "yt-dlp",
    type: "cli_tool",
    bhavyaScore: 76,
    status: "active",
    recommendation: "study",
    stars: 98000,
    integration: "cli",
  },
  {
    name: "FFmpeg",
    type: "cli_tool",
    bhavyaScore: 74,
    status: "active",
    recommendation: "reference",
    stars: 45000,
    integration: "cli",
  },
];

const DECISION_TREE = [
  { need: "Need Capability", yes: "Existing Platform Package?", no: null },
  {
    need: "Existing Platform Package?",
    yes: "Reuse",
    no: "MCP Server Available?",
  },
  {
    need: "MCP Server Available?",
    yes: "Integrate",
    no: "CLI Tool Available?",
  },
  {
    need: "CLI Tool Available?",
    yes: "Wrap as Provider",
    no: "Browser Automation Possible?",
  },
  {
    need: "Browser Automation Possible?",
    yes: "Build Playwright/Browser Use Provider",
    no: "GitHub Action Available?",
  },
  {
    need: "GitHub Action Available?",
    yes: "Integrate",
    no: "Open-Source Library Exists?",
  },
  {
    need: "Open-Source Library Exists?",
    yes: "Integrate",
    no: "Official API (Last Resort)",
  },
];

export default function CapabilityCenter() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = TOP_CAPABILITIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-[var(--border)] p-4 flex flex-col gap-2">
        <div className="mb-6 p-3">
          <h1 className="text-lg font-bold text-white">Capability Center</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Every technology = a Capability
          </p>
        </div>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm bg-[var(--accent)]/20 text-[var(--accent)]">
          📊 Overview
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
          🔌 MCP Servers
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
          ⌨️ CLI Tools
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
          🌐 Browser Automation
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
          🧩 Plugins
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
          🎯 Decision Tree
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
          📈 Rankings
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Capability Center</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Every discovered technology becomes a Capability — scored, ranked,
            and recommended
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Capabilities", value: "923" },
              { label: "MCP Servers", value: "156" },
              { label: "CLI Tools", value: "89" },
              { label: "Install Immediately", value: "24" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card">
                <p className="text-sm text-[var(--text-secondary)]">
                  {stat.label}
                </p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Capability Types */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Capability Types</h2>
            <div className="grid grid-cols-4 gap-3">
              {CAPABILITY_TYPES.map((ct) => (
                <button
                  key={ct.type}
                  onClick={() =>
                    setFilterType(filterType === ct.type ? "all" : ct.type)
                  }
                  className={`glass-card text-left p-4 cursor-pointer transition-all ${
                    filterType === ct.type
                      ? "border-[var(--accent)]/40 bg-[var(--accent)]/5"
                      : ""
                  }`}
                >
                  <span className="text-2xl">{ct.icon}</span>
                  <p className="font-medium text-sm mt-2">{ct.label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {ct.count} tracked
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search capabilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Top Capabilities */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Top Capabilities by Bhavya Score
            </h2>
            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Name
                    </th>
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Type
                    </th>
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Bhavya Score
                    </th>
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Recommendation
                    </th>
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Integration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cap) => (
                    <tr
                      key={cap.name}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-tertiary)]/50"
                    >
                      <td className="p-3 font-medium">{cap.name}</td>
                      <td className="p-3 text-[var(--text-secondary)]">
                        {cap.type.replace(/_/g, " ")}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="score-bar w-20">
                            <div
                              className="score-bar-fill"
                              style={{ width: `${cap.bhavyaScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono">
                            {cap.bhavyaScore}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            cap.recommendation === "install_immediately"
                              ? "bg-[var(--success)]/10 text-[var(--success)]"
                              : cap.recommendation === "pilot"
                                ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                                : "bg-[var(--warning)]/10 text-[var(--warning)]"
                          }`}
                        >
                          {cap.recommendation.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-[var(--text-secondary)]">
                        {cap.integration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Decision Tree */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              🎯 Capability Decision Tree
            </h2>
            <div className="glass-card">
              <div className="space-y-2">
                {DECISION_TREE.map((node, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm">
                    <span className="w-48 text-[var(--text-secondary)]">
                      {node.need}
                    </span>
                    {node.yes && (
                      <span className="text-[var(--success)]">
                        → Yes: {node.yes}
                      </span>
                    )}
                    {node.no && (
                      <span className="text-[var(--warning)]">
                        → No: {node.no}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
