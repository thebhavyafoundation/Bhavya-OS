import type { Metadata } from "next";
import { Scroll, Mic, Landmark } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader, FeatureCard } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cultural Heritage & Digital Archiving — Bhavya Foundation",
  description: "Documenting, digitizing, and safeguarding indigenous traditions, ancient manuscripts, oral histories, and historic architecture.",
  path: "/heritage",
});

const heritageProjects = [
  { id: "H-101", title: "Palm-Leaf Manuscript Multispectral Archive", type: "3D & Multispectral Scan", itemsCount: "4,200 Manuscripts", status: "Digitized" },
  { id: "H-102", title: "Regional Oral History & Folk Songs Vault", type: "Audio & Folk Recording", itemsCount: "850 Recordings", status: "Active" },
  { id: "H-103", title: "Sacred Architecture Photogrammetry", type: "3D Laser Mesh Scan", itemsCount: "32 Monuments", status: "Active" },
  { id: "H-104", title: "Indigenous Botanical Medicine Codex", type: "Textual & Ethno-botany", itemsCount: "1,120 Species", status: "Published" },
];

export default function HeritagePage() {
  return (
    <>
      <Header currentPath="/heritage" />
      <main id="main-content">
        <PageHero
          badge="CULTURAL HERITAGE"
          title="Digital Archiving & Preservation of Living Wisdom"
          lead="The Heritage Initiative preserves ancient manuscripts, records oral traditions from elder knowledge-keepers, and creates high-precision 3D digital twins of historic architecture."
        />

        <div className="container">
          <SectionHeader eyebrow="Active Initiatives" title="Heritage Preservation Programs" />

          <div className="grid-3" style={{ marginBottom: "64px" }}>
            <FeatureCard icon={<Scroll />} title="Multispectral Manuscript Vault" description="Using non-destructive multispectral cameras to capture faded ink on ancient palm-leaf texts, making hidden historical scripts readable and searchable." />
            <FeatureCard icon={<Mic />} title="Oral History Recordings" description="High-fidelity audio and video archives preserving traditional songs, ecological wisdom, and historical narratives in regional dialects." />
            <FeatureCard icon={<Landmark />} title="3D Monument Photogrammetry" description="Creating millimeter-accurate 3D point-cloud models of endangered heritage architecture for structural monitoring and global open access." />
          </div>

          <SectionHeader eyebrow="Archival Repositories" title="Digitized Heritage Vault Projects" />

          <div className="table-wrap">
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Digitized heritage vault projects</caption>
              <thead>
                <tr>
                  <th scope="col">Project Code</th>
                  <th scope="col">Archive Description</th>
                  <th scope="col">Format / Method</th>
                  <th scope="col">Archived Volume</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {heritageProjects.map(p => (
                  <tr key={p.id}>
                    <td><code>{p.id}</code></td>
                    <td><strong>{p.title}</strong></td>
                    <td><span className="tag tag-purple">{p.type}</span></td>
                    <td>{p.itemsCount}</td>
                    <td><span className="tag tag-green">{p.status}</span></td>
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
