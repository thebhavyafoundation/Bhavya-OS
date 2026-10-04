"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 1600;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));

      if (progress >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          onComplete();
        }, 400);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-primary)",
        zIndex: 10000,
        transition: "opacity 0.4s ease",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 400,
            color: "var(--color-accent-gold)",
            lineHeight: 1,
          }}
        >
          {count.toString().padStart(3, "0")}
        </div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-secondary)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: "var(--space-4)",
          }}
        >
          Bhavya Foundation
        </div>
      </div>
    </div>
  );
}

export function CinematicSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const content = contentRef.current;

    gsap.fromTo(
      content,
      { opacity: 0, y: 60, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        },
      }
    );

    gsap.to(content, {
      opacity: 0.3,
      scale: 0.97,
      filter: "blur(4px)",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "bottom 40%",
        end: "bottom 15%",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className={className} id={id}>
      <div ref={contentRef}>{children}</div>
    </section>
  );
}

export function VelocityMarquee({
  children,
  speed = 60,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [skew, setSkew] = useState(0);

  useEffect(() => {
    let velocity = 0;
    let lastScroll = 0;

    const handleScroll = () => {
      const now = Date.now();
      const scroll = window.scrollY;
      const dt = now - lastScroll;
      if (dt > 0) {
        velocity = (scroll - lastScroll) / dt;
        lastScroll = now;
      }
    };

    const animate = () => {
      const targetSkew = Math.max(-8, Math.min(8, velocity * 0.4));
      setSkew((prev) => prev + (targetSkew - prev) * 0.08);
      requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "inline-block",
          transform: `skewY(${skew}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
