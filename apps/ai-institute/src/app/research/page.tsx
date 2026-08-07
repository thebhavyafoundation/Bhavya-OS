"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TYPES = ["All", "Paper", "Dataset", "Tutorial"] as const;
const TOPICS = ["All", "ML", "DL", "NLP", "CV", "Robotics"] as const;

type FilterType = (typeof TYPES)[number];
type FilterTopic = (typeof TOPICS)[number];

interface ResearchItem {
  id: number;
  title: string;
  author: string;
  date: string;
  type: "Paper" | "Dataset" | "Tutorial";
  topics: string[];
  description: string;
  metric?: string;
}

const items: ResearchItem[] = [
  {
    id: 1,
    title: "Attention Is All You Need",
    author: "Vaswani et al.",
    date: "2017",
    type: "Paper",
    topics: ["NLP", "DL"],
    description:
      "Introduced the Transformer architecture, now foundational to modern NLP and large language models.",
  },
  {
    id: 2,
    title: "ImageNet Large Scale Visual Recognition Challenge",
    author: "ImageNet Team",
    date: "2015",
    type: "Dataset",
    topics: ["CV"],
    description:
      "Benchmark dataset with 1M+ labeled images across 1000 categories, catalyzing breakthroughs in computer vision.",
    metric: "1M+ images",
  },
  {
    id: 3,
    title: "Building Neural Networks from Scratch",
    author: "Bhavya AI Institute",
    date: "2024",
    type: "Tutorial",
    topics: ["DL"],
    description:
      "Hands-on walkthrough of forward propagation, backpropagation, and gradient descent without frameworks.",
    metric: "45 min · Beginner",
  },
  {
    id: 4,
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    author: "Devlin et al.",
    date: "2018",
    type: "Paper",
    topics: ["NLP", "DL"],
    description:
      "Bidirectional pre-training approach that set new benchmarks on eleven NLP tasks simultaneously.",
  },
  {
    id: 5,
    title: "Generative Adversarial Networks",
    author: "Goodfellow et al.",
    date: "2014",
    type: "Paper",
    topics: ["DL"],
    description:
      "Proposed the GAN framework where two neural networks compete, enabling realistic data generation.",
  },
  {
    id: 6,
    title: "Deep Residual Learning",
    author: "He et al.",
    date: "2015",
    type: "Paper",
    topics: ["CV", "DL"],
    description:
      "Introduced skip connections enabling training of networks 152+ layers deep, winning ImageNet 2015.",
  },
  {
    id: 7,
    title: "Reinforcement Learning: An Introduction",
    author: "Sutton & Barto",
    date: "2018",
    type: "Tutorial",
    topics: ["ML"],
    description:
      "The definitive textbook covering MDPs, Q-learning, policy gradients, and modern RL algorithms.",
    metric: "Textbook · Advanced",
  },
  {
    id: 8,
    title: "GPT-4 Technical Report",
    author: "OpenAI",
    date: "2023",
    type: "Paper",
    topics: ["ML", "DL", "NLP"],
    description:
      "Technical report on GPT-4, a large multimodal model achieving human-level performance on benchmarks.",
  },
];

const typeColors: Record<string, string> = {
  Paper: "bg-[#1a3a2a] text-[#c9a227] border border-[#c9a227]/30",
  Dataset: "bg-[#8a7359]/20 text-[#f5f1e6] border border-[#8a7359]/40",
  Tutorial: "bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/25",
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ResearchPage() {
  const [typeFilter, setTypeFilter] = useState<FilterType>("All");
  const [topicFilter, setTopicFilter] = useState<FilterTopic>("All");
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) => {
    if (typeFilter !== "All" && item.type !== typeFilter) return false;
    if (topicFilter !== "All" && !item.topics.includes(topicFilter))
      return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#f5f1e6]">
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#0a0f0d]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a3a2a] to-[#c9a227] flex items-center justify-center">
              <span className="text-sm font-bold text-[#f5f1e6]">B</span>
            </div>
            <span className="text-sm font-semibold tracking-wide text-[#f5f1e6]/80">
              AI INSTITUTE
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-[#f5f1e6]/50">
            <Link href="/research" className="text-[#c9a227]">
              Research
            </Link>
            <Link
              href="/portfolio"
              className="hover:text-[#f5f1e6] transition-colors"
            >
              Portfolio
            </Link>
            <Link href="/" className="hover:text-[#f5f1e6] transition-colors">
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              Research{" "}
              <span className="bg-gradient-to-r from-[#1a3a2a] via-[#c9a227] to-[#8a7359] bg-clip-text text-transparent">
                Library
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#f5f1e6]/50 max-w-2xl mx-auto">
              Explore papers, datasets, and resources curated for the next
              generation of AI builders.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f5f1e6]/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search papers, datasets, tutorials..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#1a3a2a]/30 border border-white/10 text-[#f5f1e6] placeholder:text-[#f5f1e6]/30 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/25 transition-all text-base"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#f5f1e6]/40 uppercase tracking-wider mr-1">
                Type
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      typeFilter === t
                        ? "bg-[#c9a227] text-[#0a0f0d]"
                        : "bg-white/5 text-[#f5f1e6]/50 hover:bg-white/10 hover:text-[#f5f1e6]/80"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#f5f1e6]/40 uppercase tracking-wider mr-1">
                Topic
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopicFilter(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      topicFilter === t
                        ? "bg-[#1a3a2a] text-[#c9a227] border border-[#c9a227]/30"
                        : "bg-white/5 text-[#f5f1e6]/50 hover:bg-white/10 hover:text-[#f5f1e6]/80"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="flex items-center gap-3 mb-10 max-w-7xl mx-auto"
          >
            <span className="text-sm text-[#f5f1e6]/40">
              <span className="text-[#c9a227] font-semibold">
                {filtered.length}
              </span>{" "}
              of <span className="font-semibold">{items.length}</span> items
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#c9a227]/30 to-transparent" />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${typeFilter}-${topicFilter}-${query}`}
              variants={stagger}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-6 hover:border-[#c9a227]/20 hover:bg-[#1a3a2a]/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ${typeColors[item.type]}`}
                    >
                      {item.type}
                    </span>
                    {item.metric && (
                      <span className="text-xs text-[#8a7359] font-medium">
                        {item.metric}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#f5f1e6] mb-1.5 group-hover:text-[#c9a227] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#f5f1e6]/40 mb-3">
                    {item.author} · {item.date}
                  </p>
                  <p className="text-sm text-[#f5f1e6]/50 leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {item.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f5f1e6]/5 text-[#f5f1e6]/40"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a3a2a] text-[#c9a227] border border-[#c9a227]/20 hover:bg-[#c9a227]/20 transition-colors">
                        Read
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#f5f1e6]/60 hover:bg-white/10 transition-colors">
                        Save
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#f5f1e6]/60 hover:bg-white/10 transition-colors">
                        Cite
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-[#f5f1e6]/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-[#f5f1e6]/40 text-lg">No results found</p>
              <p className="text-[#f5f1e6]/25 text-sm mt-1">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-20 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#1a3a2a]/20 to-[#0a0f0d] p-10 md:p-14"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "247", label: "Total Items" },
                { value: "89", label: "Papers" },
                { value: "64", label: "Datasets" },
                { value: "94", label: "Tutorials" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-[#c9a227] to-[#8a7359] bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#f5f1e6]/35 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
