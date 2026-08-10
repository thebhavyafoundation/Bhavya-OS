import { getAssessments } from "@/lib/data";
import type { Assessment } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

export default function AssessmentsPage() {
  const assessments = getAssessments();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0a05" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Condition Assessments</h1>
        {assessments.length === 0 ? (
          <div style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No assessments yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {assessments.map((a: Assessment) => (
              <div key={a.id} style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {a.type} &middot; {new Date(a.assessedDate).toLocaleDateString()} &middot; {a.assessedBy} &middot; condition: {a.condition}
                </div>
                {a.urgentIssues.length > 0 && (
                  <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{a.urgentIssues.length} urgent issues</div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
