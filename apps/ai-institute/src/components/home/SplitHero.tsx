"use client";

import { ArrowRight } from "lucide-react";
import { HeroEntrance } from "@/components/motion/HeroEntrance";
import { ScrubParallax } from "@/components/motion/ScrubParallax";
import { EditorialLink } from "@/components/editorial/EditorialLink";
import { PHOTO } from "@/lib/photos";

/**
 * Poster-stagger hero — asymmetric split (44/56): ivory copy panel
 * left, documentary photograph right. The second display line steps
 * over the seam onto the photograph; a vertical tagline spine rides
 * the right edge. One authored motion: image settle (gated by
 * prefers-reduced-motion) plus the staggered HeroEntrance.
 */
export function SplitHero() {
  return (
    <section className="home-hero" aria-labelledby="hero-heading">
      <HeroEntrance className="home-hero-copy">
        <span className="home-hero-rule" aria-hidden="true" />
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
          <EditorialLink href="/knowledge">Start learning</EditorialLink>
        </div>
        <a href="#pillars" className="home-hero-scroll">
          <span className="home-hero-scroll-chevron" aria-hidden="true">
            ↓
          </span>
          Scroll
        </a>
      </HeroEntrance>

      <div className="home-hero-visual">
        <ScrubParallax distance={20} className="home-hero-parallax">
          <div className="home-hero-frame">
            <img
              src={PHOTO.hero}
              alt="Sunlit mountain landscape at sunset — representative photograph"
              width={1600}
              height={1067}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="home-hero-img"
            />
            <div className="home-hero-scrim" aria-hidden="true" />
          </div>
        </ScrubParallax>
        <p className="home-hero-spine">
          For People. For Nature. For Generations.
        </p>
      </div>
    </section>
  );
}
