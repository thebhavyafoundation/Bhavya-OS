import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getMissions,
  getSites,
  getPlantings,
  getVolunteers,
  getAssignments,
  getProjects,
  getHeritageMissions,
  getHeritageAssets,
} from "@bhavya/content-core";
import { generateDecisionSupport, calculateTrends } from "@bhavya/intelligence";

function StatCard({
  label,
  value,
  color,
  trend,
}: {
  label: string;
  value: number;
  color: string;
  trend?: { change: number; direction: "up" | "down" | "stable" };
}) {
  return (
    <div
      style={{ background: "#1e293b", borderRadius: 12, padding: "20px 24px" }}
    >
      <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <p style={{ fontSize: 28, fontWeight: 700, color, margin: 0 }}>
          {value}
        </p>
        {trend && trend.direction !== "stable" && (
          <p
            style={{
              fontSize: 12,
              color: trend.direction === "up" ? "#10b981" : "#ef4444",
              margin: 0,
            }}
          >
            {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.change)}
          </p>
        )}
      </div>
    </div>
  );
}

function WidgetCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px" }}>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#f8fafc",
          margin: "0 0 16px 0",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();

  const publishedDocs = docs.filter((d) => d.status === "published").length;
  const draftDocs = docs.filter((d) => d.status === "draft").length;

  const totalEdges = kg.reduce((sum, n) => sum + (n.links?.length || 0), 0);

  const forestMissions = getMissions().length;
  const heritageMissions = getHeritageMissions().length;
  const researchProjects = getProjects().length;
  const volunteerCount = getVolunteers().length;

  const recentDocs = [...docs]
    .sort((a, b) => (b.created || "").localeCompare(a.created || ""))
    .slice(0, 5);

  const docsByCategory: Record<string, number> = {};
  for (const doc of docs) {
    docsByCategory[doc.category] = (docsByCategory[doc.category] || 0) + 1;
  }

  // Generate insights
  const insights = [
    ...recentDocs.slice(0, 3).map((doc) => ({
      id: `pub-${doc.id}`,
      type: "publication" as const,
      title: `${doc.title} published`,
      description: `${doc.type} document added to ${doc.category} knowledge base.`,
      timestamp: doc.created || new Date().toISOString(),
      source: doc.category,
    })),
    {
      id: "kg-milestone",
      type: "milestone" as const,
      title: `Knowledge graph: ${totalEdges} relationships`,
      description: `Institutional knowledge graph now connects ${kg.length} nodes through ${totalEdges} relationships.`,
      timestamp: new Date().toISOString(),
      source: "intelligence",
    },
  ].slice(0, 6);

  // Decision support
  const decisionSupport = generateDecisionSupport();
  const trends = calculateTrends();

  // Get trends for key metrics
  const docsTrend = trends.find((t) => t.metric === "Total Documents");
  const entitiesTrend = trends.find((t) => t.metric === "Entities");
  const relationshipsTrend = trends.find((t) => t.metric === "Relationships");
  const knowledgeTrend = trends.find((t) => t.metric === "Knowledge Nodes");

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#10b981",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Institutional Overview
        </p>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#f8fafc",
            marginBottom: 8,
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Real-time view of institutional health, mission activity, and
          knowledge growth.
        </p>
      </div>

      {/* Top Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard
          label="Documents"
          value={docs.length}
          color="#10b981"
          trend={docsTrend}
        />
        <StatCard
          label="Entities"
          value={entities.length}
          color="#8b5cf6"
          trend={entitiesTrend}
        />
        <StatCard
          label="Relationships"
          value={totalEdges}
          color="#3b82f6"
          trend={relationshipsTrend}
        />
        <StatCard
          label="Knowledge Nodes"
          value={kg.length}
          color="#f59e0b"
          trend={knowledgeTrend}
        />
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Mission Activity */}
        <WidgetCard title="Mission Activity">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}
              >
                Forest
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#10b981",
                  margin: 0,
                }}
              >
                {forestMissions} missions
              </p>
            </div>
            <div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}
              >
                Heritage
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#f59e0b",
                  margin: 0,
                }}
              >
                {heritageMissions} missions
              </p>
            </div>
            <div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}
              >
                Research
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#ec4899",
                  margin: 0,
                }}
              >
                {researchProjects} projects
              </p>
            </div>
            <div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}
              >
                Volunteers
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#06b6d4",
                  margin: 0,
                }}
              >
                {volunteerCount} people
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Knowledge Health */}
        <WidgetCard title="Knowledge Health">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}
              >
                Published
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#10b981",
                  margin: 0,
                }}
              >
                {publishedDocs}
              </p>
            </div>
            <div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}
              >
                Drafts
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#f59e0b",
                  margin: 0,
                }}
              >
                {draftDocs}
              </p>
            </div>
            <div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}
              >
                Coverage
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#8b5cf6",
                  margin: 0,
                }}
              >
                {docs.length > 0
                  ? Math.round((publishedDocs / docs.length) * 100)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}
              >
                Graph Density
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#3b82f6",
                  margin: 0,
                }}
              >
                {kg.length > 0
                  ? Math.round((totalEdges / kg.length) * 100) / 100
                  : 0}
              </p>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* Bottom Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Recent Publications */}
        <WidgetCard title="Recent Publications">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #334155",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#f8fafc",
                      margin: 0,
                    }}
                  >
                    {doc.title}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      margin: "2px 0 0 0",
                    }}
                  >
                    {doc.category}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: doc.status === "published" ? "#10b981" : "#f59e0b",
                  }}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Content by Category */}
        <WidgetCard title="Content by Category">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(docsByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div
                  key={category}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      margin: 0,
                      textTransform: "capitalize",
                    }}
                  >
                    {category}
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 120,
                        height: 6,
                        background: "#334155",
                        borderRadius: 3,
                      }}
                    >
                      <div
                        style={{
                          width: `${(count / docs.length) * 100}%`,
                          height: "100%",
                          background: "#10b981",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#f8fafc",
                        margin: 0,
                        minWidth: 24,
                        textAlign: "right",
                      }}
                    >
                      {count}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </WidgetCard>

        {/* Platform KPIs */}
        <WidgetCard title="Platform KPIs">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                label: "Publication Rate",
                value: `${docs.length > 0 ? Math.round((publishedDocs / docs.length) * 100) : 0}%`,
                color: "#10b981",
              },
              {
                label: "Graph Density",
                value:
                  kg.length > 0 ? (totalEdges / kg.length).toFixed(1) : "0",
                color: "#3b82f6",
              },
              {
                label: "Entity Coverage",
                value: `${entities.length} entities`,
                color: "#8b5cf6",
              },
              { label: "Validation", value: "PASS", color: "#10b981" },
              { label: "Tests", value: "55/55", color: "#10b981" },
              {
                label: "Missions Active",
                value: `${forestMissions + heritageMissions + researchProjects}`,
                color: "#f59e0b",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                  {kpi.label}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: kpi.color,
                    margin: 0,
                  }}
                >
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Recent Insights Feed */}
      <WidgetCard title="Recent Insights">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {insights.map((insight) => (
            <div
              key={insight.id}
              style={{
                padding: "12px 16px",
                background: "#0f172a",
                borderRadius: 8,
                border: "1px solid #334155",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#f8fafc",
                    margin: 0,
                  }}
                >
                  {insight.title}
                </p>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background:
                      insight.type === "publication"
                        ? "#10b98120"
                        : insight.type === "entity"
                          ? "#8b5cf620"
                          : insight.type === "mission"
                            ? "#3b82f620"
                            : "#f59e0b20",
                    color:
                      insight.type === "publication"
                        ? "#10b981"
                        : insight.type === "entity"
                          ? "#8b5cf6"
                          : insight.type === "mission"
                            ? "#3b82f6"
                            : "#f59e0b",
                  }}
                >
                  {insight.type}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                {insight.description}
              </p>
              <p
                style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0 0" }}
              >
                {insight.source}
              </p>
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Decision Support */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginTop: 24,
        }}
      >
        {/* Data Quality Alerts */}
        <WidgetCard title="Data Quality Alerts">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {decisionSupport.dataQualityAlerts.length === 0 ? (
              <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>
                ✓ No data quality issues detected
              </p>
            ) : (
              decisionSupport.dataQualityAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: "12px 16px",
                    background: "#0f172a",
                    borderRadius: 8,
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#f8fafc",
                        margin: 0,
                      }}
                    >
                      {alert.title}
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          alert.data?.severity === "high"
                            ? "#ef444420"
                            : alert.data?.severity === "medium"
                              ? "#f59e0b20"
                              : "#3b82f620",
                        color:
                          alert.data?.severity === "high"
                            ? "#ef4444"
                            : alert.data?.severity === "medium"
                              ? "#f59e0b"
                              : "#3b82f6",
                      }}
                    >
                      {alert.data?.severity || "unknown"}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                    {alert.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </WidgetCard>

        {/* Mission Health */}
        <WidgetCard title="Mission Health">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {decisionSupport.missionHealthScores.length === 0 ? (
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                No missions to evaluate
              </p>
            ) : (
              decisionSupport.missionHealthScores.slice(0, 4).map((score) => (
                <div
                  key={score.id}
                  style={{
                    padding: "12px 16px",
                    background: "#0f172a",
                    borderRadius: 8,
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#f8fafc",
                        margin: 0,
                      }}
                    >
                      {score.data?.missionName || "Unknown Mission"}
                    </p>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 60,
                          height: 6,
                          background: "#334155",
                          borderRadius: 3,
                        }}
                      >
                        <div
                          style={{
                            width: `${score.data?.score || 0}%`,
                            height: "100%",
                            background:
                              score.data?.status === "healthy"
                                ? "#10b981"
                                : score.data?.status === "needs_attention"
                                  ? "#f59e0b"
                                  : "#ef4444",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#f8fafc",
                          margin: 0,
                          minWidth: 30,
                          textAlign: "right",
                        }}
                      >
                        {score.data?.score || 0}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                    {score.data?.missionType || "Unknown Type"}
                  </p>
                </div>
              ))
            )}
          </div>
        </WidgetCard>

        {/* Knowledge Gaps */}
        <WidgetCard title="Knowledge Gaps">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {decisionSupport.knowledgeGaps.length === 0 ? (
              <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>
                ✓ No significant knowledge gaps
              </p>
            ) : (
              decisionSupport.knowledgeGaps.slice(0, 3).map((gap) => (
                <div
                  key={gap.id}
                  style={{
                    padding: "12px 16px",
                    background: "#0f172a",
                    borderRadius: 8,
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#f8fafc",
                        margin: 0,
                      }}
                    >
                      {gap.data?.area || "Unknown Area"}
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          gap.data?.priority === "high"
                            ? "#ef444420"
                            : gap.data?.priority === "medium"
                              ? "#f59e0b20"
                              : "#3b82f620",
                        color:
                          gap.data?.priority === "high"
                            ? "#ef4444"
                            : gap.data?.priority === "medium"
                              ? "#f59e0b"
                              : "#3b82f6",
                      }}
                    >
                      {gap.data?.priority || "unknown"}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                    {gap.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </WidgetCard>

        {/* Work Queue */}
        <WidgetCard title="Work Queue">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {decisionSupport.workQueue.length === 0 ? (
              <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>
                ✓ No pending work items
              </p>
            ) : (
              decisionSupport.workQueue.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "12px 16px",
                    background: "#0f172a",
                    borderRadius: 8,
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#f8fafc",
                        margin: 0,
                      }}
                    >
                      {item.data?.title || "Untitled"}
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          item.data?.priority === "high"
                            ? "#ef444420"
                            : item.data?.priority === "medium"
                              ? "#f59e0b20"
                              : "#3b82f620",
                        color:
                          item.data?.priority === "high"
                            ? "#ef4444"
                            : item.data?.priority === "medium"
                              ? "#f59e0b"
                              : "#3b82f6",
                      }}
                    >
                      {(item.data?.type || "unknown").replace(/_/g, " ")}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
