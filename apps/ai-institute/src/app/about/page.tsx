"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const values = [
  {
    title: "Excellence",
    description:
      "We pursue the highest standards in education, research, and mentorship. Every course, every lesson, every interaction reflects our commitment to quality.",
    icon: "✦",
  },
  {
    title: "Accessibility",
    description:
      "Education should be available to everyone, regardless of background, location, or financial means. We design for inclusion from the ground up.",
    icon: "◇",
  },
  {
    title: "Integrity",
    description:
      "We act with honesty, transparency, and ethical responsibility. Our governance ensures that institutional value always takes precedence over short-term gains.",
    icon: "△",
  },
  {
    title: "Innovation",
    description:
      "We push the boundaries of what education can be. From interactive labs to AI mentors, we pioneer new approaches to learning.",
    icon: "◈",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <SiteHeader />

      {/* ====== HERO ====== */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="editorial-label"
          >
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="editorial-heading"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              marginTop: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            About Bhavya Foundation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="editorial-lead"
            style={{ maxWidth: "640px", margin: "0 auto" }}
          >
            A multi-decade mission to build one of the world&apos;s most trusted
            public institutions. Not another platform. A lasting institution.
          </motion.p>
        </div>
      </section>

      {/* ====== MISSION ====== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <p className="editorial-label">Our Mission</p>
              <h2
                className="editorial-heading"
                style={{
                  fontSize: "var(--text-3xl)",
                  marginTop: "var(--space-4)",
                  marginBottom: "var(--space-6)",
                }}
              >
                Restore Nature. Advance Knowledge. Preserve Heritage.
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "var(--space-4)",
                }}
              >
                Our mission is to build an institution that restores ecosystems,
                advances open knowledge, preserves cultural heritage, and
                empowers communities — guided by a constitution that binds us to
                long-term impact.
              </p>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                Through forest restoration, open education, heritage
                documentation, and community programs, we work for decades — not
                quarters — to create lasting institutional value.
              </p>
            </div>
            <div className="relative">
              <div
                style={{
                  aspectRatio: "4/3",
                  borderRadius: "var(--radius-2xl)",
                  overflow: "hidden",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <img
                  src="/photography/hero/hero-himalayan-sunset.jpg"
                  alt="Himalayan sunset — representing the long-term vision of Bhavya Foundation"
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
                      "linear-gradient(to top, rgba(14, 56, 46, 0.6) 0%, transparent 50%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "var(--space-6)",
                    left: "var(--space-6)",
                    right: "var(--space-6)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-5xl)",
                      fontWeight: 400,
                      color: "var(--color-accent-gold)",
                      lineHeight: 1,
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    4
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "rgba(247, 244, 236, 0.8)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                    }}
                  >
                    Missions. One Purpose.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== STORY ====== */}
      <section className="py-20 px-6 section-ivory">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="editorial-label">Our Story</p>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "var(--text-3xl)",
                marginTop: "var(--space-4)",
                marginBottom: "var(--space-8)",
              }}
            >
              The Founding Story
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "var(--space-4)",
                }}
              >
                Bhavya Foundation was born from a simple observation: the
                world&apos;s most important work — restoring forests, preserving
                heritage, advancing knowledge — was being done in fragments,
                without an institution to unify and sustain it.
              </p>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                In 2026, the Bhavya Foundation set out to change that. We
                envisioned an institution that would produce not just individual
                projects, but lasting institutional value — guided by a
                constitution that binds us to decades of impact.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "var(--space-4)",
                }}
              >
                Every decision we make is guided by one principle: build
                institutional value that compounds over decades. Our forest
                restoration work, our open curriculum, our heritage
                documentation — all of it compounds.
              </p>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                This is not a startup. This is an institution — built to last,
                built to lead, and built for generations to come.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== VALUES ====== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="editorial-label">Core Values</p>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "var(--text-3xl)",
                marginTop: "var(--space-4)",
              }}
            >
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  padding: "var(--space-6)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-primary)",
                  background: "var(--color-surface)",
                  transition: "all var(--duration-normal) var(--ease-out)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-surface-forest-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-accent-gold)",
                    fontSize: "var(--text-xl)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  {value.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {value.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="editorial-heading"
              style={{
                fontSize: "var(--text-4xl)",
                marginBottom: "var(--space-6)",
              }}
            >
              Join Our Community
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                marginBottom: "var(--space-10)",
                fontSize: "var(--text-lg)",
              }}
            >
              A community of learners, researchers, and practitioners building
              the future together.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/register" className="btn btn-gold">
                Begin Your Journey
              </Link>
              <Link href="/missions" className="btn btn-secondary">
                Explore Missions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
