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

type TabId =
  | "overview"
  | "readme"
  | "architecture"
  | "tech"
  | "knowledge"
  | "patterns"
  | "adrs"
  | "learning";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Layers size={14} /> },
  { id: "readme", label: "README", icon: <FileText size={14} /> },
  { id: "architecture", label: "Architecture", icon: <Route size={14} /> },
  { id: "tech", label: "Tech Stack", icon: <Lightbulb size={14} /> },
  { id: "knowledge", label: "Knowledge", icon: <BookOpen size={14} /> },
  { id: "patterns", label: "Patterns", icon: <Shield size={14} /> },
  { id: "adrs", label: "ADRs", icon: <FileText size={14} /> },
  { id: "learning", label: "Learning", icon: <BookOpen size={14} /> },
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
            <p className="text-[#71717a]">Repository not found</p>
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
          <Link
            href="/repositories"
            className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-[#fafafa] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to repositories
          </Link>

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
                {repo.latest_release && <span>{repo.latest_release}</span>}
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
                  <p className="text-xs text-[#71717a] mb-1">Health Score</p>
                  <p
                    className={`text-2xl font-semibold ${getScoreColor(repo.health_score)}`}
                  >
                    {repo.health_score}
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                  <p className="text-xs text-[#71717a] mb-1">
                    Technology Score
                  </p>
                  <p
                    className={`text-2xl font-semibold ${getScoreColor(repo.technology_score)}`}
                  >
                    {repo.technology_score}
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                  <p className="text-xs text-[#71717a] mb-1">Bhavya Score</p>
                  <p
                    className={`text-2xl font-semibold ${getScoreColor(repo.bhavya_score)}`}
                  >
                    {repo.bhavya_score}
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

              {repo.latest_commit && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-2">
                    Latest Commit
                  </h3>
                  <p className="text-sm text-[#a1a1aa]">{repo.latest_commit}</p>
                </div>
              )}

              <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                  Intelligence Views
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/repositories/${repo.id}/learning`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded hover:border-[#3b82f6] transition-colors"
                  >
                    <BookOpen size={16} className="text-[#3b82f6]" />
                    <div>
                      <p className="text-sm text-[#fafafa]">Learning Mode</p>
                      <p className="text-[10px] text-[#52525b]">
                        Prerequisites, objectives, exercises
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/repositories/${repo.id}/timeline`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded hover:border-[#3b82f6] transition-colors"
                  >
                    <Route size={16} className="text-[#22c55e]" />
                    <div>
                      <p className="text-sm text-[#fafafa]">Timeline</p>
                      <p className="text-[10px] text-[#52525b]">
                        Releases, ADRs, milestones
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/repositories/${repo.id}/health`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded hover:border-[#3b82f6] transition-colors"
                  >
                    <Lightbulb size={16} className="text-[#f59e0b]" />
                    <div>
                      <p className="text-sm text-[#fafafa]">
                        Engineering Health
                      </p>
                      <p className="text-[10px] text-[#52525b]">
                        8-dimension health score
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/repositories/${repo.id}/memory`}
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded hover:border-[#3b82f6] transition-colors"
                  >
                    <Layers size={16} className="text-[#a855f7]" />
                    <div>
                      <p className="text-sm text-[#fafafa]">
                        Institutional Memory
                      </p>
                      <p className="text-[10px] text-[#52525b]">
                        What we know, similar repos
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "readme" && (
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#fafafa]">README</h3>
                {repo.readme_content && (
                  <button
                    onClick={() => copyToClipboard(repo.readme_content || "")}
                    className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#fafafa] transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              <pre className="text-sm text-[#a1a1aa] whitespace-pre-wrap font-mono leading-relaxed">
                {repo.readme_content || "No README content available."}
              </pre>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-6">
              {repo.architecture_summary && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Architecture Summary
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

              {patterns.length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Detected Patterns
                  </h3>
                  <div className="space-y-3">
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
                            {pat.confidence}% confidence
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
            </div>
          )}

          {activeTab === "tech" && (
            <div className="space-y-6">
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

              {deps.length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Dependencies
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

              <div className="grid grid-cols-2 gap-4">
                {mcpRecs.length > 0 && (
                  <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                    <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                      MCP Recommendations
                    </h3>
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
                  </div>
                )}

                {cliRecs.length > 0 && (
                  <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                    <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                      CLI Recommendations
                    </h3>
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
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "knowledge" && (
            <div className="space-y-4">
              {knowledge.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={24} className="mx-auto text-[#52525b] mb-3" />
                  <p className="text-sm text-[#71717a]">
                    No knowledge packages yet
                  </p>
                </div>
              ) : (
                knowledge.map((kp) => (
                  <div
                    key={kp.id}
                    className="bg-[#111111] border border-[#27272a] rounded-lg p-5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                          {kp.category}
                        </span>
                        <h3 className="text-sm font-medium text-[#fafafa] mt-1">
                          {kp.title}
                        </h3>
                      </div>
                      <span className="text-xs text-[#71717a]">
                        Quality {kp.quality_score}
                      </span>
                    </div>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">
                      {kp.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "patterns" && (
            <div className="space-y-4">
              {patterns.length === 0 ? (
                <div className="text-center py-12">
                  <Shield size={24} className="mx-auto text-[#52525b] mb-3" />
                  <p className="text-sm text-[#71717a]">
                    No patterns detected yet
                  </p>
                </div>
              ) : (
                patterns.map((pat) => (
                  <div
                    key={pat.id}
                    className="bg-[#111111] border border-[#27272a] rounded-lg p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-[#fafafa]">
                        {pat.pattern_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3b82f6] rounded-full"
                            style={{ width: `${pat.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#71717a]">
                          {pat.confidence}%
                        </span>
                      </div>
                    </div>
                    {pat.description && (
                      <p className="text-sm text-[#a1a1aa] mb-2">
                        {pat.description}
                      </p>
                    )}
                    {pat.evidence && (
                      <div className="bg-[#0a0a0a] border border-[#27272a] rounded p-3 mt-2">
                        <p className="text-xs text-[#52525b] mb-1">Evidence</p>
                        <p className="text-xs text-[#a1a1aa] font-mono">
                          {pat.evidence}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "adrs" && (
            <div className="space-y-4">
              {adrs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={24} className="mx-auto text-[#52525b] mb-3" />
                  <p className="text-sm text-[#71717a]">
                    No ADRs found for this repository
                  </p>
                </div>
              ) : (
                adrs.map((adr) => (
                  <div
                    key={adr.id}
                    className="bg-[#111111] border border-[#27272a] rounded-lg p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-[#52525b] font-mono">
                        ADR-{String(adr.number).padStart(3, "0")}
                      </span>
                      <h3 className="text-sm font-medium text-[#fafafa]">
                        {adr.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          adr.status === "accepted"
                            ? "bg-emerald-900/40 text-emerald-300"
                            : adr.status === "proposed"
                              ? "bg-amber-900/40 text-amber-300"
                              : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {adr.status}
                      </span>
                    </div>
                    {adr.context && (
                      <div className="mb-3">
                        <p className="text-[10px] text-[#52525b] uppercase tracking-wider mb-1">
                          Context
                        </p>
                        <p className="text-sm text-[#a1a1aa]">{adr.context}</p>
                      </div>
                    )}
                    {adr.decision && (
                      <div className="mb-3">
                        <p className="text-[10px] text-[#52525b] uppercase tracking-wider mb-1">
                          Decision
                        </p>
                        <p className="text-sm text-[#a1a1aa]">{adr.decision}</p>
                      </div>
                    )}
                    {adr.consequences && (
                      <div>
                        <p className="text-[10px] text-[#52525b] uppercase tracking-wider mb-1">
                          Consequences
                        </p>
                        <p className="text-sm text-[#a1a1aa]">
                          {adr.consequences}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "learning" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
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
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                  <p className="text-xs text-[#71717a] mb-1">Maintainers</p>
                  <p className="text-sm text-[#fafafa]">
                    {JSON.parse(repo.maintainers || "[]").join(", ") ||
                      "Unknown"}
                  </p>
                </div>
              </div>

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
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Recommended Reading Order
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {repo.learning_reading_order}
                  </p>
                </div>
              )}

              {repo.why_bhavya_cares && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Why Learn This
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {repo.why_bhavya_cares}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
