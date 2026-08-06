"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";

function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="hero-particles" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="hero-particle"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0.5],
            y: [0, -120 - Math.random() * 80],
            x: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: `${10 + Math.random() * 30}%`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mountainsFarY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const mountainsMidY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const mountainsNearY = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const fogOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      mouseX.set(x * 20);
    },
    [mouseX],
  );

  return (
    <section
      ref={sectionRef}
      className="hero-section hero-cinematic"
      aria-labelledby="hero-heading"
      onMouseMove={handleMouseMove}
    >
      {/* Layered mountain landscape */}
      <div className="hero-landscape" aria-hidden="true">
        {/* Sky gradient */}
        <div className="hero-sky" />

        {/* Sun glow */}
        <motion.div
          className="hero-sun"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Far mountains */}
        <motion.div
          className="hero-mountains hero-mountains-far"
          style={{ y: mountainsFarY, x: springX }}
        >
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,224 L48,213 C96,203,192,181,288,186 C384,192,480,224,576,218 C672,213,768,171,864,165 C960,160,1056,192,1152,197 C1248,203,1344,181,1392,171 L1440,160 L1440,320 L0,320Z"
              fill="rgba(5,46,22,0.15)"
            />
          </svg>
        </motion.div>

        {/* Mid mountains */}
        <motion.div
          className="hero-mountains hero-mountains-mid"
          style={{ y: mountainsMidY, x: useTransform(springX, (v) => v * 0.5) }}
        >
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,256 L60,240 C120,224,240,192,360,197 C480,203,600,245,720,250 C840,256,960,224,1080,213 C1200,203,1320,213,1380,219 L1440,224 L1440,320 L0,320Z"
              fill="rgba(5,46,22,0.3)"
            />
          </svg>
        </motion.div>

        {/* Near mountains */}
        <motion.div
          className="hero-mountains hero-mountains-near"
          style={{ y: mountainsNearY }}
        >
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,288 L80,272 C160,256,320,224,480,229 C640,235,800,277,960,282 C1120,288,1280,256,1360,240 L1440,224 L1440,320 L0,320Z"
              fill="rgba(5,46,22,0.5)"
            />
          </svg>
        </motion.div>

        {/* Atmospheric fog */}
        <motion.div className="hero-fog" style={{ opacity: fogOpacity }} />

        {/* Trees silhouette */}
        <div className="hero-trees">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            {Array.from({ length: 30 }).map((_, i) => {
              const x = (i / 30) * 1440 + Math.sin(i * 2.7) * 15;
              const h = 40 + Math.sin(i * 1.3) * 25;
              return (
                <polygon
                  key={i}
                  points={`${x},120 ${x - 8 - h * 0.15},${120 - h} ${x + 8 + h * 0.15},${120 - h}`}
                  fill="rgba(5,46,22,0.7)"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Particles */}
      <Particles />

      {/* Content */}
      <motion.div
        className="hero-cinematic-content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Shield size={12} />
          Public Charitable Trust
        </motion.div>

        <h1 id="hero-heading" className="hero-title hero-title-animated">
          <motion.span
            className="hero-title-line"
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Restoring
          </motion.span>
          <motion.span
            className="hero-title-line"
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            nature.
          </motion.span>
          <motion.span
            className="hero-title-line"
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Empowering <span className="highlight">humanity.</span>
          </motion.span>
        </h1>

        <motion.p
          className="hero-desc"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          Free AI education for rural India. Restoring forests, preserving
          heritage, and building communities. 13 levels. 78 modules. 331
          knowledge packages — designed for generations.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="/knowledge" className="btn btn-primary">
            Start Learning
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a href="/knowledge#packages" className="btn btn-secondary">
            Explore Knowledge Packages
          </a>
          <a href="/transparency" className="btn btn-secondary">
            View Transparency Portal
          </a>
        </motion.div>

        <motion.div
          className="hero-proof"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          aria-label="Foundation stats"
        >
          <span>
            <i /> 13 Levels · 78 Modules
          </span>
          <span>
            <i /> 331 Knowledge Packages
          </span>
          <span>
            <i /> 594 Production Days
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        aria-hidden="true"
      >
        <motion.div
          className="hero-scroll-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
