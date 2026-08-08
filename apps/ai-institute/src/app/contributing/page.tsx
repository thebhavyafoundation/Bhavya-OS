"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const contributionTypes = [
  {
    title: "Content",
    description:
      "Create or improve courses, lessons, assessments, and learning materials. Share your expertise to help others learn AI.",
    icon: "📝",
    actions: [
      "Write course content",
      "Create assessments",
      "Develop labs",
      "Review materials",
    ],
  },
  {
    title: "Code",
    description:
      "Contribute to our open-source platform, tools, and infrastructure. Build the systems that power AI education.",
    icon: "💻",
    actions: ["Fix bugs", "Add features", "Improve performance", "Write tests"],
  },
  {
    title: "Research",
    description:
      "Advance AI knowledge through research contributions. Publish papers, share findings, and push the field forward.",
    icon: "🔬",
    actions: [
      "Publish papers",
      "Share datasets",
      "Replicate studies",
      "Peer review",
    ],
  },
  {
    title: "Translations",
    description:
      "Help make AI education accessible worldwide by translating content into new languages and localizing materials.",
    icon: "🌍",
    actions: [
      "Translate courses",
      "Localize content",
      "Review translations",
      "Cultural adaptation",
    ],
  },
];

const codeOfConduct = [
  "Be respectful and inclusive in all interactions",
  "Provide constructive feedback, not criticism",
  "Focus on what is best for the community and learners",
  "Show empathy towards other community members",
  "Use welcoming and inclusive language",
  "Accept responsibility for mistakes and learn from them",
  "Prioritize the educational mission above all else",
];

const prProcess = [
  {
    step: "1",
    title: "Fork and Clone",
    description:
      "Fork the repository and create a local branch for your contribution.",
  },
  {
    step: "2",
    title: "Make Changes",
    description:
      "Implement your changes following the style guide. Add tests where applicable.",
  },
  {
    step: "3",
    title: "Test Locally",
    description:
      "Run the full test suite to ensure nothing is broken. Verify your changes work as expected.",
  },
  {
    step: "4",
    title: "Submit PR",
    description:
      "Create a pull request with a clear description of your changes and their educational value.",
  },
  {
    step: "5",
    title: "Review Process",
    description:
      "Respond to review feedback. Once approved, your contribution will be merged.",
  },
];

const styleGuide = [
  {
    title: "Code Style",
    items: [
      "Follow ESLint and Prettier configurations",
      "Use TypeScript for all new code",
      "Write meaningful variable and function names",
      "Add JSDoc comments for public APIs",
    ],
  },
  {
    title: "Content Style",
    items: [
      "Write in clear, accessible language",
      "Use active voice and direct address",
      "Include practical examples for every concept",
      "Test content with target audience before publishing",
    ],
  },
  {
    title: "Commit Messages",
    items: [
      "Use conventional commit format",
      "Reference issue numbers when applicable",
      "Keep commits focused on single changes",
      "Write descriptive commit messages",
    ],
  },
];

export default function ContributingPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-[#c9a227] font-medium mb-4 tracking-widest uppercase"
          >
            Open Source
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#f5f1e6] mb-6"
          >
            Contributing to Bhavya AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#8a7359] max-w-2xl mx-auto"
          >
            Join our community of contributors building the future of AI
            education. Every contribution matters.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              How to Contribute
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">
              Ways to Make an Impact
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {contributionTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-[#1a2a1f] bg-[#111916]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl">{type.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f1e6] mb-2">
                      {type.title}
                    </h3>
                    <p className="text-sm text-[#8a7359] leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {type.actions.map((action) => (
                    <span
                      key={action}
                      className="text-xs px-3 py-1 rounded-full bg-[#1a3a2a]/20 text-[#1a3a2a]"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111916]/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Code of Conduct
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6] mb-6">
              Our Standards
            </h2>
            <p className="text-[#8a7359] leading-relaxed mb-8">
              We are committed to providing a welcoming, inclusive, and
              harassment-free experience for everyone. All community members are
              expected to follow these guidelines:
            </p>
            <div className="space-y-3">
              {codeOfConduct.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-[#c9a227] mt-0.5">✓</span>
                  <span className="text-sm text-[#8a7359]">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Process
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6] mb-6">
              Pull Request Process
            </h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#1a2a1f]" />
            <div className="space-y-8">
              {prProcess.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex items-start gap-6"
                >
                  <div className="w-12 h-12 rounded-full bg-[#c9a227] flex items-center justify-center text-[#0a0f0d] font-bold text-sm z-10 shrink-0">
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-semibold text-[#f5f1e6] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#8a7359] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
              Standards
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">Style Guide</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {styleGuide.map((guide, i) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-[#1a2a1f] bg-[#0a0f0d]"
              >
                <h3 className="text-lg font-semibold text-[#f5f1e6] mb-4">
                  {guide.title}
                </h3>
                <ul className="space-y-3">
                  {guide.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-[#c9a227] text-xs mt-1">•</span>
                      <span className="text-sm text-[#8a7359]">{item}</span>
                    </li>
                  ))}
                </ul>
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
              Ready to Contribute?
            </h2>
            <p className="text-[#8a7359] mb-10 text-lg">
              Every contribution, no matter how small, helps build the future of
              AI education.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/bhavya-foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
              >
                View on GitHub
              </a>
              <Link
                href="/about"
                className="px-8 py-4 text-base font-medium text-[#f5f1e6] border border-[#1a2a1f] rounded-lg hover:border-[#1a3a2a] transition-colors"
              >
                Learn About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
