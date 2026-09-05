"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TreePine, ArrowLeft, Plus } from "lucide-react";

const REGIONS = [
  "Western Ghats",
  "Eastern Ghats",
  "Himalayan Foothills",
  "Central Indian Highlands",
  "Northeast India",
  "Aravalli Range",
  "Sundarbans",
  "Deccan Plateau",
  "Other",
];

export default function NewForestMissionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [goals, setGoals] = useState("");
  const [tags, setTags] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name || !region) {
      setError("Name and region are required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/forest/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          region,
          goals: goals ? goals.split(",").map((g) => g.trim()).filter(Boolean) : [],
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Creation failed");
      }
      const mission = await res.json();
      if (mission?.id) {
        router.push("/app/forest");
      } else {
        setError("Creation failed — no mission ID returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Creation failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-3 mb-8">
        <TreePine className="w-6 h-6 text-forest" />
        <h1
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.02em",
          }}
        >
          New Forest Mission
        </h1>
      </div>

      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--text-secondary)",
          marginBottom: "var(--space-8)",
        }}
      >
        Create a new forest restoration mission. Evidence and metrics are
        recorded automatically after successful creation.
      </p>

      {error && (
        <div
          style={{
            padding: "var(--space-4)",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "var(--radius-md)",
            color: "#ef4444",
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-6)",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {/* Name */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "var(--space-2)",
            }}
          >
            Mission Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Western Ghats Restoration Phase II"
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--text)",
              fontSize: "var(--text-sm)",
              outline: "none",
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "var(--space-2)",
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the mission objectives and approach..."
            rows={3}
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--text)",
              fontSize: "var(--text-sm)",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>

        {/* Region */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "var(--space-2)",
            }}
          >
            Region *
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--text)",
              fontSize: "var(--text-sm)",
              outline: "none",
            }}
          >
            <option value="">Select a region</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Goals */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "var(--space-2)",
            }}
          >
            Goals
          </label>
          <input
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Comma-separated: restore 100 hectares, plant 5000 trees"
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--text)",
              fontSize: "var(--text-sm)",
              outline: "none",
            }}
          />
        </div>

        {/* Tags */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "var(--space-2)",
            }}
          >
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated: reforestation, biodiversity, community"
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--text)",
              fontSize: "var(--text-sm)",
              outline: "none",
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !name || !region}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-2)",
            padding: "var(--space-3) var(--space-6)",
            background: creating || !name || !region ? "var(--border)" : "var(--forest)",
            color: creating || !name || !region ? "var(--text-secondary)" : "#fff",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            cursor: creating || !name || !region ? "not-allowed" : "pointer",
            border: "none",
          }}
        >
          <Plus size={16} />
          {creating ? "Creating..." : "Create Mission"}
        </button>

        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-secondary)",
          }}
        >
          Evidence and metrics are recorded automatically after successful
          creation. Created missions are eligible for public projection.
        </p>
      </div>
    </div>
  );
}
