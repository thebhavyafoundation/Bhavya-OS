import type { Metadata } from "next";
import { Search, Shield, Brain, Sprout } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader, FeatureCard, StatBox } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Our Mission — Bhavya Foundation",
  description: "Bhavya Foundation's governing principles, institutional philosophy, and commitment to long-term impact across nature, knowledge, heritage, and community.",
  path: "/mission",
});

export default function MissionPage() {
  return (
    <>
      <Header currentPath="/mission" />
      <main id="main-content">
        <PageHero
          badge="INSTITUTIONAL PHILOSOPHY"
          title="Built for Generations, Operating with Radical Transparency"
          lead="Bhavya Foundation was established with a singular governing principle: to create an enduring institutional foundation that serves humanity and the natural world across generations."
        />

        <div className="container">
          <SectionHeader eyebrow="Core Directives" title="Governing Institutional Principles" />

          <div className="grid-2" style={{ marginBottom: "64px" }}>
            <FeatureCard icon={<Search />} title="1. Radical Transparency" description="Every institutional decision, architectural standard, financial flow, and operational policy is version-controlled and publicly verifiable in real time on our platform." />
            <FeatureCard icon={<Shield />} title="2. Vendor & Provider Agnosticism" description="We build on open-source standards and abstract interfaces (ADR-0002), ensuring institutional operations never depend on any single commercial vendor or proprietary platform." />
            <FeatureCard icon={<Brain />} title="3. Immutable Institutional Memory" description="Decisions are never lost or modified retroactively. Every Architecture Decision Record (ADR) and policy is immutable, forming an unalterable log of institutional evolution." />
            <FeatureCard icon={<Sprout />} title="4. Direct Impact Routing" description="Resources are routed directly to frontline canopy protection, research access, digital manuscript archiving, and volunteer mobilization with zero unnecessary administrative friction." />
          </div>

          <div className="grid-4" style={{ marginBottom: "64px" }}>
            <StatBox value="100%" label="Open Governance Data" />
            <StatBox value="14k+" label="Hectares Protected" />
            <StatBox value="v3.0" label="Bhavya OS Certified" />
            <StatBox value="0" label="Proprietary Lock-in" />
          </div>

          <SectionHeader eyebrow="Progression" title="Institutional Release Progression" />

          <div className="table-wrap">
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Bhavya OS release history</caption>
              <thead>
                <tr>
                  <th scope="col">Version</th>
                  <th scope="col">Milestone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Focus Area</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { v: "v0.1", m: "Foundation Bootstrap", s: "RELEASED", f: "Monorepo, build tools, core agent runtime" },
                  { v: "v0.2", m: "Platform Integration", s: "RELEASED", f: "AI Gateway setup, OpenHuman workspace binding" },
                  { v: "v0.3", m: "Institutional Runtime", s: "CERTIFIED", f: "Schemas, memory governance, deterministic registry generator" },
                  { v: "v0.4", m: "Institutional Knowledge Platform", s: "CERTIFIED", f: "Knowledge Graph, search index, link validator, public APIs" },
                  { v: "v0.5", m: "Mission Applications", s: "CERTIFIED", f: "Shared mission runtime, public website, application manifests" },
                  { v: "v0.6", m: "Public APIs & Integrations", s: "IN PROGRESS", f: "Expanded transparency endpoints & developer SDK" },
                  { v: "v3.0", m: "Autonomous Execution", s: "CERTIFIED", f: "Planner, executor, orchestrator, CLI, API, metrics — runtime frozen" },
                ].map(r => (
                  <tr key={r.v}>
                    <td><code>{r.v}</code></td>
                    <td><strong>{r.m}</strong></td>
                    <td><span className={`tag ${r.s === "CERTIFIED" || r.s === "RELEASED" ? "tag-green" : "tag-blue"}`}>{r.s}</span></td>
                    <td>{r.f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
