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
                <p>
                  Your contribution directly supports our missions across forest
                  restoration, AI education, heritage preservation, and community
                  building. Impact details will be published as projects progress.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
