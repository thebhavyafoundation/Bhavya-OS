"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  FolderGit2,
  Search,
  Plus,
  ChevronRight,
} from "lucide-react";
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
  description: string | null;
  language: string | null;
  bhavya_score: number;
  engineering_maturity: string;
  latest_commit: string | null;
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-score-excellent";
  if (score >= 80) return "text-score-good";
  if (score >= 70) return "text-score-fair";
  return "text-score-poor";
}

const maturityVariant: Record<string, "success" | "info" | "warning" | "purple"> = {
  emerging: "warning",
  developing: "info",
  mature: "success",
  exemplary: "purple",
};

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/repositories");
      const data = await res.json();
      setRepositories(data.repositories || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = repositories.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <AppLayout sidebar={<Sidebar />}>
      <div className="animate-fade-in">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Repositories" },
          ]}
          className="mb-6"
        />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Repositories
            </h1>
            <p className="text-sm text-text-tertiary mt-1">
              Browse and analyze codebases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-secondary transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton width={16} height={16} rounded="full" />
                    <div>
                      <Skeleton width={120} height={16} className="mb-1" />
                      <Skeleton width={200} height={12} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton width={60} height={20} rounded="full" />
                    <Skeleton width={30} height={16} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FolderGit2 size={24} />}
            title={search ? "No repositories match your search" : "No repositories yet"}
            description={search ? "Try a different search term" : "Add a repository to get started"}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((repo, i) => (
              <Link
                key={repo.id}
                href={`/repositories/${repo.id}`}
                className="block animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Card padding="md" hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <FolderGit2 size={16} className="text-text-muted flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {repo.name}
                        </p>
                        <p className="text-xs text-text-muted truncate max-w-lg">
                          {repo.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {repo.language && (
                        <span className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted">
                          <span className="w-2 h-2 rounded-full bg-accent-blue" />
                          {repo.language}
                        </span>
                      )}
                      <Badge
                        variant={maturityVariant[repo.engineering_maturity] || "default"}
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
    </AppLayout>
  );
}
