import { Greeting } from "@/components/greeting";
import { StatCard } from "@/components/stat-card";
import {
  getContentStats,
  getKnowledgeObjects,
  getContentDocuments,
  getGovernanceDocs,
  getPolicies,
  getDecisions,
  getRegistry,
  getRuntime,
  getBuilders,
  getForestMissions,
  getResearchProjects,
  getProjects,
} from "@/lib/data";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

async function getHomeData() {
  const [
    stats,
    knowledgeObjects,
    contentDocs,
    governanceDocs,
    policies,
    decisions,
    knowledgeGraph,
    runtime,
    builders,
    forestMissions,
    researchProjects,
    projects,
  ] = await Promise.all([
    getContentStats(),
    getKnowledgeObjects(),
    getContentDocuments(),
    getGovernanceDocs(),
    getPolicies(),
    getDecisions(),
    getRegistry("knowledge-graph"),
    getRuntime(),
    getBuilders(),
    getForestMissions(),
    getResearchProjects(),
    getProjects(),
  ]);

  return {
    stats,
    knowledgeObjects,
    contentDocs,
    governanceDocs,
    policies,
    decisions,
    knowledgeGraph,
    runtime,
    builders,
    forestMissions,
    researchProjects,
    projects,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  const recentDocs = data.contentDocs.slice(0, 5);
  const recentKO = data.knowledgeObjects.slice(0, 3);
  const recentGovernance = data.governanceDocs.slice(0, 3);
  const recentPolicies = data.policies.slice(0, 3);
  const recentDecisions: AnyRecord[] =
    data.decisions?.records?.slice(0, 5) || [];
  const graphNodes: AnyRecord[] = data.knowledgeGraph?.nodes?.slice(0, 6) || [];
  const runtimeComponents: [string, AnyRecord][] = data.runtime?.components
    ? Object.entries(data.runtime.components)
    : [];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 48 }}>
        <Greeting />
        <div
          style={{
            fontSize: 14,
            color: "#71717a",
            marginTop: 12,
            lineHeight: 1.6,
          }}
        >
          Institutional Operating System — {data.stats.knowledgeObjects}{" "}
          Knowledge Objects · {data.stats.contentDocuments} Documents ·{" "}
          {data.stats.apps} Apps · {data.stats.services} Services
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 48,
        }}
      >
        <StatCard
          label="Knowledge Objects"
          value={data.stats.knowledgeObjects}
          icon="📚"
          color="#22c55e"
          subtitle="AI curriculum content"
        />
        <StatCard
          label="Content Documents"
          value={data.stats.contentDocuments}
          icon="📄"
          color="#3b82f6"
          subtitle="Forest, research, governance"
        />
        <StatCard
          label="Governance Docs"
          value={data.stats.governanceDocs + data.stats.policies}
          icon="⚖️"
          color="#f59e0b"
          subtitle="Policies & trust deed"
        />
        <StatCard
          label="System Services"
          value={data.stats.services}
          icon="⚡"
          color="#a855f7"
          subtitle="AI Gateway, Website, Docs"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 48,
        }}
      >
        <Section title="Knowledge Objects" icon="🧠" href="/knowledge">
          {recentKO.length > 0 ? (
            recentKO.map((ko) => (
              <div
                key={ko.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #27272a",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1c1c1f")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#fafafa",
                    marginBottom: 4,
                  }}
                >
                  {ko.title}
                </div>
                <div style={{ fontSize: 12, color: "#71717a" }}>
                  {ko.domain} · Grade {ko.grade} · {ko.concepts?.length || 0}{" "}
                  concepts
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>

        <Section title="Recent Documents" icon="📄" href="/knowledge">
          {recentDocs.length > 0 ? (
            recentDocs.map((doc) => (
              <div
                key={doc.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #27272a",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1c1c1f")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#fafafa",
                    marginBottom: 4,
                  }}
                >
                  {doc.title}
                </div>
                <div style={{ fontSize: 12, color: "#71717a" }}>
                  {doc.category} · {doc.metadata?.source || "general"}
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 48,
        }}
      >
        <Section title="Runtime" icon="⚡" href="/runtime">
          {runtimeComponents.length > 0 ? (
            runtimeComponents.map(([key, comp]) => (
              <div
                key={key}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #27272a",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#fafafa",
                      textTransform: "capitalize",
                    }}
                  >
                    {key.replace(/-/g, " ")}
                  </div>
                  <div style={{ fontSize: 11, color: "#52525b" }}>
                    {comp.description}
                  </div>
                </div>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>

        <Section title="Knowledge Graph" icon="🔗" href="/knowledge">
          {graphNodes.length > 0 ? (
            graphNodes.map((node) => (
              <div
                key={node.id}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #27272a",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 500, color: "#fafafa" }}
                  >
                    {node.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#52525b" }}>
                    {node.type} · {node.owner}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background:
                      node.status === "Accepted" || node.status === "Active"
                        ? "#166534"
                        : node.status === "Released"
                          ? "#1e3a5f"
                          : "#78350f",
                    color:
                      node.status === "Accepted" || node.status === "Active"
                        ? "#22c55e"
                        : node.status === "Released"
                          ? "#3b82f6"
                          : "#f59e0b",
                  }}
                >
                  {node.status}
                </span>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 24,
          marginBottom: 48,
        }}
      >
        <Section title="Governance" icon="⚖️" href="/governance">
          {recentGovernance.length > 0 ? (
            recentGovernance.map((doc) => (
              <div
                key={doc.id}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #27272a",
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: "#fafafa" }}
                >
                  {doc.title}
                </div>
                <div style={{ fontSize: 11, color: "#52525b" }}>
                  {doc.type} · {doc.status}
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>

        <Section title="Policies" icon="📋" href="/governance">
          {recentPolicies.length > 0 ? (
            recentPolicies.map((pol) => (
              <div
                key={pol.id}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #27272a",
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: "#fafafa" }}
                >
                  {pol.icon} {pol.title}
                </div>
                <div style={{ fontSize: 11, color: "#52525b" }}>
                  {pol.status}
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>

        <Section title="Decisions" icon="🧠" href="/memory">
          {recentDecisions.length > 0 ? (
            recentDecisions.map((dec) => (
              <div
                key={dec.id}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #27272a",
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: "#fafafa" }}
                >
                  {dec.payload?.title || dec.id}
                </div>
                <div style={{ fontSize: 11, color: "#52525b" }}>
                  {dec.payload?.status || "recorded"} · {dec.author}
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>
      </div>

      {data.builders.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <Section title="Builders" icon="🔨" href="/runtime">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                padding: "16px",
              }}
            >
              {data.builders.map((builder: AnyRecord) => (
                <div
                  key={builder.id}
                  style={{
                    padding: "16px",
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                    transition: "border-color 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#3f3f46")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#27272a")
                  }
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fafafa",
                      marginBottom: 4,
                    }}
                  >
                    {builder.name}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#71717a", marginBottom: 8 }}
                  >
                    {builder.description}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {builder.output?.slice(0, 3).map((o: string) => (
                      <span
                        key={o}
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "#1c1c1f",
                          color: "#71717a",
                        }}
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      <div
        style={{
          padding: "24px 0",
          borderTop: "1px solid #27272a",
          fontSize: 12,
          color: "#52525b",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>AI Lab OS v3.0.0 · Bhavya Foundation</span>
        <span style={{ fontFamily: "monospace" }}>
          ⌘K to search · Built for institutional intelligence
        </span>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #27272a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fafafa" }}>
            {title}
          </span>
        </div>
        <a
          href={href}
          style={{ fontSize: 12, color: "#71717a", textDecoration: "none" }}
        >
          View all →
        </a>
      </div>
      <div>{children}</div>
    </div>
  );
}

function EmptyRow() {
  return (
    <div
      style={{
        padding: "24px 16px",
        textAlign: "center",
        fontSize: 13,
        color: "#52525b",
      }}
    >
      No data available
    </div>
  );
}
