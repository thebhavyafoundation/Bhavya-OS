"use client";

import { ArrowRight, HeartHandshake } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroBackground } from "@/components/HeroBackground";
import { HeroEntrance } from "@/components/motion/HeroEntrance";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ScrubExit } from "@/components/motion/ScrubExit";
import { ScrubParallax } from "@/components/motion/ScrubParallax";
import { PhotoPlate } from "@/components/editorial/PhotoPlate";
import { ProofStrip } from "@/components/editorial/ProofStrip";
import { EditorialLink } from "@/components/editorial/EditorialLink";
import { StoryChapter } from "@/components/site/StoryChapter";
import { ChapterRail } from "@/components/site/ChapterRail";
import { STORY_CHAPTERS, STORY_PROOF } from "@/lib/homepage-story";
import { PHOTO, CHAPTER_PHOTO } from "@/lib/photos";

/**
 * Homepage — nine-chapter visual narrative.
 *
 * PLACE → WHY → PILLARS → PEOPLE → EVIDENCE → KNOWLEDGE → HERITAGE →
 * COMMUNITY → GENERATIONS
 *
 * Impact metrics: only Brand Constitution Art. 10 + curriculum data.
 * Photography: rights-cleared JPEGs via PHOTO map (see assets/manifest.json).
 * Reserved plates stay illustrative until first-party assets land.
 */

const chapterDetails: Record<
  (typeof STORY_CHAPTERS)[number]["key"],
  { body: string; credit: string; alt: string }
> = {
  forest: {
    body: "Living systems restored and held for the long term — watersheds, contour planting, and stewardship measured in generations, not seasons.",
    credit:
      "Photo · Kavittaa, CC0 1.0 · Cedar forest, Shimla — representative, not a Bhavya site",
    alt: "Tall Himalayan cedar trees in a dense forest near Shimla",
  },
  knowledge: {
    body: "Structured open education for rural India — free, durable, and built to travel from first digital literacy through research and institution-building.",
    credit:
      "Photo · Glenn Carstens-Peters, CC0 · Open book study — not a Bhavya classroom",
    alt: "Open book and notebook on a wooden table",
  },
  heritage: {
    body: "Document craft, place, and living story while keepers are still here to speak — architecture, language, and ritual held as working knowledge, not museum labels.",
    credit:
      "Photo · UnpetitproleX, CC BY 4.0 · Shirgul Maharaj Temple, Churdhar, Himachal Pradesh — representative, not a Bhavya site",
    alt: "Stone temple architecture at Churdhar, Himachal Pradesh",
  },
  community: {
    body: "Resilience grown from within — local councils, volunteers, and shared decisions. Outside support serves the village plan, not the reverse.",
    credit:
      "Photo · Aashish Chindaliya, CC0 · Himachal Pradesh landscape — place photograph, not a gathering",
    alt: "Mountain landscape in Himachal Pradesh, India",
  },
};

