"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface RepoOption {
  id: string;
  name: string;
  language?: string;
  stars?: number;
  forks?: number;
  license?: string;
  health_score?: number;
  technology_score?: number;
  bhavya_score?: number;
  engineering_maturity?: string;
  recommendation_type?: string;
  why_bhavya_cares?: string;
}

export function NewEvaluationForm({ repos }: { repos: RepoOption[] }) {
  const router = useRouter();
  const [repoId, setRepoId] = useState(repos[0]?.id ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (repos.length === 0) {
    return (
      <p className="text-xs text-text-muted">
        No analyzed repositories available. Seed GitHub OS first — evaluation jobs are created from real repository data only.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const repo = repos.find((r) => r.id === repoId);
    if (!repo) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/os/mission/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId: repo.id }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; job?: { id: string }; deduped?: boolean };
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      if (!data.job) throw new Error("Evaluation did not return a job");
      router.push(`/os/mission/jobs/${data.job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create evaluation");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-52">
        <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-eval-repo">Evaluate analyzed repository</label>
        <select
          id="mc-eval-repo"
          value={repoId}
          onChange={(e) => setRepoId(e.target.value)}
          className="w-full px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary"
        >
          {repos.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-accent-gold/20 text-sm font-medium text-accent-gold disabled:opacity-50">
        {busy ? "Creating…" : "Start evaluation job"}
      </button>
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
