import type { Metadata } from "next";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FeatureCard, SectionHeader } from "../components/ui/PageHero";
import { getPlatformStatus } from "../services/status";
import { buildMetadata } from "../lib/metadata";
import { Leaf, BookOpen, Landmark, Users, ArrowRight, Activity } from "lucide-react";
import { MissionField } from "../components/home/MissionField";

export const metadata: Metadata = buildMetadata({
  title: "Bhavya Foundation — Nature, Knowledge, Heritage, Community",
  description: "Serving nature, knowledge, heritage and community with radical transparency.",
  path: "/",
});

const pillars = [
  { key: "nature", icon: <Leaf />, title: "Nature", href: "/nature", desc: "Protecting and restoring primary canopy forests, sacred groves, and biodiversity corridors using real-time satellite GIS telemetry." },
  { key: "knowledge", icon: <BookOpen />, title: "Knowledge", href: "/knowledge", desc: "Advancing open education, technical standards, and research access. Every governance decision and standard is machine-verifiable." },
  { key: "heritage", icon: <Landmark />, title: "Heritage", href: "/heritage", desc: "Preserving cultural history, oral traditions, manuscript archives, and historic architecture through high-precision 3D scanning." },
  { key: "community", icon: <Users />, title: "Community", href: "/community", desc: "Empowering thousands of field volunteers and citizens to participate in conservation and digital archiving through open, accessible portals." },
];

export default function WebsiteHomepage() {
  const status = getPlatformStatus();

  return (
    <>
      <Header currentPath="/" />
      <main id="main-content" role="main">
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-home">
            <div className="hero-copy">
              <div className="hero-badge" aria-hidden="true">
                <Activity size={12} />
                Bhavya OS {status.release} Active
              </div>
              <h1 id="hero-heading" className="hero-title">
                Build a future<br />worth <span className="highlight">inheriting.</span>
              </h1>
              <p className="hero-desc">
                An institutional platform for protecting nature, opening knowledge, preserving heritage, and giving communities the tools to shape what comes next.
              </p>
              <div className="hero-actions">
                <a href="/mission" className="btn btn-primary">
                  Explore Our Mission
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a href="/transparency" className="btn btn-secondary">
                  View Transparency Portal
                </a>
              </div>
              <div className="hero-proof" aria-label="Foundation operating principles">
                <span><i /> Radical transparency</span>
                <span><i /> Long-term stewardship</span>
                <span><i /> Open participation</span>
              </div>
            </div>
            <MissionField />
          </div>
        </section>

        <hr className="divider" />

        <section className="container" aria-labelledby="pillars-heading">
          <SectionHeader eyebrow="Institutional Scope" title="Four Pillars of Purpose" description="Click any pillar to explore its dedicated programs, live telemetry, and active field operations." />
          <div className="grid-2 reveal-grid" role="list">
            {pillars.map((pillar) => (
              <FeatureCard key={pillar.key} icon={pillar.icon} title={pillar.title} description={pillar.desc} href={pillar.href} />
            ))}
          </div>
        </section>

        <hr className="divider" />

        <section className="container" aria-labelledby="platform-heading">
          <SectionHeader eyebrow="Real-Time Platform" title="Institutional Services & Portals" />
          <div className="grid-3">
            <div className="stat-box" style={{ textAlign: "left" }}>
              <div className="stat-eyebrow">CURRENT RELEASE</div>
              <div className="stat-number primary">{status.release} Certified</div>
              <p className="stat-description">Built on Bhavya OS with modular mission runtime, explicit app manifests, and WCAG AA accessibility.</p>
              <a href="/mission" className="stat-link">
                Read Release Architecture
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="stat-box" style={{ textAlign: "left" }}>
              <div className="stat-eyebrow">COMMUNITY VOLUNTEERS</div>
              <div className="stat-number blue">Open Enrollment</div>
              <p className="stat-description">Join field conservation teams, manuscript digitization squads, or open-source software efforts.</p>
              <a href="/community" className="stat-link" style={{ color: "var(--blue)" }}>
                Apply as a Volunteer
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="stat-box" style={{ textAlign: "left" }}>
              <div className="stat-eyebrow">GOVERNANCE MONITOR</div>
              <div className="stat-number purple">{status.services.length} Services Active</div>
              <p className="stat-description">Live monitor tracking registered platform services, active agent roster, and architecture decision records.</p>
              <a href="/transparency" className="stat-link" style={{ color: "var(--purple)" }}>
                View Transparency Portal
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
