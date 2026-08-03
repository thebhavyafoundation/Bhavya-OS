import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
}: StatCardProps) {
  return (
    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 hover:border-[#3f3f46] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium text-[#71717a] uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-[#71717a]">{icon}</span>}
      </div>
      <div className="text-[24px] font-bold text-[#fafafa]">{value}</div>
      {change && (
        <div
          className={`text-[12px] mt-1 ${changeType === "positive" ? "text-[#22c55e]" : changeType === "negative" ? "text-[#ef4444]" : "text-[#71717a]"}`}
        >
          {change}
        </div>
      )}
    </div>
  );
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getActivityColor(type: string) {
  switch (type) {
    case "commit":
      return "bg-[#22c55e]";
    case "knowledge":
      return "bg-[#a855f7]";
    case "discovery":
      return "bg-[#3b82f6]";
    case "recommendation":
      return "bg-[#eab308]";
    default:
      return "bg-[#71717a]";
  }
}

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-[#111111] border border-[#27272a] rounded-lg">
      <div className="px-5 py-4 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa]">
          Recent Activity
        </h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="px-5 py-3 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getActivityColor(activity.type)}`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#fafafa]">{activity.title}</div>
                {activity.description && (
                  <div className="text-[12px] text-[#71717a] mt-0.5 truncate">
                    {activity.description}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-[#71717a] flex-shrink-0">
                {timeAgo(activity.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RepoItem {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  health_score: number;
}

function getHealthColor(score: number) {
  if (score >= 90) return "text-[#22c55e]";
  if (score >= 75) return "text-[#eab308]";
  return "text-[#ef4444]";
}

export function RepositoryWidget({
  repositories,
}: {
  repositories: RepoItem[];
}) {
  return (
    <div className="bg-[#111111] border border-[#27272a] rounded-lg">
      <div className="px-5 py-4 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa]">
          Recent Repositories
        </h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="px-5 py-3 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[#27272a] flex items-center justify-center text-[#71717a] text-[11px] font-mono">
                {repo.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#fafafa] truncate">
                  {repo.name}
                </div>
                <div className="text-[12px] text-[#71717a] truncate">
                  {repo.description}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-[12px] font-medium ${getHealthColor(repo.health_score)}`}
                >
                  {repo.health_score}
                </div>
                <div className="text-[10px] text-[#71717a]">health</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface KPItem {
  id: string;
  title: string;
  category: string;
  quality_score: number;
}

function getCategoryColor(category: string) {
  switch (category) {
    case "architecture":
      return "bg-[#3b82f6]/20 text-[#3b82f6]";
    case "engineering":
      return "bg-[#22c55e]/20 text-[#22c55e]";
    case "research":
      return "bg-[#a855f7]/20 text-[#a855f7]";
    case "intelligence":
      return "bg-[#eab308]/20 text-[#eab308]";
    case "ui":
      return "bg-[#06b6d4]/20 text-[#06b6d4]";
    default:
      return "bg-[#71717a]/20 text-[#71717a]";
  }
}

export function KnowledgeWidget({ packages }: { packages: KPItem[] }) {
  return (
    <div className="bg-[#111111] border border-[#27272a] rounded-lg">
      <div className="px-5 py-4 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa]">
          Recent Knowledge Packages
        </h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {packages.map((kp) => (
          <div
            key={kp.id}
            className="px-5 py-3 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${getCategoryColor(kp.category)}`}
              >
                {kp.category}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#fafafa] truncate">
                  {kp.title}
                </div>
              </div>
              <div className="text-[12px] text-[#71717a]">
                {kp.quality_score}/100
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RadarItem {
  id: string;
  name: string;
  category: string;
  ring: string;
  score: number;
}

function getRingColor(ring: string) {
  switch (ring) {
    case "adopt":
      return "bg-[#22c55e]/20 text-[#22c55e]";
    case "trial":
      return "bg-[#3b82f6]/20 text-[#3b82f6]";
    case "assess":
      return "bg-[#eab308]/20 text-[#eab308]";
    case "hold":
      return "bg-[#ef4444]/20 text-[#ef4444]";
    default:
      return "bg-[#71717a]/20 text-[#71717a]";
  }
}

export function RadarWidget({ items }: { items: RadarItem[] }) {
  return (
    <div className="bg-[#111111] border border-[#27272a] rounded-lg">
      <div className="px-5 py-4 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa]">
          Technology Radar
        </h3>
      </div>
      <div className="p-4 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1a1a1a] transition-colors"
          >
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${getRingColor(item.ring)}`}
            >
              {item.ring}
            </span>
            <span className="text-sm text-[#fafafa] flex-1">{item.name}</span>
            <span className="text-[11px] text-[#71717a]">{item.category}</span>
            <span className="text-[12px] font-medium text-[#a1a1aa]">
              {item.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RecItem {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-[#ef4444]/20 text-[#ef4444]";
    case "medium":
      return "bg-[#eab308]/20 text-[#eab308]";
    case "low":
      return "bg-[#22c55e]/20 text-[#22c55e]";
    default:
      return "bg-[#71717a]/20 text-[#71717a]";
  }
}

export function RecommendationWidget({ items }: { items: RecItem[] }) {
  return (
    <div className="bg-[#111111] border border-[#27272a] rounded-lg">
      <div className="px-5 py-4 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa]">
          Recommendations
        </h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {items.map((item) => (
          <div
            key={item.id}
            className="px-5 py-3 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(item.priority)}`}
              >
                {item.priority}
              </span>
              <span className="text-[10px] text-[#71717a] uppercase">
                {item.type}
              </span>
            </div>
            <div className="text-sm text-[#fafafa]">{item.title}</div>
            <div className="text-[12px] text-[#71717a] mt-0.5">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PatternItem {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  educational_value: string | null;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "bg-[#22c55e]/20 text-[#22c55e]";
    case "intermediate":
      return "bg-[#3b82f6]/20 text-[#3b82f6]";
    case "advanced":
      return "bg-[#eab308]/20 text-[#eab308]";
    case "expert":
      return "bg-[#ef4444]/20 text-[#ef4444]";
    default:
      return "bg-[#71717a]/20 text-[#71717a]";
  }
}

export function PatternWidget({ patterns }: { patterns: PatternItem[] }) {
  return (
    <div className="bg-[#111111] border border-[#27272a] rounded-lg">
      <div className="px-5 py-4 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa]">
          Engineering Patterns
        </h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className="px-5 py-3 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-[#fafafa]">{pattern.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${getDifficultyColor(pattern.difficulty)}`}
              >
                {pattern.difficulty}
              </span>
            </div>
            <div className="text-[12px] text-[#71717a] capitalize">
              {pattern.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HealthItem {
  id: string;
  repository_id: string;
  overall_score: number;
  repository_name?: string;
}

export function HealthWidget({ items }: { items: HealthItem[] }) {
  return (
    <div className="bg-[#111111] border border-[#27272a] rounded-lg">
      <div className="px-5 py-4 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa]">
          Engineering Health
        </h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {items.map((item) => (
          <div
            key={item.id}
            className="px-5 py-3 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#fafafa] truncate">
                  {item.repository_name || item.repository_id}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.overall_score >= 90 ? "bg-[#22c55e]" : item.overall_score >= 80 ? "bg-[#3b82f6]" : item.overall_score >= 70 ? "bg-[#eab308]" : "bg-[#ef4444]"}`}
                    style={{ width: `${item.overall_score}%` }}
                  />
                </div>
                <span
                  className={`text-[12px] font-medium ${getHealthColor(item.overall_score)}`}
                >
                  {item.overall_score}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
