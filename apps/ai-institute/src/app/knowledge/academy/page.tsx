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
      <main className="pb-16">
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
              Free and open learning paths. From foundations to expert research.
            </p>
          </motion.div>

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
