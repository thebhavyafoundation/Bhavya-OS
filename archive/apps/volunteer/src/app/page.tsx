import Link from "next/link";
import { getVolunteerStats, getVolunteers, getAssignments } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const MISSION_COLORS: Record<string, string> = {
  forest: "#10b981", heritage: "#c9a84c", research: "#a78bfa",
};

export default function DashboardPage() {
  const stats = getVolunteerStats();
  const volunteers = getVolunteers();
  const assignments = getAssignments();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a1628" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Volunteer Hub</h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>Manage volunteers, skills, training, mission assignments, and recognition across all Bhavya missions.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Volunteers", value: stats.totalVolunteers, color: "#14b8a6" },
            { label: "Active Assignments", value: stats.totalAssignments, color: "#06b6d4" },
            { label: "Hours Logged", value: stats.totalHoursLogged, color: "#a78bfa" },
            { label: "Recognitions", value: stats.totalRecognitions, color: "#f59e0b" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc", marginBottom: 12 }}>Recent Volunteers</h2>
            {volunteers.length === 0 ? (
              <div style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 24, textAlign: "center" }}>
                <p style={{ color: "#64748b", fontSize: 13 }}>No volunteers yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {volunteers.slice(0, 5).map((v) => (
                  <Link key={v.id} href="/volunteers" style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 8,
                    padding: "10px 14px", textDecoration: "none",
                  }}>
                    <span style={{ fontSize: 13, color: "#f8fafc" }}>{v.name}</span>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 10,
                      background: v.status === "active" ? "rgba(20,184,166,0.12)" : "rgba(148,163,184,0.12)",
                      color: v.status === "active" ? "#14b8a6" : "#94a3b8",
                    }}>{v.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc", marginBottom: 12 }}>Mission Assignments</h2>
            {assignments.length === 0 ? (
              <div style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 24, textAlign: "center" }}>
                <p style={{ color: "#64748b", fontSize: 13 }}>No assignments yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {assignments.slice(0, 5).map((a) => (
                  <Link key={a.id} href="/assignments" style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 8,
                    padding: "10px 14px", textDecoration: "none",
                  }}>
                    <span style={{ fontSize: 13, color: "#f8fafc" }}>{a.role}</span>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 10,
                      background: `${MISSION_COLORS[a.missionType]}22`, color: MISSION_COLORS[a.missionType],
                    }}>{a.missionType}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc", marginBottom: 12 }}>Mission Integration</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { type: "forest", label: "Forest Missions", count: stats.assignmentsByMissionType.forest, color: "#10b981" },
              { type: "heritage", label: "Heritage Missions", count: stats.assignmentsByMissionType.heritage, color: "#c9a84c" },
              { type: "research", label: "Research Projects", count: stats.assignmentsByMissionType.research, color: "#a78bfa" },
            ].map((m) => (
              <div key={m.type} style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.count}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
