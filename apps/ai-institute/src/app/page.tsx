"use client";

import { useEffect, useState } from "react";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroBackground } from "@/components/HeroBackground";
import { VineDivider } from "@/components/BotanicalMotifs";
import { HeroEntrance } from "@/components/motion/HeroEntrance";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

const pillars = [
  {
    key: "forest",
    label: "Forest",
    desc: "Restore degraded ecosystems. Protect biodiversity. Conserve watersheds.",
  },
  {
    key: "knowledge",
    label: "Knowledge",
    desc: "Expand access to learning. Advance research. Bridge the digital divide.",
  },
  {
    key: "heritage",
    label: "Heritage",
    desc: "Preserve cultural traditions. Document living history. Protect heritage sites.",
  },
  {
    key: "community",
    label: "Community",
    desc: "Empower local leadership. Strengthen social fabric. Build resilient communities.",
  },
];

const communityProof = [
  "Empower local leadership.",
  "Strengthen social fabric.",
  "Build resilient communities.",
];

const osPanels = [
  {
    title: "Constitution & governance",
    desc: "12 Articles — the governance framework that guides every decision.",
    href: "/os/governance",
  },
  {
    title: "Programme operations",
    desc: "The institutional operating system connecting programs, evidence, and research.",
    href: "/os",
  },
  {
    title: "Learning records",
    desc: "Structured learning paths from foundations to advanced research.",
    href: "/app/learn",
  },
  {
    title: "Research workspace",
    desc: "Collaborate on institutional research and programmes.",
    href: "/app/research",
  },
];

const evidenceRows = [
  {
    label: "Permanent missions",
    value: "4",
    state: "verified",
    href: "/missions",
    source: "Missions",
  },
  {
    label: "Constitution articles",
    value: "12",
    state: "reported",
    href: "/about",
    source: "About",
  },
  {
    label: "Academy curriculum",
    value: "13 levels · 74 modules",
    state: "reported",
    href: "/curriculum",
    source: "Curriculum",
  },
  {
    label: "Engineering quality gates",
    value: "10 gates · 26 metrics",
    state: "reported",
    href: "/about",
    source: "Engineering standards",
  },
];

const revealDistances = [24, 20, 16, 12];

