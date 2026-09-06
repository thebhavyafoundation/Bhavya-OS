"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  TreePine,
  Brain,
  Building2,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Users,
  GraduationCap,
  Shield,
  Play,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { HeroBackground } from "@/components/HeroBackground";
import { VineDivider, BotanicalCorner } from "@/components/BotanicalMotifs";

/* ============================================
   MISSION DATA
   ============================================ */

const missions = [
  {
    key: "forest",
    icon: TreePine,
    label: "Forest",
    title: "Bhavya Forest Mission",
    desc: "Restoring ecosystems, protecting biodiversity, and conserving water through long-term ecological stewardship.",
  },
  {
    key: "knowledge",
    icon: Brain,
    label: "Knowledge",
    title: "Bhavya Knowledge Mission",
    desc: "Open education, AI, research, digital libraries, and practical learning for everyone.",
  },
  {
    key: "heritage",
    icon: Building2,
    label: "Heritage",
    title: "Bhavya Heritage Mission",
    desc: "Preserving traditional knowledge, architecture, history, arts, and living heritage.",
  },
  {
    key: "community",
    icon: HeartHandshake,
    label: "Community",
    title: "Bhavya Community Mission",
    desc: "Empowering young people, women, schools, and communities through education and participation.",
  },
];

const principles = [
  {
    number: "01",
    title: "Nature First",
    desc: "Every decision considers its environmental impact. We restore before we extract.",
  },
  {
    number: "02",
    title: "Knowledge as Commons",
    desc: "Education is a right, not a privilege. All our content is free and open.",
  },
  {
    number: "03",
    title: "Transparency",
    desc: "Every donation, every decision, every outcome is publicly documented.",
  },
  {
    number: "04",
    title: "Generational Thinking",
    desc: "We build for decades, not quarters. Our constitution binds us to long-term impact.",
  },
  {
    number: "05",
    title: "Community Sovereignty",
    desc: "The people we serve guide our priorities. Community voice shapes our mission.",
  },
];

