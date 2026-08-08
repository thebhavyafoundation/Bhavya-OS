"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const course = {
  id: "intro-to-ml",
  title: "Introduction to Machine Learning",
  subtitle:
    "Master the foundations of ML from linear regression to neural networks. Build real models, understand the math, and develop intuition for how machines learn.",
  difficulty: "Intermediate",
  duration: "22 hours",
  moduleCount: 4,
  instructor: {
    name: "Dr. Ananya Sharma",
    role: "Lead ML Researcher",
    bio: "Former Google Brain researcher with 12+ years in machine learning. Published 40+ papers on neural architectures and optimization.",
  },
  prerequisites: [
    "Python programming fundamentals",
    "Basic linear algebra (vectors, matrices)",
    "Introductory statistics and probability",
  ],
  outcomes: [
    "Understand supervised, unsupervised, and reinforcement learning paradigms",
    "Implement regression, classification, and clustering algorithms from scratch",
    "Evaluate model performance using proper metrics and validation strategies",
    "Build and train neural networks for real-world applications",
  ],
  modules: [
    {
      id: "foundations",
      title: "Foundations",
      lessonCount: 4,
      duration: "2h 30m",
      lessons: [
        { id: "what-is-ml", title: "What is Machine Learning?" },
        { id: "types-of-learning", title: "Types of Learning" },
        { id: "linear-regression", title: "Linear Regression" },
        { id: "model-evaluation", title: "Model Evaluation" },
      ],
    },
    {
      id: "supervised",
      title: "Supervised Learning",
      lessonCount: 5,
      duration: "6h",
      lessons: [
        { id: "decision-trees", title: "Decision Trees" },
        { id: "svms", title: "Support Vector Machines" },
        { id: "knn", title: "K-Nearest Neighbors" },
        { id: "ensemble", title: "Ensemble Methods" },
        { id: "comparison", title: "Algorithm Comparison" },
      ],
    },
    {
      id: "unsupervised",
      title: "Unsupervised Learning",
      lessonCount: 4,
      duration: "5h 30m",
      lessons: [
        { id: "k-means", title: "K-Means Clustering" },
        { id: "pca", title: "Principal Component Analysis" },
        { id: "anomaly-detection", title: "Anomaly Detection" },
        { id: "applications", title: "Real-World Applications" },
      ],
    },
    {
      id: "neural-networks",
      title: "Neural Networks",
      lessonCount: 5,
      duration: "8h",
      lessons: [
        { id: "perceptrons", title: "Perceptrons and Activation Functions" },
        { id: "backpropagation", title: "Backpropagation" },
        { id: "cnns", title: "Convolutional Neural Networks" },
        { id: "rnns", title: "Recurrent Neural Networks" },
        { id: "transformers", title: "Transformers and Attention" },
      ],
    },
  ],
};

const difficultyColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function CoursePage() {
  const _params = useParams();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const progress = 0;

  return (
    <div>
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a3a2a 0%, #0a0f0d 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMS0xMy43TDIwLjMgMTZsMTQuNy04LjEtNC43IDguMSAxNC43IDguMS0xNC43IDguMUwyMC4zIDQ4bDE0LjctOC4xIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border ${
                  difficultyColor[course.difficulty]
                }`}
              >
                {course.difficulty}
              </span>
              <span className="text-sm text-[#8a7359]">{course.duration}</span>
              <span className="text-sm text-[#8a7359]">·</span>
              <span className="text-sm text-[#8a7359]">
                {course.moduleCount} modules
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#f5f1e6] mb-4 tracking-tight">
              {course.title}
            </h1>

            <p className="text-lg text-[#8a7359] max-w-2xl leading-relaxed">
              {course.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-[#f5f1e6] mb-6">
                What You&apos;ll Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.outcomes.map((outcome, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex gap-3 p-4 rounded-xl bg-[#1a3a2a]/30 border border-[#1a3a2a]/50"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-[#c9a227]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-[#f5f1e6]/80 leading-relaxed">
                      {outcome}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-[#f5f1e6] mb-6">
                Course Modules
              </h2>
              <div className="space-y-3">
                {course.modules.map((mod, i) => {
                  const isExpanded = expandedModule === mod.id;
                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                      className="rounded-xl border border-white/5 overflow-hidden bg-[#111916]"
                    >
                      <button
                        onClick={() =>
                          setExpandedModule(isExpanded ? null : mod.id)
                        }
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#1a3a2a]/60 border border-[#1a3a2a] flex items-center justify-center">
                            <span className="text-sm font-semibold text-[#c9a227]">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-[#f5f1e6]">
                              {mod.title}
                            </h3>
                            <p className="text-xs text-[#8a7359] mt-0.5">
                              {mod.lessonCount} lessons · {mod.duration}
                            </p>
                          </div>
                        </div>
                        <motion.svg
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-5 h-5 text-[#8a7359]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </motion.svg>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1] as const,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-white/5">
                              <div className="pt-4 space-y-1">
                                {mod.lessons.map((lesson, j) => (
                                  <Link
                                    key={lesson.id}
                                    href={`/courses/foundations/lessons/${lesson.id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors duration-150 group"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#c9a227]/30 transition-colors">
                                      <span className="text-[10px] text-[#8a7359] group-hover:text-[#c9a227] transition-colors">
                                        {j + 1}
                                      </span>
                                    </div>
                                    <span className="text-sm text-[#f5f1e6]/70 group-hover:text-[#f5f1e6] transition-colors">
                                      {lesson.title}
                                    </span>
                                    <svg
                                      className="w-4 h-4 text-[#8a7359] opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={1.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="sticky top-20 space-y-6">
              <div className="rounded-xl border border-white/5 bg-[#111916] p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#8a7359]">Progress</span>
                    <span className="text-xs font-medium text-[#c9a227]">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#1a3a2a] to-[#c9a227] rounded-full"
                    />
                  </div>
                </div>

                <Link
                  href="/courses/foundations/lessons/what-is-ml"
                  className="block w-full py-3 px-4 bg-[#c9a227] hover:bg-[#d4ad2e] text-[#0a0f0d] text-sm font-semibold rounded-lg text-center transition-colors duration-200"
                >
                  {progress > 0 ? "Continue Learning" : "Start Course"}
                </Link>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#111916] p-6">
                <h3 className="text-sm font-semibold text-[#f5f1e6] mb-4">
                  Prerequisites
                </h3>
                <ul className="space-y-3">
                  {course.prerequisites.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <svg
                        className="w-4 h-4 text-[#8a7359] mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-[#f5f1e6]/70">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#111916] p-6">
                <h3 className="text-sm font-semibold text-[#f5f1e6] mb-4">
                  Instructor
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3a2a] to-[#c9a227] flex items-center justify-center">
                    <span className="text-sm font-bold text-[#f5f1e6]">
                      {course.instructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#f5f1e6]">
                      {course.instructor.name}
                    </p>
                    <p className="text-xs text-[#8a7359]">
                      {course.instructor.role}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#f5f1e6]/60 leading-relaxed">
                  {course.instructor.bio}
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
