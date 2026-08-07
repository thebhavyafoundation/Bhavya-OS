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

const team = [
  {
    name: "Dr. Priya Sharma",
    role: "Director of AI Research",
    bio: "Former lead at DeepMind. 15+ years in machine learning research.",
  },
  {
    name: "Prof. Rajesh Kumar",
    role: "Head of Curriculum",
    bio: "Stanford PhD. Designed ML courses used by 100K+ students worldwide.",
  },
  {
    name: "Ananya Patel",
    role: "VP of Engineering",
    bio: "Ex-Google engineer. Built distributed systems serving millions.",
  },
  {
    name: "Dr. Michael Chen",
    role: "Dean of Students",
    bio: "Education innovator. Pioneer in adaptive learning technologies.",
  },
];

const stats = [
  { value: "50K+", label: "Students" },
  { value: "100+", label: "Courses" },
  { value: "12", label: "Schools" },
  { value: "95%", label: "Completion Rate" },
];

export default function AboutPage() {
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
              Faculty
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">Meet Our Team</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-[#1a2a1f] bg-[#0a0f0d] text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#1a3a2a]/40 mx-auto mb-4 flex items-center justify-center text-[#c9a227] text-2xl font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-base font-semibold text-[#f5f1e6] mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-[#c9a227] mb-3">{member.role}</p>
                <p className="text-sm text-[#8a7359] leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-y border-[#1a2a1f]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-[#c9a227] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-[#8a7359]">{stat.label}</div>
            </motion.div>
          ))}
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

      {footer}
    </div>
  );
}
