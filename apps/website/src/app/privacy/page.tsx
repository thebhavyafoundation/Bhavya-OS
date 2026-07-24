import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — Bhavya Foundation",
  description: "Bhavya Foundation's privacy policy governing data collection, processing, storage, and user rights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Header currentPath="/privacy" />
      <main id="main-content">
        <PageHero
          badge="PRIVACY"
          title="Privacy Policy & Data Practices"
          lead="Bhavya Foundation is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information."
        />

        <div className="container">
          <div className="content-page">
            <section className="content-section">
              <h2>Information We Collect</h2>
              <p>We collect only the information you voluntarily provide through our contact forms, volunteer registration, and communication channels. This may include your name, email address, and areas of interest.</p>
            </section>

            <section className="content-section">
              <h2>How We Use Your Information</h2>
              <p>Your information is used solely for the purpose for which it was provided: processing volunteer applications, responding to inquiries, and communicating about Foundation programs. We do not sell, rent, or share your personal data with third parties.</p>
            </section>

            <section className="content-section">
              <h2>Data Retention</h2>
              <p>Personal data is retained only as long as necessary to fulfill the purpose for which it was collected. You may request deletion of your data at any time by contacting us through the Community page.</p>
            </section>

            <section className="content-section">
              <h2>Cookies</h2>
              <p>We use a minimal cookie to remember your language preference. No tracking cookies, analytics cookies, or third-party cookies are used. Our website functions fully without cookie consent.</p>
            </section>

            <section className="content-section">
              <h2>Data Security</h2>
              <p>All data transmitted to our servers is encrypted in transit. We follow industry best practices for data storage and access control.</p>
            </section>

            <section className="content-section">
              <h2>Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us through the Community page.</p>
            </section>

            <p className="content-meta">Last updated: 2026-07-23</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
