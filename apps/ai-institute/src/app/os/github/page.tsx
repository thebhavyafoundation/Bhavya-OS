import { requirePolicy } from "@/lib/require-role";
import { getGitHubData } from "@/lib/os-data";
import { getLocalRepoState } from "@/lib/local-repo-state";
import {
  GitBranch,
  Activity,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "GitHub Intelligence | Bhavya Foundation",
  description: "Repository analysis, patterns, and code intelligence",
};

export default async function GitHubPage() {
  await requirePolicy("/os/github");
  const data = getGitHubData();
  const localRepo = getLocalRepoState();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          GitHub Intelligence
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Repository analysis, patterns, and code intelligence
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-green-400" />
            <span className="text-xs text-text-tertiary">Repositories</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {data.totalRepos}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">Avg Health</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {data.avgHealthScore}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">Avg Bhavya Score</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {data.avgBhavyaScore}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-text-tertiary">Tech Radar</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {data.techRadar.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repository list */}
        <div className="lg:col-span-2 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold text-text-primary">
                Repositories
              </span>
            </div>
            <Link
              href="/os/github/repositories"
              className="text-xs text-accent-gold hover:underline flex items-center gap-1"
            >
              View all <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border-primary">
            {data.repositories.slice(0, 8).map((repo) => (
              <Link
                key={repo.id}
                href={`/os/github/repositories/${repo.slug || repo.id}`}
                className="px-4 py-3 hover:bg-bg-primary/50 transition-colors block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary truncate">
                        {repo.name}
                      </span>
                      {repo.language && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-primary text-text-tertiary">
                          {repo.language}
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold">
                        {repo.engineering_maturity}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 truncate">
                      {repo.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 text-xs text-text-tertiary">
                    <span>★ {repo.stars}</span>
                    <span>_score: {repo.bhavya_score}</span>
                  </div>
                </div>
              </Link>
            ))}
            {data.repositories.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-text-muted">
                  No repositories seeded yet. Run the GitHub OS seed endpoint.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: tech radar + recommendations */}
        <div className="space-y-6">
          {/* Tech Radar */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border-primary">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent-gold" />
                <span className="text-sm font-semibold text-text-primary">
                  Technology Radar
                </span>
              </div>
            </div>
            <div className="divide-y divide-border-primary">
              {data.techRadar.slice(0, 8).map((item) => (
                <div key={item.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-primary">{item.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        item.ring === "adopt"
                          ? "bg-green-500/10 text-green-400"
                          : item.ring === "trial"
                            ? "bg-accent-gold/10 text-accent-gold"
                            : item.ring === "assess"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-text-muted/10 text-text-muted"
                      }`}
                    >
                      {item.ring}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {item.category}
                  </p>
                </div>
              ))}
              {data.techRadar.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-text-muted">No tech radar data</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border-primary">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-gold" />
                <span className="text-sm font-semibold text-text-primary">
                  Recommendations
                </span>
              </div>
            </div>
            <div className="divide-y divide-border-primary">
              {data.recommendations.slice(0, 6).map((rec) => (
                <div key={rec.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-primary truncate">
                      {rec.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ml-2 flex-shrink-0 ${
                        rec.priority === "critical"
                          ? "bg-red-500/10 text-red-400"
                          : rec.priority === "high"
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-accent-gold/10 text-accent-gold"
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {rec.type} · {rec.status}
                  </p>
                </div>
              ))}
              {data.recommendations.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-text-muted">No recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* This repository — live local checkout state */}
      <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">
              This repository
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold">
              live local state
            </span>
          </div>
        </div>
        <div className="px-4 py-3.5">
          {localRepo.available ? (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-text-tertiary">
              <span>
                branch{" "}
                <span className="font-semibold text-text-primary">
                  {localRepo.branch}
                </span>
              </span>
              <span title={localRepo.headSubject}>
                HEAD{" "}
                <span className="font-mono text-text-primary">
                  {localRepo.headSha}
                </span>
              </span>
              <span>
                working tree{" "}
                <span className="font-semibold text-text-primary">
                  {localRepo.clean ? "clean" : "modified"}
                </span>
              </span>
              {localRepo.ahead !== undefined &&
                localRepo.behind !== undefined && (
                  <span>
                    vs upstream{" "}
                    <span className="font-semibold text-text-primary">
                      +{localRepo.ahead}/-{localRepo.behind}
                    </span>
                  </span>
                )}
            </div>
          ) : (
            <p className="text-xs text-text-muted">
              Git state unavailable in this runtime
              {localRepo.reason ? ` — ${localRepo.reason}` : ""}.
            </p>
          )}
        </div>
      </div>

      {/* Recent activity */}
      {data.recentActivity.length > 0 && (
        <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold text-text-primary">
                Recent Activity
              </span>
            </div>
          </div>
          <div className="divide-y divide-border-primary">
            {data.recentActivity.slice(0, 10).map((event) => (
              <div key={event.id} className="px-4 py-2.5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-text-primary">
                    {event.title}
                  </span>
                  {event.description && (
                    <p className="text-[11px] text-text-muted truncate">
                      {event.description}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-text-muted flex-shrink-0">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
