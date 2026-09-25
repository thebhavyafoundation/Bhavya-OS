import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { PhotoPlate, type PhotoPlateVariant } from "./PhotoPlate";

interface MissionChapterProps {
  index: string;
  title: string;
  statement: string;
  meaning: string;
  proof?: string;
  href: string;
  cta?: string;
  plateLabel: string;
  plateCaption?: string;
  variant?: PhotoPlateVariant;
  photo?: string;
  /** Required meaning when photo is set; falls back to plateLabel in PhotoPlate */
  alt?: string;
  /** Alternates plate left/right for editorial rhythm */
  flip?: boolean;
  tone?: "ivory" | "forest" | "stone";
  children?: ReactNode;
}

/**
 * MissionChapter — one pillar as a chapter (not a card).
 * Large visual · short title · one meaning · small proof · clear route.
 */
export function MissionChapter({
  index,
  title,
  statement,
  meaning,
  proof,
  href,
  cta = "Explore",
  plateLabel,
  plateCaption,
  variant = "landscape",
  photo,
  alt,
  flip = false,
  tone = "ivory",
  children,
}: MissionChapterProps) {
  return (
    <article
      className={`mission-chapter mission-chapter--${tone} ${flip ? "mission-chapter--flip" : ""}`}
      aria-labelledby={`mission-${index}`}
    >
      <div className="container mission-chapter-grid">
        <div className="mission-chapter-copy">
          <ScrollReveal direction="up" distance={16}>
            <span className="editorial-label">
              {index} · {title}
            </span>
          </ScrollReveal>
          <TextReveal>
            <h3
              id={`mission-${index}`}
              className="mission-chapter-title editorial-heading"
            >
              {statement}
            </h3>
          </TextReveal>
          <ScrollReveal direction="up" distance={14} delay={0.1}>
            <p className="mission-chapter-meaning">{meaning}</p>
          </ScrollReveal>
          {proof ? (
            <ScrollReveal direction="up" distance={12} delay={0.16}>
              <p className="mission-chapter-proof">{proof}</p>
            </ScrollReveal>
          ) : null}
          <ScrollReveal direction="up" distance={12} delay={0.22}>
            <a href={href} className="editorial-link">
              {cta} {title} <ArrowRight size={15} aria-hidden="true" />
            </a>
          </ScrollReveal>
          {children}
        </div>
        <div className="mission-chapter-visual">
          <ScrollReveal direction="up" distance={28} delay={0.08}>
            <PhotoPlate
              index={index}
              label={plateLabel}
              caption={plateCaption}
              variant={variant}
              photo={photo}
              alt={alt}
              className="mission-chapter-plate"
            />
          </ScrollReveal>
        </div>
      </div>
    </article>
  );
}
