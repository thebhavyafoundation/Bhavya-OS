"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    principalInvestigator: "",
    mission: "Nature",
    tags: "",
    objectives: "",
    deliverables: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        principalInvestigator: form.principalInvestigator,
        mission: form.mission,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        objectives: form.objectives.split("\n").filter(Boolean),
        deliverables: form.deliverables.split("\n").filter(Boolean),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/projects/${data.id}`);
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: 24,
        }}
      >
        New Research Project
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#444",
              marginBottom: 6,
            }}
          >
            Title *
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#444",
              marginBottom: 6,
            }}
          >
            Principal Investigator *
          </label>
          <input
            required
            value={form.principalInvestigator}
            onChange={(e) =>
              setForm({ ...form, principalInvestigator: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#444",
              marginBottom: 6,
            }}
          >
            Mission
          </label>
          <select
            value={form.mission}
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 14,
              background: "#fff",
            }}
          >
            <option>Nature</option>
            <option>Knowledge</option>
            <option>Heritage</option>
            <option>Community</option>
          </select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#444",
              marginBottom: 6,
            }}
          >
            Tags (comma-separated)
          </label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="e.g. biodiversity, climate, restoration"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#444",
              marginBottom: 6,
            }}
          >
            Objectives (one per line)
          </label>
          <textarea
            value={form.objectives}
            onChange={(e) => setForm({ ...form, objectives: e.target.value })}
            rows={4}
            placeholder="What does this research aim to achieve?"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 14,
              resize: "vertical",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#444",
              marginBottom: 6,
            }}
          >
            Deliverables (one per line)
          </label>
          <textarea
            value={form.deliverables}
            onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
            rows={3}
            placeholder="What will this research produce?"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 14,
              resize: "vertical",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 20px",
              background: "#0D503C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Creating..." : "Create Project"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              padding: "10px 20px",
              background: "#fff",
              color: "#666",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
