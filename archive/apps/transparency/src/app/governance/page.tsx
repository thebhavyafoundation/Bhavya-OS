import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance — Bhavya Foundation",
  description: "Board composition, trust deed, and constitutional framework.",
};

export default function GovernancePage() {
  return (
    <main id="main-content" role="main">
      <section className="container">
        <div className="section-group">
          <p className="section-eyebrow">Transparency Portal</p>
          <h1 className="section-title">Governance</h1>
          <p className="section-desc">
            Board composition, trust deed, and constitutional framework.
          </p>
        </div>

        <div className="grid-2">
          <div className="card">
            <h2>Board of Trustees</h2>
            <p>Governing body composition and roles.</p>
          </div>
          <div className="card">
            <h2>Trust Deed</h2>
            <p>Legal framework establishing the Foundation.</p>
          </div>
          <div className="card">
            <h2>Constitution</h2>
            <p>14 Parts, 11 Values governing all decisions.</p>
          </div>
          <div className="card">
            <h2>Committees</h2>
            <p>Specialized committees and their mandates.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
