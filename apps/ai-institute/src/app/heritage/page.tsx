"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Palette,
  BookOpen,
  MapPin,
  ArrowRight,
  Landmark,
  Scroll,
  Globe,
} from "lucide-react";
import { BhavyaLogo } from "@/components/BhavyaLogo";

const heritageAreas = [
  {
    icon: Building2,
    title: "Architecture",
    desc: "Documenting and preserving India's architectural heritage, from ancient temples to colonial structures.",
  },
  {
    icon: Palette,
    title: "Arts & Crafts",
    desc: "Supporting traditional artisans and preserving indigenous art forms for future generations.",
  },
  {
    icon: Scroll,
    title: "Manuscripts",
    desc: "Digitizing and preserving ancient manuscripts, texts, and historical documents.",
  },
  {
    icon: Globe,
    title: "Living Heritage",
    desc: "Recording and celebrating intangible cultural heritage — traditions, rituals, and folk knowledge.",
  },
];

const heritageStats = [
  { value: "75+", label: "Sites Documented" },
  { value: "200+", label: "Artisans Supported" },
  { value: "1,000+", label: "Manuscripts Digitized" },
  { value: "15", label: "States Covered" },
];

export default function HeritagePage() {
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
            <a href="/knowledge" className="nav-link">
              Knowledge
            </a>
            <a
              href="/heritage"
              className="nav-link"
              style={{ color: "var(--color-brand-forest)" }}
            >
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
              "linear-gradient(135deg, #3d2b1f 0%, #6A7C52 50%, #8A9A8B 100%)",
          }}
        />
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
              <a
                href="/heritage"
                className="btn btn-primary"
                style={{
                  background: "var(--color-brand-gold)",
                  color: "var(--color-brand-forest)",
                }}
              >
                Explore Heritage
                <ArrowRight size={16} />
              </a>
              <a
                href="/app/missions"
                className="btn btn-secondary"
                style={{
                  borderColor: "rgba(247, 244, 236, 0.3)",
                  color: "var(--color-text-inverse)",
                }}
              >
                View Missions
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
            {heritageStats.map((stat, i) => (
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
            Our Heritage Initiatives
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
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
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
              </motion.div>
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
            Volunteer for heritage documentation, support artisans, or help
            digitize historical records.
          </p>
          <a
            href="/app"
            className="btn btn-primary"
            style={{
              background: "var(--color-brand-gold)",
              color: "var(--color-brand-forest)",
            }}
          >
            Get Involved
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
