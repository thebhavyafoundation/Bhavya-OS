"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
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
  Search,
  Menu,
  X,
  ChevronRight,
  Play,
} from "lucide-react";
import { BhavyaLogo } from "@/components/BhavyaLogo";

/* ============================================
   NAV DATA
   ============================================ */

const navLinks = [
  { label: "Forest", href: "/forest" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Heritage", href: "/heritage" },
  { label: "Community", href: "/community" },
];

/* ============================================
   MISSION DATA
   ============================================ */

const missions = [
  {
    key: "forest",
    icon: TreePine,
    label: "Forest",
    title: "Bhavya Forest Mission",
    desc: "Restore ecosystems, protect biodiversity, and secure water for generations.",
    stat: "230+",
    statLabel: "Hectares Restored",
    gradient: "linear-gradient(135deg, #0E382E 0%, #1a6b30 50%, #2d8a45 100%)",
  },
  {
    key: "knowledge",
    icon: Brain,
    label: "Knowledge",
    title: "Bhavya Knowledge Mission",
    desc: "Advance education, research, and innovation. Making learning accessible to all.",
    stat: "331",
    statLabel: "Knowledge Packages",
    gradient: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 50%, #4a7c59 100%)",
  },
  {
    key: "heritage",
    icon: Building2,
    label: "Heritage",
    title: "Bhavya Heritage Mission",
    desc: "Preserve our traditions, architecture, arts, and living heritage for future generations.",
    stat: "75+",
    statLabel: "Sites Documented",
    gradient: "linear-gradient(135deg, #3d2b1f 0%, #6A7C52 50%, #8A9A8B 100%)",
  },
  {
    key: "community",
    icon: HeartHandshake,
    label: "Community",
    title: "Bhavya Community Mission",
    desc: "Empower youth, women and communities to build a stronger Bhavya Bharat.",
    stat: "500+",
    statLabel: "Volunteers",
    gradient: "linear-gradient(135deg, #0E382E 0%, #0a2a21 50%, #143828 100%)",
  },
];

const stats = [
  { value: "230+", label: "Hectares Restored" },
  { value: "331", label: "Knowledge Packages" },
  { value: "500+", label: "Volunteers" },
  { value: "75+", label: "Heritage Sites" },
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
    desc: "13 levels, 78 modules, 331 knowledge packages. Free and open.",
    href: "/academy",
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
    href: "/research",
  },
  {
    icon: HeartHandshake,
    title: "Support",
    desc: "Fund a mission. Every donation is publicly documented.",
    href: "/donate",
  },
];

/* ============================================
   PROCEDURAL SVG LANDSCAPE
   ============================================ */

