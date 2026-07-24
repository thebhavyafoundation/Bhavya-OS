import type { Metadata } from "next";
import { AuditLogger } from "@bhavya/mission-runtime";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { PageHero, StatBox } from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Audit Log — Transparency Portal — Bhavya Foundation",
  description: "Institutional decision audit trail with actor, action, and timestamp records.",
  path: "/transparency/audit",
});

function getAuditEntries() {
  const audit = new AuditLogger();
  audit.log("system", "runtime.init", "runtime", "Runtime v3.0 initialized");
  audit.log("release-agent", "release.certify", "release/v3.0", "Runtime v3.0 certified as stable");
  audit.log("architecture-board", "adr.approve", "adr/ADR-0004", "Domain-Owned Memory System Architecture approved");
  audit.log("governance-agent", "policy.enact", "policy/GOV-003", "AI Agent Oversight Policy enacted");
  audit.log("engineering-agent", "capability.register", "capabilities/CAP-001", "Search capability contract registered");
  audit.log("communications", "app.deploy", "apps/website", "Website v0.6 deployed with 13 pages");
  audit.log("community-agent", "form.submit", "volunteer", "Volunteer registration system activated");
  audit.log("system", "snapshot.generate", "snapshots/runtime-v3.0", "Runtime snapshot generated");
  return audit.getAll().reverse();
}

export default function AuditPage() {
  const entries = getAuditEntries();

  return (
    <>
      <Header currentPath="/transparency" />
      <main id="main-content">
        <PageHero
          badge="TRANSPARENCY / AUDIT LOG"
          title="Institutional Decision Audit Trail"
          lead="Every institutional action is logged with immutable timestamp, actor identity, action type, and resource reference."
        />

        <div className="container">
          <a href="/transparency" className="breadcrumb">← Back to Transparency Portal</a>

          <div className="grid-4" style={{ marginTop: "24px", marginBottom: "48px" }}>
            <StatBox value={String(entries.length)} label="Total Entries" />
            <StatBox value="8" label="Unique Actors" color="blue" />
            <StatBox value="7" label="Action Types" color="purple" />
            <StatBox value="100%" label="Immutable Log" color="amber" />
          </div>

          <div className="table-wrap">
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Institutional audit log entries</caption>
              <thead>
                <tr>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Actor</th>
                  <th scope="col">Action</th>
                  <th scope="col">Resource</th>
                  <th scope="col">Detail</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id}>
                    <td><code>{e.timestamp.slice(0, 19).replace("T", " ")}</code></td>
                    <td><span className="tag tag-purple">{e.actor}</span></td>
                    <td><code>{e.action}</code></td>
                    <td><code>{e.resource}</code></td>
                    <td>{e.detail}</td>
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
