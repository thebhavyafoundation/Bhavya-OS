"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function NewMissionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    region: "",
    goals: "",
    tags: "",
  });
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
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    if (res.ok) {
      const mission = await res.json();
      router.push(`/missions/${mission.id}`);
    }
    setSaving(false);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050f0a" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 640 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#f8fafc",
            marginBottom: 24,
          }}
        >
          New Mission
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {[
            {
              key: "name",
              label: "Mission Name",
              placeholder: "e.g. Himalayan Cedar Restoration",
            },
            {
              key: "region",
              label: "Region",
              placeholder: "e.g. Himachal Pradesh",
            },
          ].map((field) => (
            <div key={field.key}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#94a3b8",
                  marginBottom: 6,
                }}
              >
                {field.label}
              </label>
              <input
                required
                value={form[field.key as keyof typeof form]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "#0a1a0f",
                  border: "1px solid #1a3a2a",
                  borderRadius: 8,
                  color: "#f8fafc",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
          ))}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                color: "#94a3b8",
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Mission goals and scope..."
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#0a1a0f",
                border: "1px solid #1a3a2a",
                borderRadius: 8,
                color: "#f8fafc",
                fontSize: 14,
                outline: "none",
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
                color: "#94a3b8",
                marginBottom: 6,
              }}
            >
              Goals (one per line)
            </label>
            <textarea
              rows={3}
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
              placeholder="Restore 100 hectares&#10;Plant 10,000 trees&#10;Monitor for 5 years"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#0a1a0f",
                border: "1px solid #1a3a2a",
                borderRadius: 8,
                color: "#f8fafc",
                fontSize: 14,
                outline: "none",
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
                color: "#94a3b8",
                marginBottom: 6,
              }}
            >
              Tags (comma separated)
            </label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="reforestation, biodiversity, community"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#0a1a0f",
                border: "1px solid #1a3a2a",
                borderRadius: 8,
                color: "#f8fafc",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 24px",
              background: saving ? "#1a3a2a" : "#4ade80",
              color: saving ? "#64748b" : "#0a1a0f",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: saving ? "default" : "pointer",
            }}
          >
            {saving ? "Creating..." : "Create Mission"}
          </button>
        </form>
      </main>
    </div>
  );
}
