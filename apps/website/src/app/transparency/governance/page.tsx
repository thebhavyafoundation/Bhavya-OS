import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { PageHero } from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { readContentDir, type ContentItem, type ContentEnvelope } from "../../../services/content";

export const metadata: Metadata = buildMetadata({
  title: "Governance — Transparency Portal — Bhavya Foundation",
  description: "Board resolutions, governing documents, and institutional decisions of Bhavya Foundation.",
  path: "/transparency/governance",
});

interface GovernanceDoc extends ContentItem {
  type: string;
  status: string;
  ratified: string;
  owner: string;
}

export default function GovernancePage() {
  const docs = readContentDir<GovernanceDoc>("governance") as (ContentEnvelope<GovernanceDoc> & { data: GovernanceDoc })[];

  return (
    <>
      <Header currentPath="/transparency" />
      <main id="main-content">
        <PageHero
          badge="TRANSPARENCY / GOVERNANCE"
          title="Board Resolutions & Institutional Governance"
          lead="All governing documents, board resolutions, and institutional policies are registered as machine-verifiable records with version history."
        />

        <div className="container">
          <a href="/transparency" className="breadcrumb">← Back to Transparency Portal</a>
          <p className="content-meta" style={{ marginTop: "16px" }}>Registry last updated: {docs.reduce((latest, d) => d.lastUpdated > latest ? d.lastUpdated : latest, "")}</p>

          <div className="table-wrap" style={{ marginTop: "16px" }}>
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Governing documents and board resolutions</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Type</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ratified</th>
                </tr>
              </thead>
              <tbody>
                {docs.map(d => (
                  <tr key={d.data.id}>
                    <td><code>{d.data.id}</code></td>
                    <td><strong>{d.data.title}</strong></td>
                    <td><span className="tag tag-purple">{d.data.type}</span></td>
                    <td><code>{d.data.owner}</code></td>
                    <td><span className={`tag ${d.data.status === "Active" ? "tag-green" : "tag-amber"}`}>{d.data.status.toUpperCase()}</span></td>
                    <td><code>{d.data.ratified}</code></td>
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
