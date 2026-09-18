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
      const post = async (url: string, body: unknown) => {
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
        return data as { id: string };
      };
      const job = await post("/os/mission/api/jobs", {
        title: `Evaluate ${repo.name}`,
        department: "intelligence",
        agent: "github-os",
      });
      await post("/os/mission/api/jobs/" + job.id, { action: "start" });
      await post("/os/mission/api/artifacts", {
        op: "create",
        jobId: job.id,
        kind: "research",
        title: `Capability evaluation: ${repo.name}`,
        source: "bhavya-internal",
        producer: "github-os",
        note: [
          `Repository: ${repo.name}`,
          repo.language ? `Language: ${repo.language}` : null,
          typeof repo.stars === "number" ? `Stars: ${repo.stars}` : null,
          typeof repo.forks === "number" ? `Forks: ${repo.forks}` : null,
          repo.license ? `License: ${repo.license}` : null,
          typeof repo.health_score === "number" ? `Health: ${repo.health_score}` : null,
          typeof repo.technology_score === "number" ? `Technology: ${repo.technology_score}` : null,
          typeof repo.bhavya_score === "number" ? `Bhavya score: ${repo.bhavya_score}` : null,
          repo.engineering_maturity ? `Maturity: ${repo.engineering_maturity}` : null,
          repo.recommendation_type ? `Recommendation: ${repo.recommendation_type}` : null,
          repo.why_bhavya_cares ? `Relevance: ${repo.why_bhavya_cares}` : null,
        ]
          .filter(Boolean)
          .join(" · "),
      });
      router.push(`/os/mission/jobs/${job.id}`);
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
