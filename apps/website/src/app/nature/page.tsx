import type { Metadata } from "next";
import { TreePine, Flower2, PawPrint } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader, FeatureCard } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";
import { readContent, type ContentItem, type ContentEnvelope } from "../../services/content";

export const metadata: Metadata = buildMetadata({
  title: "Nature & Forest Conservation — Bhavya Foundation",
  description: "Protecting canopy forests, restoring sacred groves, and deploying real-time GIS telemetry for wildlife corridor protection.",
  path: "/nature",
});

interface SectorData { name: string; canopyDensity: string; telemetry: string; alerts: number; }
interface ForestProject extends ContentItem { sectors: SectorData[]; }

export default function NaturePage() {
  const project = readContent<ForestProject>("projects", "P-001") as (ContentEnvelope<ForestProject> & { data: ForestProject }) | null;
  const sectors = project?.data?.sectors ?? [];

  return (
    <>
      <Header currentPath="/nature" />
      <main id="main-content">
        <PageHero badge="NATURE & CONSERVATION" title="Canopy Protection & Real-Time Forest GIS" lead="The Nature Initiative protects primary forest canopy, restores ancient sacred groves, and operates automated bio-acoustic sensors to safeguard wildlife migration corridors." />
        <div className="container">
          {project && <p className="content-meta">Data source: {project.source} · Last updated: {project.lastUpdated}</p>}

          <SectionHeader eyebrow="Active Operations" title="Conservation Programs" />
          <div className="grid-3" style={{ marginBottom: "64px" }}>
            <FeatureCard icon={<TreePine />} title="Canopy GIS Telemetry" description="Deploying satellite GIS integration and canopy sensor nodes to monitor forest health, track temperature fluctuations, and detect illegal tree felling alerts in real time." />
            <FeatureCard icon={<Flower2 />} title="Sacred Grove Restoration" description="Partnering with indigenous communities to survey, fence, and ecologically nurture ancient sacred groves that harbor endangered endemic flora and fauna." />
            <FeatureCard icon={<PawPrint />} title="Wildlife Corridor Protection" description="Non-invasive AI camera traps and solar bio-acoustic listening posts monitor elephant and big cat movement across critical habitat connectors." />
          </div>

          <SectionHeader eyebrow="Real-Time Data" title="Forest Telemetry Sector Status" />
          <div className="table-wrap">
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Forest telemetry sector monitoring data</caption>
              <thead><tr><th scope="col">Protected Region</th><th scope="col">Canopy Density</th><th scope="col">Telemetry</th><th scope="col">Alerts</th></tr></thead>
              <tbody>{sectors.map((s, i) => (
                <tr key={i}>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="tag tag-green">{s.canopyDensity}</span></td>
                  <td><span className="tag tag-blue">{s.telemetry}</span></td>
                  <td>{s.alerts === 0 ? <span className="tag tag-green">0 Alerts</span> : <span className="tag tag-amber">{s.alerts} Alert Flagged</span>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
