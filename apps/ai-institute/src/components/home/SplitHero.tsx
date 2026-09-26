"use client";

import { ArrowRight } from "lucide-react";
import { HeroEntrance } from "@/components/motion/HeroEntrance";
import { PhotoPlate } from "@/components/editorial/PhotoPlate";
import { EditorialLink } from "@/components/editorial/EditorialLink";
import { PHOTO } from "@/lib/photos";
import { photoCredit } from "@/lib/photo-credits";

/**
 * Split hero — ivory copy panel (left) + full-height documentary
 * photograph (right). Entrance motion via HeroEntrance (GSAP,
 * reduced-motion gated).
 */
export function SplitHero() {
  return (
    <section className="home-hero" aria-labelledby="hero-heading">
      <HeroEntrance className="home-hero-copy">
        <span className="editorial-label">Bhavya Foundation</span>
        <h1 id="hero-heading" className="home-hero-title">
          Building for
          <br />
          Generations.
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
        <PhotoPlate
          index="Bhavya Foundation"
          label="For People. For Nature. For Generations."
          caption={photoCredit("hero")}
          variant="landscape"
          photo={PHOTO.hero}
          alt="Sunlit mountain landscape at sunset — representative photograph"
          priority
        />
      </div>
    </section>
  );
}
