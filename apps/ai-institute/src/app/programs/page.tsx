"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const programs = [
  {
    title: "Explorer Program",
    duration: "12 weeks",
    level: "Beginner",
    description: "Learn AI fundamentals",
    accent: "#1a3a2a",
    accentName: "green",
    curriculum: [
      "Introduction to AI & Machine Learning",
      "Python for Data Science",
      "Linear Algebra & Statistics Refresher",
      "Your First Neural Network",
      "Capstone: Build a Classification Model",
    ],
  },
  {
    title: "Builder Program",
    duration: "16 weeks",
    level: "Intermediate",
    description: "Build real AI systems",
    accent: "#c9a227",
    accentName: "gold",
    curriculum: [
      "Advanced Deep Learning Architectures",
      "Computer Vision & NLP Pipelines",
      "MLOps & Model Deployment",
      "Production System Design",
      "Capstone: End-to-End AI Product",
    ],
  },
  {
    title: "Researcher Program",
    duration: "24 weeks",
    level: "Advanced",
    description: "Push the boundaries",
    accent: "#8a7359",
    accentName: "earth",
    curriculum: [
      "Research Methodology & Paper Writing",
      "前沿 Topics in AI Safety",
      "Experimental Design & Benchmarking",
      "Novel Architecture Development",
      "Capstone: Publish a Research Paper",
    ],
  },
];

const stats = [
  { value: "3", label: "Programs" },
  { value: "10", label: "Courses" },
  { value: "12", label: "Schools" },
  { value: "Open", label: "Enrollment" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#f5f1e6]">
      {/* Editorial notice — Wave P: programs are curriculum descriptions, not verified institutional activity */}
      <div className="bg-[#c9a227]/10 border-b border-[#c9a227]/20 px-6 py-2 text-center">
        <p className="text-xs text-[#c9a227]/70 font-medium">
          Curriculum Guidance — recommended learning sequences, not enrolled
          programs
        </p>
      </div>
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#c9a227] rounded-full blur-[160px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-[#1a3a2a] rounded-full blur-[140px]" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 text-[#c9a227] text-sm font-medium tracking-wide mb-6">
              Structured Learning Paths
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Learning{" "}
            <span className="bg-gradient-to-r from-[#c9a227] via-[#4ade80] to-[#8a7359] bg-clip-text text-transparent">
              Programs
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-[#f5f1e6]/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Structured paths from beginner to expert
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {programs.map((prog, i) => (
            <motion.div
              key={prog.title}
              variants={item}
              className="group relative bg-[#0f1a14] border border-[#1a3a2a]/20 rounded-2xl p-8 flex flex-col transition-all duration-300 hover:scale-[1.01]"
              style={{
                boxShadow: `0 0 0 0px ${prog.accent}00`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 40px -8px ${prog.accent}35, 0 0 0 1px ${prog.accent}50`;
                e.currentTarget.style.borderColor = `${prog.accent}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 0px ${prog.accent}00`;
                e.currentTarget.style.borderColor = `${prog.accent}33`;
              }}
            >
              {i === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#c9a227] text-[#0a0f0d] text-xs font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: `${prog.accent}25`,
                    color: prog.accent,
                  }}
                >
                  {prog.level[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#f5f1e6]">
                    {prog.title}
                  </h3>
                  <p className="text-sm text-[#f5f1e6]/40">
                    {prog.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: `${prog.accent}15`,
                    borderColor: `${prog.accent}40`,
                    color: prog.accent,
                  }}
                >
                  {prog.level}
                </span>
                <span className="text-sm text-[#f5f1e6]/50">
                  {prog.duration}
                </span>
                <span className="text-sm text-[#f5f1e6]/40">
                  Opening soon
                </span>
              </div>

              <div className="flex-1 mb-8">
                <p className="text-xs uppercase tracking-wider text-[#f5f1e6]/30 mb-3 font-medium">
                  Curriculum
                </p>
                <ul className="space-y-2.5">
                  {prog.curriculum.map((c, ci) => (
                    <li
                      key={ci}
                      className="flex items-start gap-3 text-sm text-[#f5f1e6]/60"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: prog.accent }}
                      />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/courses"
                className="block w-full text-center py-3.5 rounded-xl font-medium text-sm transition-all"
                style={{
                  backgroundColor: `${prog.accent}20`,
                  color: prog.accent,
                  border: `1px solid ${prog.accent}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${prog.accent}35`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${prog.accent}20`;
                }}
              >
                Enroll Now
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          className="bg-[#0f1a14] border border-[#1a3a2a]/20 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#f5f1e6] mb-3">
                Custom Path
              </h2>
              <p className="text-[#f5f1e6]/50 text-base">
                Mix and match courses from any school to create your own program
              </p>
            </div>
            <Link
              href="/schools"
              className="px-8 py-4 bg-[#1a3a2a] hover:bg-[#1a3a2a]/80 text-[#4ade80] rounded-xl font-medium transition-all hover:shadow-[0_0_25px_-5px_#1a3a2a] whitespace-nowrap"
            >
              Browse Schools
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              className="bg-[#0f1a14] border border-[#1a3a2a]/20 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#f5f1e6] mb-1">
                {s.value}
              </div>
              <div className="text-sm text-[#f5f1e6]/40">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
