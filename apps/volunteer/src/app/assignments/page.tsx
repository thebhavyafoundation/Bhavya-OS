import { getAssignments } from "@/lib/data";
import type { MissionAssignment } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const MISSION_COLORS: Record<string, string> = {
  forest: "#10b981", heritage: "#c9a84c", research: "#a78bfa",
};

const STATUS_COLORS: Record<string, string> = {
  assigned: "#64748b", active: "#14b8a6", completed: "#10b981", withdrawn: "#ef4444",
};

export default function AssignmentsPage() {
  const assignments = getAssignments();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a1628" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Mission Assignments</h1>
        {assignments.length === 0 ? (
          <div style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No assignments yet. Assign volunteers to Forest, Heritage, or Research missions.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {assignments.map((a: MissionAssignment) => (
              <div key={a.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: "16px 20px",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{a.role}</span>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 10,
                      background: `${MISSION_COLORS[a.missionType]}22`, color: MISSION_COLORS[a.missionType],
                    }}>{a.missionType}</span>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 10,
                      background: `${STATUS_COLORS[a.status]}22`, color: STATUS_COLORS[a.status],
                    }}>{a.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{a.description}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{a.hoursLogged}h logged</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
