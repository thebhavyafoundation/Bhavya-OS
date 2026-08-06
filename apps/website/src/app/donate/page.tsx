import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SkipNavigation } from "../../components/SkipNavigation";
import { DonationForm } from "../../components/DonationForm";
import { buildMetadata } from "../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Donate — Bhavya Foundation",
  description:
    "Support Bhavya Foundation's missions. Your donation helps restore nature, empower communities, and preserve heritage.",
  path: "/donate",
});

export default function DonatePage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/donate" />
      <main id="main-content" role="main">
        <section className="container">
          <div className="section-group">
            <p className="section-eyebrow">Support Our Mission</p>
            <h1 className="section-title">Donate to Bhavya Foundation</h1>
            <p className="section-desc">
              Your contribution helps us restore forests, provide AI education,
              preserve heritage, and build communities across India.
            </p>
          </div>

          <div className="grid-2">
            <div>
              <DonationForm />
            </div>
            <div>
              <div className="card">
                <h2>Your Impact</h2>
                <ul>
                  <li>₹100 plants 10 native trees</li>
                  <li>₹500 supports 1 child for a month</li>
                  <li>₹1,000 documents 1 heritage site</li>
                  <li>₹5,000 establishes 1 AI lab</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
