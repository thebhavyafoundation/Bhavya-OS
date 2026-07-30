"use client";

import { useGsapStagger } from "../lib/animations";
import { ArrowRight, TreePine, GraduationCap, HandHeart } from "lucide-react";

const programs = [
  {
    eyebrow: "BHAVYA FOREST MISSION",
    value: "Native Plantation",
    description:
      "Forest restoration using indigenous species, watershed protection, biodiversity documentation, and community-led conservation.",
    link: "/nature",
    linkText: "View Forest Programmes",
    icon: <TreePine size={20} />,
    color: "var(--forest-600)",
  },
  {
    eyebrow: "BHAVYA AI LABS",
    value: "AI Education",
    description:
      "Free, offline-first AI education for children in rural Himachal Pradesh and beyond. Learn AI, programming, robotics, and more.",
    link: "https://bhavya-foundation-bhavya-ai-lab.vercel.app",
    linkText: "Visit Bhavya AI Lab",
    icon: <GraduationCap size={20} />,
    color: "var(--earth-600)",
  },
  {
    eyebrow: "BHAVYA VOLUNTEER CORPS",
    value: "Open Enrollment",
    description:
      "Join field conservation teams, digital literacy programmes, heritage documentation, and community development initiatives.",
    link: "/community",
    linkText: "Apply as a Volunteer",
    icon: <HandHeart size={20} />,
    color: "var(--gold-600)",
  },
];

export function CTASection() {
  const containerRef = useGsapStagger(programs.length);

  return (
    <section className="container" aria-labelledby="programs-heading">
      <div className="section-group">
        <p className="section-eyebrow">Active Programmes</p>
        <h2 className="section-title">Field Operations & Initiatives</h2>
        <p className="section-desc">
          From forest restoration to AI education, our programmes serve
          communities across India.
        </p>
      </div>
      <div className="grid-3" ref={containerRef}>
        {programs.map((program, i) => (
          <div key={i} className="card" style={{ textAlign: "left" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "var(--primary-subtle)",
                border: "1px solid rgba(21, 128, 61, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: program.color,
                marginBottom: "var(--space-5)",
              }}
            >
              {program.icon}
            </div>
            <div className="stat-eyebrow">{program.eyebrow}</div>
            <h3
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: program.color,
                letterSpacing: "-0.02em",
                marginBottom: "var(--space-3)",
              }}
            >
              {program.value}
            </h3>
            <p className="stat-description">{program.description}</p>
            <a
              href={program.link}
              className="stat-link"
              style={{
                color: program.color,
                marginTop: "var(--space-4)",
                display: "inline-flex",
              }}
            >
              {program.linkText}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
