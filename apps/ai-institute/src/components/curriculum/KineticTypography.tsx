"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "@/lib/motion/apple-springs";

gsap.registerPlugin(SplitText);

interface KineticTypographyProps {
  children: React.ReactNode;
  type?:
    | "chars"
    | "words"
    | "lines"
    | "chars words"
    | "words lines"
    | "chars words lines";
  stagger?: number;
  duration?: number;
  ease?: string;
  scrollTrigger?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  style?: React.CSSProperties;
  delay?: number;
  from?: {
    opacity?: number;
    y?: number;
    x?: number;
    rotate?: number;
    scale?: number;
  };
  to?: {
    opacity?: number;
    y?: number;
    x?: number;
    rotate?: number;
    scale?: number;
  };
}

const TagMap = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  span: "span",
  div: "div",
} as const;
type KineticTag = keyof typeof TagMap;

const defaultFrom = { opacity: 0, y: 30 };
const defaultTo = { opacity: 1, y: 0 };

export function KineticTypography({
  children,
  type = "chars",
  stagger = 0.03,
  duration = 0.8,
  ease = "power3.out",
  scrollTrigger = false,
  className = "",
  as = "h1",
  style,
  delay = 0,
  from = defaultFrom,
  to = defaultTo,
}: KineticTypographyProps) {
  const elementRef = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const [isVisible, setIsVisible] = useState(!scrollTrigger);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!elementRef.current) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    const split = new SplitText(elementRef.current, {
      type: type as "chars,words,lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
    });
    splitRef.current = split;

    const targets = split[type as "chars" | "words" | "lines"];
    gsap.set(targets, {
      opacity: from.opacity ?? 0,
      y: from.y ?? 0,
      x: from.x ?? 0,
      rotation: from.rotate ?? 0,
      scale: from.scale ?? 1,
      force3D: true,
    });

    const animate = () => {
      gsap.to(targets, {
        opacity: to.opacity ?? 1,
        y: to.y ?? 0,
        x: to.x ?? 0,
        rotation: to.rotate ?? 0,
        scale: to.scale ?? 1,
        duration,
        ease,
        stagger,
        delay,
        force3D: true,
        onComplete: () => {
          targets.forEach((el) => {
            (el as HTMLElement).style.transform = "";
            (el as HTMLElement).style.opacity = "";
          });
        },
      });
    };

    if (scrollTrigger) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px", threshold: 0.1 },
      );

      observer.observe(elementRef.current!);
      return () => observer.disconnect();
    } else {
      const timer = setTimeout(animate, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [scrollTrigger]);

  useEffect(() => {
    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setIsVisible(true);
    }
  }, [prefersReduced]);

  const Tag = TagMap[as ?? "h1"];

  if (!isVisible && scrollTrigger) {
    return (
      <Tag
        ref={elementRef as React.RefObject<HTMLHeadingElement>}
        className={className}
        style={{ opacity: 0, transform: "translateY(30px)", ...style }}
        aria-hidden="true"
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={elementRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{
        ...style,
        ...(prefersReduced ? { opacity: 1, transform: "none" } : {}),
      }}
      aria-hidden={scrollTrigger ? false : true}
    >
      {children}
    </Tag>
  );
}
