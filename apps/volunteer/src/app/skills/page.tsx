import { getSkills } from "@/lib/data";
import type { Skill } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

export default function SkillsPage() {
  const skills = getSkills();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a1628" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Skills Registry</h1>
        {skills.length === 0 ? (
          <div style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No skills registered yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {skills.map((skill: Skill) => (
              <div key={skill.id} style={{
                background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: "16px 20px",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{skill.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{skill.category}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{skill.description}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>{skill.volunteers.length} volunteers</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
