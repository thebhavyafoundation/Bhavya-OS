"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import {
  StatCard,
  ActivityFeed,
  RepositoryWidget,
  KnowledgeWidget,
  RadarWidget,
  RecommendationWidget,
  PatternWidget,
  HealthWidget,
} from "@/components/Widgets";
import {
  FolderGit2,
  Brain,
  Zap,
  GitBranch,
  Search,
  Layers,
  Heart,
} from "lucide-react";

interface DashboardData {
  repositories: {
    id: string;
    name: string;
    description: string | null;
    language: string | null;
    health_score: number;
  }[];
  packages: {
    id: string;
    title: string;
    category: string;
    quality_score: number;
  }[];
  activities: {
    id: string;
    type: string;
    title: string;
    description: string | null;
    created_at: string;
  }[];
  radar: {
    id: string;
    name: string;
    category: string;
    ring: string;
    score: number;
  }[];
  recommendations: {
    id: string;
    type: string;
    title: string;
    description: string;
    priority: string;
    status: string;
  }[];
  patterns: {
    id: string;
    name: string;
    category: string;
    difficulty: string;
    educational_value: string | null;
  }[];
  health: {
    id: string;
    repository_id: string;
    overall_score: number;
    repository_name?: string;
  }[];
}

export default function Dashboard() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reposRes, kpsRes, actRes, patternsRes, healthRes] =
          await Promise.all([
            fetch("/api/repositories"),
            fetch("/api/knowledge"),
            fetch("/api/activity"),
            fetch("/api/patterns"),
            fetch("/api/health"),
          ]);
        const repos = await reposRes.json();
        const kps = await kpsRes.json();
        const act = await actRes.json();
        const patternsData = await patternsRes.json();
        const healthData = await healthRes.json();

        setData({
          repositories: repos.repositories || [],
          packages: kps.packages || [],
          activities: act.activities || [],
          radar: [
            {
              id: "r1",
              name: "Next.js",
              category: "frameworks",
              ring: "adopt",
              score: 95,
            },
            {
              id: "r2",
              name: "TypeScript",
              category: "languages",
              ring: "adopt",
              score: 98,
            },
            {
              id: "r3",
              name: "Tailwind CSS",
              category: "frameworks",
              ring: "adopt",
              score: 90,
            },
            {
              id: "r4",
              name: "SQLite",
              category: "databases",
              ring: "adopt",
              score: 88,
            },
            {
              id: "r5",
              name: "MCP",
              category: "protocols",
              ring: "trial",
              score: 82,
            },
            {
              id: "r6",
              name: "Ollama",
              category: "ai",
              ring: "trial",
              score: 80,
            },
          ],
          recommendations: [
            {
              id: "rec-1",
              type: "mcp",
              title: "Install GitHub MCP",
              description: "Core integration for repository management",
              priority: "high",
              status: "pending",
            },
            {
              id: "rec-2",
              type: "mcp",
              title: "Install Filesystem MCP",
              description: "Local file operations for code access",
              priority: "high",
              status: "pending",
            },
            {
              id: "rec-3",
              type: "tool",
              title: "Standardize ripgrep",
              description: "Fast search tool for codebase exploration",
              priority: "medium",
              status: "accepted",
            },
          ],
          patterns: patternsData.patterns || [],
          health: healthData.health || [],
        });
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          <header className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[28px] font-bold text-[#fafafa]">
                  Engineering Workspace
                </h1>
                <p className="text-[14px] text-[#71717a] mt-1">
                  Bhavya Foundation — Intelligence-driven engineering platform
                </p>
              </div>
              <button
                onClick={() => setCmdOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#71717a] hover:text-[#fafafa] hover:border-[#3f3f46] transition-colors"
              >
                <Search size={14} />
                <span>Search</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-[#1a1a1a] border border-[#27272a] rounded text-[10px] font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-4 gap-4 mb-8 animate-fade-in">
            <StatCard
              label="Repositories"
              value={data?.repositories.length || 0}
              change="+2 this month"
              changeType="positive"
              icon={<FolderGit2 size={18} />}
            />
            <StatCard
              label="Knowledge Packages"
              value={data?.packages.length || 0}
              change="+4 this week"
              changeType="positive"
              icon={<Brain size={18} />}
            />
            <StatCard
              label="Patterns"
              value={data?.patterns.length || 0}
              change="10 patterns"
              changeType="neutral"
              icon={<Layers size={18} />}
            />
            <StatCard
              label="Avg Health"
              value={
                data?.health.length
                  ? Math.round(
                      data.health.reduce((a, h) => a + h.overall_score, 0) /
                        data.health.length,
                    )
                  : 0
              }
              change="Across all repos"
              changeType="neutral"
              icon={<Heart size={18} />}
            />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 animate-fade-in">
              <ActivityFeed activities={data?.activities || []} />
            </div>
            <div className="animate-fade-in">
              <RadarWidget items={data?.radar || []} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="animate-fade-in">
              <RepositoryWidget repositories={data?.repositories || []} />
            </div>
            <div className="animate-fade-in">
              <KnowledgeWidget packages={data?.packages || []} />
            </div>
            <div className="animate-fade-in">
              <PatternWidget patterns={data?.patterns || []} />
            </div>
            <div className="animate-fade-in">
              <HealthWidget items={data?.health || []} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="animate-fade-in">
              <RecommendationWidget items={data?.recommendations || []} />
            </div>
          </div>

          <footer className="pt-8 border-t border-[#27272a] text-center text-[12px] text-[#71717a]">
            GitHub OS v1.0 — Engineering Workspace — Bhavya Foundation
          </footer>
        </div>
      </main>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
