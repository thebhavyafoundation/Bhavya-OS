"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "trending", label: "Trending", icon: "🔥" },
  { id: "radar", label: "Technology Radar", icon: "🎯" },
  { id: "mcp", label: "MCP Servers", icon: "🔌" },
  { id: "frameworks", label: "AI Frameworks", icon: "🤖" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "research", label: "Research", icon: "📄" },
  { id: "recommendations", label: "Recommendations", icon: "💡" },
  { id: "comparisons", label: "Comparisons", icon: "⚖️" },
];

const TRENDING = [
  {
    name: "LangGraph",
    stars: 8200,
    language: "Python",
    trend: "+340 this week",
    category: "AI Framework",
  },
  {
    name: "Mastra",
    stars: 5600,
    language: "TypeScript",
    trend: "+280 this week",
    category: "AI Framework",
  },
  {
    name: "Playwright",
    stars: 72000,
    language: "TypeScript",
    trend: "+520 this week",
    category: "Browser Automation",
  },
  {
    name: "Cursor",
    stars: 0,
    language: "Electron",
    trend: "Trending on Product Hunt",
    category: "Developer Tool",
  },
  {
    name: "OpenAI Codex SDK",
    stars: 12000,
    language: "Python",
    trend: "+890 this week",
    category: "AI SDK",
  },
  {
    name: "ModelContextProtocol/servers",
    stars: 8500,
    language: "TypeScript",
    trend: "+410 this week",
    category: "MCP",
  },
  {
    name: "Anthropic Claude Code",
    stars: 0,
    language: "CLI",
    trend: "New release",
    category: "AI Tool",
  },
  {
    name: "PydanticAI",
    stars: 6800,
    language: "Python",
    trend: "+190 this week",
    category: "AI Framework",
  },
];

const MCP_SERVERS = [
  {
    name: "filesystem",
    status: "official",
    tools: 5,
    description: "File system access via MCP",
  },
  {
    name: "github",
    status: "official",
    tools: 12,
    description: "GitHub API integration",
  },
  {
    name: "playwright",
    status: "official",
    tools: 8,
    description: "Browser automation",
  },
  {
    name: "sqlite",
    status: "official",
    tools: 3,
    description: "SQLite database access",
  },
  {
    name: "docker",
    status: "official",
    tools: 6,
    description: "Docker container management",
  },
  {
    name: "git",
    status: "official",
    tools: 4,
    description: "Git repository operations",
  },
  {
    name: "shell",
    status: "official",
    tools: 2,
    description: "Shell command execution",
  },
  {
    name: "brave-search",
    status: "community",
    tools: 2,
    description: "Web search via Brave",
  },
];

const RECOMMENDATIONS = [
  {
    name: "Playwright",
    level: "install_immediately",
    reason: "MCP available, CLI available, offline support, 72k stars",
  },
  {
    name: "LangGraph",
    level: "pilot",
    reason: "Leading AI framework, strong community, MCP integration",
  },
  {
    name: "Mastra",
    level: "study",
    reason: "TypeScript-native AI framework, growing fast",
  },
  {
    name: "PydanticAI",
    level: "pilot",
    reason: "Type-safe AI framework, excellent DX",
  },
  {
    name: "MCP Filesystem",
    level: "install_immediately",
    reason: "Official MCP server, essential for file operations",
  },
  {
    name: "ripgrep",
    level: "install_immediately",
    reason: "Fastest search tool, CLI available, MIT license",
  },
  {
    name: "jq",
    level: "reference",
    reason: "JSON processing standard, widely supported",
  },
  {
    name: "yt-dlp",
    level: "study",
    reason: "Best video downloader, CLI available, active maintenance",
  },
];

export default function OSIPDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-[var(--border)] p-4 flex flex-col gap-2">
        <div className="mb-6 p-3">
          <h1 className="text-lg font-bold text-white">OSIP</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Open Source Intelligence Platform
          </p>
        </div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              activeNav === item.id
                ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Open Source Intelligence</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Bhavya OS engineering brain — continuously learning from the
            open-source ecosystem
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Packages Tracked", value: "2,847" },
              { label: "Sources Monitored", value: "12" },
              { label: "MCP Servers", value: "156" },
              { label: "Recommendations", value: "89" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card">
                <p className="text-sm text-[var(--text-secondary)]">
                  {stat.label}
                </p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Trending */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">🔥 Trending Today</h2>
            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Repository
                    </th>
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Language
                    </th>
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Stars
                    </th>
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Trend
                    </th>
                    <th className="text-left p-3 text-[var(--text-secondary)]">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TRENDING.map((item) => (
                    <tr
                      key={item.name}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-tertiary)]/50"
                    >
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3 text-[var(--text-secondary)]">
                        {item.language}
                      </td>
                      <td className="p-3">
                        {item.stars > 0 ? item.stars.toLocaleString() : "—"}
                      </td>
                      <td className="p-3 text-[var(--success)]">
                        {item.trend}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs">
                          {item.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* MCP Servers + Recommendations */}
          <div className="grid grid-cols-2 gap-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">🔌 MCP Servers</h2>
              <div className="space-y-2">
                {MCP_SERVERS.map((s) => (
                  <div
                    key={s.name}
                    className="glass-card flex items-center justify-between p-3"
                  >
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {s.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-secondary)]">
                        {s.tools} tools
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${s.status === "official" ? "bg-[var(--success)]/10 text-[var(--success)]" : "bg-[var(--warning)]/10 text-[var(--warning)]"}`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">💡 Recommendations</h2>
              <div className="space-y-2">
                {RECOMMENDATIONS.map((r) => (
                  <div key={r.name} className="glass-card p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{r.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          r.level === "install_immediately"
                            ? "bg-[var(--success)]/10 text-[var(--success)]"
                            : r.level === "pilot"
                              ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                              : "bg-[var(--warning)]/10 text-[var(--warning)]"
                        }`}
                      >
                        {r.level.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {r.reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
