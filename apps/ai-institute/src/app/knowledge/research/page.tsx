"use client";

import { motion } from "framer-motion";
import {
  FlaskConical,
  Search,
  FileText,
  Users,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
const researchAreas = [
  {
    title: "Ecology & Conservation",
    desc: "Forest restoration monitoring, biodiversity assessment, and climate impact studies.",
    status: "Active",
  },
  {
    title: "Heritage Documentation",
    desc: "Architectural preservation, manuscript digitization, and cultural mapping.",
    status: "Active",
  },
  {
    title: "AI for Good",
    desc: "Ethical AI development, bias mitigation, and responsible innovation.",
    status: "Active",
  },
  {
    title: "Education Research",
    desc: "Pedagogical methods, learning outcomes, and curriculum development.",
    status: "Active",
  },
];

const publications = [
  {
    title: "Forest Cover Analysis Using Remote Sensing",
    authors: "Bhavya Ecology Team",
    year: "2026",
    journal: "Environmental Monitoring",
  },
  {
    title: "Digital Preservation of Temple Architecture",
    authors: "Bhavya Heritage Team",
    year: "2026",
    journal: "Heritage Science",
  },
  {
    title: "Ethical AI in Education: A Framework",
    authors: "Bhavya AI Team",
    year: "2025",
    journal: "AI & Ethics",
  },
];

export default function ResearchPage() {
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
              Open Research
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mb-12">
              Evidence-based research across ecology, heritage, education, and
              technology. All findings are publicly documented.
            </p>
          </motion.div>

          <h2 className="text-2xl font-serif text-[var(--color-text-primary)] mb-6">
            Research Areas
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {researchAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-xl bg-[var(--color-brand-forest)] text-white">
                    <FlaskConical size={20} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {area.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                  {area.title}
                </h3>
                <p className="text-[var(--color-text-secondary)]">{area.desc}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-serif text-[var(--color-text-primary)] mb-6">
            Recent Publications
          </h2>
          <div className="space-y-4">
            {publications.map((pub, i) => (
              <motion.div
                key={pub.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-4 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-between group hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {pub.authors} · {pub.year} · {pub.journal}
                  </p>
                </div>
                <ExternalLink
                  size={18}
                  className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-brand-forest)] transition-colors"
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
