"use client";

import { ArrowRight } from "lucide-react";
import { HeroEntrance } from "@/components/motion/HeroEntrance";
import { ScrubParallax } from "@/components/motion/ScrubParallax";
import { PHOTO } from "@/lib/photos";

/**
 * Immersive background hero — full-bleed documentary photograph as a
 * background layer with editorial typography overlaid. The image carries
 * the scene; the type carries the message. Scrim stack guarantees WCAG
 * AA contrast for ivory type. Motion: staggered HeroEntrance + slow
 * background settle/parallax, all gated by prefers-reduced-motion.
 */
export function SplitHero() {
  return (
    <section
      className="home-hero home-hero--immersive"
      aria-labelledby="hero-heading"
    >
      <div className="home-hero-bg">
        <ScrubParallax distance={36} className="home-hero-parallax">
          <div className="home-hero-frame">
            <img
              src={PHOTO.hero}
              alt="Sun rising over a mountain ridge at dawn — representative photograph"
              width={2400}
              height={1601}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="home-hero-img"
            />
            <div className="home-hero-scrim" aria-hidden="true" />
          </div>
        </ScrubParallax>
      </div>

      <HeroEntrance className="home-hero-copy">
        <p className="home-hero-eyebrow">
          <span className="home-hero-rule" aria-hidden="true" />
          Bhavya Foundation — a public charitable trust
        </p>
        <h1 id="hero-heading" className="home-hero-title">
          <span className="home-hero-line">Building for</span>
          <span className="home-hero-line home-hero-line-accent">
            Generations.
          </span>
        </h1>
        <p className="home-hero-lead">
          Nature restored. Knowledge opened. Heritage kept. Communities led from
          within.
        </p>
        <div className="home-hero-actions">
          <a href="/missions" className="btn btn-gold">
            Explore Bhavya <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a href="/knowledge" className="btn btn-secondary-inverse">
            Start learning
          </a>
        </div>
        <div className="home-hero-meta">
          <a href="#pillars" className="home-hero-scroll">
            <span className="home-hero-scroll-chevron" aria-hidden="true">
              ↓
            </span>
            Scroll
          </a>
          <p className="home-hero-proof">
            For People. For Nature. For Generations.
          </p>
        </div>
      </HeroEntrance>

      <p className="home-hero-spine" aria-hidden="true">
        For People. For Nature. For Generations.
      </p>
    </section>
  );
}
