"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function NewMissionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", region: "", goals: "", tags: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        region: form.region,
        goals: form.goals.split("\n").filter(Boolean),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      const mission = await res.json();
      router.push(`/missions/${mission.id}`);
    }
    setSaving(false);
  }

  const inputStyle = {
    width: "100%" as const, padding: "10px 14px", background: "#1a1208",
    border: "1px solid #2a1f10", borderRadius: 8, color: "#f8fafc",
    fontSize: 14, outline: "none" as const,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0a05" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 640 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>New Heritage Mission</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Mission Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Temple Restoration Initiative" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Region</label>
            <input required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="e.g. Himachal Pradesh" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Description</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mission goals and scope..." style={{ ...inputStyle, resize: "vertical" as const }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Goals (one per line)</label>
            <textarea rows={3} value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })}
              placeholder="Restore 10 temples&#10;Document 100 inscriptions&#10;Train 50 local artisans"
              style={{ ...inputStyle, resize: "vertical" as const }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="temples, restoration, traditional-knowledge" style={inputStyle} />
          </div>
          <button type="submit" disabled={saving} style={{
            padding: "12px 24px", background: saving ? "#2a1f10" : "#c9a84c",
            color: saving ? "#64748b" : "#0f0a05", borderRadius: 8,
            fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "default" : "pointer",
          }}>{saving ? "Creating..." : "Create Mission"}</button>
        </form>
      </main>
    </div>
  );
}
