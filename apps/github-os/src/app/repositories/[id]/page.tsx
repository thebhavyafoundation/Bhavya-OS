"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  GitFork,
  BookOpen,
  Layers,
  Lightbulb,
  FileText,
  Route,
  Shield,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Map,
  GraduationCap,
  Activity,
  ClipboardCheck,
  GitCompare,
  Wrench,
  Target,
  Zap,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Repository {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  license: string | null;
  topics: string;
  health_score: number;
  technology_score: number;
  bhavya_score: number;
  engineering_maturity: string;
  architecture_summary: string | null;
  folder_structure: string | null;
  readme_content: string | null;
  readme_summary: string | null;
  tech_stack: string;
  patterns: string;
  dependencies: string;
  maintainers: string;
  latest_release: string | null;
  latest_commit: string | null;
  why_bhavya_cares: string | null;
  learning_difficulty: string;
  learning_prerequisites: string;
  learning_reading_order: string | null;
  mcp_recommendations: string;
  cli_recommendations: string;
  recommendation_type: string;
}

interface Pattern {
  id: string;
  pattern_name: string;
  confidence: number;
  evidence: string | null;
  description: string | null;
}

interface ADR {
  id: string;
  number: number;
  title: string;
  status: string;
  context: string | null;
  decision: string | null;
  consequences: string | null;
}

interface KnowledgePackage {
  id: string;
  category: string;
  title: string;
  content: string;
  quality_score: number;
}

type TabId = "overview" | "architecture" | "learning" | "advisor" | "activity";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Layers size={14} /> },
  { id: "architecture", label: "Architecture", icon: <Route size={14} /> },
  { id: "learning", label: "Learning", icon: <GraduationCap size={14} /> },
  { id: "advisor", label: "Advisor", icon: <Shield size={14} /> },
  { id: "activity", label: "Activity", icon: <Activity size={14} /> },
];

const maturityColors: Record<string, string> = {
  emerging: "bg-amber-900/40 text-amber-300 border-amber-800",
  developing: "bg-blue-900/40 text-blue-300 border-blue-800",
  mature: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  exemplary: "bg-purple-900/40 text-purple-300 border-purple-800",
};

const recColors: Record<string, string> = {
  adopt: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  study: "bg-blue-900/40 text-blue-300 border-blue-800",
  reference: "bg-violet-900/40 text-violet-300 border-violet-800",
  monitor: "bg-amber-900/40 text-amber-300 border-amber-800",
  archive: "bg-zinc-800/40 text-zinc-400 border-zinc-700",
};

