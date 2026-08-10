"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Users,
} from "lucide-react";
const courses = [
  {
    id: "foundations",
    title: "AI Foundations",
    level: "Beginner",
    modules: 8,
    duration: "24 hours",
    desc: "Core concepts in artificial intelligence, ethics, and digital literacy.",
  },
  {
    id: "data-science",
    title: "Data Science",
    level: "Intermediate",
    modules: 12,
    duration: "36 hours",
    desc: "Data analysis, visualization, and statistical modeling.",
  },
  {
    id: "heritage-tech",
    title: "Heritage Technology",
    level: "Intermediate",
    modules: 10,
    duration: "30 hours",
    desc: "Digital preservation, GIS mapping, and documentation techniques.",
  },
  {
    id: "ecology-ai",
    title: "Ecology & AI",
    level: "Advanced",
    modules: 15,
    duration: "45 hours",
    desc: "Applying AI to environmental monitoring and conservation.",
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <main className="pb-16">
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-text-primary)] mb-6">
              Course Catalog
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mb-12">
              Structured learning paths from foundations to advanced research.
              All courses are free and open.
            </p>
          </motion.div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
              />
            </div>
            <button className="px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] flex items-center gap-2">
              <Filter size={18} /> Filter
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-brand-forest)] text-white">
                    {course.level}
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-brand-forest)] transition-colors"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  {course.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  {course.desc}
                </p>
                <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} /> {course.modules} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {course.duration}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
