"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TreePine,
  Brain,
  Building2,
  HeartHandshake,
  ArrowRight,
  Users,
  GraduationCap,
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
import { HeroBackground } from "@/components/HeroBackground";
import { HeroEntrance } from "@/components/motion/HeroEntrance";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { OsArchitectureMap } from "@/components/os-architecture/OsArchitectureMap";

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   DATA
   ============================================ */

const missions = [
  {
    key: "forest",
    icon: TreePine,
    label: "Forest",
    desc: "Restore degraded ecosystems. Protect biodiversity. Conserve watersheds.",
    photo: "/photography/forest/forest-cedar-sunlight.jpg",
  },
  {
    key: "knowledge",
    icon: Brain,
    label: "Knowledge",
    desc: "Expand access to learning. Advance research. Bridge the digital divide.",
    photo: "/photography/knowledge/knowledge-school-children.jpg",
  },
  {
    key: "heritage",
    icon: Building2,
    label: "Heritage",
    desc: "Preserve cultural traditions. Document living history. Protect heritage sites.",
    photo: "/photography/heritage/heritage-stone-temple.jpg",
  },
  {
    key: "community",
    icon: HeartHandshake,
    label: "Community",
    desc: "Empower local leadership. Strengthen social fabric. Build resilient communities.",
    photo: "/photography/community/community-village-gathering.jpg",
  },
];

