"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { flagshipPath, type LearningStage } from "@/data/learning-paths";

const difficultyConfig: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Beginner: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  Intermediate: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  Advanced: {
    bg: "bg-accent-gold/10",
    text: "text-accent-gold",
    border: "border-accent-gold/20",
  },
  Expert: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
};

const totalWeeks = flagshipPath.reduce((acc, stage) => {
  const match = stage.duration.match(/(\d+)/);
  return acc + (match ? parseInt(match[1]) : 0);
}, 0);

const totalModules = flagshipPath.reduce(
  (acc, stage) => acc + stage.modules.length,
  0,
);

function StageCard({
  stage,
  index,
  isExpanded,
  onToggle,
}: {
  stage: LearningStage;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const config = difficultyConfig[stage.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative flex gap-6"
    >
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-300"
          style={{
            backgroundColor: isExpanded ? stage.color : stage.color + "30",
            boxShadow: isExpanded ? `0 0 24px ${stage.color}40` : "none",
          }}
        >
          {stage.icon}
        </motion.div>
        {index < flagshipPath.length - 1 && (
          <div className="w-px flex-1 min-h-[40px] relative overflow-hidden">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
              className="w-full h-full origin-top"
              style={{
                background: `linear-gradient(to bottom, ${stage.color}60, ${flagshipPath[index + 1].color}60)`,
              }}
            />
          </div>
        )}
      </div>

      <div className="flex-1 pb-8">
        <motion.button
          onClick={onToggle}
          className="w-full text-left group"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-mono text-white/30 tracking-wider">
                  STAGE {String(stage.number).padStart(2, "0")}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border}`}
                >
                  {stage.difficulty}
                </span>
                <span className="text-[11px] text-white/25">
                  {stage.duration}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                {stage.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {stage.subtitle}
              </p>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-white/20 group-hover:text-white/40 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-5">
                <p
                  className="text-sm text-white/50 leading-relaxed border-l-2 pl-4"
                  style={{ borderColor: stage.color + "60" }}
                >
                  {stage.description}
                </p>

                <div>
                  <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
                    Modules
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stage.modules.map((mod, i) => (
                      <motion.div
                        key={mod}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="text-xs text-white/60">{mod}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
                    Skills Gained
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="text-[11px] px-2.5 py-1 rounded-md font-medium"
                        style={{
                          backgroundColor: stage.color + "15",
                          color: stage.color,
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {stage.prerequisites.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
                      Prerequisites
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.prerequisites.map((pre) => (
                        <span
                          key={pre}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] text-white/40 border border-white/[0.06]"
                        >
                          {flagshipPath.find((s) => s.id === pre)?.title || pre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="rounded-xl p-4 border border-white/[0.06]"
                  style={{ backgroundColor: stage.color + "08" }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">💡</span>
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 mb-1">
                        Project Idea
                      </h4>
                      <p className="text-sm text-white/40 leading-relaxed">
                        {stage.projectIdea}
                      </p>
                    </div>
                  </div>
                </div>

                {stage.courseId && (
                  <Link
                    href={`/courses/${stage.courseId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: stage.color + "20",
                      color: stage.color,
                      border: `1px solid ${stage.color}40`,
                    }}
                  >
                    View Course →
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LearningPathsPage() {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [currentStage] = useState(1);

  const toggleStage = (id: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      {/* Fully connected — Wave Q: all 8 stages linked to published courses */}
      <div className="bg-accent-gold/10 border-b border-accent-gold/20 px-6 py-2 text-center">
        <p className="text-xs text-accent-gold/70 font-medium">
          Structured Curriculum — 8 stages, each backed by a published course.
          Follow the path or jump to any stage.
        </p>
      </div>
      <div className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="text-xs text-white/30 hover:text-white/50 mb-6 inline-flex items-center gap-1.5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M7.5 3L4.5 6L7.5 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to AI Institute
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${flagshipPath[0].color}40 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${flagshipPath[4].color}40 0%, transparent 50%)`,
          }}
        />
        <div className="max-w-6xl mx-auto px-6 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-xs font-mono text-white/20 tracking-[0.3em] uppercase mb-6 block">
              Flagship Learning Path
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                AI Journey
              </span>
            </h1>
            <p className="text-lg text-white/40 leading-relaxed max-w-xl mx-auto mb-10">
              From zero to AI expert in 8 stages. A structured path designed to
              take you from complete beginner to building autonomous AI systems.
            </p>
            <div className="flex items-center justify-center gap-8 mb-10">
              {[
                { label: "Weeks", value: `${totalWeeks}` },
                { label: "Stages", value: `${flagshipPath.length}` },
                { label: "Modules", value: `${totalModules}+` },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white/80">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-white/25 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => {
                  const el = document.getElementById("timeline");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Start Your Journey
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 3V11M7 11L3 7M7 11L11 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16" id="timeline">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold mb-2">The Path</h2>
              <p className="text-sm text-white/30">
                8 stages from foundations to frontier AI. Stages with published
                courses link directly to course content.
              </p>
            </motion.div>

            <div className="space-y-0">
              {flagshipPath.map((stage, index) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isExpanded={expandedStages.has(stage.id)}
                  onToggle={() => toggleStage(stage.id)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              >
                <h3 className="text-sm font-semibold text-white/60 mb-4">
                  Your Progress
                </h3>
                <div className="space-y-3">
                  {flagshipPath.map((stage) => {
                    const isActive = stage.number === currentStage;
                    const isComplete = stage.number < currentStage;
                    return (
                      <div key={stage.id} className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 transition-all"
                          style={{
                            backgroundColor: isComplete
                              ? stage.color
                              : isActive
                                ? stage.color + "40"
                                : "rgba(255,255,255,0.03)",
                            boxShadow: isActive
                              ? `0 0 12px ${stage.color}30`
                              : "none",
                          }}
                        >
                          {isComplete ? (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M3 7L6 10L11 4"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <span
                              className={`text-xs font-mono ${isActive ? "text-white" : "text-white/20"}`}
                            >
                              {stage.number}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-xs font-medium truncate ${isActive ? "text-white" : isComplete ? "text-white/50" : "text-white/25"}`}
                          >
                            {stage.title}
                          </div>
                          <div className="text-[10px] text-white/15">
                            {stage.duration}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              >
                <h3 className="text-sm font-semibold text-white/60 mb-4">
                  Difficulty Breakdown
                </h3>
                <div className="space-y-3">
                  {(
                    ["Beginner", "Intermediate", "Advanced", "Expert"] as const
                  ).map((diff) => {
                    const count = flagshipPath.filter(
                      (s) => s.difficulty === diff,
                    ).length;
                    const config = difficultyConfig[diff];
                    return (
                      <div key={diff} className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${config.text}`}
                          style={{ backgroundColor: "currentColor" }}
                        />
                        <span className="text-xs text-white/40 flex-1">
                          {diff}
                        </span>
                        <span className="text-xs font-mono text-white/25">
                          {count} stages
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              >
                <h3 className="text-sm font-semibold text-white/60 mb-4">
                  Skills Overview
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[...new Set(flagshipPath.flatMap((s) => s.skills))]
                    .slice(0, 16)
                    .map((skill, i) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-white/30 border border-white/[0.04]"
                      >
                        {skill}
                      </span>
                    ))}
                  <span className="text-[10px] px-2 py-0.5 text-white/15">
                    +
                    {[...new Set(flagshipPath.flatMap((s) => s.skills))]
                      .length - 16}{" "}
                    more
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
            <p className="text-sm text-white/40 mb-8 max-w-md mx-auto">
              Start with Stage 1: AI Foundations. No prior experience needed.
              Just curiosity and commitment.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/courses/ai-foundations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Start Stage 1
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7H11M11 7L7 3M11 7L7 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/60 font-medium text-sm hover:bg-white/[0.03] transition-colors"
              >
                Explore All Paths
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
