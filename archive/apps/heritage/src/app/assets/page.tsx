import { getHeritageAssets } from "@/lib/data";
import type { Asset } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const CONDITION_COLORS: Record<string, string> = {
  excellent: "#10b981", good: "#22d3ee", fair: "#f59e0b", poor: "#f97316", critical: "#ef4444", ruins: "#64748b",
};

export default function AssetsPage() {
  const assets = getHeritageAssets();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0a05" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Heritage Assets</h1>
        {assets.length === 0 ? (
          <div style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No heritage assets yet. Create a mission first, then add assets.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {assets.map((asset: Asset) => (
              <div key={asset.id} style={{
                background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: "16px 20px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{asset.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                      {asset.assetType} &middot; {asset.era || "Era TBD"}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 10,
                    background: `${CONDITION_COLORS[asset.condition]}22`, color: CONDITION_COLORS[asset.condition],
                  }}>{asset.condition}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
