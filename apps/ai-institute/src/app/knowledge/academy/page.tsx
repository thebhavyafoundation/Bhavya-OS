"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";
import { BhavyaLogo } from "@/components/BhavyaLogo";

const academyStats = [
  { value: "13", label: "Learning Levels" },
  { value: "78", label: "Modules" },
  { value: "331", label: "Knowledge Packages" },
  { value: "100%", label: "Free & Open" },
];

const levels = [
  {
    level: "Foundations",
    modules: 8,
    desc: "Core concepts in AI, ethics, and digital literacy.",
    icon: BookOpen,
  },
  {
    level: "Intermediate",
    modules: 12,
    desc: "Applied skills in research, data, and communication.",
    icon: GraduationCap,
  },
  {
    level: "Advanced",
    modules: 15,
    desc: "Specialized knowledge in AI, heritage, and ecology.",
    icon: Star,
  },
  {
    level: "Expert",
    modules: 10,
    desc: "Research-level work and mentorship preparation.",
    icon: Award,
  },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <BhavyaLogo width={32} height={32} />
            <span>Bhavya Academy</span>
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
              Bhavya Academy
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mb-12">
              13 levels, 78 modules, 331 knowledge packages. Free and open to
              all. From foundations to expert research.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {academyStats.map((stat, i) => (
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

          <h2 className="text-2xl font-serif text-[var(--color-text-primary)] mb-8">
            Learning Levels
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {levels.map((level, i) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--color-brand-forest)] text-white">
                    <level.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {level.level}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] mt-1">
                      {level.desc}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} /> {level.modules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> Self-paced
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