const participateCards = [
  {
    icon: GraduationCap,
    title: "Learn",
    desc: "Structured learning paths from foundations to advanced research. Free and open.",
    href: "/knowledge/academy",
  },
  {
    icon: Users,
    title: "Volunteer",
    desc: "Join the Bhavya Volunteer Corps. Make hands-on impact.",
    href: "/community",
  },
  {
    icon: FlaskConical,
    title: "Research",
    desc: "Open research on ecology, heritage, and education.",
    href: "/knowledge/research",
  },
  {
    icon: HeartHandshake,
    title: "Support",
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

      {/* ====== HERO ====== */}
      <section ref={heroRef} className="hero" aria-labelledby="hero-heading">
        <HeroBackground
          pillar="home"
          photo="/photography/hero/hero-himalayan-sunset.jpg"
          photoPosition="center 40%"
        />
        <BotanicalCorner position="top-right" size={160} opacity={0.1} />
        <BotanicalCorner position="bottom-left" size={120} opacity={0.08} />

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
            <Shield size={12} />
            Building India&apos;s Digital Institution
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
              Generations
            </motion.span>
          </h1>

          <motion.p
            className="hero-desc"
            style={{ color: "var(--color-text-secondary)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            We are building an institution for future generations — where
            knowledge is open, forests are restored, heritage is preserved, and
            community leads.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="/knowledge/academy" className="btn btn-gold">
              Explore Bhavya
              <ArrowRight size={16} />
            </a>
            <a href="/app" className="btn btn-secondary-inverse">
              Enter My Bhavya
              <ArrowRight size={16} />
            </a>
          </motion.div>

          <motion.div
            className="hero-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <span>
              <span className="hero-proof-dot" /> Open knowledge
            </span>
            <span>
              <span className="hero-proof-dot" /> Community governed
            </span>
            <span>
              <span className="hero-proof-dot" /> Constitution bound
            </span>
          </motion.div>
        </motion.div>

        {/* Watch Our Story button — right side */}
        <motion.div
          style={{
            position: "absolute",
            right: "var(--space-8)",
            bottom: "20%",
            zIndex: 1,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="/mission"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-4) var(--space-6)",
              borderRadius: "var(--radius-full)",
              background:
                "color-mix(in srgb, var(--color-forest-900) 60%, transparent)",
              backdropFilter: "blur(12px)",
              border:
                "1px solid color-mix(in srgb, var(--color-text-inverse) 15%, transparent)",
              color: "var(--color-text-inverse)",
              textDecoration: "none",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              transition: "all var(--duration-normal) var(--ease-out)",
            }}
          >
            <Play size={16} fill="currentColor" />
            Watch Our Story
          </a>
        </motion.div>
      </section>

      <VineDivider />

      {/* ====== FOUR MISSIONS — GLASS PANELS ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-bg-primary)",
        }}
        id="missions"
      >
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)" }}>
            <span className="editorial-label">Our Four Missions</span>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                marginTop: "var(--space-4)",
              }}
            >
              Four Pillars. One Purpose.
            </h2>
          </div>

          <div className="missions-grid">
            {missions.map((m, i) => (
              <Reveal
                key={m.key}
                variant="slide-up"
                delay={i * 0.1}
                distance={40}
              >
                <a href={`/${m.key}`} className="mission-card">
                  <div
                    className="mission-card-image"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-forest-900) 0%, var(--color-forest-700) 100%)",
                    }}
                  >
                    <div className="mission-card-overlay" />
                    <div className="mission-card-icon">
                      <m.icon size={24} color="var(--color-brand-gold)" />
                    </div>
                  </div>
                  <div className="mission-card-body">
                    <span className="mission-card-label">{m.label}</span>
                    <h3 className="mission-card-title">{m.title}</h3>
                    <p className="mission-card-desc">{m.desc}</p>
                    <div className="mission-card-arrow">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <VineDivider />

      {/* ====== MISSION STATEMENT ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background:
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-forest-800) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Botanical SVG decoration */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1200 400"
            preserveAspectRatio="xMidYMid slice"
            style={{ width: "100%", height: "100%" }}
          >
            <g fill="none" stroke="var(--color-accent-gold)" strokeWidth="1">
              <path d="M100,200 Q200,100 300,200 Q400,300 500,200 Q600,100 700,200 Q800,300 900,200 Q1000,100 1100,200" />
              <path d="M150,150 Q250,50 350,150 Q450,250 550,150 Q650,50 750,150 Q850,250 950,150" />
              <path d="M200,250 Q300,150 400,250 Q500,350 600,250 Q700,150 800,250 Q900,350 1000,250" />
            </g>
          </svg>
        </div>

        <div
          className="container"
          style={{ maxWidth: "800px", position: "relative", zIndex: 1 }}
        >
          <Reveal variant="fade">
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.5,
                color: "var(--color-text-inverse)",
                margin: 0,
                textAlign: "center",
              }}
            >
              &ldquo;We build institutions for generations, not quarters. Our
              constitution binds us to long-term impact.&rdquo;
            </blockquote>
            <p
              style={{
                marginTop: "var(--space-6)",
                color: "var(--color-brand-gold)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              — Bhavya Foundation
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====== PRINCIPLES ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-bg-primary)",
        }}
      >
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)" }}>
            <span className="editorial-label">Constitutional Principles</span>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                marginTop: "var(--space-4)",
              }}
            >
              Bound by constitution.
              <br />
              Guided by principle.
            </h2>
          </div>

          <div className="principles-grid">
            {principles.map((p, i) => (
              <Reveal key={p.number} variant="slide-up" delay={i * 0.08}>
                <div className="principle-card">
                  <span className="principle-number">{p.number}</span>
                  <h3 className="principle-title">{p.title}</h3>
                  <p className="principle-desc">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <VineDivider />

      {/* ====== PARTICIPATE ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-ivory-200)",
        }}
      >
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)" }}>
            <span className="editorial-label">Participate</span>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                marginTop: "var(--space-4)",
              }}
            >
              Be part of the institution.
            </h2>
          </div>

          <div className="participate-grid">
            {participateCards.map((card, i) => (
              <Reveal
                key={card.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <a href={card.href} className="participate-card">
                  <div className="participate-card-icon">
                    <card.icon size={24} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <span className="participate-link">
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
          padding: "var(--space-32) 0",
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
                Be part of it.
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
              <a
                href="/knowledge/academy"
                className="btn btn-secondary-inverse"
              >
                Start learning
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
