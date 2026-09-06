"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  tags: string[];
  url: string;
  source: "external";
}

const referencePapers: Paper[] = [
  {
    id: "attention",
    title: "Attention Is All You Need",
    authors: ["Vaswani", "Shazeer", "Parmar", "et al."],
    year: 2017,
    abstract:
      "Introduced the Transformer architecture, which has become the foundation for modern large language models.",
    tags: ["Transformers", "Architecture"],
    url: "https://arxiv.org/abs/1706.03762",
    source: "external",
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
    source: "external",
  },
  {
    id: "gpt3",
    title: "Language Models are Few-Shot Learners",
    authors: ["Brown", "Mann", "Ryder", "et al."],
    year: 2020,
    abstract:
      "Demonstrated GPT-3's ability to perform tasks with minimal examples.",
    tags: ["LLM", "Few-shot"],
    url: "https://arxiv.org/abs/2005.14165",
    source: "external",
  },
  {
    id: "dalle",
    title: "Zero-Shot Text-to-Image Generation",
    authors: ["Ramesh", "Pavlov", "Goh", "et al."],
    year: 2021,
    abstract:
      "Introduced DALL-E for text-to-image generation using a diffusion model.",
    tags: ["Multimodal", "Image Generation"],
    url: "https://arxiv.org/abs/2102.12092",
    source: "external",
  },
  {
    id: "scaling-laws",
    title: "Scaling Laws for Neural Language Models",
    authors: ["Kaplan", "McCandlish", "Henighan", "et al."],
    year: 2020,
    abstract:
      "Explored how model performance scales with compute, data, and parameters.",
    tags: ["Scaling", "LLM"],
    url: "https://arxiv.org/abs/2001.08361",
    source: "external",
  },
  {
    id: "rlhf",
    title:
      "Training Language Models to Follow Instructions with Human Feedback",
    authors: ["Ouyang", "Wu", "Jiang", "et al."],
    year: 2022,
    abstract:
      "Introduced InstructGPT and RLHF for aligning language models with human intent.",
    tags: ["Alignment", "RLHF"],
    url: "https://arxiv.org/abs/2203.02155",
    source: "external",
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
    source: "external",
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
    source: "external",
  },
  {
    id: "chain-of-thought",
    title:
      "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: ["Wei", "Wang", "Schuurmans", "et al."],
    year: 2022,
    abstract:
      "Showed how step-by-step reasoning improves LLM performance on complex tasks.",
    tags: ["Reasoning", "Prompting"],
    url: "https://arxiv.org/abs/2201.11903",
    source: "external",
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
    source: "external",
  },
];

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const papers = referencePapers;

  const allTags = [...new Set(papers.flatMap((p) => p.tags))].sort();

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      !searchQuery ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesTag = !selectedTag || paper.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <SiteHeader />
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI Research Library
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Foundational research papers and publications that inform AI
            education and industry practice.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-text-primary mb-1">
              {papers.length}
            </div>
            <div className="text-sm text-text-tertiary">Reference Papers</div>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-text-primary mb-1">
              {allTags.length}
            </div>
            <div className="text-sm text-text-tertiary">Topic Areas</div>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-text-primary mb-1">
              {new Set(papers.flatMap((p) => p.authors)).size}
            </div>
            <div className="text-sm text-text-tertiary">Referenced Authors</div>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-text-primary mb-1">
              {new Set(papers.map((p) => p.year)).size}
            </div>
            <div className="text-sm text-text-tertiary">Years Covered</div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search papers by title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-secondary border border-border-primary rounded-xl px-6 py-4 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-border-focus"
              />
              <span className="absolute right-4 top-4 text-text-muted">🔍</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedTag === null
                  ? "bg-bg-primary text-text-primary border border-border-primary"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedTag === tag
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Papers List */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {filteredPapers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">No papers found</h3>
              <p className="text-text-muted">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPapers.map((paper) => (
                <a
                  key={paper.id}
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-bg-secondary border border-border-primary rounded-xl p-6 hover:border-border-focus transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-forest-500 transition-colors">
                        {paper.title}
                      </h3>
                      <p className="text-sm text-text-secondary mb-2">
                        {paper.authors.join(", ")}
                      </p>
                      <p className="text-xs text-text-tertiary mb-3">
                        {paper.year}
                      </p>
                      <p className="text-sm text-text-tertiary mb-4">
                        {paper.abstract}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {paper.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 rounded-full bg-bg-tertiary text-text-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-forest-700 to-forest-600 rounded-2xl p-12 border border-border-primary">
            <h2 className="text-3xl font-bold mb-4">
              Interested in Contributing?
            </h2>
            <p className="text-text-secondary mb-6 max-w-xl mx-auto">
              We maintain this library as a reference for students and
              researchers. If you know of foundational papers that should be
              included, let us know.
            </p>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 bg-accent-gold text-text-primary px-8 py-3 rounded-xl font-semibold hover:bg-accent-gold-hover transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
