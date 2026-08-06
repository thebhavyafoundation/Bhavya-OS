import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Disclosures — Bhavya Foundation",
  description: "Annual reports, audit findings, and financial statements.",
};

export default function FinancialsPage() {
  return (
    <main id="main-content" role="main">
      <section className="container">
        <div className="section-group">
          <p className="section-eyebrow">Transparency Portal</p>
          <h1 className="section-title">Financial Disclosures</h1>
          <p className="section-desc">
            Complete access to financial statements, audit reports, and annual
            disclosures.
          </p>
        </div>

        <div className="grid-2">
          <div className="card">
            <h2>Annual Reports</h2>
            <p>Comprehensive annual reports covering all activities and finances.</p>
          </div>
          <div className="card">
            <h2>Audit Reports</h2>
            <p>Independent audit findings and compliance assessments.</p>
          </div>
          <div className="card">
            <h2>Financial Statements</h2>
            <p>Detailed financial statements for all fiscal years.</p>
          </div>
          <div className="card">
            <h2>Impact Reports</h2>
            <p>Measurable outcomes and community impact assessments.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
