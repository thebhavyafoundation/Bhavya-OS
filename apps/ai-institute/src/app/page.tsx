"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  TreePine,
  Brain,
  Building2,
  HeartHandshake,
  ArrowRight,
  Users,
  GraduationCap,
  Shield,
  Globe,
  Landmark,
  Compass,
  Target,
  Handshake,
  Heart,
  Database,
  BookCheck,
  FlaskConical,
  Map,
  BarChart3,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { HeroBackground } from "@/components/HeroBackground";

/* ============================================
   MISSION DATA
   ============================================ */

const missions = [
  {
    key: "forest",
    icon: TreePine,
    label: "Forest",
    title: "Forest",
    desc: "Restore degraded ecosystems. Protect biodiversity. Conserve watersheds.",
    photo: "/photography/forest/forest-cedar-sunlight.jpg",
    color: "var(--color-brand-forest)",
  },
  {
    key: "knowledge",
    icon: Brain,
    label: "Knowledge",
    title: "Knowledge",
    desc: "Expand access to learning. Advance research. Bridge the digital divide.",
    photo: "/photography/knowledge/knowledge-school-children.jpg",
    color: "var(--color-brand-forest)",
  },
  {
    key: "heritage",
    icon: Building2,
    label: "Heritage",
    title: "Heritage",
    desc: "Preserve cultural traditions. Document living history. Protect heritage sites.",
    photo: "/photography/heritage/heritage-stone-temple.jpg",
    color: "var(--color-brand-forest)",
  },
  {
    key: "community",
    icon: HeartHandshake,
    label: "Community",
    title: "Community",
    desc: "Empower local leadership. Strengthen social fabric. Build resilient communities.",
    photo: "/photography/community/community-village-gathering.jpg",
    color: "var(--color-brand-forest)",
  },
];

const realWork = [
  {
    title: "Restoration Initiatives in the Western Himalayas",
    category: "Forest",
    photo: "/photography/forest/forest-cedar-sunlight.jpg",
    href: "/missions/forest",
  },
  {
    title: "Digital Learning for Rural Schools",
    category: "Knowledge",
    photo: "/photography/knowledge/knowledge-school-children.jpg",
    href: "/missions/knowledge",
  },
  {
    title: "Documenting Living Heritage",
    category: "Heritage",
    photo: "/photography/heritage/heritage-wooden-temple.jpg",
    href: "/missions/heritage",
  },
  {
    title: "Women's Leadership in Mountain Communities",
    category: "Community",
    photo: "/photography/community/community-village-gathering.jpg",
    href: "/missions/community",
  },
];

const getInvolved = [
  {
    icon: Users,
    title: "Volunteer",
    desc: "Join the Bhavya Volunteer Corps. Make hands-on impact.",
    href: "/volunteer",
  },
  {
    icon: Handshake,
    title: "Partner with Us",
    desc: "Collaborate on institutional research and programmes.",
    href: "/get-involved",
  },
  {
    icon: GraduationCap,
    title: "Learn",
    desc: "Structured learning paths from foundations to advanced research.",
    href: "/knowledge/academy",
  },
  {
    icon: Heart,
    title: "Support Our Work",
    desc: "Fund a mission. Every donation is publicly documented.",
    href: "/donate",
  },
];

