import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies — Bhavya Foundation",
  description: "Organizational policies and compliance documentation.",
};

export default function PoliciesPage() {
  return (
    <main id="main-content" role="main">
      <section className="container">
        <div className="section-group">
          <p className="section-eyebrow">Transparency Portal</p>
          <h1 className="section-title">Policies</h1>
          <p className="section-desc">
            Organizational policies and compliance documentation.
          </p>
        </div>

        <div className="grid-2">
          <div className="card">
            <h2>Governance Policy</h2>
            <p>Board governance and decision-making framework.</p>
          </div>
          <div className="card">
            <h2>Financial Policy</h2>
            <p>Financial management and accountability standards.</p>
          </div>
          <div className="card">
            <h2>HR Policy</h2>
            <p>Human resources management and volunteer guidelines.</p>
          </div>
          <div className="card">
            <h2>Data Policy</h2>
            <p>Data protection and privacy compliance.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
