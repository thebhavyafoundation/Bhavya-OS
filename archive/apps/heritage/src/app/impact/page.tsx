import { getHeritageImpactReports } from "@/lib/data";
import type { Impact } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

export default function ImpactPage() {
  const impacts = getHeritageImpactReports();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0a05" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Heritage Impact</h1>
        {impacts.length === 0 ? (
          <div style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No impact reports yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {impacts.map((imp: Impact) => (
              <div key={imp.id} style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", marginBottom: 8 }}>{imp.title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>{imp.summary}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { label: "Assets Restored", value: `${imp.assetsRestored}/${imp.totalAssets}`, color: "#c9a84c" },
                    { label: "Area Documented", value: `${imp.areaDocumentedHectares} ha`, color: "#22d3ee" },
                    { label: "Inscriptions", value: imp.inscriptionsRecorded.toString(), color: "#a78bfa" },
                    { label: "Community", value: (imp.communityMembers || 0).toString(), color: "#10b981" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{stat.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
