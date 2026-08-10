import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparency Portal — Bhavya Foundation",
  description:
    "Public access to Bhavya Foundation's governance, financial disclosures, and impact reports.",
};

export default function TransparencyPage() {
  return (
    <main id="main-content" role="main">
      <section className="container">
        <div className="section-group">
          <p className="section-eyebrow">Transparency Portal</p>
          <h1 className="section-title">Public Disclosures</h1>
          <p className="section-desc">
            Complete access to governance, financials, and impact reports.
          </p>
        </div>

        <div className="grid-2">
          <a href="/transparency/financials" className="card">
            <h2>Financial Disclosures</h2>
            <p>Annual reports, audit findings, and financial statements.</p>
          </a>
          <a href="/transparency/governance" className="card">
            <h2>Governance</h2>
            <p>Board composition, trust deed, and constitutional framework.</p>
          </a>
          <a href="/transparency/projects" className="card">
            <h2>Project Updates</h2>
            <p>Current initiatives, milestones, and impact reports.</p>
          </a>
          <a href="/transparency/policies" className="card">
            <h2>Policies</h2>
            <p>Organizational policies and compliance documentation.</p>
          </a>
        </div>
      </section>
    </main>
  );
}
