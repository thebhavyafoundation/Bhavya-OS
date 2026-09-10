import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SkipNavigation } from "../../components/SkipNavigation";
import {
  PageHero,
  SectionHeader,
} from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";
import { PageContent, AnimatedGrid } from "../../components/PageContent";
import { Mail, Globe, Users, ExternalLink } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Bhavya Foundation",
  description:
    "Get in touch with Bhavya Foundation. Reach us via email, GitHub, or LinkedIn. We welcome inquiries, partnerships, and community engagement.",
  path: "/contact",
});

const contactMethods = [
  {
    icon: <Mail />,
    title: "Email",
    description: "For general inquiries, partnerships, and information.",
    href: "mailto:hello@bhavya.foundation",
    label: "hello@bhavya.foundation",
  },
  {
    icon: <Globe />,
    title: "GitHub",
    description: "Open source projects, contributions, and technical collaboration.",
    href: "https://github.com/thebhavyafoundation/Bhavya-OS",
    label: "github.com/thebhavyafoundation",
  },
  {
    icon: <Users />,
    title: "LinkedIn",
    description: "Professional networking, updates, and institutional announcements.",
    href: "https://linkedin.com/company/143079926/",
    label: "linkedin.com/company/bhavya-foundation",
  },
];

export default function ContactPage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/contact" />
      <main id="main-content">
        <PageHero
          badge="CONTACT"
          title="Get in Touch"
          lead="Bhavya Foundation welcomes inquiries, partnerships, and community engagement. Reach out through any of the channels below."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Contact Channels"
              title="How to Reach Us"
              description="Choose the channel that best fits your inquiry. We respond to all messages during business hours."
            />
          </PageContent>
          <AnimatedGrid columns={3}>
            {contactMethods.map((method, i) => (
              <a
                key={i}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div className="card">
                  <div className="card-icon" aria-hidden="true">{method.icon}</div>
                  <h3 className="card-title">{method.title}</h3>
                  <p className="card-desc">{method.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: "var(--primary)" }}>
                    <ExternalLink size={12} aria-hidden="true" />
                    {method.label}
                  </div>
                </div>
              </a>
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="About the Foundation"
                title="Bhavya Foundation"
              />
            </PageContent>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7 }}
              >
                Bhavya Foundation is established as an irrevocable Public
                Charitable Trust, existing exclusively for charitable purposes
                and for the benefit of the public without distinction. The
                Foundation operates across four permanent missions: Forest,
                Knowledge, Heritage, and Community.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Transparency"
                title="Public Information"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              <div className="info-card">
                <div className="info-card-title">Governance</div>
                <div className="info-card-desc">
                  Governance information, policies, and financial reports are
                  published on the Transparency page.
                </div>
                <a href="/transparency" style={{ fontSize: 13, color: "var(--primary)", marginTop: 8, display: "inline-block" }}>
                  View Transparency →
                </a>
              </div>
              <div className="info-card">
                <div className="info-card-title">Open Source</div>
                <div className="info-card-desc">
                  Our code, curriculum, and educational materials are published
                  openly on GitHub.
                </div>
                <a href="https://github.com/thebhavyafoundation/Bhavya-OS" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--primary)", marginTop: 8, display: "inline-block" }}>
                  Visit GitHub →
                </a>
              </div>
            </AnimatedGrid>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