function BhavyaLandscape() {
  return (
    <div className="hero-landscape" aria-hidden="true">
      <div className="hero-sky" />
      <motion.div
        className="hero-sun"
        animate={{ scale: [1, 1.03, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Far mountains — light, atmospheric */}
      <motion.div
        className="hero-mountains hero-mountains-far"
        style={{ y: useTransform(useMotionValue(0), [0, 1], [0, 30]) }}
      >
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mtn-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8A9A8B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8A9A8B" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M0,320 L80,280 L160,300 L280,220 L400,260 L520,200 L640,240 L760,180 L880,220 L1000,260 L1120,200 L1240,240 L1360,220 L1440,260 L1440,400 L0,400Z"
            fill="url(#mtn-far)"
          />
        </svg>
      </motion.div>

      {/* Mid mountains — sage */}
      <div className="hero-mountains hero-mountains-mid">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mtn-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6A7C52" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6A7C52" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0,340 L120,290 L240,310 L360,250 L480,280 L600,230 L720,270 L840,220 L960,260 L1080,240 L1200,280 L1320,250 L1440,270 L1440,400 L0,400Z"
            fill="url(#mtn-mid)"
          />
        </svg>
      </div>

      {/* Near mountains — dark forest */}
      <div className="hero-mountains hero-mountains-near">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mtn-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E382E" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0E382E" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M0,360 L100,320 L200,340 L340,280 L480,310 L620,270 L760,300 L900,260 L1040,290 L1180,270 L1320,300 L1440,280 L1440,400 L0,400Z"
            fill="url(#mtn-near)"
          />
        </svg>
      </div>

      {/* Forest tree line */}
      <div className="hero-trees">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tree-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E382E" />
              <stop offset="100%" stopColor="#071c16" />
            </linearGradient>
          </defs>
          {/* Dense forest silhouette */}
          <g fill="url(#tree-fill)">
            {Array.from({ length: 50 }).map((_, i) => {
              const x = (i / 50) * 1440;
              const h = 60 + Math.sin(i * 0.8) * 30 + Math.cos(i * 1.3) * 20;
              const w = 12 + Math.sin(i * 1.2) * 6;
              return (
                <g key={i}>
                  <polygon
                    points={`${x},180 ${x - w},${180 - h} ${x + w},${180 - h}`}
                  />
                  <ellipse
                    cx={x}
                    cy={180 - h - 15}
                    rx={w * 1.8}
                    ry={20 + Math.sin(i) * 8}
                  />
                </g>
              );
            })}
          </g>
          {/* Ground */}
          <rect
            y="170"
            width="1440"
            height="10"
            fill="var(--color-bg-primary)"
          />
        </svg>
      </div>

      {/* Fog layer */}
      <div className="hero-fog" />
    </div>
  );
}

/* ============================================
   BOTANICAL MOTIF — SECTION DIVIDER
   ============================================ */

function BotanicalDivider() {
  return (
    <div
      style={{
        width: "100%",
        height: "80px",
        position: "relative",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Organic vine curve */}
        <path
          d="M0,40 Q150,20 300,40 Q450,60 600,40 Q750,20 900,40 Q1050,60 1200,40"
          stroke="var(--color-accent-gold)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        {/* Leaf nodes */}
        <g opacity="0.2" fill="var(--color-brand-forest)">
          <path d="M300,40 Q310,30 320,40 Q310,50 300,40Z" />
          <path d="M600,40 Q610,30 620,40 Q610,50 600,40Z" />
          <path d="M900,40 Q910,30 920,40 Q910,50 900,40Z" />
        </g>
      </svg>
    </div>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* ====== NAVIGATION ====== */}
      <nav className={`site-nav ${scrolled ? "scrolled" : ""}`}>
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
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button className="nav-search" aria-label="Search">
              <Search size={16} />
              <span>Search</span>
            </button>
            <a href="/app" className="nav-cta">
              My Bhavya
              <ChevronRight size={16} />
            </a>
            <button
              className="nav-mobile-trigger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ====== MOBILE MENU ====== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="mobile-menu-header">
                <BhavyaLogo size="sm" />
                <button
                  className="mobile-menu-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mobile-menu-nav">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="mobile-menu-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mobile-menu-divider" />
                <a
                  href="/app"
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bhavya
                </a>
                <a
                  href="/donate"
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ====== HERO ====== */}
      <section ref={heroRef} className="hero" aria-labelledby="hero-heading">
        <BhavyaLandscape />

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

          <h1 id="hero-heading" className="hero-title">
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
              A Living Institution for
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
              Knowledge, Nature,
            </motion.span>
            <motion.span
              style={{ display: "block" }}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              and <span className="hero-highlight">Community.</span>
            </motion.span>
          </h1>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            Bhavya Foundation is building a nation-scale institution where
            knowledge is open, forests are restored, heritage is preserved, and
            community leads.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="/academy" className="btn btn-primary">
              Explore Bhavya
              <ArrowRight size={16} />
            </a>
            <a href="/app" className="btn btn-secondary">
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
              background: "rgba(14, 56, 46, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(247, 244, 236, 0.1)",
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
              <motion.a
                key={m.key}
                href={`/${m.key}`}
                className="mission-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div
                  className="mission-card-image"
                  style={{ background: m.gradient }}
                >
                  <div className="mission-card-overlay" />
                  <div className="mission-card-icon">
                    <m.icon size={24} color="var(--color-brand-forest)" />
                  </div>
                </div>
                <div className="mission-card-body">
                  <span className="mission-card-label">{m.label}</span>
                  <h3 className="mission-card-title">{m.title}</h3>
                  <p className="mission-card-desc">{m.desc}</p>
                  <div className="mission-card-stat">
                    <div>
                      <span className="mission-card-stat-value">{m.stat}</span>
                      <span className="mission-card-stat-label">
                        {m.statLabel}
                      </span>
                    </div>
                    <div className="mission-card-arrow">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <BotanicalDivider />

      {/* ====== KNOWLEDGE ECOSYSTEM ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-ivory-200)",
        }}
        id="knowledge"
      >
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)" }}>
            <span className="editorial-label">Knowledge Ecosystem</span>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                marginTop: "var(--space-4)",
              }}
            >
              Connected Knowledge.
              <br />
              Infinite Possibilities.
            </h2>
          </div>

          <div className="knowledge-grid">
            {[
              {
                icon: Shield,
                title: "AI Labs",
                desc: "Hands-on artificial intelligence education. Build, experiment, and understand the technology shaping our future.",
                href: "/labs",
              },
              {
                icon: BookOpen,
                title: "Digital Libraries",
                desc: "Curated collections of knowledge. Traditional wisdom meets modern research in a searchable, open archive.",
                href: "/knowledge-graph",
              },
              {
                icon: FlaskConical,
                title: "Research",
                desc: "Open research on ecology, heritage, education, and technology. All findings published freely.",
                href: "/research",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                className="knowledge-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="knowledge-card-icon">
                  <card.icon size={24} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <a href={card.href} className="knowledge-card-link">
                  Explore <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== STATS — FOREST SECTION ====== */}
      <section
        className="section-forest"
        style={{ padding: "var(--space-24) 0" }}
      >
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
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
              <motion.div
                key={p.number}
                className="principle-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="principle-number">{p.number}</span>
                <h3 className="principle-title">{p.title}</h3>
                <p className="principle-desc">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BotanicalDivider />

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
              <motion.a
                key={card.title}
                href={card.href}
                className="participate-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="participate-card-icon">
                  <card.icon size={24} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="participate-link">
                  Learn more <ArrowRight size={14} />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section
        className="section-forest"
        style={{
          padding: "var(--space-32) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background SVG landscape */}
        <div
          style={{ position: "absolute", inset: 0, opacity: 0.15 }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 400"
            preserveAspectRatio="xMidYMid slice"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <linearGradient id="cta-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0E382E" />
                <stop offset="100%" stopColor="#071c16" />
              </linearGradient>
            </defs>
            <rect width="1440" height="400" fill="url(#cta-bg)" />
            <g opacity="0.3" fill="#D4AF37">
              {Array.from({ length: 20 }).map((_, i) => (
                <circle
                  key={i}
                  cx={72 + i * 72}
                  cy={40 + Math.sin(i * 1.5) * 30}
                  r={1 + Math.random()}
                />
              ))}
            </g>
            <path
              d="M0,300 L200,250 L400,280 L600,220 L800,260 L1000,200 L1200,240 L1440,210 L1440,400 L0,400Z"
              fill="#071c16"
              opacity="0.5"
            />
          </svg>
        </div>

        <div
          className="container"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
              href="/academy"
              className="btn btn-secondary"
              style={{
                color: "var(--color-text-inverse)",
                borderColor: "rgba(247, 244, 236, 0.3)",
              }}
            >
              Start learning
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <BhavyaLogo size="sm" />
            <p
              className="footer-brand-name"
              style={{ marginTop: "var(--space-4)" }}
            >
              Bhavya Foundation
            </p>
            <p className="footer-brand-desc">
              A nation-scale institution for knowledge, nature, and community.
              Constitution bound. Community governed. Transparency first.
            </p>
            <div className="footer-status">
              <div className="footer-status-dot" />
              Building in the open
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Missions</h4>
            <nav>
              <a href="/missions/forest">Forest</a>
              <a href="/missions/knowledge">Knowledge</a>
              <a href="/missions/heritage">Heritage</a>
              <a href="/community">Community</a>
            </nav>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Learn</h4>
            <nav>
              <a href="/academy">Academy</a>
              <a href="/knowledge-graph">Knowledge Graph</a>
              <a href="/labs">AI Labs</a>
              <a href="/research">Research</a>
            </nav>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Institution</h4>
            <nav>
              <a href="/about">About</a>
              <a href="/transparency">Transparency</a>
              <a href="/donate">Donate</a>
              <a href="/constitution">Constitution</a>
            </nav>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Connect</h4>
            <nav>
              <a href="/community">Community</a>
              <a href="https://github.com/thebhavyafoundation">GitHub</a>
              <a href="mailto:hello@bhavyafoundation.org">Email</a>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Bhavya Foundation. Constitution of Bhavya Foundation.</p>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
