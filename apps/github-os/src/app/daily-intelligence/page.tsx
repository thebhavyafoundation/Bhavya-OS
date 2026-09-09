"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import {
  Brain,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowRight,
  Sparkles,
  BookOpen,
  Lightbulb,
  Shield,
  Cpu,
  Palette,
  GraduationCap,
  Zap,
  BarChart3,
  FlaskConical,
  Info,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { Card, Badge, Skeleton, AppLayout } from "@bhavya/platform-ui";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DailyRun {
  id: string;
  run_date: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  candidate_count: number;
  inspected_count: number;
  findings_count: number;
  errors_count: number;
  api_calls: number;
  duration_ms: number | null;
}

interface IntelligenceFinding {
  id: string;
  finding_type: string;
  category: string;
  title: string;
  description: string;
  confidence: string;
  confidence_score: number;
  verification_state: string;
  quality: string;
  relevance_to_bhavya: string;
  tags: string[];
  created_at: string;
}

interface BriefingItem {
  title: string;
  description: string;
  source: string;
  relevance: string;
  confidence: string;
  action: string;
}

interface DailyBriefing {
  id: string;
  run_date: string;
  top_discoveries: BriefingItem[];
  engineering_practices: BriefingItem[];
  ai_techniques: BriefingItem[];
  architecture_lessons: BriefingItem[];
  design_inspiration: BriefingItem[];
  learning_lessons: BriefingItem[];
  experiments: BriefingItem[];
  warnings: BriefingItem[];
  summary: string | null;
}

interface Trend {
  category: string;
  trend: string;
  direction: string;
  count: number;
  avg_confidence: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(ms: number | null): string {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "success";
    case "running":
      return "info";
    case "failed":
      return "error";
    case "partial":
      return "warning";
    default:
      return "default";
  }
}

function getConfidenceColor(confidence: string) {
  switch (confidence) {
    case "high":
      return "text-accent-green";
    case "medium":
      return "text-[var(--color-accent-gold)]";
    case "low":
      return "text-text-muted";
    default:
      return "text-text-muted";
  }
}

function getRelevanceColor(relevance: string) {
  switch (relevance) {
    case "high":
      return "text-[var(--color-accent-gold)]";
    case "medium":
      return "text-accent-blue";
    case "low":
      return "text-text-muted";
    default:
      return "text-text-muted";
  }
}

function getFindingIcon(type: string) {
  switch (type) {
    case "engineering_practice":
      return Zap;
    case "architecture_lesson":
      return Cpu;
    case "ai_technique":
      return Brain;
    case "design_principle":
      return Palette;
    case "visual_insight":
      return Palette;
    case "learning_lesson":
      return GraduationCap;
    case "security_concern":
      return Shield;
    case "license_concern":
      return AlertTriangle;
    default:
      return Lightbulb;
  }
}

