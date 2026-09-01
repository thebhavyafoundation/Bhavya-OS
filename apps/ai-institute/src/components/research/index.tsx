"use client";

import { useState } from "react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  tags: string[];
  url: string;
}

const papers: Paper[] = [
  {
    id: "attention",
    title: "Attention Is All You Need",
    authors: ["Vaswani", "Shazeer", "Parmar", "et al."],
    year: 2017,
    abstract:
      "Introduced the Transformer architecture, which has become the foundation for modern large language models.",
    tags: ["Transformers", "Architecture"],
    url: "https://arxiv.org/abs/1706.03762",
  },
  {
    id: "bert",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin", "Chang", "Lee", "Toutanova"],
    year: 2018,
    abstract:
      "Bidirectional encoder representation model that revolutionized NLU tasks.",
    tags: ["NLU", "Pre-training"],
    url: "https://arxiv.org/abs/1810.04805",
  },
  {
    id: "gpt3",
    title: "Language Models are Few-Shot Learners",
    authors: ["Brown", "Mann", "Ryder", "et al."],
    year: 2020,
    abstract: "Demonstrated GPT-3's ability to perform tasks with minimal examples.",
    tags: ["LLM", "Few-shot"],
    url: "https://arxiv.org/abs/2005.14165",
  },
  {
    id: "dalle",
    title: "Zero-Shot Text-to-Image Generation",
    authors: ["Ramesh", "Pavlov", "Goh", "et al."],
    year: 2021,
    abstract: "Introduced DALL-E for text-to-image generation using a diffusion model.",
    tags: ["Multimodal", "Image Generation"],
    url: "https://arxiv.org/abs/2102.12092",
  },
  {
    id: "scaling-laws",
    title: "Scaling Laws for Neural Language Models",
    authors: ["Kaplan", "McCandlish", "Henighan", "et al."],
    year: 2020,
    abstract: "Explored how model performance scales with compute, data, and parameters.",
    tags: ["Scaling", "LLM"],
    url: "https://arxiv.org/abs/2001.08361",
  },
  {
    id: "rlhf",
    title: "Training Language Models to Follow Instructions with Human Feedback",
    authors: ["Ouyang", "Wu", "Jiang", "et al."],
    year: 2022,
    abstract:
      "Introduced InstructGPT and RLHF for aligning language models with human intent.",
    tags: ["Alignment", "RLHF"],
    url: "https://arxiv.org/abs/2203.02155",
  },
  {
    id: "diffusion",
    title: "Denoising Diffusion Probabilistic Models",
    authors: ["Ho", "Jain", "Abbeel"],
    year: 2020,
    abstract:
      "Foundational paper on diffusion models for high-quality image generation.",
    tags: ["Diffusion", "Image Generation"],
    url: "https://arxiv.org/abs/2006.11239",
  },
  {
    id: "rag",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["Lewis", "Perez", "Piktus", "et al."],
    year: 2020,
    abstract:
      "Combined retrieval and generation for more accurate, fact-based outputs.",
    tags: ["RAG", "Knowledge"],
    url: "https://arxiv.org/abs/2005.11401",
  },
  {
    id: "chain-of-thought",
    title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: ["Wei", "Wang", "Schuurmans", "et al."],
    year: 2022,
    abstract:
      "Showed how step-by-step reasoning improves LLM performance on complex tasks.",
    tags: ["Reasoning", "Prompting"],
    url: "https://arxiv.org/abs/2201.11903",
  },
  {
    id: "mixture-of-experts",
    title: "Scaling Sparse Mixture of Experts",
    authors: ["Fedus", "Zoph", "Shazeer"],
    year: 2022,
    abstract:
      "Demonstrated how sparse MoE architectures enable efficient scaling of LLMs.",
    tags: ["MoE", "Scaling"],
    url: "https://arxiv.org/abs/2101.03961",
  },
];

export function ResearchLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = [...new Set(papers.flatMap((p) => p.tags))].sort();

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      !searchQuery ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesTag = !selectedTag || paper.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-1">AI Research Library</h3>
      <p className="text-xs text-white/40 mb-4">
        Key papers and research that inform AI education and industry practice.
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search papers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
        />
        <span className="absolute left-3 top-2.5 text-white/40 text-sm">
          🔍
        </span>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 text-xs rounded-lg ${
            selectedTag === null
              ? "bg-white text-black"
              : "bg-white/10 text-white/60"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-3 py-1 text-xs rounded-lg ${
              selectedTag === tag
                ? "bg-white text-black"
                : "bg-white/10 text-white/60"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Papers List */}
      <div className="space-y-3">
        {filteredPapers.map((paper) => (
          <a
            key={paper.id}
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1 hover:text-white transition-colors">
                  {paper.title}
                </h4>
                <p className="text-xs text-white/50 mb-2">
                  {paper.authors.join(", ")} ({paper.year})
                </p>
                <p className="text-xs text-white/40 mb-2">{paper.abstract}</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {paper.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
