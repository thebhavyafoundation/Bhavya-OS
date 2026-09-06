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
  Play,
  Globe,
  Landmark,
  Compass,
  Target,
  Zap,
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
    desc: "Restore ecosystems. Protect biodiversity. Conserve water.",
    photo: "/photography/forest/forest-cedar-sunlight.jpg",
    color: "var(--color-brand-forest)",
  },
  {
    key: "knowledge",
    icon: Brain,
    label: "Knowledge",
    title: "Knowledge",
    desc: "Expand learning. Research. Innovation. Digital access.",
    photo: "/photography/knowledge/knowledge-school-children.jpg",
    color: "var(--color-brand-forest)",
  },
  {
    key: "heritage",
    icon: Building2,
    label: "Heritage",
    title: "Heritage",
    desc: "Preserve traditions. Document history. Protect living heritage.",
    photo: "/photography/heritage/heritage-stone-temple.jpg",
    color: "var(--color-brand-forest)",
  },
  {
    key: "community",
    icon: HeartHandshake,
    label: "Community",
    title: "Community",
    desc: "Empower people. Strengthen communities. Develop leadership.",
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
    icon: HeartHandshake,
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
    icon: HeartHandshake,
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-accent-green focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>
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
            style={{ color: "var(--color-text-secondary)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            Bhavya is a public institution working across nature, knowledge,
            heritage, and communities.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="/missions" className="btn btn-gold">
              Explore Our Missions
              <ArrowRight size={16} />
            </a>
            <a href="/about" className="btn btn-secondary-inverse">
              <Play size={14} fill="currentColor" />
              Watch Our Story
            </a>
          </motion.div>

          <motion.div
            className="hero-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <span>
              <span className="hero-proof-dot" /> Healthier forests
            </span>
            <span>
              <span className="hero-proof-dot" /> Stronger communities
            </span>
            <span>
              <span className="hero-proof-dot" /> A brighter tomorrow
            </span>
          </motion.div>
        </motion.div>

        {/* Bhavya OS link — right side */}
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
            href="/os"
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
            <Zap size={14} />
            Enter Bhavya OS
            <ArrowRight size={14} />
          </a>
        </motion.div>
      </section>

      {/* ====== INSTITUTIONAL INTRODUCTION ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-bg-primary)",
        }}
      >
        <div className="container">
          <div
            className="home-intro-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-16)",
              alignItems: "center",
            }}
          >
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
                  Real-world impact.
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
              <div
                style={{
                  padding: "var(--space-8)",
                  background: "var(--color-ivory-200)",
                  borderRadius: "var(--radius-lg)",
                  borderLeft: "3px solid var(--color-brand-gold)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontStyle: "italic",
                    color: "var(--color-text-primary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  &ldquo;A tree planted today becomes the forest that protects
                  tomorrow.&rdquo;
                </p>
                <p
                  style={{
                    marginTop: "var(--space-4)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  — Bhavya Foundation
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== FOUR MISSIONS — IMAGE CARDS ====== */}
      <section
        id="main-content"
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-ivory-200)",
        }}
      >
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
              Four missions. A shared tomorrow.
            </h2>
            <p
              style={{
                marginTop: "var(--space-4)",
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                maxWidth: "600px",
              }}
            >
              Bhavya works across four permanent missions to create lasting
              impact for people and the planet.
            </p>
          </div>

          <div
            className="home-missions-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--space-6)",
            }}
          >
            {missions.map((m, i) => (
              <Reveal
                key={m.key}
                variant="slide-up"
                delay={i * 0.1}
                distance={40}
              >
                <a
                  href={`/${m.key}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    transition: "all var(--duration-normal) var(--ease-out)",
                  }}
                >
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={m.photo}
                      alt={m.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition:
                          "transform var(--duration-slow) var(--ease-out)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(14, 56, 46, 0.6) 0%, transparent 60%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-4)",
                        left: "var(--space-4)",
                        padding: "var(--space-1) var(--space-3)",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(8px)",
                        fontSize: "var(--text-xs)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {m.label}
                    </div>
                  </div>
                  <div style={{ padding: "var(--space-6)" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-xl)",
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      {m.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.6,
                        marginBottom: "var(--space-4)",
                      }}
                    >
                      {m.desc}
                    </p>
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
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-bg-primary)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "var(--space-12)",
            }}
          >
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
                People. Places. Progress.
              </h2>
            </div>
            <a
              href="/missions"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--color-brand-forest)",
                textDecoration: "none",
              }}
            >
              View All <ArrowRight size={14} />
            </a>
          </div>

          <div
            className="home-realwork-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--space-6)",
            }}
          >
            {realWork.map((item, i) => (
              <Reveal
                key={item.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <a
                  href={item.href}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    transition: "all var(--duration-normal) var(--ease-out)",
                  }}
                >
                  <div
                    style={{
                      height: "180px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={item.photo}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(14, 56, 46, 0.5) 0%, transparent 50%)",
                      }}
                    />
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
                          background: "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(4px)",
                          fontSize: "10px",
                          color: "white",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "var(--space-2)",
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

      {/* ====== BHAVYA ECOSYSTEM ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-ivory-200)",
        }}
      >
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
            </div>
          </Reveal>

          <Reveal variant="slide-up" delay={0.2}>
            <div
              className="home-ecosystem-flow"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-4)",
                flexWrap: "wrap",
                padding: "var(--space-8) 0",
              }}
            >
              {[
                {
                  label: "Foundation",
                  sublabel: "Institutional Home",
                  icon: Landmark,
                },
                {
                  label: "Missions",
                  sublabel: "Four Focus Areas",
                  icon: Target,
                },
                {
                  label: "Programs",
                  sublabel: "On-Ground Work",
                  icon: Compass,
                },
                { label: "Impact", sublabel: "Measurable Change", icon: Globe },
                {
                  label: "Bhavya OS",
                  sublabel: "The Operating System",
                  icon: Zap,
                },
              ].map((step, i, arr) => (
                <div
                  key={step.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-4)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      minWidth: "100px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "var(--radius-full)",
                        background:
                          i === arr.length - 1
                            ? "var(--color-brand-forest)"
                            : "var(--color-bg-primary)",
                        border: "1px solid var(--color-border-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color:
                          i === arr.length - 1
                            ? "white"
                            : "var(--color-brand-forest)",
                      }}
                    >
                      <step.icon size={20} />
                    </div>
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {step.label}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {step.sublabel}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight
                      size={20}
                      style={{
                        color: "var(--color-text-muted)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====== BHAVYA OS INTRODUCTION — DARK PANEL ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background:
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-forest-800) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            className="home-os-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-16)",
              alignItems: "center",
            }}
          >
            <Reveal variant="slide-up">
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--color-brand-gold)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  THE SYSTEM BEHIND THE INSTITUTION
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: "var(--color-text-inverse)",
                    marginBottom: "var(--space-6)",
                  }}
                >
                  From knowledge
                  <br />
                  to action.
                </h2>
                <p
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "rgba(247, 244, 236, 0.7)",
                    lineHeight: 1.7,
                    marginBottom: "var(--space-8)",
                  }}
                >
                  Bhavya OS connects programs, projects, people, documents,
                  evidence, research and impact in one institutional system.
                </p>
                <a
                  href="/os"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-3) var(--space-6)",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-brand-gold)",
                    color: "var(--color-forest-950)",
                    fontWeight: 600,
                    fontSize: "var(--text-sm)",
                    textDecoration: "none",
                    transition: "all var(--duration-normal) var(--ease-out)",
                  }}
                >
                  Explore Bhavya OS
                  <ArrowRight size={14} />
                </a>
              </div>
            </Reveal>

            <Reveal variant="slide-up" delay={0.2}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "var(--space-4)",
                }}
              >
                {[
                  {
                    label: "Programs",
                    desc: "Manage institutional programmes",
                  },
                  { label: "Projects", desc: "Track on-ground initiatives" },
                  { label: "People", desc: "Volunteers, researchers, teams" },
                  { label: "Documents", desc: "Evidence, reports, policies" },
                  { label: "Impact", desc: "Metrics and verification" },
                  { label: "Research", desc: "Knowledge and publications" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
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
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== GET INVOLVED ====== */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-bg-primary)",
        }}
      >
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)" }}>
            <span className="editorial-label">JOIN THE MOVEMENT</span>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                marginTop: "var(--space-4)",
              }}
            >
              Be part of a better tomorrow.
            </h2>
            <p
              style={{
                marginTop: "var(--space-4)",
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                maxWidth: "600px",
              }}
            >
              Whether you want to volunteer, partner, research, or support our
              work, there are many ways to get involved.
            </p>
          </div>

          <div
            className="home-involved-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--space-6)",
            }}
          >
            {getInvolved.map((card, i) => (
              <Reveal
                key={card.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <a
                  href={card.href}
                  style={{
                    display: "block",
                    padding: "var(--space-6)",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    textDecoration: "none",
                    transition: "all var(--duration-normal) var(--ease-out)",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-forest-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-brand-forest)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    <card.icon size={20} />
                  </div>
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {card.desc}
                  </p>
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
                    {card.title} <ArrowRight size={14} />
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
