import { getSites } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

export default function SitesPage() {
  const sites = getSites();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050f0a" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#f8fafc",
            marginBottom: 24,
          }}
        >
          Sites
        </h1>
        {sites.length === 0 ? (
          <div
            style={{
              background: "#0a1a0f",
              border: "1px solid #1a3a2a",
              borderRadius: 12,
              padding: 48,
              textAlign: "center",
            }}
          >
            <p style={{ color: "#64748b", fontSize: 14 }}>
              No sites yet. Create a mission first, then add sites.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sites.map((site) => (
              <div
                key={site.id}
                style={{
                  background: "#0a1a0f",
                  border: "1px solid #1a3a2a",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}
                >
                  {site.name}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {site.areaHectares ? `${site.areaHectares} ha` : "Area TBD"}{" "}
                  &middot; {site.terrainType || "Terrain TBD"} &middot;{" "}
                  {site.surveyIds.length} surveys &middot;{" "}
                  {site.plantingIds.length} plantings
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
