"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import {
  FolderGit2,
  BookOpen,
  GraduationCap,
  Search,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  Badge,
  Skeleton,
  Breadcrumb,
  AppLayout,
} from "@bhavya/platform-ui";

interface Repository {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  bhavya_score: number;
  engineering_maturity: string;
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-score-excellent";
  if (score >= 80) return "text-score-good";
  if (score >= 70) return "text-score-fair";
  return "text-score-poor";
}

const maturityVariant: Record<
  string,
  "success" | "info" | "warning" | "purple"
> = {
  emerging: "warning",
  developing: "info",
  mature: "success",
  exemplary: "purple",
};

export default function Dashboard() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/repositories");
      const data = await res.json();
      setRepositories(data.repositories || []);
      setLoading(false);
    }
    load();
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
    <AppLayout sidebar={<Sidebar />}>
      <div className="animate-fade-in">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">
                Engineering Mentor
              </h1>
              <p className="text-sm text-text-tertiary mt-1">
                Understand repositories like a senior engineer
              </p>
            </div>
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-tertiary hover:text-text-primary hover:border-border-secondary transition-colors"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="ml-2 px-1.5 py-0.5 bg-bg-tertiary border border-border-primary rounded text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        </header>

        {/* Quick Actions */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-sm font-medium text-text-primary mb-4">
            What would you like to do?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/repositories"
              className="flex items-center gap-3 p-4 bg-bg-primary border border-border-primary rounded-lg hover:border-accent-blue transition-all duration-fast group"
            >
              <FolderGit2
                size={20}
                className="text-[var(--color-accent-gold)]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  Browse Repositories
                </p>
                <p className="text-[11px] text-text-muted truncate">
                  Discover and analyze codebases
                </p>
              </div>
              <ArrowRight
                size={14}
                className="text-text-muted group-hover:text-[var(--color-accent-gold)] transition-colors flex-shrink-0"
              />
            </Link>
            <Link
              href="/knowledge"
              className="flex items-center gap-3 p-4 bg-bg-primary border border-border-primary rounded-lg hover:border-accent-blue transition-all duration-fast group"
            >
              <BookOpen size={20} className="text-[var(--color-accent-gold)]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  Explore Knowledge
                </p>
                <p className="text-[11px] text-text-muted truncate">
                  Patterns, packages, and insights
                </p>
              </div>
              <ArrowRight
                size={14}
                className="text-text-muted group-hover:text-[var(--color-accent-gold)] transition-colors flex-shrink-0"
              />
            </Link>
            <Link
              href="/learning"
              className="flex items-center gap-3 p-4 bg-bg-primary border border-border-primary rounded-lg hover:border-accent-blue transition-all duration-fast group"
            >
              <GraduationCap size={20} className="text-accent-green" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  Start Learning
                </p>
                <p className="text-[11px] text-text-muted truncate">
                  Educational exports and materials
                </p>
              </div>
              <ArrowRight
                size={14}
                className="text-text-muted group-hover:text-accent-green transition-colors flex-shrink-0"
              />
            </Link>
          </div>
        </Card>

        {/* Recent Repositories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-text-primary">
              Recent Repositories
            </h2>
            <Link
              href="/repositories"
              className="text-xs text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-hover)] transition-colors"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} padding="md">
                  <Skeleton width="30%" height={16} className="mb-2" />
                  <Skeleton width="50%" height={12} />
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {repositories.slice(0, 5).map((repo, i) => (
                <Link
                  key={repo.id}
                  href={`/repositories/${repo.id}`}
                  className="block animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <Card padding="md" hover>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <FolderGit2
                          size={16}
                          className="text-text-muted flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {repo.name}
                          </p>
                          <p className="text-xs text-text-muted truncate max-w-md">
                            {repo.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {repo.language && (
                          <span className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" />
                            {repo.language}
                          </span>
                        )}
                        <Badge
                          variant={
                            maturityVariant[repo.engineering_maturity] ||
                            "default"
                          }
                          size="sm"
                        >
                          {repo.engineering_maturity}
                        </Badge>
                        <span
                          className={`text-sm font-semibold ${getScoreColor(repo.bhavya_score)}`}
                        >
                          {repo.bhavya_score}
                        </span>
                        <ChevronRight size={14} className="text-text-muted" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card padding="md">
            <p className="text-xs text-text-muted mb-1">Repositories</p>
            <p className="text-2xl font-semibold text-text-primary">
              {repositories.length}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-xs text-text-muted mb-1">Avg Bhavya Score</p>
            <p
              className={`text-2xl font-semibold ${getScoreColor(
                repositories.length
                  ? Math.round(
                      repositories.reduce((a, r) => a + r.bhavya_score, 0) /
                        repositories.length,
                    )
                  : 0,
              )}`}
            >
              {repositories.length
                ? Math.round(
                    repositories.reduce((a, r) => a + r.bhavya_score, 0) /
                      repositories.length,
                  )
                : "—"}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-xs text-text-muted mb-1">Maturity</p>
            <p className="text-2xl font-semibold text-text-primary">
              {
                repositories.filter(
                  (r) =>
                    r.engineering_maturity === "mature" ||
                    r.engineering_maturity === "exemplary",
                ).length
              }
              <span className="text-sm font-normal text-text-muted">
                {" "}
                / {repositories.length}
              </span>
            </p>
          </Card>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-border-primary text-center text-xs text-text-muted">
          GitHub OS v2.0 — Engineering Mentor — Bhavya Foundation
        </footer>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </AppLayout>
  );
}
