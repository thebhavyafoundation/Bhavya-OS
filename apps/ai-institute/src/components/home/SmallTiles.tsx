"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { EditorialLink } from "@/components/editorial/EditorialLink";
import { SMALL_TILES } from "@/data/home-v2";

/**
 * Small tiles — four compact institutional pointers
 * (Foundation · Evidence · Participate · Bhavya OS).
 */
export function SmallTiles() {
  return (
    <section className="section-cream" aria-label="More about the foundation">
      <div
        className="container"
        style={{
          paddingTop: "var(--space-24)",
          paddingBottom: "var(--space-24)",
        }}
      >
        <SectionHeader
          label="The institution"
          title="Built to be inspected."
          description="Read how the foundation works, what backs each claim, and where you fit in."
        />
        <div className="home-small-grid">
          {SMALL_TILES.map((tile, i) => (
            <ScrollReveal key={tile.title} direction="up" delay={i * 0.07}>
              <article className="home-small-card">
                <h3 className="home-small-title">{tile.title}</h3>
                <p className="home-small-body">{tile.body}</p>
                <EditorialLink href={tile.href}>Open</EditorialLink>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
