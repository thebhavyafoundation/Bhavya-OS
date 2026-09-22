"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  /** Parallax speed (0 = static, 1 = full speed) */
  speed?: number;
  /** CSS classes for the container */
  className?: string;
  /** Image source */
  src: string;
  /** Image alt text */
  alt: string;
  /** Inline styles for the container */
  style?: CSSProperties;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ParallaxImage({
  speed = 0.5,
  className = "",
  src,
  alt,
  style,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !imageRef.current) return;
      if (getPrefersReducedMotion()) return;

      const distance = speed * 100;

      gsap.fromTo(
        imageRef.current,
        { y: distance },
        {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: containerRef, dependencies: [speed] },
  );

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ position: "relative", ...style }}
    >
      <div
        ref={imageRef}
        style={{
          position: "absolute",
          inset: "-20%",
          width: "140%",
          height: "140%",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}
