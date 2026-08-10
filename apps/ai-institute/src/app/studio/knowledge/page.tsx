"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  listKnowledgeObjects,
  deleteKnowledgeObject,
} from "@/lib/studio/runtime-client";
import { Brain, Plus, Trash2, ArrowRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default function KnowledgePage() {
  const [kos, setKos] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listKnowledgeObjects()
      .then((data) => setKos(data as AnyRecord[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = kos.filter(
    (ko) =>
      ko.title?.toLowerCase().includes(search.toLowerCase()) ||
      ko.domain?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Knowledge Object?")) return;
    await deleteKnowledgeObject(id);
    setKos((prev) => prev.filter((ko) => ko.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-6 h-6 text-accent-gold" />
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              Knowledge Objects
            </h1>
          </div>
          <p className="text-sm text-text-tertiary">
            {kos.length} objects · Browse, create, and manage
          </p>
        </div>
        <Link
          href="/studio/knowledge/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-gold text-text-inverse text-sm font-semibold hover:bg-accent-gold-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          New KO
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-gold/50 transition-colors"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-bg-tertiary rounded w-48 mb-2" />
              <div className="h-3 bg-bg-tertiary rounded w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((ko) => (
            <div
              key={ko.id}
              className="glass rounded-xl p-5 flex justify-between items-start hover:border-border-secondary transition-colors"
            >
              <Link href={`/studio/knowledge/${ko.id}/edit`} className="flex-1">
                <div className="text-base font-semibold text-text-primary mb-1">
                  {ko.title}
                </div>
                <div className="text-xs text-text-tertiary mb-2">
                  {ko.domain} · {ko.concepts?.length || 0} concepts
                </div>
                {ko.description && (
                  <div className="text-sm text-text-secondary line-clamp-2">
                    {ko.description}
                  </div>
                )}
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/studio/knowledge/${ko.id}/edit`}
                  className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(ko.id)}
                  className="p-2 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center text-sm text-text-muted bg-bg-secondary border border-border-primary rounded-xl">
          <Brain className="w-8 h-8 mx-auto mb-3 text-text-muted" />
          {search ? "No matching Knowledge Objects" : "No Knowledge Objects yet"}
        </div>
      )}
    </div>
  );
}
