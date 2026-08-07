"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const nav = (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a2a1f] bg-[#0a0f0d]/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#1a3a2a] flex items-center justify-center">
          <span className="text-[#c9a227] font-bold text-sm">B</span>
        </div>
        <span className="text-sm font-semibold text-[#f5f1e6]">
          Bhavya AI Institute
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/schools"
          className="text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors hidden md:block"
        >
          Schools
        </Link>
        <Link
          href="/learning-paths"
          className="text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors hidden md:block"
        >
          Learning Paths
        </Link>
        <Link
          href="/research"
          className="text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors hidden md:block"
        >
          Research
        </Link>
        <Link
          href="/assessment"
          className="px-4 py-2 text-sm font-medium bg-[#1a3a2a] text-[#f5f1e6] rounded-lg hover:bg-[#1a3a2a]/80 transition-colors"
        >
          Begin Journey
        </Link>
      </div>
    </div>
  </nav>
);

const footer = (
  <footer className="py-12 px-6 border-t border-[#1a2a1f]">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <div className="w-8 h-8 rounded-lg bg-[#1a3a2a] flex items-center justify-center">
          <span className="text-[#c9a227] font-bold text-sm">B</span>
        </div>
        <span className="text-sm text-[#8a7359]">
          Bhavya AI Institute — Building the future of AI education
        </span>
      </div>
      <p className="text-xs text-[#8a7359]">
        © 2026 Bhavya Foundation. Built for the next decade.
      </p>
    </div>
  </footer>
);

const pillars = [
  {
    title: "Education",
    description:
      "World-class curriculum that builds deep understanding, not surface familiarity. From foundations to frontier research.",
    stats: "100+ courses across 12 schools",
    icon: "◆",
  },
  {
    title: "Research",
    description:
      "Advancing the state of AI through rigorous investigation. Our research informs our curriculum, and our curriculum trains the next generation of researchers.",
    stats: "50+ active research projects",
    icon: "◇",
  },
  {
    title: "Impact",
    description:
      "Transforming lives through accessible AI education. From career changers to entrepreneurs, our graduates are building the future.",
    stats: "50K+ learners worldwide",
    icon: "◈",
  },
];

const milestones = [
  {
    year: "2026",
    title: "Foundation",
    description:
      "Bhavya AI Institute founded with a 10-year mission to become the global benchmark for AI education.",
  },
  {
    year: "2026",
    title: "12 Schools Launched",
    description:
      "Academic structure established with 12 specialized schools covering the full spectrum of AI.",
  },
  {
    year: "2026",
    title: "First Cohort",
    description:
      "Inaugural class of 5,000 students begins their journey through our flagship learning paths.",
  },
  {
    year: "2027",
    title: "Research Division",
    description:
      "Dedicated research division launches with focus on AI safety, alignment, and responsible development.",
  },
  {
    year: "2028",
    title: "Global Expansion",
    description:
      "Partnerships with institutions in 20+ countries. Localization in 15 languages.",
  },
  {
    year: "2030",
    title: "50K Graduates",
    description:
      "Milestone of 50,000 graduates working in AI across industry, academia, and government.",
  },
  {
    year: "2036",
    title: "Decade of Impact",
    description:
      "10-year vision realized: the global standard for AI education.",
  },
];

const impactMetrics = [
  { value: "50K+", label: "Active Learners" },
  { value: "95%", label: "Completion Rate" },
  { value: "87%", label: "Career Placement" },
  { value: "20+", label: "Countries" },
];

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      {nav}

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-[#c9a227] font-medium mb-4 tracking-widest uppercase"
          >
            Our Purpose
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#f5f1e6] mb-6"
          >
            Our Mission
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#8a7359] max-w-2xl mx-auto"
          >
            To build the world&apos;s most comprehensive and enduring
            institution for AI education, research, and impact.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Vision
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6] mb-6">
              A World Where AI Is Understood, Not Just Used
            </h2>
            <p className="text-[#8a7359] leading-relaxed text-lg max-w-3xl mx-auto">
              We envision a future where every person who interacts with AI
              understands how it works, why it matters, and how to use it
              responsibly. Not just engineers — everyone. Our vision is not just
              to teach AI, but to cultivate a generation of thinkers who will
              guide its development for the benefit of all humanity.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111916]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Three Pillars
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">
              The Foundation of Everything We Do
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-8 rounded-xl border border-[#1a2a1f] bg-[#0a0f0d] text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#1a3a2a]/30 mx-auto mb-6 flex items-center justify-center text-[#c9a227] text-2xl">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-[#f5f1e6] mb-4">
                  {pillar.title}
                </h3>
                <p className="text-[#8a7359] leading-relaxed mb-4">
                  {pillar.description}
                </p>
                <p className="text-sm text-[#c9a227] font-medium">
                  {pillar.stats}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Timeline
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">Our Journey</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#1a2a1f] -translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-[#c9a227] -translate-x-1/2 mt-1.5" />
                  <div className="ml-12 md:ml-0 md:w-1/2 pl-8">
                    <span className="text-sm text-[#c9a227] font-medium">
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-semibold text-[#f5f1e6] mt-1 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-[#8a7359] leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111916]/50 border-y border-[#1a2a1f]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Impact
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">
              Measuring What Matters
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[#c9a227] mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-[#8a7359]">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-[#f5f1e6] mb-6">
              Be Part of the Mission
            </h2>
            <p className="text-[#8a7359] mb-10 text-lg">
              Whether you&apos;re learning, teaching, or researching — you are
              the mission.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assessment"
                className="px-8 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
              >
                Start Learning
              </Link>
              <Link
                href="/research"
                className="px-8 py-4 text-base font-medium text-[#f5f1e6] border border-[#1a2a1f] rounded-lg hover:border-[#1a3a2a] transition-colors"
              >
                Explore Research
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {footer}
    </div>
  );
}
