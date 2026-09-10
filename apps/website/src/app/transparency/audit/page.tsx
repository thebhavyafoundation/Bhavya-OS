import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { PageHero, StatBox } from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Audit Log — Transparency Portal — Bhavya Foundation",
  description: "Institutional decision audit trail with actor, action, and timestamp records.",
  path: "/transparency/audit",
});

const auditEntries = [
  { id: "1", timestamp: "2026-07-23T10:00:00Z", actor: "system", action: "runtime.init", resource: "runtime", detail: "Runtime v3.0 initialized" },
  { id: "2", timestamp: "2026-07-23T10:01:00Z", actor: "release-agent", action: "release.certify", resource: "release/v3.0", detail: "Runtime v3.0 certified as stable" },
  { id: "3", timestamp: "2026-07-23T10:02:00Z", actor: "architecture-board", action: "adr.approve", resource: "adr/ADR-0004", detail: "Domain-Owned Memory System Architecture approved" },
  { id: "4", timestamp: "2026-07-23T10:03:00Z", actor: "governance-agent", action: "policy.enact", resource: "policy/GOV-003", detail: "AI Agent Oversight Policy enacted" },
  { id: "5", timestamp: "2026-07-23T10:04:00Z", actor: "engineering-agent", action: "capability.register", resource: "capabilities/CAP-001", detail: "Search capability contract registered" },
  { id: "6", timestamp: "2026-07-23T10:05:00Z", actor: "communications", action: "app.deploy", resource: "apps/website", detail: "Website v0.6 deployed with 13 pages" },
  { id: "7", timestamp: "2026-07-23T10:06:00Z", actor: "community-agent", action: "form.submit", resource: "volunteer", detail: "Volunteer registration system activated" },
  { id: "8", timestamp: "2026-07-23T10:07:00Z", actor: "system", action: "snapshot.generate", resource: "snapshots/runtime-v3.0", detail: "Runtime snapshot generated" },
];

export default function AuditPage() {
  const entries = auditEntries;

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

          <div style={{ marginTop: "24px", marginBottom: "16px", padding: "12px 16px", background: "var(--color-surface-elevated, #f5f5f0)", border: "1px solid var(--color-border-subtle, #e0ddd5)", borderRadius: "var(--radius-md, 8px)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary, #666)" }}>
            <strong>Note:</strong> The audit entries below are sample data for demonstration purposes. A full, immutable audit trail will be published as the institutional governance system matures.
          </div>

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
