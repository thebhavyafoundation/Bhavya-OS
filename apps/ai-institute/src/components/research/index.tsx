"use client";

import { useState } from "react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  category: string;
  abstract: string;
  url: string;
  citations: number;
  tags: string[];
  relatedLessons: string[];
  impact: "foundational" | "high" | "medium" | "emerging";
}

const papers: Paper[] = [
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    year: 2017,
    category: "transformers",
    abstract:
      "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
    url: "https://arxiv.org/abs/1706.03762",
    citations: 100000,
    tags: ["transformers", "attention", "neural-networks"],
    relatedLessons: ["transformers", "attention-mechanism"],
    impact: "foundational",
  },
  {
    id: "bert",
    title:
      "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Devlin et al."],
    year: 2018,
    category: "llm",
    abstract:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.",
    url: "https://arxiv.org/abs/1810.04805",
    citations: 80000,
    tags: ["bert", "pre-training", "nlp"],
    relatedLessons: ["llm", "transformers"],
    impact: "foundational",
  },
  {
    id: "gpt-3",
    title: "Language Models are Few-Shot Learners",
    authors: ["Brown et al."],
    year: 2020,
    category: "llm",
    abstract:
      "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task.",
    url: "https://arxiv.org/abs/2005.14165",
    citations: 25000,
    tags: ["gpt-3", "few-shot", "scaling"],
    relatedLessons: ["llm", "few-shot-learning"],
    impact: "foundational",
  },
  {
    id: "rag",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["Lewis et al."],
    year: 2020,
    category: "rag",
    abstract:
      "We explore a general-purpose fine-free recipe for open-domain QA that combines parametric knowledge with non-parametric retrieval.",
    url: "https://arxiv.org/abs/2005.11401",
    citations: 5000,
    tags: ["rag", "retrieval", "generation"],
    relatedLessons: ["rag", "vector-databases"],
    impact: "high",
  },
  {
    id: "react",
    title: "ReAct: Synergizing Reasoning and Acting in Language Models",
    authors: ["Yao et al."],
    year: 2022,
    category: "agents",
    abstract:
      "We show how an LLM can learn to interact with external tools (APIs) to fetch additional information that leads to more reliable and factually grounded responses.",
    url: "https://arxiv.org/abs/2210.03629",
    citations: 3000,
    tags: ["agents", "reasoning", "acting"],
    relatedLessons: ["agents", "tool-calling"],
    impact: "high",
  },
  {
    id: "lora",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Hu et al."],
    year: 2021,
    category: "fine-tuning",
    abstract:
      "We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer.",
    url: "https://arxiv.org/abs/2106.09685",
    citations: 8000,
    tags: ["lora", "fine-tuning", "efficiency"],
    relatedLessons: ["fine-tuning", "rlhf"],
    impact: "high",
  },
  {
    id: "instructgpt",
    title:
      "Training Language Models to Follow Instructions with Human Feedback",
    authors: ["Ouyang et al."],
    year: 2022,
    category: "alignment",
    abstract:
      "Making language models bigger does not inherently make them better at following user intent. We show an avenue for aligning language models with user intent.",
    url: "https://arxiv.org/abs/2203.02155",
    citations: 10000,
    tags: ["rlhf", "instructgpt", "alignment"],
    relatedLessons: ["rlhf", "fine-tuning"],
    impact: "foundational",
  },
  {
    id: "word2vec",
    title: "Efficient Estimation of Word Representations in Vector Space",
    authors: ["Mikolov et al."],
    year: 2013,
    category: "embeddings",
    abstract:
      "We propose two new model architectures for computing distributed vector representations of words.",
    url: "https://arxiv.org/abs/1301.3781",
    citations: 20000,
    tags: ["word2vec", "embeddings", "distributed-representations"],
    relatedLessons: ["embeddings", "vector-databases"],
    impact: "foundational",
  },
  {
    id: "chain-of-thought",
    title:
      "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: ["Wei et al."],
    year: 2022,
    category: "prompting",
    abstract:
      "We explore how generating a chain of thought — a series of intermediate reasoning steps — significantly improves the ability of large language models to perform complex reasoning.",
    url: "https://arxiv.org/abs/2201.11903",
    citations: 5000,
    tags: ["chain-of-thought", "prompting", "reasoning"],
    relatedLessons: ["chain-of-thought", "prompt-engineering"],
    impact: "high",
  },
  {
    id: "alphafold",
    title: "Highly accurate protein structure prediction with AlphaFold",
    authors: ["Jumper et al."],
    year: 2021,
    category: "applications",
    abstract:
      "Proteins are essential to life, supporting virtually all of its functions. We present a machine learning system for protein structure prediction.",
    url: "https://www.nature.com/articles/s41586-021-03819-2",
    citations: 15000,
    tags: ["alphafold", "protein", "science"],
    relatedLessons: ["deep-learning", "transformers"],
    impact: "foundational",
  },
];

export function ResearchLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);

  const categories = [...new Set(papers.map((p) => p.category))];
  const impacts = ["foundational", "high", "medium", "emerging"];

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      !searchQuery ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.tags.some((t) => t.includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || paper.category === selectedCategory;
    const matchesImpact =
      selectedImpact === "all" || paper.impact === selectedImpact;
    return matchesSearch && matchesCategory && matchesImpact;
  });

  const impactColors: Record<string, string> = {
    foundational: "#f59e0b",
    high: "#22c55e",
    medium: "#3b82f6",
    emerging: "#8b5cf6",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Research Library</h3>

      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm mb-4"
        placeholder="Search papers, topics, authors..."
      />

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-xs text-white"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={selectedImpact}
          onChange={(e) => setSelectedImpact(e.target.value)}
          className="bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-xs text-white"
        >
          <option value="all">All Impact</option>
          {impacts.map((i) => (
            <option key={i} value={i}>
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40 self-center">
          {filteredPapers.length} papers
        </span>
      </div>

      {/* Papers */}
      <div className="space-y-3">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="bg-black/30 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() =>
              setExpandedPaper(expandedPaper === paper.id ? null : paper.id)
            }
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white/90 mb-1">
                  {paper.title}
                </h4>
                <div className="text-xs text-white/50">
                  {paper.authors.join(", ")} • {paper.year} •{" "}
                  {paper.citations.toLocaleString()} citations
                </div>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: impactColors[paper.impact] + "20",
                  color: impactColors[paper.impact],
                }}
              >
                {paper.impact}
              </span>
            </div>

            {expandedPaper === paper.id && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-white/60 mb-3">{paper.abstract}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {paper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-3">
                  <span className="text-xs text-white/40">
                    Related Lessons:{" "}
                  </span>
                  {paper.relatedLessons.map((lesson, i) => (
                    <span key={lesson}>
                      <a
                        href={`/concepts/${lesson}`}
                        className="text-xs text-[#22c55e] hover:underline"
                      >
                        {lesson}
                      </a>
                      {i < paper.relatedLessons.length - 1 && (
                        <span className="text-white/30">, </span>
                      )}
                    </span>
                  ))}
                </div>

                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#3b82f6] hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read Paper →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
