"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroEntranceProps {
  badge?: ReactNode;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  ctas?: ReactNode;
  proofDots?: ReactNode;
  /** Hero background image */
  imageSrc?: string;
  /** Hero background image alt text */
  imageAlt?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroEntrance({
  badge,
  titleLine1,
  titleLine2,
  description,
  ctas,
  proofDots,
  imageSrc,
  imageAlt = "",
  className,
}: HeroEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (getPrefersReducedMotion()) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.1,
      })
        .from(
          title1Ref.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.7,
          },
          "-=0.3",
        )
        .from(
          title2Ref.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.7,
          },
          "-=0.4",
        )
        .from(
          descriptionRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.3",
        )
        .from(
          ctasRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.3",
        )
        .from(
          proofRef.current,
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          "-=0.2",
        );

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1 },
          {
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef },
  );

  if (getPrefersReducedMotion()) {
    return (
      <div ref={containerRef} className={className}>
        <div ref={badgeRef}>{badge}</div>
        <h1>
          <span ref={title1Ref}>{titleLine1}</span>
          <br />
          <span ref={title2Ref}>{titleLine2}</span>
        </h1>
        <p ref={descriptionRef}>{description}</p>
        <div ref={ctasRef}>{ctas}</div>
        <div ref={proofRef}>{proofDots}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {imageSrc && (
        <div ref={imageRef} className="absolute inset-0 -z-10">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div ref={badgeRef}>{badge}</div>

      <h1>
        {titleLine1 && (
          <span ref={title1Ref} className="block">
            {titleLine1}
          </span>
        )}
        {titleLine2 && (
          <span ref={title2Ref} className="block">
            {titleLine2}
          </span>
        )}
      </h1>

      {description && <p ref={descriptionRef}>{description}</p>}

      <div ref={ctasRef}>{ctas}</div>
      <div ref={proofRef}>{proofDots}</div>
    </div>
  );
}
