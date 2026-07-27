"use client";

import { useGsapStagger } from "../lib/animations";
import { Eye, TrendingUp, FlaskConical, Users, Shield } from "lucide-react";

const principles = [
  {
    icon: <Eye size={18} />,
    title: "Radical Transparency",
    desc: "Open governance, published finances, and public accountability in every decision.",
  },
  {
    icon: <TrendingUp size={18} />,
    title: "Long-term Stewardship",
    desc: "Building institutions for generations, not projects for headlines.",
  },
  {
    icon: <FlaskConical size={18} />,
    title: "Evidence-Based Action",
    desc: "Scientific conservation, measured outcomes, and data-driven education.",
  },
  {
    icon: <Users size={18} />,
    title: "Community Ownership",
    desc: "Open participation, local leadership, and shared responsibility.",
  },
  {
    icon: <Shield size={18} />,
    title: "Ethical Leadership",
    desc: "Public accountability, constitutional commitments, and unwavering integrity.",
  },
];

export function PrinciplesSection() {
  const containerRef = useGsapStagger(principles.length);

  return (
    <section className="container" aria-labelledby="principles-heading">
      <div className="section-group">
        <p className="section-eyebrow">Guiding Principles</p>
        <h2 className="section-title">How We Serve</h2>
        <p className="section-desc">
          Every decision of the Foundation is guided by constitutional
          principles, ethical commitments, and a duty to future generations.
        </p>
      </div>
      <div
        ref={containerRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {principles.map((p, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: "var(--space-6)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                background: "var(--primary-subtle)",
                border: "1px solid rgba(21, 128, 61, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
              }}
            >
              {p.icon}
            </div>
            <h3
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
              }}
            >
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