const realWork = [
  {
    title: "Western Himalaya Watershed Restoration",
    category: "Forest",
    desc: "Restoring degraded watersheds across Himachal Pradesh — soil conservation, native species reforestation, and community-led stewardship.",
    metric: "12 villages",
    photo: "/photography/forest/forest-cedar-sunlight.jpg",
  },
  {
    title: "Digital Literacy for Rural Schools",
    category: "Knowledge",
    desc: "Equipping government schools with structured AI curriculum — from digital foundations to applied problem-solving.",
    metric: "13 Levels",
    photo: "/photography/knowledge/knowledge-school-children.jpg",
  },
  {
    title: "Stone Temple Documentation Project",
    category: "Heritage",
    desc: "Systematic documentation of Himalayan sacred architecture — 3D scanning, oral histories, and conservation planning.",
    metric: "Active fieldwork",
    photo: "/photography/heritage/heritage-stone-temple.jpg",
  },
  {
    title: "Mountain Women's Leadership Program",
    category: "Community",
    desc: "Building local leadership capacity through governance training, cooperative development, and community organizing.",
    metric: "Community-led",
    photo: "/photography/community/community-village-gathering.jpg",
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
   ANIMATED STAT COMPONENT
   ============================================ */

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const { ref, value: current } = useAnimatedCounter({
    target: Number.isNaN(numericValue) ? 0 : numericValue,
  });

  return (
    <div>
      <span
        ref={ref}
        style={{
          display: "block",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          fontWeight: 400,
          color: "var(--color-brand-forest)",
          lineHeight: 1,
        }}
      >
        {numericValue > 0 ? `${current}${suffix}` : value}
      </span>
      <div
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          marginTop: "var(--space-1)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <SiteHeader />
      <section ref={heroRef} className="hero" aria-labelledby="hero-heading">
        <HeroBackground
          pillar="home"
          photo="/photography/hero/hero-himalayan-sunset.jpg"
          photoPosition="center 40%"
        />
        <HeroEntrance>
          <h1
            id="hero-heading"
            className="hero-title"
            style={{ color: "var(--color-text-inverse)" }}
          >
            <span style={{ display: "block" }}>Building for</span>
            <span style={{ display: "block" }}>Generations.</span>
          </h1>
          <p
            className="hero-desc"
            style={{ color: "rgba(247, 244, 236, 0.75)" }}
          >
            A public institution working across nature, knowledge, heritage, and
            community — built with patience, evidence, and long-term thinking.
          </p>
          <div className="hero-actions">
            <a href="/missions" className="btn btn-gold">
              Our Missions <ArrowRight size={16} />
            </a>
            <a href="/about" className="btn btn-secondary-inverse">
              About the Institution <ArrowRight size={14} />
            </a>
          </div>
          <div className="hero-proof">
            <span>
              <span className="hero-proof-dot" /> Four permanent missions
            </span>
            <span>
              <span className="hero-proof-dot" /> Evidence-driven work
            </span>
            <span>
              <span className="hero-proof-dot" /> Built to last
            </span>
          </div>
        </HeroEntrance>
      </section>
      <section className="scene scene-cream">
        <div className="container">
          <div className="scene-grid-asymmetric">
            <div className="scene-content">
              <ScrollReveal direction="up" distance={24}>
                <span className="editorial-label">
                  AN INSTITUTION, NOT A CAMPAIGN
                </span>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={20} delay={0.1}>
                <TextReveal>
                  <h2
                    className="editorial-heading"
                    style={{
                      fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
                      marginTop: "var(--space-4)",
                    }}
                  >
                    Long-term thinking. Enduring impact.
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
                    maxWidth: "520px",
                  }}
                >
                  Bhavya is being built as a long-term institution — not a
                  collection of short-term projects. We work with patience,
                  evidence and integrity to create enduring change.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={12} delay={0.3}>
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
                  Our Approach <ArrowRight size={14} />
                </a>
              </ScrollReveal>
            </div>
            <div className="scene-visual">
              <ScrollReveal direction="right" distance={30} delay={0.15}>
                <div className="quote-block">
                  <p>
                    &ldquo;A tree planted today becomes the forest that protects
                    tomorrow. An institution built today becomes the system that
                    serves generations.&rdquo;
                  </p>
                  <cite>— Bhavya Foundation</cite>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
      <section className="scene scene-ivory" id="main-content">
        <div className="container">
          <ScrollReveal direction="up" distance={20}>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <span className="editorial-label">OUR MISSIONS</span>
              <TextReveal>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    marginTop: "var(--space-4)",
                  }}
                >
                  Four permanent missions.
                </h2>
              </TextReveal>
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
          </ScrollReveal>
          <div className="home-grid-4">
            {missions.map((m, i) => (
              <ScrollReveal
                key={m.key}
                direction="up"
                distance={40}
                delay={i * 0.1}
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
                    <ParallaxImage
                      src={m.photo}
                      alt={m.label}
                      speed={0.15}
                      style={{
                        width: "100%",
                        height: "120%",
                        objectFit: "cover",
                        position: "absolute",
                        top: "-10%",
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
                    <h3 className="mission-card-title">{m.label}</h3>
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <section className="scene scene-cream">
        <div className="container">
          <ScrollReveal direction="up" distance={20}>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <span className="editorial-label">
                OUR WORK IN THE REAL WORLD
              </span>
              <TextReveal>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    marginTop: "var(--space-4)",
                  }}
                >
                  From intention to action.
                </h2>
              </TextReveal>
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
          </ScrollReveal>
          <div className="real-work-sticky">
            {realWork.map((item) => (
              <div key={item.title} className="real-work-item">
                <div className="real-work-info">
                  <ScrollReveal direction="left" distance={20}>
                    <span className="evidence-card-badge">{item.category}</span>
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-muted)",
                        marginTop: "var(--space-2)",
                        fontWeight: 500,
                      }}
                    >
                      {item.metric}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-2xl)",
                        fontWeight: 400,
                        lineHeight: 1.2,
                        marginTop: "var(--space-4)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "var(--text-base)",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.7,
                        marginTop: "var(--space-4)",
                      }}
                    >
                      {item.desc}
                    </p>
                    <a
                      href={`/missions/${item.category.toLowerCase()}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        marginTop: "var(--space-6)",
                        color: "var(--color-brand-forest)",
                        fontWeight: 600,
                        fontSize: "var(--text-sm)",
                        textDecoration: "none",
                      }}
                    >
                      Learn more <ArrowRight size={14} />
                    </a>
                  </ScrollReveal>
                </div>
                <div className="real-work-visual">
                  <ScrollReveal direction="right" distance={30} delay={0.1}>
                    <div
                      style={{
                        borderRadius: "var(--radius-2xl)",
                        overflow: "hidden",
                        border: "1px solid var(--color-border-primary)",
                        aspectRatio: "4/3",
                      }}
                    >
                      <ParallaxImage
                        src={item.photo}
                        alt={item.title}
                        speed={0.2}
                        style={{
                          width: "100%",
                          height: "120%",
                          objectFit: "cover",
                          position: "absolute",
                          top: "-10%",
                        }}
                      />
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        className="scene scene-dark"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(247,244,236,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            className="scene-grid-asymmetric"
            style={{ alignItems: "center" }}
          >
            <div className="scene-content">
              <ScrollReveal direction="up" distance={20}>
                <span className="dark-label">
                  THE SYSTEM BEHIND THE INSTITUTION
                </span>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={16} delay={0.1}>
                <TextReveal>
                  <h2
                    className="dark-heading"
                    style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
                  >
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
              <ScrollReveal direction="up" distance={12} delay={0.3}>
                <a
                  href="/os"
                  className="btn btn-gold"
                  style={{ marginTop: "var(--space-6)" }}
                >
                  Explore Bhavya OS <ArrowRight size={14} />
                </a>
              </ScrollReveal>
            </div>
            <div className="scene-visual">
              <OsArchitectureMap />
            </div>
          </div>
        </div>
      </section>
      <section className="scene scene-ivory">
        <div className="container">
          <ScrollReveal direction="up" distance={20}>
            <div
              style={{ textAlign: "center", marginBottom: "var(--space-12)" }}
            >
              <span className="editorial-label">THE BHAVYA ECOSYSTEM</span>
              <TextReveal>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    marginTop: "var(--space-4)",
                  }}
                >
                  A connected ecosystem for greater impact.
                </h2>
              </TextReveal>
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
          </ScrollReveal>
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
              <ScrollReveal
                key={item.label}
                direction="up"
                distance={20}
                delay={i * 0.1}
              >
                <div className="ecosystem-card-light">
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
              </ScrollReveal>
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
              <ScrollReveal
                key={item.label}
                direction="up"
                distance={20}
                delay={0.3 + i * 0.1}
              >
                <div className="ecosystem-card-dark">
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <section className="scene scene-cream">
        <div className="container">
          <ScrollReveal direction="up" distance={20}>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <span className="editorial-label">BUILT ON PUBLIC TRUST</span>
              <TextReveal>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    marginTop: "var(--space-4)",
                  }}
                >
                  Transparency is not optional.
                </h2>
              </TextReveal>
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
          </ScrollReveal>
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
              <ScrollReveal
                key={item.title}
                direction="up"
                distance={30}
                delay={i * 0.1}
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
              </ScrollReveal>
            ))}
          </div>
          <div style={{ marginTop: "var(--space-20)" }}>
            <div className="scene-grid-asymmetric">
              <div className="scene-content">
                <ScrollReveal direction="up" distance={20}>
                  <span className="editorial-label">AI INSTITUTE</span>
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
                      Free AI education for rural India.
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
                      maxWidth: "480px",
                    }}
                  >
                    A complete curriculum from foundations to advanced research
                    — designed for communities that need it most. Open,
                    structured, and built to scale.
                  </p>
                </ScrollReveal>
                <ScrollReveal direction="up" distance={12} delay={0.25}>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-8)",
                      marginTop: "var(--space-8)",
                    }}
                  >
                    <AnimatedStat value="13" label="Levels" />
                    <AnimatedStat value="74+" label="Modules" />
                    <AnimatedStat value="25" label="Core Concepts" />
                  </div>
                </ScrollReveal>
                <ScrollReveal direction="up" distance={12} delay={0.3}>
                  <a
                    href="/curriculum"
                    className="btn btn-primary"
                    style={{ marginTop: "var(--space-8)" }}
                  >
                    Explore the Curriculum <ArrowRight size={14} />
                  </a>
                </ScrollReveal>
              </div>
              <div className="scene-visual">
                <ScrollReveal direction="right" distance={30} delay={0.15}>
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
                      alt="Students in a rural school"
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
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="scene scene-cream">
        <div className="container">
          <ScrollReveal direction="up" distance={20}>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <span className="editorial-label">GET INVOLVED</span>
              <TextReveal>
                <h2
                  className="editorial-heading"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    marginTop: "var(--space-4)",
                  }}
                >
                  Contribute to what lasts.
                </h2>
              </TextReveal>
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
          </ScrollReveal>
          <div className="home-grid-4">
            {getInvolved.map((card, i) => (
              <ScrollReveal
                key={card.title}
                direction="up"
                distance={30}
                delay={i * 0.1}
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
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
          <ScrollReveal direction="up" distance={20}>
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
          </ScrollReveal>
          <ScrollReveal direction="up" distance={16} delay={0.15}>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href="/donate" className="btn btn-gold">
                <HeartHandshake size={16} /> Support the mission
              </a>
              <a href="/missions" className="btn btn-secondary-inverse">
                Explore Missions <ArrowRight size={16} />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
