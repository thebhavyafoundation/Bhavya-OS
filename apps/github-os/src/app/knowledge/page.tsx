"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  BookOpen,
  Layers,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  Badge,
  Skeleton,
  Breadcrumb,
  EmptyState,
  AppLayout,
} from "@bhavya/platform-ui";

interface KnowledgePackage {
  id: string;
  repository_id: string | null;
  category: string;
  title: string;
  content: string;
  tags: string;
  quality_score: number;
  repository_name?: string;
}

interface Pattern {
  id: string;
  name: string;
  slug: string;
  category: string;
  explanation: string;
  difficulty: string;
  educational_value: string | null;
  bhavya_recommendation: string | null;
}

export default function KnowledgePage() {
  const [packages, setPackages] = useState<KnowledgePackage[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"packages" | "patterns">(
    "packages",
  );

  useEffect(() => {
    async function load() {
      const [kpRes, patRes] = await Promise.all([
        fetch("/api/knowledge"),
        fetch("/api/patterns"),
      ]);
      const kpData = await kpRes.json();
      const patData = await patRes.json();
      setPackages(kpData.packages || []);
      setPatterns(patData.patterns || []);
      setLoading(false);
    }
    load();
  }, []);

  const filteredPackages = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredPatterns = patterns.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout sidebar={<Sidebar />}>
      <div className="animate-fade-in">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Knowledge" },
          ]}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">
            Knowledge
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Patterns, packages, and engineering insights
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex-1 relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search knowledge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-secondary transition-colors"
            />
          </div>
          <div className="flex gap-1 bg-bg-secondary border border-border-primary rounded-md p-1">
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                activeTab === "packages"
                  ? "bg-bg-hover text-text-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              Packages ({packages.length})
            </button>
            <button
              onClick={() => setActiveTab("patterns")}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                activeTab === "patterns"
                  ? "bg-bg-hover text-text-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              Patterns ({patterns.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} padding="lg">
                <Skeleton width="30%" height={16} className="mb-2" />
                <Skeleton width="60%" height={12} />
              </Card>
            ))}
          </div>
        ) : activeTab === "packages" ? (
          filteredPackages.length === 0 ? (
            <EmptyState
              icon={<BookOpen size={24} />}
              title={search ? "No packages match your search" : "No knowledge packages yet"}
              description="Knowledge packages are generated when you analyze repositories"
            />
          ) : (
            <div className="space-y-3">
              {filteredPackages.map((kp, i) => (
                <Card
                  key={kp.id}
                  padding="lg"
                  hover
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider">
                        {kp.category}
                      </span>
                      <h3 className="text-sm font-medium text-text-primary mt-1">
                        {kp.title}
                      </h3>
                    </div>
                    <span className="text-xs text-text-tertiary">
                      Quality {kp.quality_score}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    {kp.content}
                  </p>
                  <div className="flex items-center justify-between">
                    {kp.repository_id && (
                      <Link
                        href={`/repositories/${kp.repository_id}`}
                        className="flex items-center gap-1.5 text-xs text-accent-blue hover:text-accent-blue-hover transition-colors"
                      >
                        <ExternalLink size={10} />
                        View repository
                      </Link>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : filteredPatterns.length === 0 ? (
          <EmptyState
            icon={<Layers size={24} />}
            title={search ? "No patterns match your search" : "No patterns yet"}
            description="Patterns are detected when you analyze repositories"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPatterns.map((pat, i) => (
              <Card
                key={pat.id}
                padding="lg"
                hover
                className="animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-text-primary">
                    {pat.name}
                  </h3>
                  <Badge variant="default" size="sm">
                    {pat.category}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                  {pat.explanation}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted capitalize">
                    {pat.difficulty}
                  </span>
                  {pat.bhavya_recommendation && (
                    <span className="text-[10px] text-accent-blue">
                      Bhavya recommends
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
