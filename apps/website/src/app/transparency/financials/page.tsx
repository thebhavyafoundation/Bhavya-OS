import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { PageHero, StatBox } from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { readContentDir, type ContentItem, type ContentEnvelope } from "../../../services/content";

export const metadata: Metadata = buildMetadata({
  title: "Financials — Transparency Portal — Bhavya Foundation",
  description: "Annual reports, financial statements, and donation records of Bhavya Foundation.",
  path: "/transparency/financials",
});

interface FinancialReport extends ContentItem { period: string; status: string; approved: string; type: string; }

export default function FinancialsPage() {
  const docs = readContentDir<FinancialReport>("financials") as (ContentEnvelope<FinancialReport> & { data: FinancialReport })[];
  const audited = docs.filter(d => d.data.status === "Audited").length;

  return (
    <>
      <Header currentPath="/transparency" />
      <main id="main-content">
        <PageHero badge="TRANSPARENCY / FINANCIALS" title="Financial Statements & Institutional Reports" lead="All financial transactions, annual reports, and periodic statements are published with full traceability." />
        <div className="container">
          <a href="/transparency" className="breadcrumb">← Back to Transparency Portal</a>
          <p className="content-meta" style={{ marginTop: "16px" }}>Registry last updated: {docs.reduce((l, d) => d.lastUpdated > l ? d.lastUpdated : l, "")}</p>
          <div className="grid-4" style={{ marginTop: "24px", marginBottom: "48px" }}>
            <StatBox value={String(docs.length)} label="Published Reports" />
            <StatBox value="100%" label="Direct Impact" color="blue" />
            <StatBox value="$0" label="Admin Overhead" color="purple" />
            <StatBox value={String(audited)} label="Audited Statements" color="amber" />
          </div>
          <div className="table-wrap">
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Financial statements</caption>
              <thead><tr><th scope="col">ID</th><th scope="col">Title</th><th scope="col">Period</th><th scope="col">Type</th><th scope="col">Status</th><th scope="col">Approved</th></tr></thead>
              <tbody>{docs.map(d => (
                <tr key={d.data.id}>
                  <td><code>{d.data.id}</code></td>
                  <td><strong>{d.data.title}</strong></td>
                  <td>{d.data.period}</td>
                  <td><span className="tag tag-blue">{d.data.type}</span></td>
                  <td><span className={`tag ${d.data.status === "Audited" ? "tag-green" : d.data.status === "Provisional" ? "tag-blue" : "tag-amber"}`}>{d.data.status.toUpperCase()}</span></td>
                  <td><code>{d.data.approved}</code></td>
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
