"use client";

import { useState } from "react";

// ─── Research Domains ──────────────────────────────────────────────────────

const DOMAINS = [
  {
    id: "ui",
    label: "Elite UI",
    icon: "🎨",
    desc: "Exceptional UI repositories, design systems, patterns",
  },
  {
    id: "ai-education",
    label: "AI Education",
    icon: "📚",
    desc: "Courses, labs, curricula, learning paths",
  },
  {
    id: "frameworks",
    label: "AI Frameworks",
    icon: "🤖",
    desc: "LangGraph, Mastra, CrewAI, PydanticAI, AutoGen",
  },
  {
    id: "mcp",
    label: "MCP Intelligence",
    icon: "🔌",
    desc: "MCP servers, capabilities, security, alternatives",
  },
  {
    id: "plugins",
    label: "Plugin Intelligence",
    icon: "🧩",
    desc: "VS Code, Cursor, OpenCode, JetBrains extensions",
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: "🏗️",
    desc: "Folder structures, monorepos, naming conventions",
  },
  {
    id: "documentation",
    label: "Documentation",
    icon: "📝",
    desc: "README quality, ADRs, RFCs, contribution guides",
  },
  {
    id: "automation",
    label: "Automation",
    icon: "⚡",
    desc: "GitHub Actions, CI/CD, code generation, releases",
  },
  {
    id: "websites",
    label: "Website Intelligence",
    icon: "🌐",
    desc: "Best AI, education, developer, NGO websites",
  },
  {
    id: "institute",
    label: "AI Institute",
    icon: "🎓",
    desc: "Courses, bootcamps, capstone projects, learning paths",
  },
];

// ─── Sample Data ───────────────────────────────────────────────────────────

const TRENDING_REPOS = [
  {
    name: "shadcn/ui",
    stars: 82000,
    language: "TypeScript",
    domain: "ui",
    score: 95,
    status: "adopt",
  },
  {
    name: "vercel/next.js",
    stars: 132000,
    language: "TypeScript",
    domain: "ui",
    score: 98,
    status: "adopt",
  },
  {
    name: "langchain-ai/langgraph",
    stars: 8200,
    language: "Python",
    domain: "frameworks",
    score: 85,
    status: "pilot",
  },
  {
    name: "mastra-ai/mastra",
    stars: 5600,
    language: "TypeScript",
    domain: "frameworks",
    score: 82,
    status: "pilot",
  },
  {
    name: "anthropics/claude-code",
    stars: 0,
    language: "CLI",
    domain: "mcp",
    score: 90,
    status: "adopt",
  },
  {
    name: "modelcontextprotocol/servers",
    stars: 8500,
    language: "TypeScript",
    domain: "mcp",
    score: 88,
    status: "adopt",
  },
  {
    name: "pydantic/pydantic-ai",
    stars: 6800,
    language: "Python",
    domain: "frameworks",
    score: 78,
    status: "pilot",
  },
  {
    name: "openai/openai-cookbook",
    stars: 20000,
    language: "Python",
    domain: "ai-education",
    score: 80,
    status: "reference",
  },
  {
    name: "deep-learning-ai/courses",
    stars: 12000,
    language: "Jupyter",
    domain: "ai-education",
    score: 75,
    status: "reference",
  },
  {
    name: "linear/linear",
    stars: 25000,
    language: "TypeScript",
    domain: "ui",
    score: 88,
    status: "study",
  },
];

const MCP_SERVERS = [
  {
    name: "filesystem",
    status: "official",
    tools: 5,
    score: 92,
    recommendation: "install_immediately",
  },
  {
    name: "github",
    status: "official",
    tools: 12,
    score: 88,
    recommendation: "install_immediately",
  },
  {
    name: "playwright",
    status: "official",
    tools: 8,
    score: 95,
    recommendation: "install_immediately",
  },
  {
    name: "sqlite",
    status: "official",
    tools: 3,
    score: 85,
    recommendation: "install_immediately",
  },
  {
    name: "docker",
    status: "official",
    tools: 6,
    score: 80,
    recommendation: "pilot",
  },
  {
    name: "git",
    status: "official",
    tools: 4,
    score: 82,
    recommendation: "install_immediately",
  },
  {
    name: "shell",
    status: "official",
    tools: 2,
    score: 78,
    recommendation: "pilot",
  },
  {
    name: "brave-search",
    status: "community",
    tools: 2,
    score: 72,
    recommendation: "study",
  },
];

