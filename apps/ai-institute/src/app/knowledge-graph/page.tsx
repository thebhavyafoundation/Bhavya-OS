"use client";

import { useState } from "react";
import Link from "next/link";
import {
  knowledgeGraph,
  getCategories,
  getNodesByCategory,
  getPrerequisites,
  getRelated,
  type KnowledgeNode,
  type KnowledgeCategory,
} from "@/data/knowledge-graph";

const categoryColors: Record<KnowledgeCategory, string> = {
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

const difficultyBadge: Record<string, { bg: string; text: string }> = {
  beginner: { bg: "#dcfce7", text: "#166534" },
  intermediate: { bg: "#dbeafe", text: "#1e40af" },
  advanced: { bg: "#fef3c7", text: "#92400e" },
  expert: { bg: "#fce7f3", text: "#9d174d" },
};

export default function KnowledgeGraphPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    KnowledgeCategory | "all"
  >("all");
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = getCategories();
  const allNodes =
    selectedCategory === "all"
      ? knowledgeGraph
      : getNodesByCategory(selectedCategory);

  const filteredNodes = searchQuery
    ? allNodes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allNodes;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white/70 mb-4 inline-block"
          >
            ← Back to AI University
          </Link>
          <h1 className="text-4xl font-bold mb-3">AI Knowledge Graph</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Every concept in AI, connected. Click any node to explore
            prerequisites, related concepts, and learning resources.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#22c55e]/50"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-white text-black"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All ({knowledgeGraph.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
              style={
                selectedCategory === cat.id
                  ? { backgroundColor: categoryColors[cat.id] }
                  : undefined
              }
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Concept Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNodes.map((node) => {
                const badge = difficultyBadge[node.difficulty];
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`text-left p-5 rounded-xl border transition-all ${
                      selectedNode?.id === node.id
                        ? "border-[#22c55e]/50 bg-[#22c55e]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{node.title}</h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {node.difficulty}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm line-clamp-2">
                      {node.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: categoryColors[node.category],
                        }}
                      />
                      <span className="text-xs text-white/40">
                        {node.category
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </span>
                      <span className="text-xs text-white/30">•</span>
                      <span className="text-xs text-white/40">
                        {node.estimatedMinutes} min
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedNode ? (
              <div className="sticky top-8 bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold">{selectedNode.title}</h2>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        difficultyBadge[selectedNode.difficulty].bg,
                      color: difficultyBadge[selectedNode.difficulty].text,
                    }}
                  >
                    {selectedNode.difficulty}
                  </span>
                </div>

                <p className="text-white/60 text-sm mb-6">
                  {selectedNode.description}
                </p>

                {/* Why It Exists */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    Why It Exists
                  </h3>
                  <p className="text-white/50 text-sm">
                    {selectedNode.whyItExists}
                  </p>
                </div>

                {/* History */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    History
                  </h3>
                  <p className="text-white/50 text-sm">
                    {selectedNode.history}
                  </p>
                </div>

                {/* Prerequisites */}
                {selectedNode.prerequisites.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white/80 mb-2">
                      Prerequisites
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getPrerequisites(selectedNode.id).map((pre) => (
                        <button
                          key={pre.id}
                          onClick={() => setSelectedNode(pre)}
                          className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                        >
                          {pre.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Concepts */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    Related Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getRelated(selectedNode.id).map((rel) => (
                      <button
                        key={rel.id}
                        onClick={() => setSelectedNode(rel)}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                      >
                        {rel.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-World Use Cases */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    Real-World Use Cases
                  </h3>
                  <ul className="space-y-1">
                    {selectedNode.realWorldUseCases.map((use, i) => (
                      <li
                        key={i}
                        className="text-white/50 text-sm flex items-start gap-2"
                      >
                        <span className="text-[#22c55e] mt-1">•</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Mistakes */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    Common Mistakes
                  </h3>
                  <ul className="space-y-1">
                    {selectedNode.commonMistakes.map((mistake, i) => (
                      <li
                        key={i}
                        className="text-white/50 text-sm flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-1">✗</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interview Questions */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    Interview Questions
                  </h3>
                  <ul className="space-y-1">
                    {selectedNode.interviewQuestions.map((q, i) => (
                      <li
                        key={i}
                        className="text-white/50 text-sm flex items-start gap-2"
                      >
                        <span className="text-blue-400 mt-1">Q</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Glossary */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    Key Terms
                  </h3>
                  <dl className="space-y-2">
                    {selectedNode.glossary.map((term, i) => (
                      <div key={i}>
                        <dt className="text-sm font-medium text-white/70">
                          {term.term}
                        </dt>
                        <dd className="text-xs text-white/40">
                          {term.definition}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* References */}
                {selectedNode.references.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white/80 mb-2">
                      References
                    </h3>
                    <ul className="space-y-1">
                      {selectedNode.references.map((ref, i) => (
                        <li key={i}>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#22c55e] hover:underline"
                          >
                            {ref.title}
                          </a>
                          <span className="text-xs text-white/30 ml-2">
                            ({ref.type})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={`/concepts/${selectedNode.slug}`}
                  className="mt-6 block w-full text-center bg-[#22c55e] text-black font-semibold py-3 rounded-lg hover:bg-[#16a34a] transition-colors"
                >
                  Learn This Concept →
                </Link>
              </div>
            ) : (
              <div className="sticky top-8 bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="font-semibold mb-2">Select a Concept</h3>
                <p className="text-white/50 text-sm">
                  Click any concept card to see its full details, prerequisites,
                  and learning resources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
