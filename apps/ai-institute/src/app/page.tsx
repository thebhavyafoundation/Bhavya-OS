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
import { MissionChapter } from "@/components/editorial/MissionChapter";
import { EditorialLink } from "@/components/editorial/EditorialLink";
import { STORY_PROOF } from "@/lib/homepage-story";
import { PHOTO } from "@/lib/photos";

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

const missions = [
  {
    key: "forest",
    index: "01",
    label: "Forest",
    line: "Restore living systems. Protect watersheds. Hold the ground for generations.",
  },
  {
    key: "knowledge",
    index: "02",
    label: "Knowledge",
    line: "Open learning for rural India — structured, free, built to endure.",
  },
  {
    key: "heritage",
    index: "03",
    label: "Heritage",
    line: "Keep living memory. Document craft, place, and story before they fade.",
  },
  {
    key: "community",
    index: "04",
    label: "Community",
    line: "Local leadership at the center. Resilience grown from within.",
  },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <SiteHeader variant="dark" />
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

        {/* ——— CH 03: PILLARS ——— */}
        <section className="cine-missions" aria-labelledby="missions-heading">
          <div className="container">
            <div className="cine-missions-head">
              <ScrollReveal direction="up" distance={20}>
                <span className="dark-label">02 · Pillars</span>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={16} delay={0.08}>
                <TextReveal>
                  <h2
                    id="missions-heading"
                    className="dark-heading cine-missions-title"
                  >
                    Four permanent missions.
                  </h2>
                </TextReveal>
              </ScrollReveal>
            </div>

            <ul className="mission-index">
              {missions.map((m, i) => (
                <li key={m.key} className="mission-index-item">
                  <ScrollReveal direction="up" distance={20} delay={i * 0.07}>
                    <a href={`/${m.key}`} className="mission-row">
                      <span className="mission-row-index" aria-hidden="true">
                        {m.index}
                      </span>
                      <span className="mission-row-body">
                        <span className="mission-row-label">{m.label}</span>
                        <span className="mission-row-line">{m.line}</span>
                      </span>
                      <span className="mission-row-cta" aria-hidden="true">
                        Enter <ArrowRight size={15} />
                      </span>
                    </a>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ——— CH 04: PEOPLE ——— */}
        <section className="chapter-people" aria-labelledby="people-heading">
          <div className="container chapter-people-grid">
            <div className="chapter-people-copy">
              <ScrollReveal direction="up" distance={16}>
                <span className="editorial-label">03 · People</span>
              </ScrollReveal>
              <TextReveal>
                <h2
                  id="people-heading"
                  className="editorial-heading chapter-people-title"
                >
                  Held by the people who stay.
                </h2>
              </TextReveal>
              <ScrollReveal direction="up" distance={14} delay={0.1}>
                <p className="chapter-people-body">
                  Students in village classrooms. Elders keeping craft and
                  language. Volunteers planting on contour. Local councils
                  choosing what endures. The work is theirs before it is ours.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={12} delay={0.18}>
                <EditorialLink href="/community">
                  Meet the community
                </EditorialLink>
              </ScrollReveal>
            </div>
            <div className="chapter-people-visual">
              <ScrollReveal direction="up" distance={24} delay={0.06}>
                <ScrubParallax distance={20}>
                  <PhotoPlate
                    index="Plate 02"
                    label="People · village gathering"
                    caption="Documentary portrait reserved. No stock or AI faces — rights-cleared field photography only. PEOPLE chapter remains on hold pending consent."
                    variant="people"
                  />
                </ScrubParallax>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ——— CH 05: EVIDENCE ——— */}
        <section className="cine-proof" aria-labelledby="proof-heading">
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

        {/* ——— CH 06: KNOWLEDGE ——— */}
        <MissionChapter
          index="05"
          title="Knowledge"
          statement="Learning that outlasts a classroom."
          meaning="Structured open education for rural India — free, durable, and built to travel from first digital literacy through research and institution-building."
          proof="Bhavya Academy · progressive curriculum toward mastery"
          href="/knowledge"
          cta="Enter"
          plateLabel="Knowledge · open book study"
          plateCaption="Object study for the knowledge chapter (CC0). Not a Bhavya classroom — school-children frame remains ASSET REQUIRED."
          photo={PHOTO.knowledgeBooks}
          alt="Open book and notebook on a wooden table"
          variant="knowledge"
          tone="ivory"
          flip={false}
        />

        {/* ——— CH 07: HERITAGE ——— */}
        <MissionChapter
          index="06"
          title="Heritage"
          statement="Memory before it thins."
          meaning="Document craft, place, and living story while keepers are still here to speak. Architecture, language, and ritual held as working knowledge — not museum labels."
          href="/heritage"
          cta="Enter"
          plateLabel="Heritage · stone temple"
          plateCaption="Shirgul Maharaj Temple, Churdhar, Himachal Pradesh · UnpetitproleX, CC BY 4.0. Representative photograph — not a Bhavya site."
          photo={PHOTO.heritageStone}
          alt="Stone temple architecture at Churdhar, Himachal Pradesh"
          variant="heritage"
          tone="stone"
          flip
        />

        {/* ——— CH 08: COMMUNITY ——— */}
        <MissionChapter
          index="07"
          title="Community"
          statement="Leadership already on the ground."
          meaning="Resilience grown from within — local councils, volunteers, and shared decisions. Outside support serves the village plan, not the reverse."
          href="/community"
          cta="Enter"
          plateLabel="Community · mountain landscape"
          plateCaption="Mountain landscape, Himachal Pradesh · Aashish Chindaliya, CC0. Place photograph only — gathering frame remains ASSET REQUIRED."
          photo={PHOTO.communityLandscape}
          alt="Mountain landscape in Himachal Pradesh, India"
          variant="community"
          tone="ivory"
          flip={false}
        />

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
