import type { Metadata } from "next";
import { Landmark, ClipboardList, Bot, Globe, Zap, Wrench, Package } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader, FeatureCard } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About — Bhavya Foundation",
  description: "Learn about Bhavya Foundation's institutional structure, governance model, and commitment to long-term impact.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Header currentPath="/about" />
      <main id="main-content">
        <PageHero
          badge="INSTITUTIONAL OVERVIEW"
          title="A Foundation Built for the Long Term"
          lead="Bhavya Foundation is registered as a non-profit trust committed to nature conservation, cultural heritage preservation, open knowledge, and community empowerment."
        />

        <div className="container">
          <SectionHeader eyebrow="Our Structure" title="Institutional Framework" />
          <div className="grid-2" style={{ marginBottom: "64px" }}>
            <FeatureCard icon={<Landmark />} title="Governing Trust" description="The Foundation operates under a governing trust deed that mandates radical transparency, vendor independence, and immutable decision logging as core institutional principles." />
            <FeatureCard icon={<ClipboardList />} title="Architecture Board" description="All technical and governance decisions pass through the Architecture Board, which maintains ADRs, capability contracts, and the institutional knowledge graph." />
            <FeatureCard icon={<Bot />} title="AI Agent Framework" description="Autonomous AI agents handle documentation, governance, release engineering, and specialized domain tasks under human oversight using the Bhavya Runtime." />
            <FeatureCard icon={<Globe />} title="Open Community" description="All software, standards, and governance data are open-source. The Foundation operates without proprietary lock-in, ensuring long-term institutional independence." />
          </div>

          <div className="grid-3" style={{ marginBottom: "64px" }}>
            <div className="stat-box">
              <div className="stat-number primary">100%</div>
              <div className="stat-label">Open Source Code</div>
            </div>
            <div className="stat-box">
              <div className="stat-number blue">9</div>
              <div className="stat-label">Active Mission Apps</div>
            </div>
            <div className="stat-box">
              <div className="stat-number purple">14k+</div>
              <div className="stat-label">Hectares Under Protection</div>
            </div>
          </div>

          <SectionHeader eyebrow="Technology Stack" title="Built on Bhavya OS" />
          <p className="section-desc">
            The entire platform runs on Bhavya OS — an AI-native software development runtime providing deterministic context loading, knowledge graphs, autonomous planning, and multi-agent orchestration.
          </p>
          <div className="grid-3">
            <FeatureCard icon={<Zap />} title="Runtime v3.0 Stable" description="The core runtime is frozen at v3.0 with CLI, planner, executor, orchestrator, API, metrics, and compatibility snapshots." />
            <FeatureCard icon={<Wrench />} title="Mission Runtime v0.6" description="Shared application services including auth, permissions, content, navigation, search, audit, documents, media, localization, and notifications." />
            <FeatureCard icon={<Package />} title="SDK Layer" description="Public API wrappers at @bhavya/sdk provide typed interfaces for all mission applications consuming the runtime." />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
