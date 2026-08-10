"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  TreePine,
  Droplets,
  Leaf,
  MapPin,
  ArrowRight,
  Shield,
} from "lucide-react";
import { BhavyaLogo } from "@/components/BhavyaLogo";

const forestStats = [
  { value: "230+", label: "Hectares Restored" },
  { value: "50,000+", label: "Trees Planted" },
  { value: "12", label: "Active Sites" },
  { value: "3", label: "River Basins" },
];

const forestMissions = [
  {
    title: "Ecosystem Restoration",
    desc: "Restoring degraded forests across India through community-led plantation drives and scientific monitoring.",
    icon: TreePine,
  },
  {
    title: "Water Security",
    desc: "Protecting watersheds and river basins through forest cover restoration and sustainable water management.",
    icon: Droplets,
  },
  {
    title: "Biodiversity Conservation",
    desc: "Documenting and protecting native species through field surveys and habitat restoration programs.",
    icon: Leaf,
  },
  {
    title: "GIS Monitoring",
    desc: "Real-time satellite monitoring of forest cover, plantation growth, and ecosystem health.",
    icon: MapPin,
  },
];

export default function ForestPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

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
            <a
              href="/forest"
              className="nav-link"
              style={{ color: "var(--color-brand-forest)" }}
            >
              Forest
            </a>
            <a href="/knowledge" className="nav-link">
              Knowledge
            </a>
            <a href="/heritage" className="nav-link">
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
              "linear-gradient(135deg, #0E382E 0%, #1a6b30 50%, #2d8a45 100%)",
          }}
        />
        <motion.div style={{ position: "absolute", inset: 0, y: heroY }}>
          <svg
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%" }}
          >
            <g fill="rgba(247, 244, 236, 0.05)">
              {Array.from({ length: 40 }).map((_, i) => {
                const x = (i / 40) * 1440;
                const h = 80 + Math.sin(i * 0.7) * 40;
                const w = 15 + Math.sin(i * 1.1) * 8;
                return (
                  <g key={i}>
                    <polygon
                      points={`${x},600 ${x - w},${600 - h} ${x + w},${600 - h}`}
                    />
                    <ellipse
                      cx={x}
                      cy={600 - h - 20}
                      rx={w * 2}
                      ry={25 + Math.sin(i) * 10}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </motion.div>

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
              <a
                href="/app"
                className="btn btn-primary"
                style={{
                  background: "var(--color-brand-gold)",
                  color: "var(--color-brand-forest)",
                }}
              >
                Join the Mission
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
                View Projects
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
            {forestStats.map((stat, i) => (
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

      {/* Mission Areas */}
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
            {forestMissions.map((mission, i) => (
              <motion.div
                key={mission.title}
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
                <mission.icon
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
                  {mission.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {mission.desc}
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
