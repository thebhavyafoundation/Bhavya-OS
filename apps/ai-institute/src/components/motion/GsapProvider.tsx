"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GsapProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({
        toggleActions: "play none none reverse",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

export function useScrollTrigger(
  ref: React.RefObject<HTMLElement | null>,
  options: ScrollTrigger.Vars,
) {
  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      ...options,
    });

    return () => trigger.kill();
  }, [ref, options]);
}

export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  speed: number = 0.5,
) {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const yPercent = speed * 100;

    const tween = gsap.to(element, {
      yPercent: -yPercent,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, speed]);
}

export function useFadeInUp(
  ref: React.RefObject<HTMLElement | null>,
  options: { delay?: number; duration?: number; stagger?: number } = {},
) {
  const { delay = 0, duration = 0.8, stagger = 0 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const children = ref.current.querySelectorAll("[data-animate]");
    const targets = children.length > 0 ? children : [ref.current];

    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, delay, duration, stagger]);
}

export function useScaleIn(
  ref: React.RefObject<HTMLElement | null>,
  options: { delay?: number; duration?: number } = {},
) {
  const { delay = 0, duration = 0.6 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const tween = gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, delay, duration]);
}

export function useStaggerReveal(
  ref: React.RefObject<HTMLElement | null>,
  options: { delay?: number; duration?: number; stagger?: number } = {},
) {
  const { delay = 0, duration = 0.6, stagger = 0.1 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const children = ref.current.querySelectorAll("[data-stagger]");
    if (children.length === 0) return;

    const tween = gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, delay, duration, stagger]);
}

export { gsap, ScrollTrigger };
