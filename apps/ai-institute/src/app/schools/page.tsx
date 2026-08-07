"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const schools = [
  {
    id: 1,
    icon: "🧠",
    name: "School of AI Foundations",
    description: "Core AI concepts and fundamentals",
    courses: 8,
    students: 12400,
    accent: "#1a3a2a",
    tag: "foundations",
  },
  {
    id: 2,
    icon: "⚡",
    name: "School of Machine Learning",
    description: "From linear regression to deep learning",
    courses: 10,
    students: 9800,
    accent: "#2d5a42",
    tag: "ml",
  },
  {
    id: 3,
    icon: "🔬",
    name: "School of Deep Learning",
    description: "Neural networks, CNNs, RNNs, transformers",
    courses: 8,
    students: 7200,
    accent: "#c9a227",
    tag: "deep-learning",
  },
  {
    id: 4,
    icon: "💬",
    name: "School of Natural Language Processing",
    description: "Language models, NLU, NLG",
    courses: 7,
    students: 6500,
    accent: "#8a7359",
    tag: "nlp",
  },
  {
    id: 5,
    icon: "👁️",
    name: "School of Computer Vision",
    description: "Image recognition, detection, generation",
    courses: 6,
    students: 5400,
    accent: "#1a3a2a",
    tag: "cv",
  },
  {
    id: 6,
    icon: "🤖",
    name: "School of Robotics & Embodied AI",
    description: "Physical AI systems and control",
    courses: 5,
    students: 3200,
    accent: "#2d5a42",
    tag: "robotics",
  },
  {
    id: 7,
    icon: "🛠️",
    name: "School of AI Engineering",
    description: "MLOps, deployment, production systems",
    courses: 7,
    students: 8100,
    accent: "#c9a227",
    tag: "engineering",
  },
  {
    id: 8,
    icon: "⚖️",
    name: "School of AI Ethics & Safety",
    description: "Responsible AI, alignment, governance",
    courses: 5,
    students: 4600,
    accent: "#8a7359",
    tag: "ethics",
  },
  {
    id: 9,
    icon: "🔭",
    name: "School of AI Research",
    description: "Papers, experiments, breakthroughs",
    courses: 6,
    students: 3800,
    accent: "#1a3a2a",
    tag: "research",
  },
  {
    id: 10,
    icon: "🚀",
    name: "School of AI Products",
    description: "Building AI-powered products",
    courses: 5,
    students: 5200,
    accent: "#2d5a42",
    tag: "products",
  },
  {
    id: 11,
    icon: "📊",
    name: "School of AI Business",
    description: "AI strategy, investment, transformation",
    courses: 4,
    students: 4100,
    accent: "#c9a227",
    tag: "business",
  },
  {
    id: 12,
    icon: "🎨",
    name: "School of AI Creativity",
    description: "Generative AI, art, music, design",
    courses: 6,
    students: 7600,
    accent: "#8a7359",
    tag: "creativity",
  },
];

const filters = ["All", "Technical", "Applied", "Research", "Business"];

const filterMap: Record<string, string[]> = {
  Technical: ["foundations", "ml", "deep-learning", "nlp", "cv", "robotics"],
  Applied: ["engineering", "products", "creativity"],
  Research: ["research", "ethics"],
  Business: ["business"],
};

function formatStudents(n: number) {
  return n >= 1000
    ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : String(n);
}

export default function SchoolsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    return schools.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === "All" || filterMap[activeFilter]?.includes(s.tag);
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#f5f1e6]">
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1a3a2a] rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#c9a227] rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#1a3a2a] bg-[#1a3a2a]/20 text-[#4ade80] text-sm font-medium tracking-wide mb-6">
              12 Specialized Schools
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore Our{" "}
            <span className="bg-gradient-to-r from-[#4ade80] via-[#c9a227] to-[#8a7359] bg-clip-text text-transparent">
              Schools
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-[#f5f1e6]/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            12 specialized schools covering every dimension of AI
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f5f1e6]/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search schools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#0f1a14] border border-[#1a3a2a]/40 rounded-xl text-[#f5f1e6] placeholder:text-[#f5f1e6]/30 focus:outline-none focus:border-[#1a3a2a] focus:ring-1 focus:ring-[#1a3a2a] transition-all"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === f
                    ? "bg-[#1a3a2a] text-[#4ade80] border border-[#1a3a2a]"
                    : "bg-[#0f1a14] text-[#f5f1e6]/50 border border-[#1a3a2a]/20 hover:border-[#1a3a2a]/50 hover:text-[#f5f1e6]/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((school, i) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
            >
              <Link href={`/schools/${school.tag}`}>
                <div
                  className="group relative bg-[#0f1a14] border border-[#1a3a2a]/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    boxShadow: `0 0 0 0px ${school.accent}00`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px -5px ${school.accent}40, 0 0 0 1px ${school.accent}60`;
                    e.currentTarget.style.borderColor = `${school.accent}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 0px ${school.accent}00`;
                    e.currentTarget.style.borderColor = `${school.accent}33`;
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${school.accent}20` }}
                    >
                      {school.icon}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#f5f1e6]/40 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      {school.courses} courses
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#f5f1e6] mb-1.5 group-hover:text-white transition-colors">
                    {school.name}
                  </h3>
                  <p className="text-sm text-[#f5f1e6]/45 mb-5 line-clamp-1">
                    {school.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-[#f5f1e6]/40">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {formatStudents(school.students)} students
                    </div>
                    <svg
                      className="w-5 h-5 text-[#f5f1e6]/20 group-hover:text-[#f5f1e6]/60 transition-all group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-[#f5f1e6]/40 text-lg">
              No schools match your search.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveFilter("All");
              }}
              className="mt-4 text-[#4ade80] hover:text-[#4ade80]/80 text-sm font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#0f1a14] border border-[#1a3a2a]/30 rounded-2xl px-8 py-6">
            <div className="text-left">
              <p className="text-[#f5f1e6] font-medium">Can&apos;t decide?</p>
              <p className="text-sm text-[#f5f1e6]/40">
                Take our AI-guided assessment
              </p>
            </div>
            <Link
              href="/assessment"
              className="px-6 py-3 bg-[#1a3a2a] hover:bg-[#1a3a2a]/80 text-[#4ade80] rounded-xl font-medium text-sm transition-all hover:shadow-[0_0_20px_-5px_#1a3a2a]"
            >
              Start Assessment
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
