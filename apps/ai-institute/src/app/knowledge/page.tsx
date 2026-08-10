"use client";

import { motion } from "framer-motion";
import {
  Brain,
  BookOpen,
  FlaskConical,
  GraduationCap,
  ArrowRight,
  Library,
  Users,
  Award,
} from "lucide-react";
import { BhavyaLogo } from "@/components/BhavyaLogo";

const knowledgeAreas = [
  {
    icon: Brain,
    title: "AI",
    desc: "Artificial intelligence research, education, and ethical deployment.",
    href: "/knowledge/ai",
  },
  {
    icon: GraduationCap,
    title: "Academy",
    desc: "Structured learning paths from foundations to advanced research.",
    href: "/knowledge/academy",
  },
  {
    icon: Library,
    title: "Library",
    desc: "Open-access knowledge repository. 331 knowledge packages and growing.",
    href: "/knowledge/library",
  },
  {
    icon: FlaskConical,
    title: "Research",
    desc: "Open research on ecology, heritage, education, and technology.",
    href: "/knowledge/research",
  },
];

const knowledgeStats = [
  { value: "331", label: "Knowledge Packages" },
  { value: "13", label: "Learning Levels" },
  { value: "78", label: "Modules" },
  { value: "100%", label: "Free & Open" },
];

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Navigation */}
      <nav className="site-nav">
        <div className="site-nav-inner">
          <a href="/" className="nav-logo">
            <BhavyaLogo size="sm" />
            <div className="nav-logo-text">
              <span className="nav-logo-name">Bhavya</span>
              <span className="nav-logo-tagline">
                Nature. Knowledge. Heritage.
              </span>
            </div>
          </a>
          <div className="nav-links">
            <a href="/forest" className="nav-link">
              Forest
            </a>
            <a
              href="/knowledge"
              className="nav-link"
              style={{ color: "var(--color-brand-forest)" }}
            >
              Knowledge
            </a>
            <a href="/heritage" className="nav-link">
              Heritage
            </a>
            <a href="/community" className="nav-link">
              Community
            </a>
          </div>
          <div className="nav-actions">
            <a href="/app" className="nav-cta">
              My Bhavya
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          paddingTop: "var(--header-h)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 50%, #4a7c59 100%)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
          <svg
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(247,244,236,0.2)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            color: "var(--color-text-inverse)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span
              className="editorial-label"
              style={{ color: "var(--color-brand-gold)" }}
            >
              Knowledge Mission
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                marginTop: "var(--space-4)",
              }}
            >
              Knowledge as a<br />
              Public Right
            </h1>
            <p
              style={{
                fontSize: "var(--text-lg)",
                maxWidth: "600px",
                marginTop: "var(--space-6)",
                opacity: 0.9,
                lineHeight: 1.7,
              }}
            >
              Education is a right, not a privilege. Bhavya Foundation makes
              quality learning accessible to all through open knowledge, free
              courses, and community research.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                marginTop: "var(--space-8)",
              }}
            >
              <a
                href="/knowledge/academy"
                className="btn btn-primary"
                style={{
                  background: "var(--color-brand-gold)",
                  color: "var(--color-brand-forest)",
                }}
              >
                Explore Academy
                <ArrowRight size={16} />
              </a>
              <a
                href="/knowledge/library"
                className="btn btn-secondary"
                style={{
                  borderColor: "rgba(247, 244, 236, 0.3)",
                  color: "var(--color-text-inverse)",
                }}
              >
                Browse Library
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: "var(--space-16) 0",
          background: "var(--color-brand-forest)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-8)",
              textAlign: "center",
            }}
          >
            {knowledgeStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ color: "var(--color-text-inverse)" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-4xl)",
                    fontWeight: 400,
                    color: "var(--color-brand-gold)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    opacity: 0.8,
                    marginTop: "var(--space-2)",
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Areas */}
      <section style={{ padding: "var(--space-24) 0" }}>
        <div className="container">
          <span className="editorial-label">Knowledge Domains</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginTop: "var(--space-4)",
            }}
          >
            Explore Knowledge
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-12)",
            }}
          >
            {knowledgeAreas.map((area, i) => (
              <motion.a
                key={area.title}
                href={area.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass"
                style={{
                  padding: "var(--space-8)",
                  borderRadius: "var(--radius-lg)",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  transition: "all var(--duration-normal) var(--ease-out)",
                }}
              >
                <area.icon
                  size={32}
                  style={{
                    color: "var(--color-brand-forest)",
                    marginBottom: "var(--space-4)",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 400,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {area.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {area.desc}
                </p>
                <div
                  style={{
                    marginTop: "var(--space-4)",
                    color: "var(--color-brand-forest)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  Explore <ArrowRight size={14} />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-brand-forest)",
          textAlign: "center",
          color: "var(--color-text-inverse)",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginBottom: "var(--space-6)",
            }}
          >
            Start Learning Today
          </h2>
          <p
            style={{
              fontSize: "var(--text-lg)",
              maxWidth: "600px",
              margin: "0 auto var(--space-8)",
              opacity: 0.9,
              lineHeight: 1.7,
            }}
          >
            Free courses, open knowledge, community research. No prerequisites.
            No fees.
          </p>
          <a
            href="/knowledge/academy"
            className="btn btn-primary"
            style={{
              background: "var(--color-brand-gold)",
              color: "var(--color-brand-forest)",
            }}
          >
            Explore Academy
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
