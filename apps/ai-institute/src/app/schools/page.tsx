"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const schools = [
  {
    tag: "foundations",
    name: "School of AI Foundations",
    description:
      "Start here. Learn what AI is, how it works, and how to build with it.",
    icon: "Building blocks of AI",
    href: "/courses/ai-foundations",
    courseCount: 1,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-white">
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-ivory-100) 0%, var(--color-brand-gold) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Schools
            </h1>
            <p className="text-white/40 text-lg">
              Explore our schools of learning
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {schools.map((school) => (
            <Link
              key={school.tag}
              href={school.href}
              className="group block rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-accent-gold/30 transition-all"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-gold transition-colors">
                {school.name}
              </h3>
              <p className="text-sm text-white/40 mb-4">{school.description}</p>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <span className="px-2 py-1 rounded bg-white/[0.06]">
                  {school.courseCount} course
                </span>
              </div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <p className="text-sm text-white/40">
              More schools are being developed. Each school will launch with
              real courses and real content.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
