#!/usr/bin/env node
/**
 * Bhavya OS — Engineering Dashboard v2
 * Generates a comprehensive engineering dashboard.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "../..");
const INPUT = join(ROOT, "platform", "repo-intelligence", "output");
const OUTPUT = join(ROOT, "platform", "dashboard");

// Load data
const repoIndex = JSON.parse(readFileSync(join(INPUT, "repository-index.json"), "utf-8"));
const depGraph = JSON.parse(readFileSync(join(INPUT, "dependency-graph.json"), "utf-8"));

// Get git stats
let gitStats = { commits: 0, lastCommit: "unknown" };
try {
  const log = execSync('git log --oneline -1 --format="%H|%s|%ai"', { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
  const parts = log.trim().split("|");
  gitStats.lastCommit = parts[1] || "unknown";
  gitStats.commits = 50;
} catch { /* skip */ }

// Route stats
const routeStats = repoIndex.routes.reduce((acc, r) => {
  acc[r.app] = (acc[r.app] || 0) + 1;
  return acc;
}, {});

const routeListHtml = Object.entries(routeStats)
  .map(([app, count]) => `<li><span class="tag app">${app}</span> ${count} routes</li>`)
  .join("\n        ");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bhavya OS — Engineering Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      padding: 24px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #262626;
    }
    .header h1 { font-size: 24px; font-weight: 700; color: #fff; }
    .header .badge {
      background: #15803d;
      color: #fff;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .card {
      background: #171717;
      border: 1px solid #262626;
      border-radius: 12px;
      padding: 20px;
    }
    .card h2 {
      font-size: 14px;
      font-weight: 600;
      color: #a3a3a3;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #262626;
    }
    .stat:last-child { border-bottom: none; }
    .stat-label { color: #a3a3a3; font-size: 14px; }
    .stat-value { font-size: 20px; font-weight: 700; color: #fff; }
    .stat-value.green { color: #22c55e; }
    .stat-value.gold { color: #eab308; }
    .stat-value.red { color: #ef4444; }
    .list { list-style: none; max-height: 300px; overflow-y: auto; }
    .list li {
      padding: 8px 0;
      border-bottom: 1px solid #262626;
      font-size: 13px;
      font-family: monospace;
    }
    .list li:last-child { border-bottom: none; }
    .tag {
      display: inline-block;
      background: #262626;
      color: #a3a3a3;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      margin: 2px;
    }
    .tag.app { background: #1e3a5f; color: #60a5fa; }
    .tag.pkg { background: #1e3a1e; color: #4ade80; }
    .progress {
      width: 100%;
      height: 8px;
      background: #262626;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 8px;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #15803d, #22c55e);
      border-radius: 4px;
    }
    .timestamp { color: #525252; font-size: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Bhavya OS — Engineering Dashboard</h1>
    <span class="badge">v2.0</span>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Repository Overview</h2>
      <div class="stat">
        <span class="stat-label">Total Files</span>
        <span class="stat-value">${repoIndex.stats.totalFiles.toLocaleString()}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Directories</span>
        <span class="stat-value">${repoIndex.stats.totalDirs.toLocaleString()}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Packages</span>
        <span class="stat-value green">${repoIndex.stats.totalPackages}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Routes</span>
        <span class="stat-value">${repoIndex.stats.totalRoutes}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Components</span>
        <span class="stat-value">${repoIndex.stats.totalComponents}</span>
      </div>
    </div>

    <div class="card">
      <h2>Package Distribution</h2>
      <div class="stat">
        <span class="stat-label">Applications</span>
        <span class="stat-value green">${repoIndex.fileTree.apps.length}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Libraries</span>
        <span class="stat-value gold">${repoIndex.fileTree.packages.length}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Dependencies</span>
        <span class="stat-value">${repoIndex.stats.totalDependencies}</span>
      </div>
      <div style="margin-top: 12px;">
        <div class="stat-label" style="margin-bottom: 8px;">Apps</div>
        <div>${repoIndex.fileTree.apps.map(a => `<span class="tag app">${a}</span>`).join(" ")}</div>
      </div>
      <div style="margin-top: 12px;">
        <div class="stat-label" style="margin-bottom: 8px;">Packages</div>
        <div>${repoIndex.fileTree.packages.map(p => `<span class="tag pkg">${p}</span>`).join(" ")}</div>
      </div>
    </div>

    <div class="card">
      <h2>Git Activity</h2>
      <div class="stat">
        <span class="stat-label">Recent Commits</span>
        <span class="stat-value">${repoIndex.gitHistory.length}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Last Commit</span>
        <span class="stat-value" style="font-size: 14px;">${gitStats.lastCommit}</span>
      </div>
      <ul class="list">
        ${repoIndex.gitHistory.slice(0, 10).map(c => `<li>${c.message.slice(0, 60)}</li>`).join("\n        ")}
      </ul>
    </div>

    <div class="card">
      <h2>Architecture Health</h2>
      <div class="stat">
        <span class="stat-label">Workspace Dependencies</span>
        <span class="stat-value green">${depGraph.edges.filter(e => e.type === "workspace").length}</span>
      </div>
      <div class="stat">
        <span class="stat-label">External Dependencies</span>
        <span class="stat-value">${depGraph.edges.filter(e => e.type === "npm").length}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Dependency Ratio</span>
        <span class="stat-value gold">${(depGraph.edges.filter(e => e.type === "npm").length / Math.max(depGraph.edges.filter(e => e.type === "workspace").length, 1)).toFixed(1)}:1</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: ${Math.min(100, (depGraph.edges.filter(e => e.type === "workspace").length / 20) * 100)}%"></div>
      </div>
      <div class="timestamp">Updated: ${new Date().toISOString()}</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Top Packages by Dependencies</h2>
      <ul class="list">
        ${repoIndex.packages
          .sort((a, b) => Object.keys(b.dependencies || {}).length - Object.keys(a.dependencies || {}).length)
          .slice(0, 15)
          .map(p => `<li><span class="tag ${p.type === "app" ? "app" : "pkg"}">${p.name}</span> ${Object.keys(p.dependencies || {}).length} deps</li>`)
          .join("\n        ")}
      </ul>
    </div>

    <div class="card">
      <h2>Routes by Application</h2>
      <ul class="list">
        ${routeListHtml}
      </ul>
    </div>
  </div>
</body>
</html>`;

writeFileSync(join(OUTPUT, "dashboard.html"), html);
console.log("✅ Engineering Dashboard generated: platform/dashboard/dashboard.html");
