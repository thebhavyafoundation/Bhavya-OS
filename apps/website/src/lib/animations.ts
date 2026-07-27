import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Fade In on Scroll ─────────────────────────────────────── */
export function useGsapFadeIn(options?: {
  delay?: number;
  duration?: number;
  y?: number;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    gsap.fromTo(
      el,
      { opacity: 0, y: options?.y ?? options?.distance ?? 40 },
      {
        opacity: 1,
        y: 0,
        duration: options?.duration ?? 0.9,
        delay: options?.delay ?? 0,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [options?.delay, options?.duration, options?.y, options?.distance]);

  return ref;
}

/* ── Staggered Children ────────────────────────────────────── */
export function useGsapStagger(
  count: number,
  options?: { delay?: number; duration?: number; stagger?: number; y?: number },
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const children = Array.from(containerRef.current.children);
    if (children.length === 0) return;

    gsap.fromTo(
      children,
      { opacity: 0, y: options?.y ?? 48, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: options?.duration ?? 0.8,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 82%",
          once: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [count, options?.delay, options?.duration, options?.stagger, options?.y]);

  return containerRef;
}

/* ── Hero Timeline ─────────────────────────────────────────── */
export function useGsapHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      heroRef.current.querySelector(".hero-badge"),
      { opacity: 0, y: 24, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7 },
    )
      .fromTo(
        heroRef.current.querySelector(".hero-title"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.35",
      )
      .fromTo(
        heroRef.current.querySelector(".hero-desc"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5",
      )
      .fromTo(
        heroRef.current.querySelector(".hero-actions"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.35",
      )
      .fromTo(
        heroRef.current.querySelector(".hero-proof"),
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2",
      )
      .fromTo(
        heroRef.current.querySelector(".mission-field"),
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power2.out" },
        "-=0.9",
      );

    return () => {
      tl.kill();
    };
  }, []);

  return heroRef;
}

/* ── Parallax Scroll ───────────────────────────────────────── */
export function useGsapParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    gsap.to(el, {
      y: () => speed * 120,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [speed]);

  return ref;
}

/* ── Count Up Animation ────────────────────────────────────── */
export function useGsapCountUp(end: number, duration: number = 2.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const obj = { value: 0 };
    gsap.to(obj, {
      value: end,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.value).toLocaleString();
        }
      },
      scrollTrigger: {
        trigger: ref.current,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [end, duration]);

  return ref;
}

/* ── Magnetic Button Effect ────────────────────────────────── */
export function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(ref.current, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    [strength],
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref as React.RefObject<HTMLElement>;
}

/* ── Reveal on Scroll (CSS class-based) ────────────────────── */
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => el.classList.add("visible"),
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return ref;
}