export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <SiteHeader variant="dark" />
      <ChapterRail />
      <main id="main-content">
        {/* ——— CH 01: PLACE ——— */}
        <section
          className="cine-hero place-hero"
          aria-labelledby="hero-heading"
        >
          <HeroBackground
            pillar="home"
            variant="dark"
            overlayOpacity={0.25}
            photo={PHOTO.hero}
          />
          {/*
            PLACE photo: Valley of Uttarakhand, SND Nature, CC BY 4.0.
            Brand mountain planes remain atmospheric only (hero JPEG is
            the base layer via HeroBackground).
          */}
          <div className="place-atmosphere" aria-hidden="true">
            <img
              src="/brand/svg/atmosphere-layers.svg"
              alt=""
              draggable={false}
              className="place-mist"
            />
            <ScrubParallax
              distance={16}
              className="place-plane place-plane-far"
            >
              <img
                src="/brand/svg/mountain-layer.svg"
                alt=""
                draggable={false}
              />
            </ScrubParallax>
            <ScrubParallax
              distance={30}
              className="place-plane place-plane-near"
            >
              <img
                src="/brand/svg/mountain-layer.svg"
                alt=""
                draggable={false}
              />
            </ScrubParallax>
          </div>
          <p className="editorial-label place-photo-credit">
            Photo · SND Nature, CC BY 4.0 · Valley of Uttarakhand
          </p>

          <ScrubExit className="cine-hero-frame">
            <HeroEntrance className="cine-hero-copy">
              <span className="editorial-label cine-hero-eyebrow">
                Bhavya Foundation · Uttarakhand
              </span>
              <h1
                id="hero-heading"
                className="cine-hero-title editorial-heading"
              >
                <span className="cine-hero-line">Building for</span>
                <span className="cine-hero-line cine-hero-line-accent">
                  Generations.
                </span>
              </h1>
              <p className="cine-hero-lead">
                Nature restored. Knowledge opened. Heritage kept. Communities
                led from within.
              </p>
              <div className="cine-hero-actions">
                <a href="/missions" className="btn btn-gold">
                  Explore Bhavya <ArrowRight size={16} />
                </a>
                <a
                  href="#story"
                  className="cine-hero-secondary place-secondary"
                >
                  Our story
                </a>
              </div>
            </HeroEntrance>

            <aside className="cine-hero-aside" aria-label="Foundation promise">
              <p className="cine-hero-aside-text place-aside-text">
                For People.
                <br />
                For Nature.
                <br />
                For Generations.
              </p>
              <span className="cine-hero-aside-rule" aria-hidden="true" />
              <p className="cine-hero-aside-meta place-aside-meta">
                A public charitable trust
              </p>
            </aside>
          </ScrubExit>

          <a href="#story" className="cine-hero-scroll place-scroll">
            <span className="cine-hero-scroll-dot" aria-hidden="true" />
            Scroll
          </a>
        </section>

        {/* ——— CH 02: WHY ——— */}
        <section
          className="cine-story"
          id="story"
          aria-labelledby="story-heading"
        >
          <div className="container cine-story-grid">
            <div className="cine-story-copy">
              <ScrollReveal direction="up" distance={20}>
                <span className="editorial-label">01 · Why</span>
              </ScrollReveal>
              <TextReveal>
                <h2
                  id="story-heading"
                  className="editorial-heading cine-story-title"
                >
                  Long arcs over loud launches.
                </h2>
              </TextReveal>
              <ScrollReveal direction="up" distance={16} delay={0.12}>
                <p className="cine-story-body">
                  Built for the long term — restoring landscapes, opening
                  education, safeguarding heritage, and strengthening local
                  leadership. Decades, not campaigns.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={12} delay={0.22}>
                <EditorialLink href="/about">Read the foundation</EditorialLink>
              </ScrollReveal>
            </div>

            <div className="cine-story-visual">
              <ScrollReveal direction="up" distance={28} delay={0.08}>
                <ScrubParallax distance={24}>
                  <PhotoPlate
                    index="Plate 01"
                    label="Place · Garhwal terraces"
                    caption="Terrace fields near Ransi village, Garhwal, Uttarakhand · Varun Shiv Kapur, CC BY 2.0. Representative landscape — not a Bhavya site."
                    variant="landscape"
                    photo={PHOTO.why}
                    alt="Terraced agricultural fields on a hillside near Ransi village, Garhwal, Uttarakhand"
                  />
                </ScrubParallax>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ——— CH 03–06: PRACTICE — four sticky mission chapters ——— */}
        {STORY_CHAPTERS.map((c, i) => (
          <StoryChapter
            key={c.key}
            id={`chapter-${c.key}`}
            index={c.index}
            label={c.label}
            line={c.line}
            body={chapterDetails[c.key].body}
            href={c.href}
            photo={CHAPTER_PHOTO[c.key]}
            alt={chapterDetails[c.key].alt}
            credit={chapterDetails[c.key].credit}
            flip={i % 2 === 1}
          />
        ))}

        {/* ——— CH 05: EVIDENCE ——— */}
        <section
          className="cine-proof"
          id="evidence"
          aria-labelledby="proof-heading"
        >
          <div className="container">
            <ScrollReveal direction="up" distance={16}>
              <span className="editorial-label">04 · Evidence</span>
            </ScrollReveal>
            <TextReveal>
              <h2
                id="proof-heading"
                className="cine-proof-title editorial-heading"
              >
                Stated plainly. Sourced openly.
              </h2>
            </TextReveal>
            <ProofStrip points={STORY_PROOF} />
            <ScrollReveal direction="up" distance={12} delay={0.2}>
              <EditorialLink href="/about">
                Full evidence &amp; sources
              </EditorialLink>
            </ScrollReveal>
          </div>
        </section>

        {/* ——— CH 09: GENERATIONS ——— */}
        <section className="cine-invite" aria-labelledby="invite-heading">
          <div className="cine-invite-atmosphere" aria-hidden="true" />
          <div className="container cine-invite-inner">
            <ScrollReveal direction="up" distance={16}>
              <span className="dark-label">08 · Generations</span>
            </ScrollReveal>
            <ScrollReveal direction="up" distance={24} delay={0.06}>
              <h2
                id="invite-heading"
                className="editorial-heading cine-invite-title"
              >
                The institution is being built.
                <br />
                <span className="cine-invite-accent">Shape what endures.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" distance={16} delay={0.12}>
              <p className="cine-invite-body">
                Volunteer, partner, research, or support the work — there is a
                place for you in what lasts.
              </p>
              <div className="cine-invite-actions">
                <a href="/donate" className="btn btn-gold">
                  <HeartHandshake size={16} /> Support the mission
                </a>
                <a href="/volunteer" className="btn btn-secondary-inverse">
                  Volunteer <ArrowRight size={16} />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
