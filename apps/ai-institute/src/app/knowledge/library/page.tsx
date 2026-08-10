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
import Link from "next/link";
import { BhavyaLogo } from "@/components/BhavyaLogo";

const libraryStats = [
  { value: "331", label: "Knowledge Packages" },
  { value: "1,200+", label: "Documents" },
  { value: "50+", label: "Collections" },
  { value: "100%", label: "Open Access" },
];

const collections = [
  {
    title: "Ecology & Environment",
    count: 89,
    desc: "Research papers, field reports, and data on forest restoration and biodiversity.",
  },
  {
    title: "Heritage & Culture",
    count: 67,
    desc: "Documentation of architectural heritage, manuscripts, and living traditions.",
  },
  {
    title: "AI & Technology",
    count: 112,
    desc: "Technical documentation, research papers, and educational materials on AI.",
  },
  {
    title: "Education & Pedagogy",
    count: 63,
    desc: "Curriculum materials, teaching guides, and learning resources.",
  },
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <BhavyaLogo width={32} height={32} />
            <span>Bhavya Library</span>
          </Link>
          <Link href="/knowledge" className="nav-link">
            Back to Knowledge
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16">
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
              331 knowledge packages and growing. Free, open-access repository
              of institutional knowledge.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {libraryStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[var(--color-bg-secondary)]"
              >
                <div className="text-3xl font-bold text-[var(--color-brand-forest)]">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative mb-12">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            />
            <input
              type="text"
              placeholder="Search 331 knowledge packages..."
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
                <p className="text-sm text-[var(--color-brand-forest)] mb-2">
                  {col.count} packages
                </p>
                <p className="text-[var(--color-text-secondary)]">{col.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
