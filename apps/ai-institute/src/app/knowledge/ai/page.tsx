"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Cpu,
  Database,
  Globe,
  ArrowRight,
  Shield,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { BhavyaLogo } from "@/components/BhavyaLogo";

const aiCapabilities = [
  {
    icon: Brain,
    title: "Natural Language Processing",
    desc: "Understanding and generating human language for education and research.",
  },
  {
    icon: Database,
    title: "Knowledge Graphs",
    desc: "Connecting ideas, concepts, and relationships across 331 knowledge packages.",
  },
  {
    icon: Globe,
    title: "Computer Vision",
    desc: "Analyzing images for heritage documentation and ecological monitoring.",
  },
  {
    icon: Cpu,
    title: "AI Lab Runtime",
    desc: "Running AI experiments and models for educational purposes.",
  },
];

const principles = [
  {
    title: "Transparency",
    desc: "All AI systems are documented. Users understand how decisions are made.",
  },
  {
    title: "Human Oversight",
    desc: "AI assists humans. Humans decide. No autonomous actions without approval.",
  },
  {
    title: "Bias Mitigation",
    desc: "Active monitoring and correction of biases in AI systems.",
  },
  {
    title: "Privacy First",
    desc: "Data minimization. No unnecessary collection. User control.",
  },
];

export default function AIPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <BhavyaLogo width={32} height={32} />
            <span>Bhavya AI</span>
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
              AI for Good
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mb-12">
              Ethical AI development, education, and research. Technology in
              service of humanity, not the other way around.
            </p>
          </motion.div>

          <h2 className="text-2xl font-serif text-[var(--color-text-primary)] mb-6">
            Capabilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {aiCapabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <div className="p-3 rounded-xl bg-[var(--color-brand-forest)] text-white w-fit mb-4">
                  <cap.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {cap.title}
                </h3>
                <p className="text-[var(--color-text-secondary)]">{cap.desc}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-serif text-[var(--color-text-primary)] mb-6">
            Ethical Principles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, i) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--color-bg-secondary)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Shield
                    size={20}
                    className="text-[var(--color-brand-gold)]"
                  />
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {principle.title}
                  </h3>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  {principle.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 p-8 rounded-2xl bg-[var(--color-brand-forest)] text-white text-center"
          >
            <h2 className="text-2xl font-serif mb-4">
              AI Ethics Policy
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              Read our comprehensive AI Ethics and Responsible AI Policy. Every
              AI system at Bhavya Foundation operates under these guidelines.
            </p>
            <Link
              href="/ai-ethics"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[var(--color-brand-forest)] font-medium hover:bg-white/90 transition-colors"
            >
              Read Policy <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