const ARCHITECTURE_PATTERNS = [
  {
    pattern: "Turborepo Monorepo",
    repos: ["vercel/next.js", "calcom/cal.com", "documenso/documenso"],
    score: 90,
  },
  {
    pattern: "Feature-Based Folders",
    repos: ["linear/linear", "calcom/cal.com"],
    score: 85,
  },
  {
    pattern: "Domain-Driven Design",
    repos: ["trpc/trpc", "colinhacks/zod"],
    score: 88,
  },
  {
    pattern: "Plugin Architecture",
    repos: ["payloadcms/payload", "keystonejs/keystone"],
    score: 82,
  },
  {
    pattern: "Convention Over Configuration",
    repos: ["rails/rails", "django/django"],
    score: 80,
  },
];

const RECOMMENDATIONS = [
  {
    title: "Adopt shadcn/ui as primary component library",
    domain: "ui",
    priority: "high",
    effort: "1 week",
    reasoning:
      "82k stars, MIT license, copy-paste components, works with Next.js",
  },
  {
    title: "Install MCP Playwright server",
    domain: "mcp",
    priority: "high",
    effort: "30 min",
    reasoning: "Official MCP, 8 tools, replaces custom browser automation",
  },
  {
    title: "Evaluate LangGraph for agent workflows",
    domain: "frameworks",
    priority: "medium",
    effort: "2 weeks",
    reasoning: "Leading agent framework, strong community, MCP integration",
  },
  {
    title: "Adopt Turborepo for monorepo structure",
    domain: "architecture",
    priority: "high",
    effort: "3 days",
    reasoning: "Industry standard, fast builds, good DX",
  },
  {
    title: "Install MCP GitHub server",
    domain: "mcp",
    priority: "high",
    effort: "15 min",
    reasoning: "Official MCP, 12 tools, API-free GitHub access",
  },
  {
    title: "Study Linear's UI patterns",
    domain: "ui",
    priority: "medium",
    effort: "1 week",
    reasoning: "Best-in-class keyboard UX, command palette, clean design",
  },
  {
    title: "Add DeepLearning.AI courses to curriculum",
    domain: "institute",
    priority: "medium",
    effort: "2 days",
    reasoning: "World-class AI education, project-based, free",
  },
  {
    title: "Adopt semantic-release for versioning",
    domain: "automation",
    priority: "medium",
    effort: "1 day",
    reasoning: "Automated changelogs, semantic versioning, CI integration",
  },
];

// ─── Dashboard ─────────────────────────────────────────────────────────────

