"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  BookOpen,
  Layers,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

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
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#52525b] mb-6">
            <Link href="/" className="hover:text-[#fafafa] transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#71717a]">Knowledge</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#fafafa]">Knowledge</h1>
            <p className="text-sm text-[#71717a] mt-1">
              Patterns, packages, and engineering insights
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]"
              />
              <input
                type="text"
                placeholder="Search knowledge..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-[#27272a] rounded-md text-sm text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#3f3f46]"
              />
            </div>
            <div className="flex gap-1 bg-[#111111] border border-[#27272a] rounded-md p-1">
              <button
                onClick={() => setActiveTab("packages")}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  activeTab === "packages"
                    ? "bg-[#27272a] text-[#fafafa]"
                    : "text-[#71717a] hover:text-[#fafafa]"
                }`}
              >
                Packages ({packages.length})
              </button>
              <button
                onClick={() => setActiveTab("patterns")}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  activeTab === "patterns"
                    ? "bg-[#27272a] text-[#fafafa]"
                    : "text-[#71717a] hover:text-[#fafafa]"
                }`}
              >
                Patterns ({patterns.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#111111] border border-[#27272a] rounded-lg p-5 animate-pulse"
                >
                  <div className="h-4 bg-[#27272a] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[#27272a] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : activeTab === "packages" ? (
            filteredPackages.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={24} className="mx-auto text-[#52525b] mb-3" />
                <p className="text-sm text-[#71717a]">
                  {search
                    ? "No packages match your search"
                    : "No knowledge packages yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPackages.map((kp) => (
                  <div
                    key={kp.id}
                    className="bg-[#111111] border border-[#27272a] rounded-lg p-5 hover:border-[#3f3f46] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[10px] text-[#52525b] uppercase tracking-wider">
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
                    <p className="text-sm text-[#a1a1aa] leading-relaxed mb-3">
                      {kp.content}
                    </p>
                    <div className="flex items-center justify-between">
                      {kp.repository_id && (
                        <Link
                          href={`/repositories/${kp.repository_id}`}
                          className="flex items-center gap-1.5 text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                        >
                          <ExternalLink size={10} />
                          View repository
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : filteredPatterns.length === 0 ? (
            <div className="text-center py-20">
              <Layers size={24} className="mx-auto text-[#52525b] mb-3" />
              <p className="text-sm text-[#71717a]">
                {search ? "No patterns match your search" : "No patterns yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredPatterns.map((pat) => (
                <div
                  key={pat.id}
                  className="bg-[#111111] border border-[#27272a] rounded-lg p-5 hover:border-[#3f3f46] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-[#fafafa]">
                      {pat.name}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-[#27272a] text-[#a1a1aa] capitalize">
                      {pat.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mb-3 line-clamp-2">
                    {pat.explanation}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#52525b] capitalize">
                      {pat.difficulty}
                    </span>
                    {pat.bhavya_recommendation && (
                      <span className="text-[10px] text-[#3b82f6]">
                        Bhavya recommends
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
