"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getNodeBySlug,
  getPrerequisites,
  getRelated,
  knowledgeGraph,
  getNodesByCategory,
} from "@/data/knowledge-graph";
import { useState } from "react";

const categoryColors: Record<string, string> = {
  fundamentals: "#22c55e",
  "machine-learning": "#3b82f6",
  "deep-learning": "#8b5cf6",
  nlp: "#06b6d4",
  "computer-vision": "#f59e0b",
  "generative-ai": "#ec4899",
  llm: "#6366f1",
  agents: "#ef4444",
  rag: "#14b8a6",
  embeddings: "#a855f7",
  infrastructure: "#64748b",
  deployment: "#0ea5e9",
  ethics: "#f97316",
  product: "#e11d48",
  research: "#7c3aed",
};

export default function ConceptPage() {
  const params = useParams();
  const slug = params.id as string;
  const node = getNodeBySlug(slug);
  const [activeTab, setActiveTab] = useState<
    "overview" | "examples" | "mistakes" | "interview" | "glossary"
  >("overview");

  if (!node) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Concept Not Found</h1>
          <Link
            href="/knowledge-graph"
            className="text-[#22c55e] hover:underline"
          >
            ← Back to Knowledge Graph
          </Link>
        </div>
      </div>
    );
  }

  const prerequisites = getPrerequisites(node.id);
  const related = getRelated(node.id);
  const sameCategory = getNodesByCategory(node.category).filter(
    (n) => n.id !== node.id,
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/knowledge-graph"
            className="text-sm text-white/50 hover:text-white/70 mb-4 inline-block"
          >
            ← Back to Knowledge Graph
          </Link>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{
                backgroundColor: categoryColors[node.category] + "30",
                color: categoryColors[node.category],
              }}
            >
              {node.title.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{node.title}</h1>
              <p className="text-white/60 text-lg">{node.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: categoryColors[node.category] + "20",
                    color: categoryColors[node.category],
                  }}
                >
                  {node.category
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </span>
                <span className="text-xs text-white/40">
                  {node.estimatedMinutes} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-lg p-1">
          {(
            [
              "overview",
              "examples",
              "mistakes",
              "interview",
              "glossary",
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Why It Exists */}
            <section>
              <h2 className="text-xl font-bold mb-3">Why It Exists</h2>
              <p className="text-white/60 leading-relaxed">
                {node.whyItExists}
              </p>
            </section>

            {/* History */}
            <section>
              <h2 className="text-xl font-bold mb-3">History</h2>
              <p className="text-white/60 leading-relaxed">{node.history}</p>
            </section>

            {/* Real-World Use Cases */}
            <section>
              <h2 className="text-xl font-bold mb-3">Real-World Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {node.realWorldUseCases.map((use, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/5 rounded-lg p-4"
                  >
                    <span className="text-[#22c55e] mt-0.5">▸</span>
                    <span className="text-white/70 text-sm">{use}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Prerequisites */}
            {prerequisites.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-3">Prerequisites</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prerequisites.map((pre) => (
                    <Link
                      key={pre.id}
                      href={`/concepts/${pre.slug}`}
                      className="flex items-center gap-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: categoryColors[pre.category] + "30",
                          color: categoryColors[pre.category],
                        }}
                      >
                        {pre.title.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{pre.title}</div>
                        <div className="text-xs text-white/40">
                          {pre.difficulty}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Concepts */}
            <section>
              <h2 className="text-xl font-bold mb-3">Related Concepts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/concepts/${rel.slug}`}
                    className="flex items-center gap-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: categoryColors[rel.category] + "30",
                        color: categoryColors[rel.category],
                      }}
                    >
                      {rel.title.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{rel.title}</div>
                      <div className="text-xs text-white/40">
                        {rel.difficulty}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "examples" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Examples</h2>
            {node.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <h3 className="font-semibold mb-2">{ex.title}</h3>
                <p className="text-white/60 text-sm mb-4">{ex.description}</p>
                {ex.code && (
                  <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm text-[#22c55e] font-mono">
                    {ex.code}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "mistakes" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Common Mistakes</h2>
            <div className="space-y-3">
              {node.commonMistakes.map((mistake, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                >
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span className="text-white/70 text-sm">{mistake}</span>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4">Interview Questions</h2>
            <div className="space-y-3">
              {node.interviewQuestions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
                >
                  <span className="text-blue-400 mt-0.5">Q</span>
                  <span className="text-white/70 text-sm">{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "interview" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Interview Questions</h2>
            <div className="space-y-3">
              {node.interviewQuestions.map((q, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-lg p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[#3b82f6] font-bold">{i + 1}</span>
                    <span className="text-white/80">{q}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "glossary" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Key Terms</h2>
            <div className="space-y-3">
              {node.glossary.map((term, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-lg p-5"
                >
                  <dt className="font-semibold text-[#22c55e] mb-1">
                    {term.term}
                  </dt>
                  <dd className="text-white/60 text-sm">{term.definition}</dd>
                </div>
              ))}
            </div>

            {node.references.length > 0 && (
              <>
                <h2 className="text-xl font-bold mt-8 mb-4">References</h2>
                <div className="space-y-3">
                  {node.references.map((ref, i) => (
                    <a
                      key={i}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#22c55e] font-medium">
                          {ref.title}
                        </span>
                        <span className="text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/10">
                          {ref.type}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Same Category */}
        {sameCategory.length > 0 && (
          <section className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-xl font-bold mb-4">
              More in{" "}
              {node.category
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sameCategory.slice(0, 4).map((n) => (
                <Link
                  key={n.id}
                  href={`/concepts/${n.slug}`}
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: categoryColors[n.category] + "30",
                      color: categoryColors[n.category],
                    }}
                  >
                    {n.title.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-white/40">
                      {n.difficulty} • {n.estimatedMinutes} min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
