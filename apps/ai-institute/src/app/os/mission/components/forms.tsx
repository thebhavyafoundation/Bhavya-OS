"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data;
}

export function NewJobForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("engineering");
  const [tasks, setTasks] = useState<{ task: { id: string; title: string; status: string } }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/os/mission/api/tasks")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setTasks(Array.isArray(rows) ? rows : []))
      .catch(() => {});
  }, []);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const job = (await postJson("/os/mission/api/jobs", { title, department, taskContractIds: selected })) as { id: string };
      router.push(`/os/mission/jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-52">
        <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-job-title">New job</label>
        <input
          id="mc-job-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Evaluate offline video pipeline"
          className="w-full px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-secondary"
        />
      </div>
      <div>
        <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-job-dept">Department</label>
        <select
          id="mc-job-dept"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary"
        >
          {["intelligence", "research", "knowledge", "content", "design", "engineering", "distribution", "governance"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={busy || !title.trim()}
        className="px-4 py-2 rounded-lg bg-accent-gold text-sm font-medium text-text-primary disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create job"}
      </button>
      {tasks.length > 0 && (
        <div className="w-full">
          <span className="block text-xs text-text-tertiary mb-1">Link task contracts (optional, from .ai/tasks)</span>
          <div className="flex flex-wrap gap-2">
            {tasks.map(({ task }) => (
              <label key={task.id} className="flex items-center gap-1.5 text-xs text-text-secondary border border-border-primary rounded-full px-2.5 py-1">
                <input type="checkbox" checked={selected.includes(task.id)} onChange={() => toggle(task.id)} />
                <span className="font-mono">{task.id}</span> {task.title} ({task.status})
              </label>
            ))}
          </div>
        </div>
      )}
      {error && <p role="alert" className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}

export function JobActions({ jobId, status }: { jobId: string; status: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const allowed: Record<string, string[]> = {
    queued: ["start", "cancel"],
    running: ["submit", "stop", "cancel"],
    awaiting_approval: ["complete", "stop"],
    revising: ["submit", "stop"],
  };
  const actions = allowed[status] ?? [];

  async function run(action: string) {
    let reason = "";
    if (action === "stop") {
      reason = window.prompt("Reason for stopping this job (recorded):") ?? "";
      if (!reason.trim()) return;
    }
    setError("");
    setBusy(true);
    try {
      await postJson(`/os/mission/api/jobs/${jobId}`, { action, reason });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transition failed");
    } finally {
      setBusy(false);
    }
  }

  if (actions.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((a) => (
        <button
          key={a}
          type="button"
          disabled={busy}
          onClick={() => run(a)}
          className="px-3 py-1.5 rounded-lg border border-border-primary text-xs font-medium text-text-primary hover:bg-bg-secondary transition disabled:opacity-50"
        >
          {a === "submit" ? "Submit for approval" : a[0].toUpperCase() + a.slice(1)}
        </button>
      ))}
      {error && <p role="alert" className="w-full text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function RequestApprovalButton({ artifactId }: { artifactId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setError("");
    setBusy(true);
    try {
      await postJson("/os/mission/api/approvals", { op: "request", artifactId });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={run}
        className="px-3 py-1.5 rounded-lg bg-accent-gold/20 text-xs font-medium text-accent-gold hover:bg-accent-gold/30 transition disabled:opacity-50"
      >
        {busy ? "Requesting…" : "Request approval"}
      </button>
      {error && <p role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function DecisionForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [instruction, setInstruction] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function decide(action: "approve" | "reject" | "request_revision") {
    if ((action === "reject" || action === "request_revision") && !reason.trim()) {
      setError("A reason is required to reject or request revision.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await postJson("/os/mission/api/approvals", {
        op: "decide",
        requestId,
        action,
        reason,
        instruction,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decision failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <input
        value={reason}
        aria-label="Decision reason (required to reject or request revision)"
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (required to reject / revise)"
        className="w-full px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-xs text-text-primary placeholder-text-secondary"
      />
      <input
        value={instruction}
        aria-label="Revision instruction (optional)"
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Revision instruction (optional)"
        className="w-full px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-xs text-text-primary placeholder-text-secondary"
      />
      <div className="flex gap-2">
        <button type="button" disabled={busy} onClick={() => decide("approve")} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-xs font-medium text-green-400 disabled:opacity-50">Approve</button>
        <button type="button" disabled={busy} onClick={() => decide("reject")} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-xs font-medium text-red-400 disabled:opacity-50">Reject</button>
        <button type="button" disabled={busy} onClick={() => decide("request_revision")} className="px-3 py-1.5 rounded-lg bg-accent-gold/20 text-xs font-medium text-accent-gold disabled:opacity-50">Request revision</button>
      </div>
      {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function IntegrationActions({ artifactId, status }: { artifactId: string; status: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const next =
    status === "approved" ? "verify"
    : status === "verified" ? "beginIntegrate"
    : status === "integrating" ? "completeIntegrate"
    : null;
  if (!next) return null;

  const label = next === "verify" ? "Mark verified" : next === "beginIntegrate" ? "Begin integration" : "Complete integration";

  async function run() {
    let note = "";
    if (next === "completeIntegrate") {
      note = window.prompt("Integration note (recorded with the approval):") ?? "";
      if (!note.trim()) return;
    }
    setError("");
    setBusy(true);
    try {
      await postJson("/os/mission/api/artifacts", { op: next, artifactId, note });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2">
      <button type="button" disabled={busy} onClick={run} className="px-3 py-1.5 rounded-lg border border-accent-gold/40 text-xs font-medium text-accent-gold disabled:opacity-50">
        {busy ? "Working…" : label}
      </button>
      {error && <p role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function NewVersionForm({ artifactId }: { artifactId: string }) {  const router = useRouter();
  const [note, setNote] = useState("");
  const [humanReplacement, setHumanReplacement] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await postJson("/os/mission/api/artifacts", {
        op: "addVersion",
        artifactId,
        producer: humanReplacement ? "human-operator" : "agent",
        humanReplacement,
        note,
      });
      setNote("");
      setHumanReplacement(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record version");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-center gap-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Version note (what changed)"
        className="flex-1 min-w-40 px-3 py-1.5 bg-bg-secondary border border-border-primary rounded-lg text-xs text-text-primary placeholder-text-secondary"
      />
      <label className="flex items-center gap-1.5 text-xs text-text-secondary">
        <input type="checkbox" checked={humanReplacement} onChange={(e) => setHumanReplacement(e.target.checked)} />
        Human replacement
      </label>
      <button type="submit" disabled={busy} className="px-3 py-1.5 rounded-lg border border-border-primary text-xs font-medium text-text-primary disabled:opacity-50">
        {busy ? "Recording…" : "Record version"}
      </button>
      {error && <p role="alert" className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