// ─── Components ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  tooltip,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  tooltip?: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card padding="md" className="relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-2xl font-semibold text-text-primary">{value}</p>
            {trend && (
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  trend === "up"
                    ? "text-accent-green"
                    : trend === "down"
                      ? "text-red-400"
                      : "text-text-muted"
                }`}
              >
                {trend === "up" ? (
                  <TrendingUp size={12} />
                ) : trend === "down" ? (
                  <TrendingDown size={12} />
                ) : (
                  <Minus size={12} />
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <p className="text-xs text-text-muted">{label}</p>
            {tooltip && (
              <span title={tooltip} className="cursor-help">
                <Info size={10} className="text-text-muted" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function FindingCard({ finding }: { finding: IntelligenceFinding }) {
  const Icon = getFindingIcon(finding.finding_type);
  const [expanded, setExpanded] = useState(false);

  // Parse tags for source repository
  const sourceRepo = finding.tags.find((t) => t.startsWith("repo:"))?.replace("repo:", "");
  const sourceFile = finding.tags.find((t) => t.startsWith("file:"))?.replace("file:", "");

  return (
    <Card padding="md" hover className="group">
      <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg-tertiary flex-shrink-0 mt-0.5 group-hover:bg-[var(--color-accent-gold)]/10 transition-colors">
              <Icon size={14} className="text-text-secondary group-hover:text-[var(--color-accent-gold)] transition-colors" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium text-text-primary truncate">
                  {finding.title}
                </p>
                <Badge
                  variant={
                    finding.finding_type === "security_concern"
                      ? "error"
                      : finding.finding_type === "license_concern"
                        ? "warning"
                        : "default"
                  }
                  size="sm"
                >
                  {finding.finding_type.replace(/_/g, " ")}
                </Badge>
              </div>
              <p className="text-xs text-text-muted line-clamp-2">
                {finding.description}
              </p>
              {sourceRepo && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <GitBranch size={10} className="text-text-muted" />
                  <span className="text-[10px] text-text-muted font-mono">
                    {sourceRepo}
                  </span>
                  {sourceFile && (
                    <>
                      <span className="text-[10px] text-text-muted">·</span>
                      <span className="text-[10px] text-text-muted font-mono truncate max-w-[200px]">
                        {sourceFile}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={
                  finding.confidence === "high"
                    ? "success"
                    : finding.confidence === "medium"
                      ? "warning"
                      : "default"
                }
                size="sm"
              >
                {finding.confidence}
              </Badge>
              <Badge
                variant={
                  finding.relevance_to_bhavya === "high"
                    ? "purple"
                    : finding.relevance_to_bhavya === "medium"
                      ? "info"
                      : "default"
                }
                size="sm"
              >
                {finding.relevance_to_bhavya} relevance
              </Badge>
            </div>
            <div className="w-6 h-6 rounded flex items-center justify-center text-text-muted group-hover:bg-bg-tertiary transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border-primary space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-text-muted">Verification:</span>
              <span className="ml-2 text-text-secondary">
                {finding.verification_state}
              </span>
            </div>
            <div>
              <span className="text-text-muted">Quality:</span>
              <span className="ml-2 text-text-secondary">
                {finding.quality}
              </span>
            </div>
            <div>
              <span className="text-text-muted">Confidence Score:</span>
              <span className="ml-2 text-text-secondary">
                {(finding.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-text-muted">Discovered:</span>
              <span className="ml-2 text-text-secondary">
                {formatDate(finding.created_at)}
              </span>
            </div>
          </div>
          {finding.tags.length > 0 && (
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {finding.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-bg-tertiary border border-border-primary rounded text-[10px] text-text-muted font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function BriefingSection({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: BriefingItem[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-[var(--color-accent-gold)]/10">
          <Icon size={14} className="text-[var(--color-accent-gold)]" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="text-xs text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">
          {items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <Card key={i} padding="sm" className="group hover:border-[var(--color-accent-gold)]/20 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary mb-0.5">
                  {item.title}
                </p>
                <p className="text-xs text-text-muted line-clamp-2">
                  {item.description}
                </p>
                {item.source && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <ExternalLink size={10} className="text-text-muted" />
                    <span className="text-[10px] text-text-muted font-mono truncate">
                      {item.source}
                    </span>
                  </div>
                )}
                {item.action && (
                  <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 bg-[var(--color-accent-gold)]/5 rounded border border-[var(--color-accent-gold)]/10">
                    <ArrowRight size={10} className="text-[var(--color-accent-gold)]" />
                    <p className="text-xs text-[var(--color-accent-gold)] font-medium">
                      {item.action}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Badge
                  variant={
                    item.confidence === "high"
                      ? "success"
                      : item.confidence === "medium"
                        ? "warning"
                        : "default"
                  }
                  size="sm"
                >
                  {item.confidence}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function DailyIntelligenceDashboard() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [latestRun, setLatestRun] = useState<DailyRun | null>(null);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [findings, setFindings] = useState<IntelligenceFinding[]>([]);
  const [runs, setRuns] = useState<DailyRun[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);

  const [filterType, setFilterType] = useState<string>("all");
  const [filterConfidence, setFilterConfidence] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<
    "briefing" | "findings" | "trends" | "history"
  >("briefing");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, findingsRes, trendsRes, runsRes] = await Promise.all([
        fetch("/api/daily-intelligence"),
        fetch("/api/daily-intelligence/findings?limit=50"),
        fetch("/api/daily-intelligence/trends"),
        fetch("/api/daily-intelligence/runs?limit=10"),
      ]);

      // Check for authentication errors
      if (statusRes.status === 401 || findingsRes.status === 401) {
        setError(
          "Authentication required. Please sign in to access Daily Intelligence.",
        );
        setLoading(false);
        return;
      }

      const statusData = await statusRes.json();
      const findingsData = await findingsRes.json();
      const trendsData = await trendsRes.json();
      const runsData = await runsRes.json();

      if (statusData.success) {
        setLatestRun(statusData.latest_run);
        setBriefing(statusData.latest_briefing);
      }
      if (findingsData.success) setFindings(findingsData.findings || []);
      if (trendsData.success) setTrends(trendsData.trends || []);
      if (runsData.success) setRuns(runsData.runs || []);
    } catch {
      setError("Unable to connect to the intelligence API.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleTriggerRun = async () => {
    setTriggering(true);
    try {
      await fetch("/api/daily-intelligence", { method: "POST" });
      await loadData();
    } catch {
      // silent
    }
    setTriggering(false);
  };

  const filteredFindings = findings.filter((f) => {
    if (filterType !== "all" && f.finding_type !== filterType) return false;
    if (filterConfidence !== "all" && f.confidence !== filterConfidence)
      return false;
    return true;
  });

  const findingTypes = [...new Set(findings.map((f) => f.finding_type))];

  return (
    <AppLayout sidebar={<Sidebar />}>
      <div className="animate-fade-in">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Brain size={20} className="text-[var(--color-accent-gold)]" />
                <h1 className="text-2xl font-semibold text-text-primary">
                  Daily Intelligence
                </h1>
                {latestRun && (
                  <Badge
                    variant={getStatusColor(latestRun.status) as any}
                    size="sm"
                  >
                    {latestRun.status}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-tertiary">
                Continuous open-source discovery, extraction, and learning
              </p>
              {latestRun && (
                <p className="text-xs text-text-muted mt-1">
                  Last run: {formatDate(latestRun.completed_at || latestRun.started_at)} at {formatTime(latestRun.completed_at || latestRun.started_at)}
                  {latestRun.duration_ms && ` · ${formatDuration(latestRun.duration_ms)}`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-tertiary hover:text-text-primary hover:border-border-secondary transition-colors"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleTriggerRun}
                disabled={triggering}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-green)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Sparkles size={14} />
                {triggering ? "Running..." : "Trigger Run"}
              </button>
              <button
                onClick={() => setCmdOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-tertiary hover:text-text-primary hover:border-border-secondary transition-colors"
              >
                <Search size={14} />
                <kbd className="ml-2 px-1.5 py-0.5 bg-bg-tertiary border border-border-primary rounded text-[10px] font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>
        </header>

        {/* Stats */}
        {latestRun && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            <StatCard
              label="Status"
              value={latestRun.status}
              icon={CheckCircle2}
              color={
                latestRun.status === "completed"
                  ? "bg-accent-green/10 text-accent-green"
                  : "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]"
              }
              tooltip="Current pipeline execution status"
            />
            <StatCard
              label="Findings"
              value={latestRun.findings_count}
              icon={Lightbulb}
              color="bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]"
              tooltip="Intelligence insights extracted from repositories"
            />
            <StatCard
              label="Repos Inspected"
              value={latestRun.inspected_count}
              icon={BarChart3}
              color="bg-accent-blue/10 text-accent-blue"
              tooltip="Repositories analyzed in this run"
            />
            <StatCard
              label="API Calls"
              value={latestRun.api_calls}
              icon={Zap}
              color="bg-purple-500/10 text-purple-400"
              tooltip="GitHub API requests made during inspection"
            />
            <StatCard
              label="Duration"
              value={formatDuration(latestRun.duration_ms)}
              icon={Clock}
              color="bg-bg-tertiary text-text-secondary"
              tooltip="Total time for pipeline execution"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border-primary">
          {[
            { id: "briefing" as const, label: "Briefing", icon: BookOpen, count: briefing ? (briefing.top_discoveries.length + briefing.engineering_practices.length + briefing.ai_techniques.length + briefing.architecture_lessons.length + briefing.design_inspiration.length + briefing.learning_lessons.length + briefing.experiments.length + briefing.warnings.length) : 0 },
            { id: "findings" as const, label: "Findings", icon: Lightbulb, count: findings.length },
            { id: "trends" as const, label: "Trends", icon: TrendingUp, count: trends.length },
            { id: "history" as const, label: "Run History", icon: Clock, count: runs.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  activeTab === tab.id
                    ? "bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]"
                    : "bg-bg-tertiary text-text-muted"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} padding="lg">
                <Skeleton width="40%" height={16} className="mb-3" />
                <Skeleton width="80%" height={12} className="mb-2" />
                <Skeleton width="60%" height={12} />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card padding="lg" className="text-center">
            <AlertTriangle
              size={48}
              className="text-[var(--color-accent-gold)] mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Authentication Required
            </h3>
            <p className="text-sm text-text-muted mb-4">{error}</p>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-tertiary hover:text-text-primary hover:border-border-secondary transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </Card>
        ) : (
          <>
            {/* Briefing Tab */}
            {activeTab === "briefing" && (
              <div>
                {briefing ? (
                  <>
                    {briefing.summary && (
                      <Card padding="lg" className="mb-6">
                        <h3 className="text-sm font-medium text-text-primary mb-2">
                          Daily Summary
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {briefing.summary}
                        </p>
                      </Card>
                    )}
                    <BriefingSection
                      title="Top Discoveries"
                      items={briefing.top_discoveries}
                      icon={Sparkles}
                    />
                    <BriefingSection
                      title="Engineering Practices"
                      items={briefing.engineering_practices}
                      icon={Zap}
                    />
                    <BriefingSection
                      title="AI Techniques"
                      items={briefing.ai_techniques}
                      icon={Brain}
                    />
                    <BriefingSection
                      title="Architecture Lessons"
                      items={briefing.architecture_lessons}
                      icon={Cpu}
                    />
                    <BriefingSection
                      title="Design Inspiration"
                      items={briefing.design_inspiration}
                      icon={Palette}
                    />
                    <BriefingSection
                      title="Learning Lessons"
                      items={briefing.learning_lessons}
                      icon={GraduationCap}
                    />
                    <BriefingSection
                      title="Experiments"
                      items={briefing.experiments}
                      icon={FlaskConical}
                    />
                    <BriefingSection
                      title="Warnings"
                      items={briefing.warnings}
                      icon={AlertTriangle}
                    />
                  </>
                ) : (
                  <Card padding="lg" className="text-center">
                    <Brain size={48} className="text-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      No Briefing Yet
                    </h3>
                    <p className="text-sm text-text-muted mb-4">
                      Trigger a daily intelligence run to generate your first
                      briefing.
                    </p>
                    <button
                      onClick={handleTriggerRun}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-green)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Sparkles size={14} />
                      Trigger First Run
                    </button>
                  </Card>
                )}
              </div>
            )}

            {/* Findings Tab */}
            {activeTab === "findings" && (
              <div>
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Filter size={14} className="text-text-muted" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1.5 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary"
                  >
                    <option value="all">All Types</option>
                    {findingTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterConfidence}
                    onChange={(e) => setFilterConfidence(e.target.value)}
                    className="px-3 py-1.5 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary"
                  >
                    <option value="all">All Confidence</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <span className="text-xs text-text-muted">
                    {filteredFindings.length} findings
                  </span>
                </div>

                {/* Findings List */}
                {filteredFindings.length > 0 ? (
                  <div className="space-y-3">
                    {filteredFindings.map((finding) => (
                      <FindingCard key={finding.id} finding={finding} />
                    ))}
                  </div>
                ) : (
                  <Card padding="lg" className="text-center">
                    <Lightbulb
                      size={48}
                      className="text-text-muted mx-auto mb-4"
                    />
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      No Findings
                    </h3>
                    <p className="text-sm text-text-muted">
                      {findings.length === 0
                        ? "Run the intelligence pipeline to discover findings."
                        : "No findings match the current filters."}
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* Trends Tab */}
            {activeTab === "trends" && (
              <div>
                {trends.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trends.map((trend, i) => (
                      <Card key={i} padding="md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">
                            {trend.category}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              trend.direction === "up"
                                ? "text-accent-green"
                                : trend.direction === "down"
                                  ? "text-red-400"
                                  : "text-text-muted"
                            }`}
                          >
                            {trend.direction === "up"
                              ? "↑"
                              : trend.direction === "down"
                                ? "↓"
                                : "→"}{" "}
                            {trend.trend}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <span>{trend.count} findings</span>
                          <span>
                            Avg confidence:{" "}
                            {(trend.avg_confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card padding="lg" className="text-center">
                    <TrendingUp
                      size={48}
                      className="text-text-muted mx-auto mb-4"
                    />
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      No Trends Detected
                    </h3>
                    <p className="text-sm text-text-muted">
                      Run the intelligence pipeline multiple times to detect
                      trends.
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div>
                {runs.length > 0 ? (
                  <div className="space-y-3">
                    {runs.map((run) => (
                      <Link
                        key={run.id}
                        href={`/daily-intelligence/run/${run.id}`}
                      >
                        <Card padding="md" hover>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge
                                variant={getStatusColor(run.status) as any}
                                size="sm"
                              >
                                {run.status}
                              </Badge>
                              <div>
                                <p className="text-sm font-medium text-text-primary">
                                  {formatDate(run.run_date)}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {formatTime(run.started_at)}
                                  {run.duration_ms &&
                                    ` · ${formatDuration(run.duration_ms)}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-text-muted">
                              <span>{run.findings_count} findings</span>
                              <span>{run.inspected_count} inspected</span>
                              <span>{run.api_calls} API calls</span>
                              <ChevronRight size={14} />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card padding="lg" className="text-center">
                    <Clock size={48} className="text-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      No Runs Yet
                    </h3>
                    <p className="text-sm text-text-muted">
                      Trigger a run to start building history.
                    </p>
                  </Card>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="pt-8 mt-8 border-t border-border-primary text-center text-xs text-text-muted">
          Daily Intelligence Loop v1 — Bhavya Foundation
        </footer>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </AppLayout>
  );
}
