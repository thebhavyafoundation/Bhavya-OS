"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialLink } from "@/components/editorial/EditorialLink";

gsap.registerPlugin(ScrollTrigger);

interface StoryChapterProps {
  id: string;
  index: string;
  label: string;
  line: string;
  body: string;
  href: string;
  photo: string;
  alt: string;
  credit: string;
  /** Alternates photo side for editorial rhythm */
  flip?: boolean;
}

/**
 * StoryChapter — one mission as a sticky full-viewport chapter.
 *
 * Layout: CSS `position: sticky` holds the photo panel while the copy column
 * scrolls (no GSAP pin — fewer layout side effects). GSAP ScrollTrigger only
 * scrubs the photo's scale (transform-only, INP-safe).
 *
 * Reduced motion: sticky released to static flow, scrub skipped — the chapter
 * still reads completely in order.
 */
export function StoryChapter({
  id,
  index,
  label,
  line,
  body,
  href,
  photo,
  alt,
  credit,
  flip = false,
}: StoryChapterProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(max-width: 767px)").matches) return;

      const img = ref.current.querySelector<HTMLElement>(
        ".story-chapter-photo",
      );
      if (!img) return;

      gsap.fromTo(
        img,
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      id={id}
      ref={ref}
      className={`story-chapter ${flip ? "story-chapter--flip" : ""}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="story-chapter-media">
        <div className="story-chapter-media-sticky">
          <img
            src={photo}
            alt={alt}
            className="story-chapter-photo"
            loading="lazy"
            draggable={false}
          />
          <span className="story-chapter-number" aria-hidden="true">
            {index}
          </span>
          <p className="story-chapter-credit editorial-label">{credit}</p>
        </div>
      </div>

      <div className="story-chapter-copy">
        <div className="story-chapter-copy-inner">
          <ScrollReveal direction="up" distance={16}>
            <span className="editorial-label">
              {index} · {label}
            </span>
          </ScrollReveal>
          <TextReveal>
            <h2
              id={`${id}-heading`}
              className="editorial-heading story-chapter-title"
            >
              {line}
            </h2>
          </TextReveal>
          <ScrollReveal direction="up" distance={14} delay={0.1}>
            <p className="story-chapter-body">{body}</p>
          </ScrollReveal>
          <ScrollReveal direction="up" distance={12} delay={0.18}>
            <EditorialLink href={href}>Enter {label}</EditorialLink>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
