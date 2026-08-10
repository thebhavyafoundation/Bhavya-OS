"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getKnowledgeObject,
  updateKnowledgeObject,
} from "@/lib/studio/runtime-client";
import { Brain, ArrowLeft, Save } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default function EditKnowledgePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [ko, setKo] = useState<AnyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [domain, setDomain] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState(9);
  const [subject, setSubject] = useState("");
  const [conceptsText, setConceptsText] = useState("");
  const [definitionsText, setDefinitionsText] = useState("");

  useEffect(() => {
    getKnowledgeObject(id)
      .then((data) => {
        setKo(data);
        setDomain(data?.domain || "");
        setTitle(data?.title || "");
        setDescription(data?.description || "");
        setGrade(data?.grade || 9);
        setSubject(data?.subject || "");
        setConceptsText(
          (data?.concepts || [])
            .map((c: { name: string; description: string; difficulty: string }) =>
              `${c.name}: ${c.description} (${c.difficulty})`
            )
            .join("\n")
        );
        setDefinitionsText(
          (data?.definitions || [])
            .map((d: { term: string; definition: string }) => `${d.term}: ${d.definition}`)
            .join("\n")
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const concepts = conceptsText
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [name, ...rest] = line.split(":");
        const desc = rest.join(":").trim();
        const diffMatch = desc.match(/\((\w+)\)$/);
        return {
          name: name.trim(),
          description: diffMatch ? desc.replace(/\(\w+\)$/, "").trim() : desc,
          difficulty: (diffMatch?.[1] as "beginner" | "intermediate" | "advanced") || "beginner",
        };
      });

    const definitions = definitionsText
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [term, ...rest] = line.split(":");
        return { term: term.trim(), definition: rest.join(":").trim() };
      });

    await updateKnowledgeObject(id, {
      domain,
      title,
      description,
      grade,
      subject,
      concepts,
      definitions,
    });
    setSaving(false);
    router.push("/studio/knowledge");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass rounded-xl p-8 animate-pulse">
          <div className="h-6 bg-bg-tertiary rounded w-64 mb-4" />
          <div className="h-4 bg-bg-tertiary rounded w-96" />
        </div>
      </div>
    );
  }

  if (!ko) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-text-muted">
        Knowledge Object not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-accent-gold" />
          <h1 className="text-2xl font-bold text-text-primary">Edit Knowledge Object</h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-gold text-text-inverse text-sm font-semibold hover:bg-accent-gold-hover disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-tertiary mb-1">Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50"
              >
                <option value="AI">AI</option>
                <option value="ML">ML</option>
                <option value="Data Science">Data Science</option>
                <option value="Computer Science">CS</option>
                <option value="Mathematics">Math</option>
                <option value="Ecology">Ecology</option>
                <option value="Heritage">Heritage</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1">Grade</label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-tertiary mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50"
            />
          </div>
          <div>
            <label className="block text-xs text-text-tertiary mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50"
            />
          </div>
          <div>
            <label className="block text-xs text-text-tertiary mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50 resize-none"
            />
          </div>
        </div>

        {/* Concepts & Definitions */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-3">
              Concepts (one per line)
            </h2>
            <p className="text-xs text-text-muted mb-2">
              Format: name: description (difficulty)
            </p>
            <textarea
              value={conceptsText}
              onChange={(e) => setConceptsText(e.target.value)}
              rows={8}
              placeholder={"neural network: A computing system inspired by biological neurons (beginner)\n supervised learning: Training with labeled data (intermediate)"}
              className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary font-mono outline-none focus:border-accent-gold/50 resize-none"
            />
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-3">
              Definitions (one per line)
            </h2>
            <p className="text-xs text-text-muted mb-2">
              Format: term: definition
            </p>
            <textarea
              value={definitionsText}
              onChange={(e) => setDefinitionsText(e.target.value)}
              rows={6}
              placeholder={"epoch: One complete pass through the training dataset\nlearning rate: Step size for weight updates"}
              className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary font-mono outline-none focus:border-accent-gold/50 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
