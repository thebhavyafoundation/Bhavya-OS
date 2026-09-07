import { GitBranch } from "lucide-react";
import { requirePolicy } from "@/lib/require-role";
import {
  getGitHubRepository,
  getGitHubRepoHealth,
  getGitHubRepoReviews,
  getGitHubRepoDebt,
  getGitHubRepoADRs,
} from "@/lib/os-data";
import Link from "next/link";

export const metadata = {
  title: "Repository Detail | Bhavya Foundation",
  description: "Repository analysis and intelligence",
};

export default async function RepositoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePolicy("/os/github");
  const { id } = await params;

  const repo = getGitHubRepository(id);
  if (!repo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Repository Not Found
          </h1>
          <p className="text-sm text-text-tertiary mt-2">
            No repository found for &ldquo;{id}&rdquo;
          </p>
        </div>
        <Link
          href="/os/github/repositories"
          className="text-sm text-accent-gold hover:underline"
        >
          _back to repositories
        </Link>
      </div>
    );
  }

  const health = getGitHubRepoHealth(repo.id);
  const reviews = getGitHubRepoReviews(repo.id);
  const debt = getGitHubRepoDebt(repo.id);
  const adrs = getGitHubRepoADRs(repo.id);

  let techStack: Record<string, string> = {};
  try {
    techStack = JSON.parse(repo.tech_stack || "{}");
  } catch {
    /* ignore */
  }

  let topics: string[] = [];
  try {
    topics = JSON.parse(repo.topics || "[]");
  } catch {
    /* ignore */
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/os/github/repositories"
          className="text-xs text-accent-gold hover:underline mb-2 inline-block"
        >
          _back to repositories
        </Link>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          {repo.name}
        </h1>
        <p className="text-sm text-text-tertiary mt-2">{repo.description}</p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {repo.language && (
            <span className="text-xs px-2 py-1 rounded bg-bg-secondary border border-border-primary text-text-tertiary">
              {repo.language}
            </span>
          )}
          <span className="text-xs px-2 py-1 rounded bg-accent-gold/10 text-accent-gold">
            {repo.engineering_maturity}
          </span>
          <span className="text-xs text-text-muted">
            ★ {repo.stars} · {repo.forks} forks · {repo.license}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <span className="text-xs text-text-tertiary">Health Score</span>
          <div className="text-2xl font-bold text-text-primary mt-1">
            {repo.health_score}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <span className="text-xs text-text-tertiary">Technology Score</span>
          <div className="text-2xl font-bold text-text-primary mt-1">
            {repo.technology_score}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <span className="text-xs text-text-tertiary">Bhavya Score</span>
          <div className="text-2xl font-bold text-accent-gold mt-1">
            {repo.bhavya_score}
          </div>
        </div>
      </div>

      {/* Why Bhavya Cares */}
      {repo.why_bhavya_cares && (
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-xl p-5">
          <h2 className="text-sm font-semibold text-accent-gold mb-2">
            Why Bhavya Cares
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {repo.why_bhavya_cares}
          </p>
        </div>
      )}

      {/* Architecture summary */}
      {repo.architecture_summary && (
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-2">
            Architecture
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {repo.architecture_summary}
          </p>
        </div>
      )}

      {/* Tech stack */}
      {Object.keys(techStack).length > 0 && (
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(techStack).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-text-tertiary">{key}:</span>{" "}
                <span className="text-text-primary">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className="text-[11px] px-2 py-1 rounded-full bg-bg-secondary border border-border-primary text-text-tertiary"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Engineering Health */}
      {health && (
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <h2 className="text-sm font-semibold text-text-primary">
              Engineering Health
            </h2>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Overall", value: health.overall_score },
              { label: "Documentation", value: health.documentation_score },
              { label: "Test Coverage", value: health.test_coverage_score },
              {
                label: "Dependency Freshness",
                value: health.dependency_freshness_score,
              },
              {
                label: "Release Cadence",
                value: health.release_cadence_score,
              },
              {
                label: "Architecture",
                value: health.architecture_consistency_score,
              },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-[11px] text-text-muted">{item.label}</span>
                <div className="mt-1 h-1.5 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-gold rounded-full"
                    style={{ width: `${Math.min(100, item.value)}%` }}
                  />
                </div>
                <span className="text-xs text-text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <h2 className="text-sm font-semibold text-text-primary">
              Reviews ({reviews.length})
            </h2>
          </div>
          <div className="divide-y divide-border-primary">
            {reviews.map((review) => (
              <div key={review.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-primary">
                    {review.review_type}
                  </span>
                  <span className="text-xs text-accent-gold">
                    _score: {review.overall_score}
                  </span>
                </div>
                {review.verdict && (
                  <p className="text-xs text-text-secondary">{review.verdict}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Debt */}
      {debt.length > 0 && (
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <h2 className="text-sm font-semibold text-text-primary">
              Technical Debt ({debt.length})
            </h2>
          </div>
          <div className="divide-y divide-border-primary">
            {debt.map((item) => (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-primary">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        item.severity === "critical"
                          ? "bg-red-500/10 text-red-400"
                          : item.severity === "high"
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-accent-gold/10 text-accent-gold"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADRs */}
      {adrs.length > 0 && (
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <h2 className="text-sm font-semibold text-text-primary">
              Architecture Decision Records ({adrs.length})
            </h2>
          </div>
          <div className="divide-y divide-border-primary">
            {adrs.map((adr) => (
              <div key={adr.id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-text-muted">
                    ADR-{adr.number}
                  </span>
                  <span className="text-sm text-text-primary">{adr.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      adr.status === "accepted"
                        ? "bg-green-500/10 text-green-400"
                        : adr.status === "proposed"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    {adr.status}
                  </span>
                </div>
                {adr.decision && (
                  <p className="text-xs text-text-secondary mt-1">
                    {adr.decision}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
