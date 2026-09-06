"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const categories = ["General", "Courses", "Pricing", "Technical"] as const;

const faqs: Record<string, { question: string; answer: string }[]> = {
  General: [
    {
      question: "What is Bhavya Foundation?",
      answer:
        "Bhavya Foundation is a comprehensive AI education institution with a 10-year mission to become the global benchmark for AI education. We offer structured learning paths from beginner to expert level.",
    },
    {
      question: "Who can join Bhavya Foundation?",
      answer:
        "Anyone with curiosity and determination. Whether you're a complete beginner, a working professional looking to transition into AI, or an experienced researcher — we have a path for you. Our programs span from introductory to expert level.",
    },
    {
      question: "How is Bhavya Foundation different from other platforms?",
      answer:
        "We are not a course marketplace — we are an institution. Our curriculum is built on foundational research, our governance ensures long-term quality, and our multi-pillar academic structure covers the full spectrum of AI. Every decision is guided by institutional value, not short-term metrics.",
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
        "Our courses are part of structured learning paths, ensuring you build knowledge systematically from foundations to advanced topics.",
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
        "Yes. We offer merit-based and need-based scholarships covering up to 100% of tuition. We are building partnerships with leading organizations to expand access to underrepresented communities in AI.",
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
    <div className="border border-border-primary rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 text-left flex items-center justify-between bg-bg-secondary hover:bg-bg-secondary/80 transition-colors"
      >
        <span className="text-base font-medium text-text-primary pr-4">
          {question}
        </span>
        <span
          className={`text-accent-gold text-xl transition-transform duration-300 ${open ? "rotate-45" : ""}`}
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
            <div className="px-6 pb-5 bg-bg-secondary">
              <p className="text-sm text-text-tertiary leading-relaxed">
                {answer}
              </p>
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
    <>
      <SiteHeader />
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-accent-gold font-medium mb-4 tracking-widest uppercase"
          >
            Help Center
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-text-primary mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-tertiary max-w-2xl mx-auto"
          >
            Everything you need to know about Bhavya Foundation. Can&apos;t find
            your answer? Contact us below.
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
                    ? "bg-accent-gold text-text-primary"
                    : "bg-bg-secondary text-text-tertiary hover:text-text-primary border border-border-primary"
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
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Still Have Questions?
            </h2>
            <p className="text-text-tertiary mb-8">
              Our team is here to help. Reach out and we&apos;ll get back to you
              within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@bhavyafoundation.org"
                className="px-8 py-4 text-base font-semibold bg-accent-gold text-text-primary rounded-lg hover:bg-accent-gold-hover transition-colors"
              >
                Contact Support
              </a>
              <Link
                href="/assessment"
                className="px-8 py-4 text-base font-medium text-text-primary border border-border-primary rounded-lg hover:border-border-focus transition-colors"
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
