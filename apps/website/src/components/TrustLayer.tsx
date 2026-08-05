"use client";

import { useGsapStagger } from "../lib/animations";
import {
  ArrowRight,
  BookCheck,
  FlaskConical,
  Map,
  BarChart3,
} from "lucide-react";

const trustItems = [
  {
    icon: <BookCheck size={20} />,
    title: "Constitution",
    description:
      "14 Parts, 11 Values — the governance framework that guides every decision.",
    link: "/mission",
    linkText: "Read the Constitution",
    color: "var(--primary)",
  },
  {
    icon: <FlaskConical size={20} />,
    title: "Engineering Standards",
    description:
      "10 Quality Gates, 26 Production Metrics, research-backed decisions. Every line of code earns its place.",
    link: "/about",
    linkText: "View Engineering Standards",
    color: "var(--earth-600)",
  },
  {
    icon: <Map size={20} />,
    title: "Public Roadmap",
    description:
      "Open governance, published priorities, and community input on every initiative.",
    link: "/transparency",
    linkText: "View Roadmap",
    color: "var(--gold-600)",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Live Metrics",
    description:
      "Real-time financials, programme outcomes, and institutional health — always public.",
    link: "/transparency/financials",
    linkText: "See the Numbers",
    color: "var(--forest-600)",
  },
];

export function TrustLayer() {
  const containerRef = useGsapStagger(trustItems.length);

  return (
    <section className="container" aria-labelledby="trust-heading">
      <div className="section-group">
        <p className="section-eyebrow">Built for Generations</p>
        <h2 className="section-title">Transparency Is Not Optional</h2>
        <p className="section-desc">
          Every decision is traceable. Every metric is public. Every commitment
          is constitutional.
        </p>
      </div>
      <div className="grid-2" ref={containerRef}>
        {trustItems.map((item, i) => (
          <a
            key={i}
            href={item.link}
            className="card"
            style={{
              textDecoration: "none",
              color: "inherit",
              textAlign: "left",
            }}
          >
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
                color: item.color,
                marginBottom: "var(--space-5)",
              }}
            >
              {item.icon}
            </div>
            <h3
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: item.color,
                letterSpacing: "-0.02em",
                marginBottom: "var(--space-3)",
              }}
            >
              {item.title}
            </h3>
            <p className="stat-description">{item.description}</p>
            <span
              className="stat-link"
              style={{
                color: item.color,
                marginTop: "var(--space-4)",
                display: "inline-flex",
              }}
            >
              {item.linkText}
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