export default function GILDashboard() {
  const [activeDomain, setActiveDomain] = useState("ui");
  const [search, setSearch] = useState("");

  const filteredRepos = TRENDING_REPOS.filter(
    (r) =>
      r.domain === activeDomain &&
      r.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-52 bg-[var(--bg-card)] border-r border-[var(--border)] p-3 flex flex-col">
        <div className="mb-5 px-2">
          <h1 className="text-sm font-bold">GIL</h1>
          <p className="text-[10px] text-[var(--text-dim)]">
            GitHub Intelligence Lab
          </p>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDomain(d.id)}
              className={`nav-item text-left ${activeDomain === d.id ? "active" : ""}`}
            >
              <span className="mr-1.5">{d.icon}</span>
              {d.label}
            </button>
          ))}
        </nav>

        <div className="mt-3 px-2">
          <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider mb-1">
            Capability Decision
          </p>
          <div className="text-[10px] text-[var(--text-dim)] space-y-0.5">
            <p>1. Existing Package?</p>
            <p>2. MCP Server?</p>
            <p>3. CLI Tool?</p>
            <p>4. GitHub Action?</p>
            <p>5. Browser Automation?</p>
            <p>6. Open Source Library?</p>
            <p>7. Official API?</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-5 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold">
                {DOMAINS.find((d) => d.id === activeDomain)?.icon}{" "}
                {DOMAINS.find((d) => d.id === activeDomain)?.label}
              </h1>
              <p className="text-xs text-[var(--text-dim)]">
                {DOMAINS.find((d) => d.id === activeDomain)?.desc}
              </p>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              {
                label: "Repositories",
                value: TRENDING_REPOS.filter((r) => r.domain === activeDomain)
                  .length,
              },
              {
                label: "Avg Score",
                value: Math.round(
                  TRENDING_REPOS.filter(
                    (r) => r.domain === activeDomain,
                  ).reduce((s, r) => s + r.score, 0) /
                    (TRENDING_REPOS.filter((r) => r.domain === activeDomain)
                      .length || 1),
                ),
              },
              {
                label: "Recommendations",
                value: RECOMMENDATIONS.filter((r) => r.domain === activeDomain)
                  .length,
              },
              { label: "MCP Servers", value: MCP_SERVERS.length },
            ].map((s) => (
              <div key={s.label} className="card">
                <p className="text-[10px] text-[var(--text-dim)] uppercase">
                  {s.label}
                </p>
                <p className="score">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Repositories */}
          <section className="mb-5">
            <h2 className="text-sm font-semibold mb-3">Repositories</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left p-2 text-[var(--text-dim)]">
                      Repository
                    </th>
                    <th className="text-left p-2 text-[var(--text-dim)]">
                      Language
                    </th>
                    <th className="text-left p-2 text-[var(--text-dim)]">
                      Stars
                    </th>
                    <th className="text-left p-2 text-[var(--text-dim)]">
                      Score
                    </th>
                    <th className="text-left p-2 text-[var(--text-dim)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRepos.map((r) => (
                    <tr
                      key={r.name}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-elevated)]/50"
                    >
                      <td className="p-2 font-medium">{r.name}</td>
                      <td className="p-2 text-[var(--text-dim)]">
                        {r.language}
                      </td>
                      <td className="p-2">
                        {r.stars > 0 ? r.stars.toLocaleString() : "—"}
                      </td>
                      <td className="p-2">
                        <span className="score text-sm">{r.score}</span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`badge ${r.status === "adopt" ? "badge-green" : r.status === "pilot" ? "badge-blue" : "badge-amber"}`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredRepos.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-[var(--text-dim)]"
                      >
                        No repositories in this domain yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recommendations */}
          <section className="mb-5">
            <h2 className="text-sm font-semibold mb-3">Recommendations</h2>
            <div className="space-y-2">
              {RECOMMENDATIONS.filter((r) => r.domain === activeDomain).map(
                (r, i) => (
                  <div
                    key={i}
                    className="card flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-medium">{r.title}</p>
                      <p className="text-[10px] text-[var(--text-dim)] mt-0.5">
                        {r.reasoning}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="pill">{r.effort}</span>
                      <span
                        className={`badge ${r.priority === "high" ? "badge-green" : "badge-amber"}`}
                      >
                        {r.priority}
                      </span>
                    </div>
                  </div>
                ),
              )}
              {RECOMMENDATIONS.filter((r) => r.domain === activeDomain)
                .length === 0 && (
                <p className="text-xs text-[var(--text-dim)]">
                  No recommendations for this domain yet
                </p>
              )}
            </div>
          </section>

          {/* Architecture Patterns (shown for architecture domain) */}
          {activeDomain === "architecture" && (
            <section>
              <h2 className="text-sm font-semibold mb-3">
                Architecture Patterns
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {ARCHITECTURE_PATTERNS.map((p) => (
                  <div key={p.pattern} className="card">
                    <p className="text-xs font-medium">{p.pattern}</p>
                    <p className="text-[10px] text-[var(--text-dim)] mt-1">
                      Used by: {p.repos.join(", ")}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--bg)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--accent)]"
                          style={{ width: `${p.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono">{p.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MCP Servers (shown for mcp domain) */}
          {activeDomain === "mcp" && (
            <section>
              <h2 className="text-sm font-semibold mb-3">MCP Servers</h2>
              <div className="grid grid-cols-2 gap-3">
                {MCP_SERVERS.map((s) => (
                  <div
                    key={s.name}
                    className="card flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-medium">{s.name}</p>
                      <p className="text-[10px] text-[var(--text-dim)]">
                        {s.tools} tools
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="score text-sm">{s.score}</span>
                      <span
                        className={`badge ${s.status === "official" ? "badge-green" : "badge-amber"}`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
