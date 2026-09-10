"use client";

import { useGsapStagger } from "../lib/animations";
import { ArrowRight } from "lucide-react";

const stats = [
  {
    eyebrow: "FOUNDER & MANAGING TRUSTEE",
    value: "Shri Manohar Lal",
    description:
      "Leading the Foundation with a vision to restore nature, empower communities, and build institutions worthy of future generations.",
    link: "/about",
    linkText: "Read the Founders Charter",
    color: "var(--forest-700)",
  },
  {
    eyebrow: "BOARD OF TRUSTEES",
    value: "Three Trustees",
    description:
      "Shri Manohar Lal (Founder), Smt. Kanta Devi, and Shri Kuldeep Sangal — governing with integrity, diligence, and independence.",
    link: "/about",
    linkText: "View Governance Structure",
    color: "var(--text)",
  },
  {
    eyebrow: "CONSTITUTIONAL COMMITMENTS",
    value: "12 Articles · 4 Missions",
    description:
      "Our Constitution establishes the governance, ethics, and operational framework that guides every decision of the Foundation.",
    link: "/mission",
    linkText: "Read the Constitution",
    color: "var(--gold-600)",
  },
];

export function StatsSection() {
  const containerRef = useGsapStagger(stats.length);

  return (
    <section className="container" aria-labelledby="about-heading">
      <div className="section-group">
        <p className="section-eyebrow">About the Foundation</p>
        <h2 className="section-title">Founded on Public Trust</h2>
        <p className="section-desc">
          Established as an irrevocable Public Charitable Trust, Bhavya
          Foundation is governed by a Board of Trustees committed to
          transparency, stewardship, and long-term impact.
        </p>
      </div>
      <div className="grid-3" ref={containerRef}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-box" style={{ textAlign: "left" }}>
            <div className="stat-eyebrow">{stat.eyebrow}</div>
            <div
              className="stat-number"
              style={{ fontSize: "var(--text-xl)", color: stat.color }}
            >
              {stat.value}
            </div>
            <p className="stat-description">{stat.description}</p>
            <a
              href={stat.link}
              className="stat-link"
              style={{ color: stat.color }}
            >
              {stat.linkText}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
