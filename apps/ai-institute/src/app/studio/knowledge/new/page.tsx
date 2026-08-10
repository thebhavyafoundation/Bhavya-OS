"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createKnowledgeObject } from "@/lib/studio/runtime-client";
import { Brain, ArrowLeft, Plus } from "lucide-react";

export default function NewKnowledgePage() {
  const router = useRouter();
  const [domain, setDomain] = useState("AI");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState(9);
  const [subject, setSubject] = useState("Computer Science");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title || !domain) {
      setError("Title and domain are required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const ko = await createKnowledgeObject({ domain, title, description, grade, subject });
      if (ko?.id) {
        router.push(`/studio/knowledge/${ko.id}/edit`);
      } else {
        setError("Creation failed");
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
        <Brain className="w-6 h-6 text-accent-gold" />
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          New Knowledge Object
        </h1>
      </div>

      <div className="glass rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50 transition-colors"
            >
              <option value="AI">Artificial Intelligence</option>
              <option value="ML">Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Ecology">Ecology</option>
              <option value="Heritage">Heritage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Neural Networks"
              className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-gold/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What does this Knowledge Object cover?"
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-gold/50 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Grade Level</label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              min={1}
              max={12}
              className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50 transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">{error}</div>
        )}

        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !title}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent-gold text-text-inverse text-sm font-semibold hover:bg-accent-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {creating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Knowledge Object
            </>
          )}
        </button>
      </div>
    </div>
  );
}
