import Link from "next/link";
import { getVolunteers } from "@/lib/data";
import type { Volunteer } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  active: "#14b8a6", inactive: "#64748b", "on-mission": "#06b6d4", training: "#a78bfa",
};

export default function VolunteersPage() {
  const volunteers = getVolunteers();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a1628" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Volunteers</h1>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>{volunteers.length} registered volunteers</p>
          </div>
          <Link href="/volunteers/new" style={{
            padding: "10px 20px", background: "#14b8a6", color: "#0a1628",
            borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>+ Register Volunteer</Link>
        </div>
        {volunteers.length === 0 ? (
          <div style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No volunteers yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {volunteers.map((vol: Volunteer) => (
              <div key={vol.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: "16px 20px",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{vol.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {vol.email} &middot; {vol.location || "Location TBD"} &middot; {vol.missionIds.length} missions
                  </div>
                </div>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 10,
                  background: `${STATUS_COLORS[vol.status]}22`, color: STATUS_COLORS[vol.status],
                }}>{vol.status}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
