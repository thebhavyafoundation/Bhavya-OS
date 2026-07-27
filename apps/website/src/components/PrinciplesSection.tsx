"use client";

import { useGsapStagger } from "../lib/animations";

const principles = [
  "Radical transparency in governance and finances",
  "Long-term stewardship over short-term gains",
  "Evidence-based conservation and education",
  "Open participation and community ownership",
  "Ethical leadership and public accountability",
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
      <div className="grid-auto" ref={containerRef}>
        {principles.map((p, i) => (
          <div key={i} className="info-card">
            <div className="info-card-title" style={{ fontSize: "14px" }}>
              {p}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
