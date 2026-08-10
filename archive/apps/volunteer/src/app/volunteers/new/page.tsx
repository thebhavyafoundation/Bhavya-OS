"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function NewVolunteerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", interests: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        location: form.location || undefined,
        interests: form.interests.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) router.push("/volunteers");
    setSaving(false);
  }

  const inputStyle = {
    width: "100%" as const, padding: "10px 14px", background: "#0f1d32",
    border: "1px solid #1e3a5f", borderRadius: 8, color: "#f8fafc",
    fontSize: 14, outline: "none" as const,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a1628" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 640 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Register Volunteer</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Priya Sharma" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="priya@example.com" style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Himachal Pradesh" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Interests (comma separated)</label>
            <input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="reforestation, heritage-docs, species-survey" style={inputStyle} />
          </div>
          <button type="submit" disabled={saving} style={{
            padding: "12px 24px", background: saving ? "#1e3a5f" : "#14b8a6",
            color: saving ? "#64748b" : "#0a1628", borderRadius: 8,
            fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "default" : "pointer",
          }}>{saving ? "Registering..." : "Register Volunteer"}</button>
        </form>
      </main>
    </div>
  );
}
