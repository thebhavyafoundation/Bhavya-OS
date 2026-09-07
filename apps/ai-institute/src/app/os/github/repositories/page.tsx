import { GitBranch } from "lucide-react";
import { requirePolicy } from "@/lib/require-role";
import { getGitHubData } from "@/lib/os-data";
import Link from "next/link";

export const metadata = {
  title: "Repositories | Bhavya Foundation",
  description: "Repository analysis and intelligence",
};

export default async function RepositoriesPage() {
  await requirePolicy("/os/github");
  const data = getGitHubData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Repositories
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          {data.totalRepos} repositories · avg health {data.avgHealthScore} ·
          avg bhavya score {data.avgBhavyaScore}
        </p>
      </div>

      {/* Language distribution */}
      {Object.keys(data.languageDistribution).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(data.languageDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([lang, count]) => (
              <span
                key={lang}
                className="text-[11px] px-2 py-1 rounded-full bg-bg-secondary border border-border-primary text-text-tertiary"
              >
                {lang} ({count})
              </span>
            ))}
        </div>
      )}

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">
              All Repositories
            </span>
          </div>
        </div>
        <div className="divide-y divide-border-primary">
          {data.repositories.map((repo) => (
            <Link
              key={repo.id}
              href={`/os/github/repositories/${repo.slug || repo.id}`}
              className="px-4 py-3.5 hover:bg-bg-primary/50 transition-colors block"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-text-primary">
                      {repo.name}
                    </span>
                    {repo.language && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-primary text-text-tertiary">
                        {repo.language}
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        repo.engineering_maturity === "elite"
                          ? "bg-green-500/10 text-green-400"
                          : repo.engineering_maturity === "mature"
                            ? "bg-accent-gold/10 text-accent-gold"
                            : "bg-text-muted/10 text-text-muted"
                      }`}
                    >
                      {repo.engineering_maturity}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold">
                      {repo.recommendation_type}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">{repo.description}</p>
                  {repo.why_bhavya_cares && (
                    <p className="text-[11px] text-accent-gold/80 mt-1 italic">
                      {repo.why_bhavya_cares}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-text-tertiary flex-shrink-0">
                  <span>★ {repo.stars} · {repo.forks} forks</span>
                  <span>_health: {repo.health_score}</span>
                  <span>_bhavya: {repo.bhavya_score}</span>
                </div>
              </div>
            </Link>
          ))}
          {data.repositories.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-text-muted">
                No repositories seeded. Start the GitHub OS app and hit{" "}
                <code className="text-accent-gold">/api/seed</code> to populate
                data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
