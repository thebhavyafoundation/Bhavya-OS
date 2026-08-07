"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const categories = ["General", "Courses", "Pricing", "Technical"] as const;

const faqs: Record<string, { question: string; answer: string }[]> = {
  General: [
    {
      question: "What is Bhavya AI Institute?",
      answer:
        "Bhavya AI Institute is a comprehensive AI education institution with 12 specialized schools, 100+ courses, and a 10-year mission to become the global benchmark for AI education. We offer structured learning paths from beginner to expert level.",
    },
    {
      question: "Who can join Bhavya AI Institute?",
      answer:
        "Anyone with curiosity and determination. Whether you're a complete beginner, a working professional looking to transition into AI, or an experienced researcher — we have a path for you. Our programs span from introductory to expert level.",
    },
    {
      question: "How is Bhavya AI Institute different from other platforms?",
      answer:
        "We are not a course marketplace — we are an institution. Our curriculum is built on foundational research, our governance ensures long-term quality, and our 12-school academic structure covers the full spectrum of AI. Every decision is guided by institutional value, not short-term metrics.",
    },
    {
      question: "What is the 10-year mission?",
      answer:
        "Our 10-year mission is to become the global standard for AI education. We measure success not in quarters or years, but in decades. Every decision we make is designed to compound institutional value over the long term.",
    },
  ],
  Courses: [
    {
      question: "How many courses are available?",
      answer:
        "We currently offer 100+ courses across 12 specialized schools. Each course is part of a structured learning path, ensuring you build knowledge systematically from foundations to advanced topics.",
    },
    {
      question: "What format are the courses in?",
      answer:
        "Our courses combine interactive lessons, hands-on labs, real-world projects, and AI-powered mentorship. You learn by doing, not just watching. Each course includes assessments, projects, and a completion certificate.",
    },
    {
      question: "Are there prerequisites for courses?",
      answer:
        "Each learning path has clearly defined prerequisites. Our Foundations path has no prerequisites — it's designed for complete beginners. Advanced paths like Deep Learning or LLM Engineering build on earlier paths.",
    },
    {
      question: "Can I take multiple courses simultaneously?",
      answer:
        "Yes. While we recommend following a single learning path sequentially for optimal knowledge building, you can enroll in courses across different schools to customize your education.",
    },
  ],
  Pricing: [
    {
      question: "How much does it cost?",
      answer:
        "We offer flexible pricing tiers to ensure accessibility. Free tier includes access to foundational courses. Pro tier unlocks all courses, labs, and mentorship. Institutional pricing is available for universities and organizations.",
    },
    {
      question: "Is there a free tier?",
      answer:
        "Yes. Our free tier includes access to foundational courses, community forums, and limited lab usage. We believe everyone should have access to AI education regardless of financial means.",
    },
    {
      question: "Do you offer scholarships?",
      answer:
        "Yes. We offer merit-based and need-based scholarships covering up to 100% of tuition. We also have partnerships with organizations worldwide to expand access to underrepresented communities in AI.",
    },
    {
      question: "Can organizations purchase bulk access?",
      answer:
        "Yes. We offer institutional licensing for universities, companies, and government organizations. Contact our partnerships team for custom pricing and deployment options.",
    },
  ],
  Technical: [
    {
      question: "What technical setup do I need?",
      answer:
        "A modern web browser and internet connection are all you need to get started. Our labs run in the cloud, so no local setup is required for most courses. Advanced projects may require local development environments with Python and common ML libraries.",
    },
    {
      question: "Do I need a powerful computer?",
      answer:
        "No. All course content and labs run in the cloud. For local development, any computer with Python 3.8+ and 8GB RAM will work for most courses. GPU access is provided through our cloud labs for deep learning courses.",
    },
    {
      question: "What programming languages are used?",
      answer:
        "Python is our primary language, as it's the standard for AI development. Some courses also cover SQL, JavaScript (for web-based AI applications), and R (for statistical modeling). We provide language foundations as part of our introductory courses.",
    },
    {
      question: "How do the AI labs work?",
      answer:
        "Our AI labs are cloud-based development environments pre-configured with all necessary libraries, datasets, and tools. You can code, train models, and run experiments directly in your browser. No installation or setup required.",
    },
  ],
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1a2a1f] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 text-left flex items-center justify-between bg-[#111916] hover:bg-[#111916]/80 transition-colors"
      >
        <span className="text-base font-medium text-[#f5f1e6] pr-4">
          {question}
        </span>
        <span
          className={`text-[#c9a227] text-xl transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 bg-[#111916]">
              <p className="text-sm text-[#8a7359] leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("General");

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
            Help Center
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#f5f1e6] mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#8a7359] max-w-2xl mx-auto"
          >
            Everything you need to know about Bhavya AI Institute. Can&apos;t
            find your answer? Contact us below.
          </motion.p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#c9a227] text-[#0a0f0d]"
                    : "bg-[#111916] text-[#8a7359] hover:text-[#f5f1e6] border border-[#1a2a1f]"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <div className="space-y-4">
            {faqs[activeCategory]?.map((faq, i) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <FAQItem {...faq} />
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
            <h2 className="text-3xl font-bold text-[#f5f1e6] mb-4">
              Still Have Questions?
            </h2>
            <p className="text-[#8a7359] mb-8">
              Our team is here to help. Reach out and we&apos;ll get back to you
              within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@bhavya.ai"
                className="px-8 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
              >
                Contact Support
              </a>
              <Link
                href="/assessment"
                className="px-8 py-4 text-base font-medium text-[#f5f1e6] border border-[#1a2a1f] rounded-lg hover:border-[#1a3a2a] transition-colors"
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {footer}
    </div>
  );
}