export default function HomePage() {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <SiteHeader />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-heading">
          <HeroBackground
            pillar="home"
            photo="/photography/hero/hero-himalayan-sunset.jpg"
            photoPosition="center 40%"
            overlayOpacity={0.4}
          />
          <HeroEntrance className="hero-content">
            <span
              className="editorial-label"
              style={{ display: "block", marginBottom: "var(--space-6)" }}
            >
              Bhavya Foundation
            </span>
            <h1
              id="hero-heading"
              className="hero-title editorial-heading"
              style={{ color: "var(--color-text-inverse)" }}
            >
              <span style={{ display: "block" }}>Building for</span>
              <span style={{ display: "block" }}>Generations.</span>
            </h1>
            <p
              className="hero-desc"
              style={{
                color: "var(--color-text-inverse)",
                fontSize: "var(--text-xl)",
              }}
            >
              A public institution working across nature, knowledge, heritage,
              and community — built with patience, evidence, and long-term
              thinking.
            </p>
            <div className="hero-actions">
              <a href="/missions" className="btn btn-gold">
                Our Missions <ArrowRight size={16} />
              </a>
              <a
                href="#evidence"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  alignSelf: "flex-start",
                  minHeight: 44,
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--color-text-inverse)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                See the evidence <ArrowRight size={16} />
              </a>
            </div>
          </HeroEntrance>
        </section>

        <section className="scene scene-ivory">
          <div className="container">
            <div style={{ maxWidth: 800 }}>
              <TextReveal>
                <h2
                  className="editorial-heading"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  Long-term thinking. Enduring impact.
                </h2>
              </TextReveal>
              <VineDivider
                color="var(--color-sage-500)"
                opacity={0.5}
                height="64px"
              />
            </div>
          </div>
        </section>

        <section className="scene scene-cream">
          <div className="container">
            <div className="scene-grid-asymmetric">
              <div className="scene-content">
                <ScrollReveal direction="up" distance={24}>
                  <TextReveal>
                    <h2
                      className="editorial-heading"
                      style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
                    >
                      Four permanent missions.
                    </h2>
                  </TextReveal>
                </ScrollReveal>
                <ScrollReveal direction="up" distance={20} delay={0.1}>
                  <p
                    style={{
                      marginTop: "var(--space-6)",
                      fontSize: "var(--text-lg)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                      maxWidth: 560,
                    }}
                  >
                    Bhavya works across four permanent missions to create
                    lasting impact for people and the planet.
                  </p>
                </ScrollReveal>
              </div>
              <div
                style={{ borderTop: "1px solid var(--color-border-primary)" }}
              >
                {pillars.map((p, i) => (
                  <ScrollReveal
                    key={p.key}
                    direction="up"
                    distance={revealDistances[i]}
                    delay={i * 0.1}
                  >
                    <a
                      href={`/${p.key}`}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--space-4)",
                        minHeight: 44,
                        padding: "var(--space-5) 0",
                        borderBottom: "1px solid var(--color-border-primary)",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          minWidth: 28,
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          color: "var(--color-accent-gold)",
                          paddingTop: "0.35em",
                        }}
                      >
                        {`0${i + 1}`}
                      </span>
                      <span style={{ flex: 1 }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "var(--text-2xl)",
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                            lineHeight: 1.25,
                          }}
                        >
                          {p.label}
                        </span>
                        <span
                          style={{
                            display: "block",
                            marginTop: "var(--space-1)",
                            fontSize: "var(--text-sm)",
                            color: "var(--color-text-secondary)",
                            lineHeight: 1.6,
                          }}
                        >
                          {p.desc}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        style={{
                          flexShrink: 0,
                          color: "var(--color-text-muted)",
                          marginTop: "0.5em",
                        }}
                      />
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="scene scene-ivory">
          <div className="container">
            <div className="grid grid-cols-1 items-center gap-[var(--space-10)] lg:grid-cols-[55fr_45fr] lg:gap-[var(--space-16)]">
              <figure style={{ margin: 0 }}>
                <ScrollReveal direction="up" distance={24}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "var(--radius-2xl)",
                      overflow: "hidden",
                      border: "1px solid var(--color-border-primary)",
                      aspectRatio: "4 / 3",
                    }}
                  >
                    <ImageReveal
                      src="/photography/knowledge/knowledge-school-children.jpg"
                      alt="School children in uniform with the snowy Himalaya behind them"
                      className="h-full w-full [&>div]:h-full [&_img]:object-[center_30%]"
                    />
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(14, 56, 46, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </ScrollReveal>
                <figcaption
                  style={{
                    marginTop: "var(--space-3)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Representative photograph — Himachal Pradesh.
                </figcaption>
              </figure>
              <div style={{ maxWidth: 560 }}>
                <ScrollReveal direction="up" distance={24}>
                  <span
                    className="editorial-label"
                    style={{ display: "block" }}
                  >
                    Knowledge
                  </span>
                </ScrollReveal>
                <ScrollReveal direction="up" distance={20} delay={0.1}>
                  <TextReveal>
                    <h2
                      className="editorial-heading"
                      style={{
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        marginTop: "var(--space-4)",
                      }}
                    >
                      Free AI education for rural India.
                    </h2>
                  </TextReveal>
                </ScrollReveal>
                <ScrollReveal direction="up" distance={16} delay={0.2}>
                  <p
                    style={{
                      marginTop: "var(--space-6)",
                      fontSize: "var(--text-lg)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    A complete curriculum from foundations to advanced research
                    — designed for communities that need it most. Open,
                    structured, and built to scale.
                  </p>
                </ScrollReveal>
                <ScrollReveal direction="up" distance={12} delay={0.3}>
                  <a
                    href="/knowledge"
                    className="btn btn-primary"
                    style={{ marginTop: "var(--space-8)" }}
                  >
                    Explore Knowledge <ArrowRight size={14} />
                  </a>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        <section className="scene scene-cream">
          <div className="container">
            <div style={{ maxWidth: 560 }}>
              <ScrollReveal direction="up" distance={20}>
                <span className="editorial-label" style={{ display: "block" }}>
                  Systems
                </span>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={16} delay={0.1}>
                <TextReveal>
                  <h2
                    className="editorial-heading"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      marginTop: "var(--space-4)",
                    }}
                  >
                    Structure is the work.
                  </h2>
                </TextReveal>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={12} delay={0.2}>
                <p
                  style={{
                    marginTop: "var(--space-6)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Institutional home — constitution-bound, community-governed.
                </p>
              </ScrollReveal>
            </div>
            <div
              className="hidden sm:block"
              style={{ maxWidth: 1000, margin: "var(--space-12) auto 0" }}
            >
              <ScrollReveal direction="up" distance={24} delay={0.1}>
                <svg
                  viewBox="0 0 640 420"
                  role="img"
                  aria-labelledby="systems-title"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                  }}
                >
                  <title id="systems-title">Bhavya Foundation structure</title>
                  <line
                    x1="240"
                    y1="75"
                    x2="320"
                    y2="210"
                    stroke="var(--color-sage-300)"
                    strokeWidth="1"
                  />
                  <line
                    x1="400"
                    y1="75"
                    x2="320"
                    y2="210"
                    stroke="var(--color-sage-300)"
                    strokeWidth="1"
                  />
                  <line
                    x1="240"
                    y1="345"
                    x2="320"
                    y2="210"
                    stroke="var(--color-sage-300)"
                    strokeWidth="1"
                  />
                  <line
                    x1="400"
                    y1="345"
                    x2="320"
                    y2="210"
                    stroke="var(--color-sage-300)"
                    strokeWidth="1"
                  />
                  <rect
                    x="40"
                    y="40"
                    width="200"
                    height="70"
                    rx="12"
                    fill="none"
                    stroke="var(--color-border-primary)"
                    strokeWidth="1"
                  />
                  <text
                    x="140"
                    y="75"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-sans)"
                    fontSize="14"
                    fontWeight="600"
                    letterSpacing="0.08em"
                    fill="var(--color-text-primary)"
                  >
                    FOREST
                  </text>
                  <rect
                    x="400"
                    y="40"
                    width="200"
                    height="70"
                    rx="12"
                    fill="none"
                    stroke="var(--color-border-primary)"
                    strokeWidth="1"
                  />
                  <text
                    x="500"
                    y="75"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-sans)"
                    fontSize="14"
                    fontWeight="600"
                    letterSpacing="0.08em"
                    fill="var(--color-text-primary)"
                  >
                    KNOWLEDGE
                  </text>
                  <rect
                    x="40"
                    y="310"
                    width="200"
                    height="70"
                    rx="12"
                    fill="none"
                    stroke="var(--color-border-primary)"
                    strokeWidth="1"
                  />
                  <text
                    x="140"
                    y="345"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-sans)"
                    fontSize="14"
                    fontWeight="600"
                    letterSpacing="0.08em"
                    fill="var(--color-text-primary)"
                  >
                    HERITAGE
                  </text>
                  <rect
                    x="400"
                    y="310"
                    width="200"
                    height="70"
                    rx="12"
                    fill="none"
                    stroke="var(--color-border-primary)"
                    strokeWidth="1"
                  />
                  <text
                    x="500"
                    y="345"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-sans)"
                    fontSize="14"
                    fontWeight="600"
                    letterSpacing="0.08em"
                    fill="var(--color-text-primary)"
                  >
                    COMMUNITY
                  </text>
                  <circle
                    cx="320"
                    cy="210"
                    r="56"
                    fill="var(--color-accent-gold)"
                  />
                  <text
                    x="320"
                    y="210"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-sans)"
                    fontSize="13"
                    fontWeight="600"
                    letterSpacing="0.06em"
                    fill="var(--color-forest-950)"
                  >
                    FOUNDATION
                  </text>
                </svg>
              </ScrollReveal>
            </div>
            <ul
              className="sm:hidden"
              style={{
                listStyle: "none",
                margin: "var(--space-8) 0 0",
                padding: 0,
              }}
            >
              {pillars.map((p) => (
                <li
                  key={p.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-4) 0",
                    borderBottom: "1px solid var(--color-border-primary)",
                    fontSize: "var(--text-lg)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {p.label}
                </li>
              ))}
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-4) 0",
                  fontSize: "var(--text-lg)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-accent-gold)",
                    flexShrink: 0,
                  }}
                />
                Foundation
              </li>
            </ul>
          </div>
        </section>

        <section className="scene scene-ivory">
          <div className="container">
            <div className="grid grid-cols-1 items-center gap-[var(--space-10)] lg:grid-cols-[45fr_55fr] lg:gap-[var(--space-16)]">
              <ScrollReveal
                direction="up"
                distance={24}
                className="lg:col-start-2 lg:row-start-1"
              >
                <figure style={{ margin: 0 }}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "var(--radius-2xl)",
                      overflow: "hidden",
                      border: "1px solid var(--color-border-primary)",
                      aspectRatio: "4 / 3",
                    }}
                  >
                    <ImageReveal
                      src="/photography/community/community-village-gathering.jpg"
                      alt="Village women and children gathered in a stone courtyard"
                      className="h-full w-full [&>div]:h-full"
                    />
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(14, 56, 46, 0.4)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                  <figcaption
                    style={{
                      marginTop: "var(--space-3)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Representative photograph — Himachal Pradesh.
                  </figcaption>
                </figure>
              </ScrollReveal>
              <div
                className="lg:col-start-1 lg:row-start-1"
                style={{ maxWidth: 560 }}
              >
                <ScrollReveal direction="up" distance={24}>
                  <span
                    className="editorial-label"
                    style={{ display: "block" }}
                  >
                    Community
                  </span>
                </ScrollReveal>
                <ScrollReveal direction="up" distance={20} delay={0.1}>
                  <TextReveal>
                    <h2
                      className="editorial-heading"
                      style={{
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        marginTop: "var(--space-4)",
                      }}
                    >
                      Local leadership at the center.
                    </h2>
                  </TextReveal>
                </ScrollReveal>
                <ScrollReveal direction="up" distance={16} delay={0.15}>
                  <p
                    style={{
                      marginTop: "var(--space-6)",
                      fontSize: "var(--text-lg)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    Building local leadership capacity through governance
                    training, cooperative development, and community organizing.
                  </p>
                </ScrollReveal>
                <ul
                  style={{
                    listStyle: "none",
                    margin: "var(--space-6) 0 0",
                    padding: 0,
                    borderTop: "1px solid var(--color-border-secondary)",
                  }}
                >
                  {communityProof.map((text, i) => (
                    <li
                      key={text}
                      style={{
                        borderBottom: "1px solid var(--color-border-secondary)",
                        padding: "var(--space-3) 0",
                      }}
                    >
                      <ScrollReveal
                        direction="up"
                        distance={16}
                        delay={i * 0.1}
                      >
                        <span
                          style={{
                            display: "flex",
                            gap: "var(--space-3)",
                            fontSize: "var(--text-base)",
                            color: "var(--color-text-secondary)",
                            lineHeight: 1.6,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{ color: "var(--color-earth-500)" }}
                          >
                            —
                          </span>
                          {text}
                        </span>
                      </ScrollReveal>
                    </li>
                  ))}
                </ul>
                <ScrollReveal direction="up" distance={12} delay={0.3}>
                  <a
                    href="/community"
                    className="btn btn-primary"
                    style={{ marginTop: "var(--space-8)" }}
                  >
                    Explore Community <ArrowRight size={14} />
                  </a>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative min-h-[70vh] overflow-hidden lg:min-h-[85vh]"
          style={{ background: "var(--color-brand-forest)" }}
        >
          <div aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
            <ParallaxImage
              speed={isNarrow ? 0 : 0.15}
              src="/photography/forest/forest-cedar-sunlight.jpg"
              alt=""
              style={{ position: "absolute", inset: 0 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(14, 56, 46, 0.45)",
              }}
            />
          </div>
          <div
            className="container"
            style={{
              position: "relative",
              zIndex: 1,
              paddingTop: "var(--space-28)",
              paddingBottom: "var(--space-28)",
            }}
          >
            <div style={{ maxWidth: 800 }}>
              <TextReveal>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    color: "var(--color-text-inverse)",
                  }}
                >
                  Knowledge grows where{" "}
                  <span
                    style={{
                      borderBottom: "3px solid var(--color-accent-gold)",
                      paddingBottom: "0.08em",
                    }}
                  >
                    forests
                  </span>{" "}
                  remain.
                </h2>
              </TextReveal>
              <ScrollReveal direction="up" distance={16} delay={0.15}>
                <a
                  href="/forest"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    minHeight: 44,
                    marginTop: "var(--space-8)",
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    color: "rgba(247, 244, 236, 0.85)",
                    textDecoration: "none",
                  }}
                >
                  Explore the Forest mission <ArrowRight size={16} />
                </a>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section
          className="scene scene-dark"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(247,244,236,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="container"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div style={{ maxWidth: 800 }}>
              <ScrollReveal direction="up" distance={20}>
                <span className="dark-label" style={{ display: "block" }}>
                  Bhavya OS
                </span>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={16} delay={0.1}>
                <TextReveal>
                  <h2 className="dark-heading">
                    The system behind the institution.
                  </h2>
                </TextReveal>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={12} delay={0.2}>
                <p className="dark-desc">
                  Bhavya OS is the institutional operating system — connecting
                  programs, projects, evidence, research, and impact in one
                  unified system built to endure.
                </p>
              </ScrollReveal>
            </div>
            <div
              className="home-grid-2x2"
              style={{ marginTop: "var(--space-10)" }}
            >
              {osPanels.map((panel, i) => (
                <ScrollReveal
                  key={panel.title}
                  direction="up"
                  distance={24}
                  delay={i * 0.1}
                >
                  <a
                    href={panel.href}
                    className="flex h-full min-h-[160px] flex-col rounded-[var(--radius-lg)] border border-[rgba(247,244,236,0.12)] bg-[rgba(247,244,236,0.04)] p-[var(--space-6)] no-underline transition-colors hover:border-[rgba(247,244,236,0.28)] hover:bg-[rgba(247,244,236,0.08)]"
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "var(--space-3)",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "var(--text-lg)",
                          fontWeight: 600,
                          color: "var(--color-text-inverse)",
                          lineHeight: 1.3,
                        }}
                      >
                        {panel.title}
                      </h3>
                      <span
                        style={{
                          flexShrink: 0,
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "rgba(247, 244, 236, 0.6)",
                          border: "1px solid rgba(247, 244, 236, 0.25)",
                          borderRadius: "var(--radius-full)",
                          padding: "2px 10px",
                        }}
                      >
                        Internal
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "var(--space-3) 0 0",
                        fontSize: "var(--text-sm)",
                        color: "rgba(247, 244, 236, 0.7)",
                        lineHeight: 1.6,
                      }}
                    >
                      {panel.desc}
                    </p>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section
          className="scene scene-cream"
          id="evidence"
          style={{
            scrollMarginTop: "calc(var(--header-h) + var(--space-4))",
          }}
        >
          <div className="container">
            <div style={{ maxWidth: 640 }}>
              <ScrollReveal direction="up" distance={20}>
                <span className="editorial-label" style={{ display: "block" }}>
                  Evidence
                </span>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={16} delay={0.1}>
                <TextReveal>
                  <h2
                    className="editorial-heading"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      marginTop: "var(--space-4)",
                    }}
                  >
                    Every claim, with its source.
                  </h2>
                </TextReveal>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={12} delay={0.2}>
                <p
                  style={{
                    marginTop: "var(--space-6)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Figures already published by the institution, each with its
                  source and verification state.
                </p>
              </ScrollReveal>
            </div>
            <dl
              style={{
                margin: 0,
                marginTop: "var(--space-10)",
                borderTop: "1px solid var(--color-border-secondary)",
              }}
            >
              {evidenceRows.map((row, i) => (
                <ScrollReveal
                  key={row.label}
                  direction="up"
                  distance={16}
                  delay={i * 0.08}
                  className="flex flex-col gap-[var(--space-3)] [border-bottom:1px_solid_var(--color-border-secondary)] py-[var(--space-5)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <dt
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {row.label}
                  </dt>
                  <dd
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "var(--space-4)",
                      margin: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-xl)",
                        fontWeight: 400,
                        color: "var(--color-text-primary)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row.value}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        border:
                          row.state === "verified"
                            ? "1px solid var(--color-accent-gold)"
                            : "1px solid var(--color-border-primary)",
                        color:
                          row.state === "verified"
                            ? "var(--color-brand-forest)"
                            : "var(--color-text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.state}
                    </span>
                    <a
                      href={row.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        minHeight: 44,
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                        color: "var(--color-brand-forest)",
                        textDecoration: "none",
                      }}
                    >
                      {row.source} <ArrowRight size={14} />
                    </a>
                  </dd>
                </ScrollReveal>
              ))}
            </dl>
          </div>
        </section>

        <section
          className="scene"
          style={{
            background: "var(--color-brand-forest)",
            paddingTop: "var(--space-28)",
            paddingBottom: "var(--space-28)",
          }}
        >
          <div className="container">
            <div style={{ maxWidth: 800 }}>
              <ScrollReveal direction="up" distance={24}>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    color: "var(--color-text-inverse)",
                  }}
                >
                  The institution is being built.
                  <br />
                  <span style={{ color: "var(--color-accent-gold)" }}>
                    Shape what endures.
                  </span>
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={16} delay={0.15}>
                <>
                  <p
                    style={{
                      marginTop: "var(--space-6)",
                      fontSize: "var(--text-lg)",
                      color: "rgba(247, 244, 236, 0.8)",
                      lineHeight: 1.7,
                    }}
                  >
                    Whether you want to volunteer, partner, research, or support
                    our work, there are many ways to contribute to the
                    institution.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-4)",
                      marginTop: "var(--space-8)",
                    }}
                    className="sm:flex-row sm:flex-wrap"
                  >
                    <a
                      href="/donate"
                      className="btn btn-gold w-full justify-center sm:w-auto"
                    >
                      <HeartHandshake size={16} /> Support the mission
                    </a>
                    <a
                      href="/volunteer"
                      className="btn btn-secondary-inverse w-full justify-center sm:w-auto"
                    >
                      Volunteer <ArrowRight size={16} />
                    </a>
                  </div>
                </>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
