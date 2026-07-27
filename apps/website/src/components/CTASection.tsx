"use client";

import { useGsapStagger } from "../lib/animations";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    eyebrow: "BHAVYA FOREST MISSION",
    value: "Native Plantation",
    description:
      "Forest restoration using indigenous species, watershed protection, biodiversity documentation, and community-led conservation.",
    link: "/nature",
    linkText: "View Forest Programmes",
    color: "var(--forest-700)",
  },
  {
    eyebrow: "BHAVYA AI LABS",
    value: "AI Education",
    description:
      "Computer education, AI literacy, coding workshops, digital libraries, and innovation challenges in rural communities.",
    link: "/knowledge",
    linkText: "View Knowledge Programmes",
    color: "var(--earth-600)",
  },
  {
    eyebrow: "BHAVYA VOLUNTEER CORPS",
    value: "Open Enrollment",
    description:
      "Join field conservation teams, digital literacy programmes, heritage documentation, and community development initiatives.",
    link: "/community",
    linkText: "Apply as a Volunteer",
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
          <div key={i} className="stat-box" style={{ textAlign: "left" }}>
            <div className="stat-eyebrow">{program.eyebrow}</div>
            <div
              className="stat-number"
              style={{ fontSize: "22px", color: program.color }}
            >
              {program.value}
            </div>
            <p className="stat-description">{program.description}</p>
            <a
              href={program.link}
              className="stat-link"
              style={{ color: program.color }}
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
