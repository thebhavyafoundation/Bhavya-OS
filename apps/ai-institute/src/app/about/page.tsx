"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const values = [
  {
    title: "Excellence",
    description:
      "We pursue the highest standards in AI education, research, and mentorship. Every course, every lesson, every interaction reflects our commitment to quality.",
    icon: "✦",
  },
  {
    title: "Accessibility",
    description:
      "AI education should be available to everyone, regardless of background, location, or financial means. We design for inclusion from the ground up.",
    icon: "◇",
  },
  {
    title: "Integrity",
    description:
      "We act with honesty, transparency, and ethical responsibility. Our governance ensures that institutional value always takes precedence over short-term gains.",
    icon: "△",
  },
  {
    title: "Innovation",
    description:
      "We push the boundaries of what AI education can be. From interactive labs to AI mentors, we pioneer new approaches to learning.",
    icon: "◈",
  },
];

export default function AboutPage() {
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
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#f5f1e6] mb-6"
          >
            About Bhavya AI Institute
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#8a7359] max-w-2xl mx-auto"
          >
            A 10-year mission to become the global benchmark for AI education.
            Not another course platform. A lasting institution.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
                Our Mission
              </p>
              <h2 className="text-3xl font-bold text-[#f5f1e6] mb-6">
                Democratize AI Education for Everyone
              </h2>
              <p className="text-[#8a7359] leading-relaxed mb-4">
                Our mission is to democratize AI education, making world-class
                learning accessible to anyone with curiosity and determination.
                We believe that understanding AI is not a luxury — it is a
                necessity for the 21st century.
              </p>
              <p className="text-[#8a7359] leading-relaxed">
                Through rigorous curriculum, hands-on labs, and personalized
                mentorship, we transform learners into practitioners,
                researchers, and leaders who will shape the future of artificial
                intelligence.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1a3a2a]/40 to-[#0a0f0d] border border-[#1a2a1f] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-[#c9a227] mb-2">
                    10
                  </div>
                  <div className="text-sm text-[#8a7359]">Year Mission</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111916]/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Our Story
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6] mb-8">
              The Founding Story
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-[#8a7359] leading-relaxed mb-4">
                Bhavya AI Institute was born from a simple observation: the
                world&apos;s most transformative technology — artificial
                intelligence — was being taught as a series of disconnected
                tutorials and bootcamps. There was no institution dedicated to
                building deep, lasting understanding.
              </p>
              <p className="text-[#8a7359] leading-relaxed">
                In 2026, the Bhavya Foundation set out to change that. We
                envisioned an institution that would produce not just
                practitioners, but researchers, educators, and leaders who truly
                understand AI at its core.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-[#8a7359] leading-relaxed mb-4">
                Every decision we make is guided by one principle: build
                institutional value that compounds over decades. Our curriculum
                is built on foundational research. Our governance ensures
                independence. Our mission demands excellence.
              </p>
              <p className="text-[#8a7359] leading-relaxed">
                This is not a startup. This is an institution — built to last,
                built to lead, and built for the next decade of AI.
              </p>
            </motion.div>
          </div>
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
              Core Values
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-[#1a2a1f] bg-[#111916] hover:border-[#c9a227]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1a3a2a]/30 flex items-center justify-center text-[#c9a227] text-xl mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#f5f1e6] mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-[#8a7359] leading-relaxed">
                  {value.description}
                </p>
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
              Join Our Community
            </h2>
            <p className="text-[#8a7359] mb-10 text-lg">
              50,000+ learners, researchers, and practitioners are building the
              future of AI together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assessment"
                className="px-8 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
              >
                Begin Your Journey
              </Link>
              <Link
                href="/schools"
                className="px-8 py-4 text-base font-medium text-[#f5f1e6] border border-[#1a2a1f] rounded-lg hover:border-[#1a3a2a] transition-colors"
              >
                Explore Schools
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
