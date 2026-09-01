"use client";

import {
  Building2,
  Palette,
  Scroll,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { HeroBackground } from "@/components/HeroBackground";

const heritageAreas = [
  {
    icon: Building2,
    title: "Architecture",
    desc: "Documenting India's architectural heritage — from ancient temples to colonial structures — to inform preservation and inspire future design.",
  },
  {
    icon: Palette,
    title: "Arts & Crafts",
    desc: "Supporting traditional artisans and preserving indigenous art forms that carry centuries of cultural knowledge.",
  },
  {
    icon: Scroll,
    title: "Manuscripts",
    desc: "Digitizing ancient manuscripts, texts, and historical documents to make them accessible for research and education.",
  },
  {
    icon: Globe,
    title: "Living Heritage",
    desc: "Recording intangible cultural heritage — traditions, rituals, and folk knowledge — before they are lost.",
  },
];

export default function HeritagePage() {
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
          pillar="heritage"
          photo="/photography/heritage/heritage-stone-temple.jpg"
          photoPosition="center 30%"
        />

        <div
          className="container"
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
              Heritage Mission
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
              Preserving Our
              <br />
              Living Heritage
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
              From ancient architecture to living traditions, Bhavya Foundation
              documents, preserves, and celebrates India&apos;s cultural
              heritage for future generations.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                marginTop: "var(--space-8)",
              }}
            >
              <a href="/heritage" className="btn btn-gold">
                Explore Heritage
                <ArrowRight size={16} />
              </a>
              <a href="/app/missions" className="btn btn-secondary-inverse">
                View Missions
                <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission Statement */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background:
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-earth-700) 100%)",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
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
              }}
            >
              &ldquo;Heritage is not a relic of the past. It is the living
              foundation upon which future generations build.&rdquo;
            </blockquote>
            <p
              style={{
                marginTop: "var(--space-6)",
                color: "var(--color-brand-gold)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              — Bhavya Foundation
            </p>
          </Reveal>
        </div>
      </section>

      {/* Heritage Areas */}
      <section style={{ padding: "var(--space-24) 0" }}>
        <div className="container">
          <span className="editorial-label">Heritage Domains</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginTop: "var(--space-4)",
            }}
          >
            Our Heritage Focus Areas
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-12)",
            }}
          >
            {heritageAreas.map((area, i) => (
              <Reveal
                key={area.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <div
                  className="glass"
                  style={{
                    padding: "var(--space-8)",
                    borderRadius: "var(--radius-lg)",
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
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How to Contribute */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-ivory-200)",
        }}
      >
        <div className="container">
          <span className="editorial-label">Get Involved</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginTop: "var(--space-4)",
            }}
          >
            Support Heritage Preservation
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-12)",
            }}
          >
            <Reveal variant="slide-up" delay={0} distance={30}>
              <div
                style={{
                  background: "var(--color-bg-primary)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-8)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-lg)",
                    fontWeight: 400,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  Volunteer
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Contribute your skills to heritage documentation, research, or
                  community outreach. Help us record and preserve cultural
                  knowledge.
                </p>
              </div>
            </Reveal>
            <Reveal variant="slide-up" delay={0.1} distance={30}>
              <div
                style={{
                  background: "var(--color-bg-primary)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-8)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-lg)",
                    fontWeight: 400,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  Donate
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Support heritage preservation initiatives. Your contribution
                  funds documentation equipment, research travel, and community
                  programs.
                </p>
              </div>
            </Reveal>
            <Reveal variant="slide-up" delay={0.2} distance={30}>
              <div
                style={{
                  background: "var(--color-bg-primary)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-8)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-lg)",
                    fontWeight: 400,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  Collaborate
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Partner with us if you work in heritage preservation,
                  archaeology, cultural studies, or museum technology. We welcome
                  institutional collaborations.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background:
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-earth-700) 100%)",
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
            Preserve Our Heritage
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
            Every culture carries irreplaceable knowledge. Help us document,
            preserve, and share it with the world.
          </p>
          <a href="/app" className="btn btn-gold">
            Get Involved
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
