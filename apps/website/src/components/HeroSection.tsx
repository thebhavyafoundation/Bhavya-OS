"use client";

import { useGsapHero } from "../lib/animations";
import { ArrowRight, Shield } from "lucide-react";

export function HeroSection() {
  const heroRef = useGsapHero();

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-home" ref={heroRef}>
        <div className="hero-copy">
          <div className="hero-badge" style={{ opacity: 0 }}>
            <Shield size={12} />
            Public Charitable Trust
          </div>
          <h1 id="hero-heading" className="hero-title" style={{ opacity: 0 }}>
            Restoring nature.
            <br />
            Empowering <span className="highlight">humanity.</span>
          </h1>
          <p className="hero-desc" style={{ opacity: 0 }}>
            Bhavya Foundation exists to build institutions that endure —
            restoring forests, expanding knowledge, preserving heritage, and
            giving communities the tools to shape what comes next.
          </p>
          <div className="hero-actions" style={{ opacity: 0 }}>
            <a href="/mission" className="btn btn-primary">
              Explore Our Mission
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href="/transparency" className="btn btn-secondary">
              View Transparency Portal
            </a>
          </div>
          <div
            className="hero-proof"
            style={{ opacity: 0 }}
            aria-label="Foundation principles"
          >
            <span>
              <i /> Building for generations
            </span>
            <span>
              <i /> Nature. Knowledge. Heritage.
            </span>
            <span>
              <i /> Stewardship for tomorrow
            </span>
          </div>
        </div>
        <div className="mission-field" aria-hidden="true">
          <div className="mission-grid" />
          <div className="mission-orbit orbit-one" />
          <div className="mission-orbit orbit-two" />
          <div className="mission-orbit orbit-three" />
          <div className="mission-core">
            <span />
          </div>
          <div className="mission-signal signal-nature">
            <span /> FOREST
          </div>
          <div className="mission-signal signal-knowledge">
            <span /> KNOWLEDGE
          </div>
          <div className="mission-signal signal-community">
            <span /> COMMUNITY
          </div>
          <div className="mission-caption">
            <strong>Bhavya</strong> — Grand. Noble. Magnificent.
          </div>
        </div>
      </div>
    </section>
  );
}
