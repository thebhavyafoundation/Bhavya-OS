import type { Metadata } from "next";
import { TreePine, Scroll, Flower2, Landmark, GraduationCap, Users } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Programs — Bhavya Foundation",
  description: "Explore Bhavya Foundation's active programs in nature conservation, heritage preservation, open knowledge, and community engagement.",
  path: "/programs",
});

const programs = [
  { icon: <TreePine />, title: "Canopy GIS Program", desc: "Satellite telemetry and on-ground sensor networks monitoring primary forest canopy density, detecting illegal logging, and tracking biodiversity health across 14,000+ hectares.", status: "Active" },
  { icon: <Scroll />, title: "Manuscript Digitization", desc: "Non-destructive multispectral imaging of ancient palm-leaf manuscripts. Over 4,200 texts digitized with full-text search and cross-referencing.", status: "Active" },
  { icon: <Flower2 />, title: "Sacred Grove Restoration", desc: "Indigenous community-led restoration of sacred groves — fencing, invasive removal, native species reintroduction, and biodiversity surveys.", status: "Active" },
  { icon: <Landmark />, title: "3D Heritage Architecture", desc: "Millimeter-accurate photogrammetry and laser scanning of endangered heritage structures for digital preservation and structural monitoring.", status: "Active" },
  { icon: <GraduationCap />, title: "Open Knowledge Platform", desc: "Versioned institutional standards, governance ADRs, and research publications in machine-readable format with full knowledge graph navigation.", status: "Active" },
  { icon: <Users />, title: "Volunteer Corps", desc: "Field conservation teams, digital archiving squads, open-source contributors, and community chapter leaders across India.", status: "Active" },
];

export default function ProgramsPage() {
  return (
    <>
      <Header currentPath="/programs" />
      <main id="main-content">
        <PageHero
          badge="ACTIVE PROGRAMS"
          title="Mission-Driven Programs & Initiatives"
          lead="Every program at Bhavya Foundation is governed by explicit standards, tracked in real time, and accessible through the institutional transparency portal."
        />

        <div className="container">
          <SectionHeader eyebrow="In Focus" title="Flagship Programs" />
          <div className="grid-2">
            {programs.map((p, i) => (
              <div className="card" key={i}>
                <div className="card-header">
                  <span className="card-icon" aria-hidden="true">{p.icon}</span>
                  <span className="tag tag-green" style={{ marginLeft: "auto" }}>{p.status}</span>
                </div>
                <h3 className="card-title">{p.title}</h3>
                <p className="card-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