export default function RepositoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [repo, setRepo] = useState<Repository | null>(null);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [adrs, setADRs] = useState<ADR[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}`);
      const data = await res.json();
      setRepo(data.repository);
      setPatterns(data.patterns || []);
      setADRs(data.adrs || []);
      setKnowledge(data.knowledge || []);
      setLoading(false);
    }
    load();
  }, [id]);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getScoreColor(score: number) {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-amber-400";
    return "text-red-400";
  }

  function getScoreRing(score: number) {
    if (score >= 90) return "stroke-emerald-400";
    if (score >= 80) return "stroke-blue-400";
    if (score >= 70) return "stroke-amber-400";
    return "stroke-red-400";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-[#27272a] rounded w-1/3 mb-4" />
            <div className="h-4 bg-[#27272a] rounded w-1/2 mb-8" />
            <div className="h-64 bg-[#111111] rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <FileText size={24} className="mx-auto text-[#52525b] mb-3" />
            <p className="text-sm text-[#71717a]">Repository not found</p>
            <Link
              href="/repositories"
              className="text-sm text-[#3b82f6] hover:text-[#60a5fa] mt-2 inline-block"
            >
              Back to repositories
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const topics = JSON.parse(repo.topics || "[]");
  const techStack = JSON.parse(repo.tech_stack || "{}");
  const deps = JSON.parse(repo.dependencies || "[]");
  const mcpRecs = JSON.parse(repo.mcp_recommendations || "[]");
  const cliRecs = JSON.parse(repo.cli_recommendations || "[]");
  const prerequisites = JSON.parse(repo.learning_prerequisites || "[]");
  const folderStructure = JSON.parse(repo.folder_structure || "{}");

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#52525b] mb-6">
            <Link
              href="/repositories"
              className="hover:text-[#fafafa] transition-colors"
            >
              Repositories
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#71717a]">{repo.name}</span>
          </nav>

          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-[#fafafa]">
                  {repo.name}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium border ${maturityColors[repo.engineering_maturity]}`}
                >
                  {repo.engineering_maturity}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium border ${recColors[repo.recommendation_type]}`}
                >
                  {repo.recommendation_type}
                </span>
              </div>
              <p className="text-sm text-[#71717a] mb-3">{repo.description}</p>
              <div className="flex items-center gap-4 text-xs text-[#52525b]">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} />
                  {repo.forks}
                </span>
                {repo.license && <span>{repo.license}</span>}
              </div>
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {topics.map((topic: string) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 bg-[#1a1a1a] border border-[#27272a] rounded text-[10px] text-[#71717a]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-6">
              <div className="relative">
                <svg className="w-20 h-20" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    className={getScoreRing(repo.bhavya_score)}
                    strokeWidth="3"
                    strokeDasharray={`${repo.bhavya_score} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span
                  className={`absolute inset-0 flex items-center justify-center text-lg font-semibold ${getScoreColor(repo.bhavya_score)}`}
                >
                  {repo.bhavya_score}
                </span>
              </div>
              <p className="text-center text-[10px] text-[#52525b] mt-1">
                Bhavya Score
              </p>
            </div>
          </div>

          <div className="flex gap-1 border-b border-[#27272a] mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-[#fafafa] border-b-2 border-[#3b82f6]"
                    : "text-[#71717a] hover:text-[#fafafa]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                  <p className="text-xs text-[#71717a] mb-1">Health</p>
                  <p
                    className={`text-2xl font-semibold ${getScoreColor(repo.health_score)}`}
                  >
                    {repo.health_score}
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                  <p className="text-xs text-[#71717a] mb-1">Technology</p>
                  <p
                    className={`text-2xl font-semibold ${getScoreColor(repo.technology_score)}`}
                  >
                    {repo.technology_score}
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                  <p className="text-xs text-[#71717a] mb-1">Difficulty</p>
                  <p className="text-lg font-semibold text-[#fafafa] capitalize">
                    {repo.learning_difficulty}
                  </p>
                </div>
              </div>

              {repo.why_bhavya_cares && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-2">
                    Why Bhavya Cares
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {repo.why_bhavya_cares}
                  </p>
                </div>
              )}

              {repo.architecture_summary && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-2">
                    Architecture Summary
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {repo.architecture_summary}
                  </p>
                </div>
              )}

              {repo.readme_summary && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-2">
                    README Summary
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {repo.readme_summary}
                  </p>
                </div>
              )}

              {knowledge.length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Knowledge Packages ({knowledge.length})
                  </h3>
                  <div className="space-y-2">
                    {knowledge.slice(0, 3).map((kp) => (
                      <div
                        key={kp.id}
                        className="flex items-center justify-between p-2 bg-[#0a0a0a] border border-[#27272a] rounded"
                      >
                        <div>
                          <span className="text-[10px] text-[#52525b] uppercase">
                            {kp.category}
                          </span>
                          <p className="text-sm text-[#fafafa]">{kp.title}</p>
                        </div>
                        <span className="text-xs text-[#71717a]">
                          Q{kp.quality_score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-6">
              {repo.architecture_summary && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Architecture
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {repo.architecture_summary}
                  </p>
                </div>
              )}

              {Object.keys(folderStructure).length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Folder Structure
                  </h3>
                  <pre className="text-sm text-[#a1a1aa] font-mono leading-relaxed overflow-x-auto">
                    {JSON.stringify(folderStructure, null, 2)}
                  </pre>
                </div>
              )}

              <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                  Technology Stack
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(techStack).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between border border-[#27272a] rounded-md p-2"
                    >
                      <span className="text-xs text-[#71717a] capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-[#fafafa] font-medium">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {patterns.length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Detected Patterns ({patterns.length})
                  </h3>
                  <div className="space-y-2">
                    {patterns.map((pat) => (
                      <div
                        key={pat.id}
                        className="border border-[#27272a] rounded-md p-3"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-[#fafafa]">
                            {pat.pattern_name}
                          </span>
                          <span className="text-xs text-[#71717a]">
                            {pat.confidence}%
                          </span>
                        </div>
                        {pat.description && (
                          <p className="text-xs text-[#a1a1aa]">
                            {pat.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adrs.length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Architecture Decision Records ({adrs.length})
                  </h3>
                  <div className="space-y-3">
                    {adrs.map((adr) => (
                      <div
                        key={adr.id}
                        className="border border-[#27272a] rounded-md p-3"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-[#52525b] font-mono">
                            ADR-{String(adr.number).padStart(3, "0")}
                          </span>
                          <span className="text-sm font-medium text-[#fafafa]">
                            {adr.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              adr.status === "accepted"
                                ? "bg-emerald-900/40 text-emerald-300"
                                : "bg-amber-900/40 text-amber-300"
                            }`}
                          >
                            {adr.status}
                          </span>
                        </div>
                        {adr.decision && (
                          <p className="text-xs text-[#a1a1aa]">
                            {adr.decision}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {deps.length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Dependencies ({deps.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {deps.map((dep: string) => (
                      <span
                        key={dep}
                        className="px-2.5 py-1 bg-[#1a1a1a] border border-[#27272a] rounded text-xs text-[#a1a1aa] font-mono"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "learning" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                  <p className="text-xs text-[#71717a] mb-1">Difficulty</p>
                  <p className="text-lg font-semibold text-[#fafafa] capitalize">
                    {repo.learning_difficulty}
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                  <p className="text-xs text-[#71717a] mb-1">Recommendation</p>
                  <p className="text-lg font-semibold text-[#fafafa] capitalize">
                    {repo.recommendation_type}
                  </p>
                </div>
              </div>

              {repo.why_bhavya_cares && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={14} className="text-[#3b82f6]" />
                    <h3 className="text-sm font-medium text-[#fafafa]">
                      Why Learn This
                    </h3>
                  </div>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {repo.why_bhavya_cares}
                  </p>
                </div>
              )}

              {prerequisites.length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Prerequisites
                  </h3>
                  <div className="space-y-2">
                    {prerequisites.map((prereq: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm text-[#a1a1aa]"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#27272a] flex items-center justify-center text-[10px] text-[#71717a]">
                          {i + 1}
                        </span>
                        {prereq}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {repo.learning_reading_order && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={14} className="text-[#f59e0b]" />
                    <h3 className="text-sm font-medium text-[#fafafa]">
                      Reading Order
                    </h3>
                  </div>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {repo.learning_reading_order}
                  </p>
                </div>
              )}

              <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap size={14} className="text-emerald-400" />
                  <h3 className="text-sm font-medium text-[#fafafa]">
                    Start Learning
                  </h3>
                </div>
                <p className="text-sm text-[#a1a1aa] mb-3">
                  Ready to dive in? Explore the architecture, study the
                  patterns, and build something.
                </p>
                <Link
                  href={`/repositories/${repo.id}/learning`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white text-sm rounded-md hover:bg-[#2563eb] transition-colors"
                >
                  Open Learning Mode
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "advisor" && (
            <div className="space-y-6">
              <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-[#3b82f6]" />
                  <h3 className="text-sm font-medium text-[#fafafa]">
                    Engineering Advisor
                  </h3>
                </div>
                <p className="text-sm text-[#a1a1aa] mb-4">
                  Get a comprehensive engineering assessment of this repository.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/repositories/${repo.id}/advisor`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded hover:border-[#3b82f6] transition-colors"
                  >
                    <ClipboardCheck size={16} className="text-[#3b82f6]" />
                    <div>
                      <p className="text-sm text-[#fafafa]">Full Assessment</p>
                      <p className="text-[10px] text-[#52525b]">
                        Review, debt, recommendations
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/repositories/${repo.id}/debt`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded hover:border-[#3b82f6] transition-colors"
                  >
                    <AlertTriangle size={16} className="text-amber-400" />
                    <div>
                      <p className="text-sm text-[#fafafa]">Technical Debt</p>
                      <p className="text-[10px] text-[#52525b]">
                        Categorized debt register
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/repositories/${repo.id}/plan`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded hover:border-[#3b82f6] transition-colors"
                  >
                    <Map size={16} className="text-[#a855f7]" />
                    <div>
                      <p className="text-sm text-[#fafafa]">
                        Implementation Plan
                      </p>
                      <p className="text-[10px] text-[#52525b]">
                        Roadmap and milestones
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/repositories/${repo.id}/architecture-advisor`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded hover:border-[#3b82f6] transition-colors"
                  >
                    <GitCompare size={16} className="text-[#22c55e]" />
                    <div>
                      <p className="text-sm text-[#fafafa]">
                        Compare Architecture
                      </p>
                      <p className="text-[10px] text-[#52525b]">
                        vs elite repositories
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-[#f59e0b]" />
                  <h3 className="text-sm font-medium text-[#fafafa]">
                    Quick Insights
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#27272a] rounded">
                    <span className="text-sm text-[#a1a1aa]">
                      Patterns Detected
                    </span>
                    <span className="text-sm font-medium text-[#fafafa]">
                      {patterns.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#27272a] rounded">
                    <span className="text-sm text-[#a1a1aa]">
                      ADRs Documented
                    </span>
                    <span className="text-sm font-medium text-[#fafafa]">
                      {adrs.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#27272a] rounded">
                    <span className="text-sm text-[#a1a1aa]">
                      Knowledge Packages
                    </span>
                    <span className="text-sm font-medium text-[#fafafa]">
                      {knowledge.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#27272a] rounded">
                    <span className="text-sm text-[#a1a1aa]">Dependencies</span>
                    <span className="text-sm font-medium text-[#fafafa]">
                      {deps.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              {repo.latest_commit && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} className="text-[#3b82f6]" />
                    <h3 className="text-sm font-medium text-[#fafafa]">
                      Latest Commit
                    </h3>
                  </div>
                  <p className="text-sm text-[#a1a1aa] font-mono">
                    {repo.latest_commit}
                  </p>
                </div>
              )}

              {repo.latest_release && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-emerald-400" />
                    <h3 className="text-sm font-medium text-[#fafafa]">
                      Latest Release
                    </h3>
                  </div>
                  <p className="text-sm text-[#a1a1aa]">
                    {repo.latest_release}
                  </p>
                </div>
              )}

              <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench size={14} className="text-[#f59e0b]" />
                  <h3 className="text-sm font-medium text-[#fafafa]">
                    MCP Recommendations
                  </h3>
                </div>
                {mcpRecs.length > 0 ? (
                  <div className="space-y-2">
                    {mcpRecs.map((mcp: string) => (
                      <div
                        key={mcp}
                        className="flex items-center gap-2 text-xs text-[#a1a1aa]"
                      >
                        <ExternalLink size={10} />
                        {mcp}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#52525b]">
                    No MCP recommendations
                  </p>
                )}
              </div>

              <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench size={14} className="text-[#3b82f6]" />
                  <h3 className="text-sm font-medium text-[#fafafa]">
                    CLI Recommendations
                  </h3>
                </div>
                {cliRecs.length > 0 ? (
                  <div className="space-y-2">
                    {cliRecs.map((cli: string) => (
                      <div
                        key={cli}
                        className="flex items-center gap-2 text-xs text-[#a1a1aa] font-mono"
                      >
                        <ChevronRight size={10} />
                        {cli}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#52525b]">
                    No CLI recommendations
                  </p>
                )}
              </div>

              {repo.readme_content && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#fafafa]">
                      README
                    </h3>
                    <button
                      onClick={() => copyToClipboard(repo.readme_content || "")}
                      className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#fafafa] transition-colors"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-sm text-[#a1a1aa] whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                    {repo.readme_content}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
