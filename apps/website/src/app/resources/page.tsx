import type { Metadata } from "next";
import { ArrowRight, ChevronDown, ScanLine } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ResourceLibrary } from "../../components/ResourceLibrary";
import { buildMetadata } from "../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Bhavya AI Lab — Resources for a more capable future",
  description:
    "Field notes, playbooks, and research from Bhavya AI Lab — making AI more useful, accessible, and human.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <>
      <Header currentPath="/resources" />
      <main id="main-content" className="lab-page">
        <section className="lab-hero" aria-labelledby="lab-title">
          <div className="lab-hero-orbit orbit-a" aria-hidden="true" />
          <div className="lab-hero-orbit orbit-b" aria-hidden="true" />
          <div className="lab-hero-grid" aria-hidden="true" />
          <div className="lab-hero-copy">
            <div className="lab-mark"><ScanLine size={16} aria-hidden="true" /> BHAVYA AI LAB <span>01</span></div>
            <h1 id="lab-title">Make the future<br /><em>more human.</em></h1>
            <p>
              A living library for people who want to understand AI, use it
              with intention, and build what comes next.
            </p>
            <div className="lab-hero-actions">
              <a className="lab-button lab-button-primary" href="#resource-grid">Explore the library <ArrowRight size={17} aria-hidden="true" /></a>
              <a className="lab-text-link" href="#manifesto">Read our manifesto <ChevronDown size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="lab-signal-card" aria-label="Bhavya AI Lab signal">
            <div className="lab-signal-header"><span className="signal-live" /> LAB SIGNAL / 28.07.26</div>
            <div className="lab-signal-visual"><div className="signal-core">B</div><div className="signal-ring ring-one" /><div className="signal-ring ring-two" /><span className="signal-label label-one">curiosity</span><span className="signal-label label-two">agency</span><span className="signal-label label-three">care</span></div>
            <div className="lab-signal-footer"><span>01</span><strong>Useful intelligence<br />starts with listening.</strong><span>↗</span></div>
          </div>
        </section>

        <section className="lab-manifesto" id="manifesto" aria-labelledby="manifesto-title">
          <p className="lab-kicker">Our point of view</p>
          <h2 id="manifesto-title">AI should widen the circle<br />of who gets to <span>make.</span></h2>
          <p className="lab-manifesto-copy">Bhavya AI Lab is a public-interest studio for learning, experimentation, and responsible technology. We translate complexity into confidence — for classrooms, communities, and the curious.</p>
          <div className="lab-stat-row"><div><strong>03</strong><span>ways to go deeper</span></div><div><strong>∞</strong><span>questions welcome</span></div><div><strong>01</strong><span>shared future</span></div></div>
        </section>

        <ResourceLibrary />

        <section className="lab-cta" aria-labelledby="join-title">
          <div><p className="lab-kicker">Stay curious</p><h2 id="join-title">Bring a better question.</h2></div>
          <a className="lab-button lab-button-light" href="mailto:hello@bhavya.foundation">Join the lab <ArrowRight size={17} aria-hidden="true" /></a>
        </section>
      </main>
      <Footer />
    </>
  );
}