/* ============================================
   MAIN PAGE
   ============================================ */

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <SiteHeader />

      {/* ====== HERO — CINEMATIC INSTITUTIONAL ====== */}
      <section ref={heroRef} className="hero" aria-labelledby="hero-heading">
        <HeroBackground
          pillar="home"
          photo="/photography/hero/hero-himalayan-sunset.jpg"
          photoPosition="center 40%"
        />

        <motion.div
          className="hero-content"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Shield size={12} />A PUBLIC INSTITUTION
          </motion.div>

          <h1
            id="hero-heading"
            className="hero-title"
            style={{ color: "var(--color-text-inverse)" }}
          >
            <motion.span
              style={{ display: "block" }}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Building for
            </motion.span>
            <motion.span
              style={{ display: "block" }}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Generations.
            </motion.span>
          </h1>

          <motion.p
            className="hero-desc"
            style={{ color: "rgba(247, 244, 236, 0.75)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            A public institution working across nature, knowledge, heritage, and
            community — built with patience, evidence, and long-term thinking.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="/missions" className="btn btn-gold">
              Our Missions
              <ArrowRight size={16} />
            </a>
            <a href="/about" className="btn btn-secondary-inverse">
              About the Institution
              <ArrowRight size={14} />
            </a>
          </motion.div>

          <motion.div
            className="hero-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <span>
              <span className="hero-proof-dot" /> Four permanent missions
            </span>
            <span>
              <span className="hero-proof-dot" /> Evidence-driven work
            </span>
            <span>
              <span className="hero-proof-dot" /> Built to last
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ====== INSTITUTIONAL INTRODUCTION ====== */}
      <section className="home-section home-section-cream">
        <div className="container">
          <div className="home-grid-2">
            <Reveal variant="slide-up">
              <div>
                <span className="editorial-label">
                  AN INSTITUTION, NOT A CAMPAIGN
                </span>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    marginTop: "var(--space-4)",
                  }}
                >
                  Long-term thinking.
                  <br />
                  Enduring impact.
                </h2>
                <p
                  style={{
                    marginTop: "var(--space-6)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Bhavya is being built as a long-term institution — not a
                  collection of short-term projects. We work with patience,
                  evidence and integrity to create enduring change.
                </p>
                <a
                  href="/about"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginTop: "var(--space-8)",
                    color: "var(--color-brand-forest)",
                    fontWeight: 600,
                    fontSize: "var(--text-sm)",
                    textDecoration: "none",
                  }}
                >
                  Our Approach
                  <ArrowRight size={14} />
                </a>
              </div>
            </Reveal>
            <Reveal variant="slide-up" delay={0.2}>
              <div className="quote-block">
                <p>
                  &ldquo;A tree planted today becomes the forest that protects
                  tomorrow. An institution built today becomes the system that
                  serves generations.&rdquo;
                </p>
                <cite>— Bhavya Foundation</cite>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== FOUR MISSIONS — IMAGE CARDS ====== */}
      <section id="main-content" className="home-section home-section-ivory">
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)" }}>
            <span className="editorial-label">OUR MISSIONS</span>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                marginTop: "var(--space-4)",
              }}
            >
              Four permanent missions.
            </h2>
            <p
              style={{
                marginTop: "var(--space-4)",
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                maxWidth: "600px",
                lineHeight: 1.7,
              }}
            >
              Bhavya works across four permanent missions to create lasting
              impact for people and the planet.
            </p>
          </div>

          <div className="home-grid-4">
            {missions.map((m, i) => (
              <Reveal
                key={m.key}
                variant="slide-up"
                delay={i * 0.1}
                distance={40}
              >
                <a
                  href={`/${m.key}`}
                  className="mission-card"
                  style={{ height: "100%" }}
                >
                  <div
                    className="mission-card-image"
                    style={{ height: "220px" }}
                  >
                    <img
                      src={m.photo}
                      alt={m.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition:
                          "transform var(--duration-slow) var(--ease-out)",
                      }}
                    />
                    <div className="mission-card-overlay" />
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-4)",
                        left: "var(--space-4)",
                        padding: "var(--space-1) var(--space-3)",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(255, 255, 255, 0.12)",
                        backdropFilter: "blur(8px)",
                        fontSize: "var(--text-xs)",
                        color: "white",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {m.label}
                    </div>
                  </div>
                  <div className="mission-card-body">
                    <h3 className="mission-card-title">{m.title}</h3>
                    <p className="mission-card-desc">{m.desc}</p>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                        color: "var(--color-brand-forest)",
                      }}
                    >
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== REAL WORK — PEOPLE, PLACES, PROGRESS ====== */}
      <section className="home-section home-section-cream">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="editorial-label">
                OUR WORK IN THE REAL WORLD
              </span>
              <h2
                className="editorial-heading"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  marginTop: "var(--space-4)",
                }}
              >
                From intention to action.
              </h2>
              <p
                style={{
                  marginTop: "var(--space-4)",
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-secondary)",
                  maxWidth: "500px",
                  lineHeight: 1.6,
                }}
              >
                Active work across our four missions — restoring landscapes,
                expanding access, and strengthening communities.
              </p>
            </div>
            <a href="/missions" className="section-header-link">
              View All <ArrowRight size={14} />
            </a>
          </div>

          <div className="home-grid-4">
            {realWork.map((item, i) => (
              <Reveal
                key={item.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <a href={item.href} className="mission-card">
                  <div
                    className="mission-card-image"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={item.photo}
                      alt={item.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition:
                          "transform var(--duration-slow) var(--ease-out)",
                      }}
                    />
                    <div className="mission-card-overlay" />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "var(--space-4)",
                        left: "var(--space-4)",
                        right: "var(--space-4)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px var(--space-2)",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(4px)",
                          fontSize: "10px",
                          color: "white",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "var(--space-5)" }}>
                    <h3
                      style={{
                        fontSize: "var(--text-base)",
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== GOVERNANCE & TRUST — INSTITUTIONAL CREDIBILITY ====== */}
      <section className="home-section home-section-cream">
        <div className="container">
          <Reveal variant="slide-up">
            <div style={{ marginBottom: "var(--space-12)" }}>
              <span className="editorial-label">BUILT ON PUBLIC TRUST</span>
              <h2
                className="editorial-heading"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  marginTop: "var(--space-4)",
                }}
              >
                Transparency is not optional.
              </h2>
              <p
                style={{
                  marginTop: "var(--space-4)",
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-secondary)",
                  maxWidth: "600px",
                  lineHeight: 1.7,
                }}
              >
                Every decision is traceable. Every metric is public. Every
                commitment is constitutional.
              </p>
            </div>
          </Reveal>

          <div className="home-grid-2x2">
            {[
              {
                icon: BookCheck,
                title: "Constitution",
                desc: "12 Articles — the governance framework that guides every decision.",
                href: "/about",
                linkText: "Read the Constitution",
                color: "var(--color-brand-forest)",
              },
              {
                icon: FlaskConical,
                title: "Engineering Standards",
                desc: "10 Quality Gates, 26 Production Metrics, research-backed decisions.",
                href: "/about",
                linkText: "View Engineering Standards",
                color: "var(--color-earth-600, #6a7c52)",
              },
              {
                icon: Map,
                title: "Public Roadmap",
                desc: "Open governance, published priorities, and community input on every initiative.",
                href: "/missions",
                linkText: "View Roadmap",
                color: "var(--color-brand-gold)",
              },
              {
                icon: BarChart3,
                title: "Live Metrics",
                desc: "Real-time programme outcomes and institutional health — always public.",
                href: "/missions",
                linkText: "See the Numbers",
                color: "var(--color-forest-600, #0e5936)",
              },
            ].map((item, i) => (
              <Reveal
                key={item.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <a href={item.href} className="governance-card">
                  <div
                    className="governance-card-icon"
                    style={{ color: item.color }}
                  >
                    <item.icon size={20} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span
                    className="governance-card-link"
                    style={{ color: item.color }}
                  >
                    {item.linkText} <ArrowRight size={14} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CURRICULUM HIGHLIGHT — AI EDUCATION ====== */}
      <section className="home-section home-section-ivory">
        <div className="container">
          <div className="home-grid-2">
            <Reveal variant="slide-up">
              <div>
                <span className="editorial-label">AI INSTITUTE</span>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    marginTop: "var(--space-4)",
                  }}
                >
                  Free AI education
                  <br />
                  for rural India.
                </h2>
                <p
                  style={{
                    marginTop: "var(--space-6)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    maxWidth: "480px",
                  }}
                >
                  A complete curriculum from foundations to advanced research —
                  designed for communities that need it most. Open, structured,
                  and built to scale.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-8)",
                    marginTop: "var(--space-8)",
                  }}
                >
                  {[
                    { value: "13", label: "Levels" },
                    { value: "74+", label: "Modules" },
                    { value: "25", label: "Core Concepts" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-2xl, 2rem)",
                          fontWeight: 400,
                          color: "var(--color-brand-forest)",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-muted)",
                          marginTop: "var(--space-1)",
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href="/curriculum"
                  className="btn btn-primary"
                  style={{ marginTop: "var(--space-8)" }}
                >
                  Explore the Curriculum
                  <ArrowRight size={14} />
                </a>
              </div>
            </Reveal>

            <Reveal variant="slide-up" delay={0.2}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-2xl)",
                  overflow: "hidden",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <img
                  src="/photography/knowledge/knowledge-school-children.jpg"
                  alt="Students in a rural school — representing the communities Bhavya AI Institute serves"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    minHeight: "400px",
                  }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(14, 56, 46, 0.7) 0%, rgba(14, 56, 46, 0.1) 50%, transparent 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "var(--space-8)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "rgba(247, 244, 236, 0.7)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    Knowledge Mission
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-2xl)",
                      color: "var(--color-text-inverse)",
                      lineHeight: 1.2,
                    }}
                  >
                    13 Levels. 74 Modules.
                    <br />
                    One Complete Path.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== BHAVYA ECOSYSTEM ====== */}
      <section className="home-section home-section-cream">
        <div className="container">
          <Reveal variant="slide-up">
            <div
              style={{ textAlign: "center", marginBottom: "var(--space-12)" }}
            >
              <span className="editorial-label">THE BHAVYA ECOSYSTEM</span>
              <h2
                className="editorial-heading"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  marginTop: "var(--space-4)",
                }}
              >
                A connected ecosystem for greater impact.
              </h2>
              <p
                style={{
                  marginTop: "var(--space-4)",
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-secondary)",
                  maxWidth: "550px",
                  marginInline: "auto",
                  lineHeight: 1.6,
                }}
              >
                One institution connecting missions, programs, evidence, and
                technology — so every effort compounds over time.
              </p>
            </div>
          </Reveal>

          <div className="ecosystem-grid-3">
            {[
              {
                icon: Landmark,
                label: "Foundation",
                desc: "Institutional home — constitution-bound, community-governed",
                color: "var(--color-brand-forest)",
              },
              {
                icon: Target,
                label: "Four Missions",
                desc: "Forest, Knowledge, Heritage, Community — permanent focus areas",
                color: "var(--color-brand-forest)",
              },
              {
                icon: Compass,
                label: "Programs",
                desc: "On-ground work with evidence trails and measurable outcomes",
                color: "var(--color-earth-500, #6a7c52)",
              },
            ].map((item, i) => (
              <Reveal
                key={item.label}
                variant="slide-up"
                delay={i * 0.1}
                distance={20}
              >
                <div
                  style={{
                    padding: "var(--space-6)",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    height: "100%",
                  }}
                >
                  <item.icon
                    size={24}
                    style={{
                      color: item.color,
                      marginBottom: "var(--space-4)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "var(--text-md)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="ecosystem-grid-2">
            {[
              {
                icon: BarChart3,
                label: "Impact",
                desc: "Real-time metrics, transparent reporting, institutional health — always public",
                color: "var(--color-accent-gold)",
              },
              {
                icon: Database,
                label: "Bhavya OS",
                desc: "The institutional operating system connecting programs, evidence, and research",
                color: "var(--color-brand-forest)",
              },
            ].map((item, i) => (
              <Reveal
                key={item.label}
                variant="slide-up"
                delay={0.3 + i * 0.1}
                distance={20}
              >
                <div
                  style={{
                    padding: "var(--space-6)",
                    borderRadius: "var(--radius-lg)",
                    background:
                      "linear-gradient(135deg, var(--color-forest-900) 0%, var(--color-forest-800) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    height: "100%",
                  }}
                >
                  <item.icon
                    size={24}
                    style={{
                      color: "var(--color-accent-gold)",
                      marginBottom: "var(--space-4)",
                      opacity: 0.9,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "var(--text-md)",
                      fontWeight: 600,
                      color: "var(--color-text-inverse)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "rgba(247, 244, 236, 0.6)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BHAVYA OS INTRODUCTION — DARK PANEL ====== */}
      <section className="home-section home-section-wide home-section-dark">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="home-grid-2">
            <Reveal variant="slide-up">
              <div>
                <span className="dark-label">
                  THE SYSTEM BEHIND THE INSTITUTION
                </span>
                <h2 className="dark-heading">
                  The system behind
                  <br />
                  the institution.
                </h2>
                <p className="dark-desc">
                  Bhavya OS is the institutional operating system — connecting
                  programs, projects, evidence, research, and impact in one
                  unified system built to endure.
                </p>
                <a href="/os" className="btn btn-gold">
                  Explore Bhavya OS
                  <ArrowRight size={14} />
                </a>
              </div>
            </Reveal>

            <Reveal variant="slide-up" delay={0.2}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-2xl)",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1px",
                    background: "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  {[
                    {
                      icon: Database,
                      label: "Programs",
                      desc: "Manage institutional programmes across all missions",
                    },
                    {
                      icon: Target,
                      label: "Projects",
                      desc: "Track on-ground initiatives with evidence trails",
                    },
                    {
                      icon: FlaskConical,
                      label: "Research",
                      desc: "Knowledge, publications, and institutional learning",
                    },
                    {
                      icon: BarChart3,
                      label: "Impact",
                      desc: "Metrics, verification, and transparent reporting",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        padding: "var(--space-5)",
                        background: "rgba(255, 255, 255, 0.03)",
                        transition:
                          "background var(--duration-normal) var(--ease-out)",
                      }}
                    >
                      <item.icon
                        size={18}
                        style={{
                          color: "var(--color-accent-gold)",
                          marginBottom: "var(--space-3)",
                          opacity: 0.8,
                        }}
                      />
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          color: "var(--color-text-inverse)",
                          marginBottom: "var(--space-1)",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "rgba(247, 244, 236, 0.5)",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== GET INVOLVED ====== */}
      <section className="home-section home-section-cream">
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)" }}>
            <span className="editorial-label">GET INVOLVED</span>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                marginTop: "var(--space-4)",
              }}
            >
              Contribute to what lasts.
            </h2>
            <p
              style={{
                marginTop: "var(--space-4)",
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                maxWidth: "600px",
                lineHeight: 1.7,
              }}
            >
              Whether you want to volunteer, partner, research, or support our
              work, there are many ways to contribute to the institution.
            </p>
          </div>

          <div className="home-grid-4">
            {getInvolved.map((card, i) => (
              <Reveal
                key={card.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <a href={card.href} className="involvement-card">
                  <div className="involvement-card-icon">
                    <card.icon size={20} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <span className="involvement-card-link">
                    Learn more <ArrowRight size={14} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section
        style={{
          padding: "var(--space-28) 0",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-forest-800) 50%, var(--color-forest-700) 100%)",
        }}
      >
        <div
          className="container"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <Reveal variant="slide-up">
            <h2
              className="editorial-heading"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "var(--color-text-inverse)",
                marginBottom: "var(--space-8)",
              }}
            >
              The institution is being built.
              <br />
              <span style={{ color: "var(--color-accent-gold)" }}>
                Shape what endures.
              </span>
            </h2>
          </Reveal>

          <Reveal variant="slide-up" delay={0.2}>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href="/donate" className="btn btn-gold">
                <HeartHandshake size={16} />
                Support the mission
              </a>
              <a href="/missions" className="btn btn-secondary-inverse">
                Explore Missions
                <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
