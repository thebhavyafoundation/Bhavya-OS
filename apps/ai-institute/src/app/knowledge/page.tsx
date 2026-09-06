"use client";

import { useState } from "react";
import {
  Brain,
  BookOpen,
  FlaskConical,
  GraduationCap,
  ArrowRight,
  Library,
  ExternalLink,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { HeroBackground } from "@/components/HeroBackground";

const knowledgeTabs = [
  {
    id: "academy",
    icon: GraduationCap,
    title: "Academy",
    desc: "Structured learning paths from foundations to advanced research. Free and open.",
    href: "/knowledge/academy",
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI Institute",
    desc: "Artificial intelligence research, education, and ethical deployment.",
    href: "/knowledge/ai",
  },
  {
    id: "library",
    icon: Library,
    title: "Library",
    desc: "Open-access knowledge repository. Curated collections of traditional wisdom and modern research.",
    href: "/knowledge/library",
  },
  {
    id: "research",
    icon: FlaskConical,
    title: "Research",
    desc: "Open research on ecology, heritage, education, and technology. All findings published freely.",
    href: "/knowledge/research",
  },
  {
    id: "courses",
    icon: BookOpen,
    title: "Courses",
    desc: "Free, structured courses across multiple disciplines. No prerequisites. No fees.",
    href: "/knowledge/academy",
  },
  {
    id: "knowledge-graph",
    icon: Brain,
    title: "Knowledge Graph",
    desc: "Interconnected knowledge map linking concepts across disciplines.",
    href: "/knowledge-graph",
  },
];

const ecosystemCards = [
  {
    icon: Brain,
    title: "AI Labs",
    desc: "Hands-on artificial intelligence education. Build, experiment, and understand the technology shaping our future.",
    href: "/knowledge/ai",
  },
  {
    icon: BookOpen,
    title: "Digital Libraries",
    desc: "Curated collections of knowledge. Traditional wisdom meets modern research in a searchable, open archive.",
    href: "/knowledge/library",
  },
  {
    icon: FlaskConical,
    title: "Research",
    desc: "Open research on ecology, heritage, education, and technology. All findings published freely.",
    href: "/knowledge/research",
  },
];

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState("academy");

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
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
        <HeroBackground
          pillar="knowledge"
          photo="/photography/knowledge/knowledge-school-children.jpg"
          photoPosition="center 30%"
        />

        <div
          className="container mission-hero-grid"
          style={{
            position: "relative",
            zIndex: 2,
            color: "var(--color-text-inverse)",
          }}
        >
          <Reveal variant="slide-up" delay={0.2}>
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
              <a href="/knowledge/academy" className="btn btn-gold">
                Explore Academy
                <ArrowRight size={16} />
              </a>
              <a
                href="/knowledge/library"
                className="btn btn-secondary-inverse"
              >
                Browse Library
                <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>

          {/* By the Numbers sidebar */}
          <Reveal variant="slide-up" delay={0.4}>
            <div
              style={{
                background:
                  "rgba(var(--color-ivory-200-rgb, 247, 244, 236), 0.08)",
                backdropFilter: "blur(16px)",
                border:
                  "1px solid rgba(var(--color-ivory-200-rgb, 247, 244, 236), 0.12)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-8)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 400,
                  marginBottom: "var(--space-6)",
                  color: "var(--color-brand-gold)",
                }}
              >
                What We Offer
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-5)",
                }}
              >
                {[
                  { label: "Learning levels", note: "structured curriculum" },
                  { label: "Knowledge packages", note: "open and growing" },
                  { label: "AI-powered tools", note: "for learning" },
                  {
                    label: "Community contributors",
                    note: "building together",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom:
                        "1px solid rgba(var(--color-ivory-200-rgb, 247, 244, 236), 0.08)",
                      paddingBottom: "var(--space-4)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                        color: "var(--color-text-inverse)",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-xs)",
                        color:
                          "rgba(var(--color-ivory-200-rgb, 247, 244, 236), 0.6)",
                        marginTop: "var(--space-1)",
                      }}
                    >
                      {item.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section style={{ padding: "var(--space-16) 0 0" }}>
        <div className="container">
          <div
            role="tablist"
            style={{
              display: "flex",
              gap: "var(--space-2)",
              overflowX: "auto",
              paddingBottom: "var(--space-4)",
              borderBottom: "1px solid var(--color-border-primary)",
            }}
          >
            {knowledgeTabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={tab.id === activeTab}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3) var(--space-5)",
                  borderRadius: "var(--radius-sm)",
                  background:
                    activeTab === tab.id
                      ? "var(--color-brand-forest)"
                      : "transparent",
                  color:
                    activeTab === tab.id
                      ? "var(--color-text-inverse)"
                      : "var(--color-text-secondary)",
                  border: "none",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all var(--duration-fast) ease",
                }}
              >
                <tab.icon size={16} />
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Tab Content */}
      <section style={{ padding: "var(--space-16) 0" }}>
        <div className="container">
          {knowledgeTabs
            .filter((tab) => tab.id === activeTab)
            .map((tab) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={`panel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
                className="mission-tab-grid"
                style={{
                  display: "grid",
                }}
              >
                <div>
                  <span className="editorial-label">{tab.title}</span>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      fontWeight: 400,
                      marginTop: "var(--space-4)",
                      marginBottom: "var(--space-6)",
                    }}
                  >
                    {tab.desc}
                  </h2>
                  <a
                    href={tab.href}
                    className="btn btn-primary"
                    style={{ display: "inline-flex" }}
                  >
                    Explore {tab.title}
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div
                  style={{
                    background: "var(--color-ivory-200)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <tab.icon
                    size={80}
                    style={{
                      color: "var(--color-brand-forest)",
                      opacity: 0.3,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Knowledge Ecosystem */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-ivory-200)",
        }}
      >
        <div className="container">
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-12)",
            }}
          >
            {ecosystemCards.map((card, i) => (
              <Reveal
                key={card.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <a
                  href={card.href}
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
                  <card.icon
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
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {card.desc}
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
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background:
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-sage-800) 100%)",
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
          <a href="/knowledge/academy" className="btn btn-gold">
            Explore Academy
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
