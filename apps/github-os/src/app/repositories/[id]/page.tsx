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
import {
  Card,
  Badge,
  Skeleton,
  Breadcrumb,
  EmptyState,
  AppLayout,
} from "@bhavya/platform-ui";

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

const maturityVariant: Record<string, "warning" | "info" | "success" | "purple"> = {
  emerging: "warning",
  developing: "info",
  mature: "success",
  exemplary: "purple",
};

const recVariant: Record<string, "success" | "info" | "purple" | "warning" | "default"> = {
  adopt: "success",
  study: "info",
  reference: "purple",
  monitor: "warning",
  archive: "default",
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
    if (score >= 90) return "text-score-excellent";
    if (score >= 80) return "text-score-good";
    if (score >= 70) return "text-score-fair";
    return "text-score-poor";
  }

  function getScoreRing(score: number) {
    if (score >= 90) return "stroke-score-excellent";
    if (score >= 80) return "stroke-score-good";
    if (score >= 70) return "stroke-score-fair";
    return "stroke-score-poor";
  }

  if (loading) {
    return (
      <AppLayout sidebar={<Sidebar />}>
        <div className="animate-fade-in">
          <Skeleton width="33%" height={32} className="mb-4" />
          <Skeleton width="50%" height={16} className="mb-8" />
          <Skeleton width="100%" height={256} rounded="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!repo) {
    return (
      <AppLayout sidebar={<Sidebar />}>
        <EmptyState
          icon={<FileText size={24} />}
          title="Repository not found"
          description="The repository you're looking for doesn't exist or has been removed."
          action={{
            label: "Back to repositories",
            onClick: () => (window.location.href = "/repositories"),
          }}
        />
      </AppLayout>
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
    <AppLayout sidebar={<Sidebar />}>
      <div className="animate-fade-in">
        <Breadcrumb
          items={[
            { label: "Repositories", href: "/repositories" },
            { label: repo.name },
          ]}
          className="mb-6"
        />

        <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-text-primary">
                {repo.name}
              </h1>
              <Badge variant={maturityVariant[repo.engineering_maturity]}>
                {repo.engineering_maturity}
              </Badge>
              <Badge variant={recVariant[repo.recommendation_type]}>
                {repo.recommendation_type}
              </Badge>
            </div>
            <p className="text-sm text-text-tertiary mb-3">{repo.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
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
                  <Badge key={topic} variant="default" size="sm">
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="relative">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="none"
                  stroke="var(--color-border-primary)"
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
            <p className="text-center text-[10px] text-text-muted mt-1">
              Bhavya Score
            </p>
          </div>
        </div>

        <div className="flex gap-1 border-b border-border-primary mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-text-primary border-b-2 border-accent-blue"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card padding="md">
                <p className="text-xs text-text-tertiary mb-1">Health</p>
                <p
                  className={`text-2xl font-semibold ${getScoreColor(repo.health_score)}`}
                >
                  {repo.health_score}
                </p>
              </Card>
              <Card padding="md">
                <p className="text-xs text-text-tertiary mb-1">Technology</p>
                <p
                  className={`text-2xl font-semibold ${getScoreColor(repo.technology_score)}`}
                >
                  {repo.technology_score}
                </p>
              </Card>
              <Card padding="md">
                <p className="text-xs text-text-tertiary mb-1">Difficulty</p>
                <p className="text-lg font-semibold text-text-primary capitalize">
                  {repo.learning_difficulty}
                </p>
              </Card>
            </div>

            {repo.why_bhavya_cares && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Why Bhavya Cares
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {repo.why_bhavya_cares}
                </p>
              </Card>
            )}

            {repo.architecture_summary && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Architecture Summary
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {repo.architecture_summary}
                </p>
              </Card>
            )}

            {repo.readme_summary && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  README Summary
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {repo.readme_summary}
                </p>
              </Card>
            )}

            {knowledge.length > 0 && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  Knowledge Packages ({knowledge.length})
                </h3>
                <div className="space-y-2">
                  {knowledge.slice(0, 3).map((kp) => (
                    <div
                      key={kp.id}
                      className="flex items-center justify-between p-2 bg-bg-primary border border-border-primary rounded"
                    >
                      <div>
                        <span className="text-[10px] text-text-muted uppercase">
                          {kp.category}
                        </span>
                        <p className="text-sm text-text-primary">{kp.title}</p>
                      </div>
                      <span className="text-xs text-text-tertiary">
                        Q{kp.quality_score}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "architecture" && (
          <div className="space-y-6 animate-fade-in">
            {repo.architecture_summary && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  Architecture
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {repo.architecture_summary}
                </p>
              </Card>
            )}

            {Object.keys(folderStructure).length > 0 && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  Folder Structure
                </h3>
                <pre className="text-sm text-text-secondary font-mono leading-relaxed overflow-x-auto">
                  {JSON.stringify(folderStructure, null, 2)}
                </pre>
              </Card>
            )}

            <Card padding="lg">
              <h3 className="text-sm font-medium text-text-primary mb-3">
                Technology Stack
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(techStack).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between border border-border-primary rounded-md p-2"
                  >
                    <span className="text-xs text-text-tertiary capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-text-primary font-medium">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {patterns.length > 0 && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  Detected Patterns ({patterns.length})
                </h3>
                <div className="space-y-2">
                  {patterns.map((pat) => (
                    <div
                      key={pat.id}
                      className="border border-border-primary rounded-md p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-text-primary">
                          {pat.pattern_name}
                        </span>
                        <span className="text-xs text-text-tertiary">
                          {pat.confidence}%
                        </span>
                      </div>
                      {pat.description && (
                        <p className="text-xs text-text-secondary">
                          {pat.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {adrs.length > 0 && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  Architecture Decision Records ({adrs.length})
                </h3>
                <div className="space-y-3">
                  {adrs.map((adr) => (
                    <div
                      key={adr.id}
                      className="border border-border-primary rounded-md p-3"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs text-text-muted font-mono">
                          ADR-{String(adr.number).padStart(3, "0")}
                        </span>
                        <span className="text-sm font-medium text-text-primary">
                          {adr.title}
                        </span>
                        <Badge
                          variant={
                            adr.status === "accepted" ? "success" : "warning"
                          }
                          size="sm"
                        >
                          {adr.status}
                        </Badge>
                      </div>
                      {adr.decision && (
                        <p className="text-xs text-text-secondary">
                          {adr.decision}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {deps.length > 0 && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  Dependencies ({deps.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {deps.map((dep: string) => (
                    <Badge key={dep} variant="default" size="sm" className="font-mono">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "learning" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card padding="md">
                <p className="text-xs text-text-tertiary mb-1">Difficulty</p>
                <p className="text-lg font-semibold text-text-primary capitalize">
                  {repo.learning_difficulty}
                </p>
              </Card>
              <Card padding="md">
                <p className="text-xs text-text-tertiary mb-1">Recommendation</p>
                <p className="text-lg font-semibold text-text-primary capitalize">
                  {repo.recommendation_type}
                </p>
              </Card>
            </div>

            {repo.why_bhavya_cares && (
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} className="text-accent-blue" />
                  <h3 className="text-sm font-medium text-text-primary">
                    Why Learn This
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {repo.why_bhavya_cares}
                </p>
              </Card>
            )}

            {prerequisites.length > 0 && (
              <Card padding="lg">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  Prerequisites
                </h3>
                <div className="space-y-2">
                  {prerequisites.map((prereq: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm text-text-secondary"
                    >
                      <span className="w-5 h-5 rounded-full bg-bg-tertiary border border-border-primary flex items-center justify-center text-[10px] text-text-tertiary">
                        {i + 1}
                      </span>
                      {prereq}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {repo.learning_reading_order && (
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-accent-yellow" />
                  <h3 className="text-sm font-medium text-text-primary">
                    Reading Order
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {repo.learning_reading_order}
                </p>
              </Card>
            )}

            <Card padding="lg">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={14} className="text-score-excellent" />
                <h3 className="text-sm font-medium text-text-primary">
                  Start Learning
                </h3>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                Ready to dive in? Explore the architecture, study the
                patterns, and build something.
              </p>
              <Link
                href={`/repositories/${repo.id}/learning`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue text-white text-sm rounded-md hover:bg-accent-blue-hover transition-colors"
              >
                Open Learning Mode
                <ChevronRight size={14} />
              </Link>
            </Card>
          </div>
        )}

        {activeTab === "advisor" && (
          <div className="space-y-6 animate-fade-in">
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-accent-blue" />
                <h3 className="text-sm font-medium text-text-primary">
                  Engineering Advisor
                </h3>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Get a comprehensive engineering assessment of this repository.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href={`/repositories/${repo.id}/advisor`}
                  className="flex items-center gap-3 p-3 bg-bg-primary border border-border-primary rounded hover:border-accent-blue transition-colors"
                >
                  <ClipboardCheck size={16} className="text-accent-blue" />
                  <div>
                    <p className="text-sm text-text-primary">Full Assessment</p>
                    <p className="text-[10px] text-text-muted">
                      Review, debt, recommendations
                    </p>
                  </div>
                </Link>
                <Link
                  href={`/repositories/${repo.id}/debt`}
                  className="flex items-center gap-3 p-3 bg-bg-primary border border-border-primary rounded hover:border-accent-blue transition-colors"
                >
                  <AlertTriangle size={16} className="text-score-fair" />
                  <div>
                    <p className="text-sm text-text-primary">Technical Debt</p>
                    <p className="text-[10px] text-text-muted">
                      Categorized debt register
                    </p>
                  </div>
                </Link>
                <Link
                  href={`/repositories/${repo.id}/plan`}
                  className="flex items-center gap-3 p-3 bg-bg-primary border border-border-primary rounded hover:border-accent-blue transition-colors"
                >
                  <Map size={16} className="text-accent-purple" />
                  <div>
                    <p className="text-sm text-text-primary">
                      Implementation Plan
                    </p>
                    <p className="text-[10px] text-text-muted">
                      Roadmap and milestones
                    </p>
                  </div>
                </Link>
                <Link
                  href={`/repositories/${repo.id}/architecture-advisor`}
                  className="flex items-center gap-3 p-3 bg-bg-primary border border-border-primary rounded hover:border-accent-blue transition-colors"
                >
                  <GitCompare size={16} className="text-accent-green" />
                  <div>
                    <p className="text-sm text-text-primary">
                      Compare Architecture
                    </p>
                    <p className="text-[10px] text-text-muted">
                      vs elite repositories
                    </p>
                  </div>
                </Link>
              </div>
            </Card>

            <Card padding="lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-accent-yellow" />
                <h3 className="text-sm font-medium text-text-primary">
                  Quick Insights
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-bg-primary border border-border-primary rounded">
                  <span className="text-sm text-text-secondary">
                    Patterns Detected
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {patterns.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-primary border border-border-primary rounded">
                  <span className="text-sm text-text-secondary">
                    ADRs Documented
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {adrs.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-primary border border-border-primary rounded">
                  <span className="text-sm text-text-secondary">
                    Knowledge Packages
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {knowledge.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-primary border border-border-primary rounded">
                  <span className="text-sm text-text-secondary">Dependencies</span>
                  <span className="text-sm font-medium text-text-primary">
                    {deps.length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6 animate-fade-in">
            {repo.latest_commit && (
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-accent-blue" />
                  <h3 className="text-sm font-medium text-text-primary">
                    Latest Commit
                  </h3>
                </div>
                <p className="text-sm text-text-secondary font-mono">
                  {repo.latest_commit}
                </p>
              </Card>
            )}

            {repo.latest_release && (
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-score-excellent" />
                  <h3 className="text-sm font-medium text-text-primary">
                    Latest Release
                  </h3>
                </div>
                <p className="text-sm text-text-secondary">
                  {repo.latest_release}
                </p>
              </Card>
            )}

            <Card padding="lg">
              <div className="flex items-center gap-2 mb-2">
                <Wrench size={14} className="text-accent-yellow" />
                <h3 className="text-sm font-medium text-text-primary">
                  MCP Recommendations
                </h3>
              </div>
              {mcpRecs.length > 0 ? (
                <div className="space-y-2">
                  {mcpRecs.map((mcp: string) => (
                    <div
                      key={mcp}
                      className="flex items-center gap-2 text-xs text-text-secondary"
                    >
                      <ExternalLink size={10} />
                      {mcp}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted">
                  No MCP recommendations
                </p>
              )}
            </Card>

            <Card padding="lg">
              <div className="flex items-center gap-2 mb-2">
                <Wrench size={14} className="text-accent-blue" />
                <h3 className="text-sm font-medium text-text-primary">
                  CLI Recommendations
                </h3>
              </div>
              {cliRecs.length > 0 ? (
                <div className="space-y-2">
                  {cliRecs.map((cli: string) => (
                    <div
                      key={cli}
                      className="flex items-center gap-2 text-xs text-text-secondary font-mono"
                    >
                      <ChevronRight size={10} />
                      {cli}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted">
                  No CLI recommendations
                </p>
              )}
            </Card>

            {repo.readme_content && (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-primary">
                    README
                  </h3>
                  <button
                    onClick={() => copyToClipboard(repo.readme_content || "")}
                    className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="text-sm text-text-secondary whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                  {repo.readme_content}
                </pre>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
