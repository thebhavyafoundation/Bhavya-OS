"use client";

import { motion } from "framer-motion";
import {
  TreePine,
  Droplets,
  Leaf,
  MapPin,
  ArrowRight,
  Globe,
  Sprout,
  Bird,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { HeroBackground } from "@/components/HeroBackground";

const focusAreas = [
  {
    icon: TreePine,
    title: "Ecosystem Restoration",
    desc: "Restoring degraded forests across India through community-led plantation drives and scientific monitoring.",
  },
  {
    icon: Droplets,
    title: "Water Security",
    desc: "Protecting watersheds and river basins through forest cover restoration and sustainable water management.",
  },
  {
    icon: Leaf,
    title: "Biodiversity Conservation",
    desc: "Documenting and protecting native species through field surveys and habitat restoration programs.",
  },
  {
    icon: MapPin,
    title: "GIS Monitoring",
    desc: "Real-time satellite monitoring of forest cover, plantation growth, and ecosystem health.",
  },
];

const initiatives = [
  {
    icon: Sprout,
    title: "Community Plantation Drives",
    desc: "Engaging local communities in large-scale tree planting across degraded landscapes.",
  },
  {
    icon: Globe,
    title: "Watershed Protection",
    desc: "Restoring forest cover in critical watershed areas to ensure water security for downstream communities.",
  },
  {
    icon: Bird,
    title: "Wildlife Habitat Corridors",
    desc: "Creating connected habitats for wildlife through strategic reforestation of migration routes.",
  },
];

export default function ForestPage() {
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
          pillar="forest"
          photo="/photography/forest/forest-cedar-sunlight.jpg"
          photoPosition="center center"
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
              Forest Mission
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
              Restoring India&apos;s
              <br />
              Forest Heritage
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
              Through community-led plantation drives, scientific monitoring,
              and ecosystem restoration, we are bringing India&apos;s degraded
              forests back to life.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                marginTop: "var(--space-8)",
              }}
            >
              <a href="/app" className="btn btn-gold">
                Join the Mission
                <ArrowRight size={16} />
              </a>
              <a href="/app/missions" className="btn btn-secondary-inverse">
                View Projects
                <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>

          {/* Our Impact sidebar */}
          <Reveal variant="slide-up" delay={0.4}>
            <div
              style={{
                background: "rgba(247, 244, 236, 0.08)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(247, 244, 236, 0.12)",
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
                Our Impact
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-5)",
                }}
              >
                {[
                  {
                    label: "Forest cover restored",
                    note: "across multiple states",
                  },
                  {
                    label: "Community-led plantations",
                    note: "with local participation",
                  },
                  {
                    label: "Species documented",
                    note: "through field surveys",
                  },
                  {
                    label: "Watersheds protected",
                    note: "for downstream communities",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom: "1px solid rgba(247, 244, 236, 0.08)",
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
                        color: "rgba(247, 244, 236, 0.6)",
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

      {/* Focus Areas */}
      <section style={{ padding: "var(--space-24) 0" }}>
        <div className="container">
          <span className="editorial-label">What We Do</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginTop: "var(--space-4)",
            }}
          >
            Our Forest Initiatives
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-12)",
            }}
          >
            {focusAreas.map((area, i) => (
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

      {/* Active Initiatives */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-ivory-200)",
        }}
      >
        <div className="container">
          <span className="editorial-label">Active Initiatives</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginTop: "var(--space-4)",
            }}
          >
            On the Ground
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-12)",
            }}
          >
            {initiatives.map((init, i) => (
              <Reveal
                key={init.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <div
                  style={{
                    background: "var(--color-bg-primary)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-8)",
                    border: "1px solid var(--color-border-primary)",
                  }}
                >
                  <init.icon
                    size={28}
                    style={{
                      color: "var(--color-brand-forest)",
                      marginBottom: "var(--space-4)",
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-lg)",
                      fontWeight: 400,
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    {init.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {init.desc}
                  </p>
                </div>
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
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-forest-800) 100%)",
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
            Join the Forest Mission
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
            Volunteer for plantation drives, monitor forest health, or support
            ecosystem restoration.
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
