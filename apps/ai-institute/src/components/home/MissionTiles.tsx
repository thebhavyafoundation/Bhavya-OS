"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { EditorialLink } from "@/components/editorial/EditorialLink";
import { getMissionProfile, type MissionId } from "@/data/mission-profiles";
import { CHAPTER_PHOTO } from "@/lib/photos";
import { photoCredit } from "@/lib/photo-credits";

interface Tile {
  id: MissionId;
  photo: string;
  alt: string;
}

const TILES: readonly Tile[] = [
  {
    id: "knowledge",
    photo: CHAPTER_PHOTO.knowledge,
    alt: "Open book and notebook on a wooden table",
  },
  {
    id: "heritage",
    photo: CHAPTER_PHOTO.heritage,
    alt: "Stone temple architecture — representative photograph",
  },
  {
    id: "community",
    photo: CHAPTER_PHOTO.community,
    alt: "Mountain landscape — representative photograph",
  },
];

/**
 * Mission tiles — three photographic cards (Knowledge · Heritage ·
 * Community) drawn from mission-profiles so copy and status stay
 * truthful to the constitution-sourced source of record. Forest is
 * represented by the hero on the front page.
 */
export function MissionTiles() {
  return (
    <section aria-label="Mission spotlights">
      <div
        className="container"
        style={{
          paddingTop: "var(--space-24)",
          paddingBottom: "var(--space-24)",
        }}
      >
        <TextReveal>
          <SectionHeader
            label="Spotlight"
            title="Three more paths forward."
            description="Each mission keeps its own page — plan, sources, and what is honestly true today."
          />
        </TextReveal>
        <div className="home-tiles">
          {TILES.map((tile, i) => {
            const profile = getMissionProfile(tile.id);
            return (
              <ScrollReveal key={tile.id} direction="up" delay={i * 0.1}>
                <article className="home-tile">
                  <div className="home-tile-media">
                    <img
                      src={tile.photo}
                      alt={tile.alt}
                      loading="lazy"
                      decoding="async"
                      className="home-tile-img"
                    />
                  </div>
                  <div className="home-tile-body">
                    <span className="editorial-label">Mission</span>
                    <h3 className="home-tile-name">{profile.name}</h3>
                    <p className="home-tile-body-text">{profile.oneLiner}</p>
                    <span className="home-tile-status">
                      {profile.statusLabel}
                    </span>
                    <div
                      style={{
                        marginTop: "auto",
                        paddingTop: "var(--space-4)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: "var(--space-4)",
                        flexWrap: "wrap",
                      }}
                    >
                      <span className="home-tile-credit">
                        {photoCredit(
                          tile.id === "knowledge"
                            ? "knowledgeBooks"
                            : tile.id === "heritage"
                              ? "heritageStone"
                              : "communityLandscape",
                        )}
                      </span>
                      <EditorialLink href={`/missions/${tile.id}`}>
                        Explore
                      </EditorialLink>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
