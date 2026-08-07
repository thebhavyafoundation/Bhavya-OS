"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "completed" | "in-progress" | "not-started" | "bookmarked";
  techStack: string[];
  mentorReview: string;
  thumbnail: string;
}

const projects: Project[] = [
  {
    id: "house-price-predictor",
    title: "House Price Predictor",
    description:
      "Build a regression model that predicts house prices from features like square footage, location, and amenities using scikit-learn.",
    domain: "ML",
    duration: "2 weeks",
    difficulty: "intermediate",
    status: "completed",
    techStack: ["Python", "scikit-learn", "pandas", "matplotlib"],
    mentorReview:
      "Excellent feature engineering. Your model achieved 92% R² — well above the 85% threshold.",
    thumbnail: "🏠",
  },
  {
    id: "sentiment-analyzer",
    title: "Sentiment Analyzer",
    description:
      "Create an NLP pipeline that classifies product reviews as positive, negative, or neutral with production-grade accuracy.",
    domain: "NLP",
    duration: "1 week",
    difficulty: "beginner",
    status: "completed",
    techStack: ["Python", "NLTK", "transformers", "FastAPI"],
    mentorReview:
      "Clean implementation. Good choice of preprocessing pipeline — tokenization was thorough.",
    thumbnail: "💬",
  },
  {
    id: "image-classifier",
    title: "Image Classifier",
    description:
      "Train a convolutional neural network to classify images across 10 categories using transfer learning and data augmentation.",
    domain: "CV",
    duration: "3 weeks",
    difficulty: "intermediate",
    status: "in-progress",
    techStack: ["Python", "PyTorch", "torchvision", "Gradio"],
    mentorReview:
      "Great progress on the architecture. Consider adding dropout layers for regularization.",
    thumbnail: "🖼",
  },
  {
    id: "chatbot-rag",
    title: "Chatbot with RAG",
    description:
      "Build an intelligent chatbot that retrieves relevant context from a document corpus before generating accurate, grounded responses.",
    domain: "LLMs",
    duration: "4 weeks",
    difficulty: "advanced",
    status: "not-started",
    techStack: ["Python", "LangChain", "OpenAI", "ChromaDB", "FastAPI"],
    mentorReview: "",
    thumbnail: "🤖",
  },
];

const statusConfig = {
  completed: {
    label: "Completed",
    bg: "bg-[#1a3a2a]/30",
    text: "text-[#4ade80]",
    dot: "bg-[#4ade80]",
  },
  "in-progress": {
    label: "In Progress",
    bg: "bg-[#c9a227]/15",
    text: "text-[#c9a227]",
    dot: "bg-[#c9a227]",
  },
  "not-started": {
    label: "Not Started",
    bg: "bg-white/[0.04]",
    text: "text-white/40",
    dot: "bg-white/40",
  },
  bookmarked: {
    label: "Bookmarked",
    bg: "bg-[#8a7359]/15",
    text: "text-[#d4b896]",
    dot: "bg-[#d4b896]",
  },
};

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    bg: "bg-[#1a3a2a]/20",
    text: "text-[#4ade80]",
  },
  intermediate: {
    label: "Intermediate",
    bg: "bg-[#c9a227]/15",
    text: "text-[#c9a227]",
  },
  advanced: {
    label: "Advanced",
    bg: "bg-[#8a7359]/20",
    text: "text-[#d4b896]",
  },
};

const stats = [
  { label: "Total Projects", value: "4" },
  { label: "Completed", value: "2" },
  { label: "Total Hours", value: "120" },
  { label: "Avg. Rating", value: "4.8" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "in-progress" | "completed" | "bookmarked"
  >("all");

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="text-xs text-white/30 hover:text-white/50 transition-colors mb-6 inline-flex items-center gap-1.5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              AI Institute
            </Link>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-2"
              style={{
                background: "linear-gradient(135deg, #f5f1e6 0%, #c9a227 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Project Studio
            </h1>
            <p className="text-white/40 text-lg">
              Build real AI systems. Ship to production.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center"
            >
              <div className="text-2xl font-bold text-[#f5f1e6] mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          {(["all", "in-progress", "completed", "bookmarked"] as const).map(
            (tab) => {
              const count =
                tab === "all"
                  ? projects.length
                  : projects.filter((p) => p.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? "bg-[#1a3a2a] text-[#4ade80]"
                      : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08]"
                  }`}
                >
                  {tab === "all"
                    ? "All"
                    : tab === "in-progress"
                      ? "In Progress"
                      : tab === "completed"
                        ? "Completed"
                        : "Bookmarked"}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    ({count})
                  </span>
                </button>
              );
            },
          )}
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {filteredProjects.map((project, i) => {
            const status = statusConfig[project.status];
            const diff = difficultyConfig[project.difficulty];
            return (
              <motion.div
                key={project.id}
                variants={fadeUp}
                custom={i}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="h-40 bg-white/[0.02] flex items-center justify-center text-5xl border-b border-white/[0.04]">
                  {project.thumbnail}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#c9a227]/15 text-[#c9a227]">
                          {project.domain}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${diff.bg} ${diff.text}`}
                        >
                          {diff.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#f5f1e6]">
                        {project.title}
                      </h3>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                      />
                      <span
                        className={`text-[10px] font-medium ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-white/40 line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-3 mb-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      {project.duration}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[10px] bg-white/[0.04] text-white/40 rounded-md font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.mentorReview && (
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-[#c9a227]"
                        >
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        <span className="text-[10px] text-[#c9a227] font-medium">
                          Mentor Review
                        </span>
                      </div>
                      <p className="text-xs text-white/40 italic leading-relaxed">
                        &ldquo;{project.mentorReview}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-semibold text-[#c9a227] hover:text-[#c9a227]/80 transition-colors"
                    >
                      {project.status === "not-started"
                        ? "Start Project →"
                        : project.status === "completed"
                          ? "View Project →"
                          : "Continue Project →"}
                    </Link>
                    {project.status === "completed" && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={star <= 4 ? "#c9a227" : "none"}
                            stroke="#c9a227"
                            strokeWidth="2"
                          >
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center py-8"
        >
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl bg-[#1a3a2a] text-[#4ade80] hover:bg-[#1a3a2a]/80 transition-all duration-300 shadow-[0_0_24px_rgba(26,58,42,0.3)] hover:shadow-[0_0_32px_rgba(26,58,42,0.4)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Start New Project
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
