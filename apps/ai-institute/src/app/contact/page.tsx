import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Bhavya Foundation",
  description:
    "Get in touch with Bhavya Foundation. Reach our institutional team for partnerships, inquiries, and general correspondence.",
};

export default function ContactPage() {
  return (
    <>
      <div>
        {/* Hero */}
        <section
          className="section-cream"
          style={{
            paddingTop: "var(--space-32)",
            paddingBottom: "var(--space-16)",
          }}
        >
          <div className="container-narrow" style={{ textAlign: "center" }}>
            <p className="editorial-label">Get in Touch</p>
            <h1
              className="editorial-heading"
              style={{
                fontSize: "var(--text-5xl)",
                marginTop: "var(--space-4)",
              }}
            >
              Contact Bhavya Foundation
            </h1>
            <p
              className="editorial-lead"
              style={{
                marginTop: "var(--space-6)",
                maxWidth: "600px",
                marginInline: "auto",
              }}
            >
              We welcome inquiries from individuals, institutions, and
              organizations who share our commitment to nature, knowledge,
              heritage, and community.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section
          className="section-ivory"
          style={{ padding: "var(--space-16) 0" }}
        >
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "var(--space-8)",
              }}
            >
              {/* General Inquiries */}
              <div
                style={{
                  padding: "var(--space-8)",
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 600,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  General Inquiries
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: "var(--space-4)",
                  }}
                >
                  For general questions about Bhavya Foundation, our mission, or
                  our work.
                </p>
                <a
                  href="mailto:info@bhavyafoundation.org"
                  style={{
                    color: "var(--color-accent-gold)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  info@bhavyafoundation.org
                </a>
              </div>

              {/* Partnerships */}
              <div
                style={{
                  padding: "var(--space-8)",
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 600,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  Partnerships & Collaboration
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: "var(--space-4)",
                  }}
                >
                  Interested in partnering with us or collaborating on
                  institutional projects.
                </p>
                <a
                  href="mailto:partnerships@bhavyafoundation.org"
                  style={{
                    color: "var(--color-accent-gold)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  partnerships@bhavyafoundation.org
                </a>
              </div>

              {/* Media & Press */}
              <div
                style={{
                  padding: "var(--space-8)",
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 600,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  Media & Press
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: "var(--space-4)",
                  }}
                >
                  For media inquiries, press releases, and official
                  communications.
                </p>
                <a
                  href="mailto:press@bhavyafoundation.org"
                  style={{
                    color: "var(--color-accent-gold)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  press@bhavyafoundation.org
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section
          className="section-cream"
          style={{ padding: "var(--space-16) 0" }}
        >
          <div className="container-narrow">
            <div
              style={{
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <h2
                className="editorial-heading"
                style={{ fontSize: "var(--text-3xl)" }}
              >
                Institutional Correspondence
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  marginTop: "var(--space-4)",
                }}
              >
                For official institutional correspondence, legal matters, or
                formal communications, please reach out through the appropriate
                channel above. We respond to all inquiries within a reasonable
                timeframe.
              </p>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  marginTop: "var(--space-4)",
                }}
              >
                Bhavya Foundation is a public charitable trust committed to
                transparency and accountability. All official documents are
                available through our governance portal.
              </p>
              <a
                href="/transparency"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginTop: "var(--space-6)",
                  padding: "var(--space-3) var(--space-6)",
                  background: "var(--color-brand-forest)",
                  color: "var(--color-text-inverse)",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 600,
                  fontSize: "var(--text-sm)",
                  textDecoration: "none",
                  transition: "all var(--duration-fast) ease",
                }}
              >
                View Governance Portal
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
