"use client";

import { motion } from "framer-motion";
import {
  Library,
  Search,
  BookOpen,
  FileText,
  Download,
  ArrowRight,
} from "lucide-react";
const collections = [
  {
    title: "Ecology & Environment",
    desc: "Research papers, field reports, and data on forest restoration and biodiversity.",
  },
  {
    title: "Heritage & Culture",
    desc: "Documentation of architectural heritage, manuscripts, and living traditions.",
  },
  {
    title: "AI & Technology",
    desc: "Technical documentation, research papers, and educational materials on AI.",
  },
  {
    title: "Education & Pedagogy",
    desc: "Curriculum materials, teaching guides, and learning resources.",
  },
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="pb-16">
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-text-primary)] mb-6">
              Open Library
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mb-12">
              Free, open-access repository of institutional knowledge. Growing
              every day.
            </p>
          </motion.div>

          <div className="relative mb-12">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            />
            <input
              type="text"
              placeholder="Search knowledge packages..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] text-lg"
            />
          </div>

          <h2 className="text-2xl font-serif text-[var(--color-text-primary)] mb-6">
            Collections
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {collections.map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-xl bg-[var(--color-brand-forest)] text-white">
                    <Library size={20} />
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-brand-forest)] transition-colors"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                  {col.title}
                </h3>
                <p className="text-[var(--color-text-secondary)]">{col.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
