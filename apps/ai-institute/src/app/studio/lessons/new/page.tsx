"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  listKnowledgeObjects,
  generateLesson,
} from "@/lib/studio/runtime-client";
import { BookOpen, ArrowLeft, Sparkles } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default function NewLessonPage() {
  const router = useRouter();
  const [kos, setKos] = useState<AnyRecord[]>([]);
  const [selectedKo, setSelectedKo] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listKnowledgeObjects()
      .then((data) => setKos(data as AnyRecord[]))
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!selectedKo || !title) {
      setError("Select a Knowledge Object and enter a title");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const ko = kos.find((k) => k.id === selectedKo);
      const result = await generateLesson(
        { ...ko, id: selectedKo },
        { title, duration },
      );
      if (result?.id) {
        router.push(`/studio/lessons/${result.id}`);
      } else {
        setError("Generation failed — no lesson ID returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
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
        <BookOpen className="w-6 h-6 text-accent-gold" />
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Generate Lesson
        </h1>
      </div>

      <div className="glass rounded-xl p-6 space-y-6">
        {/* Knowledge Object */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Knowledge Object
          </label>
          <select
            value={selectedKo}
            onChange={(e) => setSelectedKo(e.target.value)}
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50 transition-colors"
          >
            <option value="">Select a Knowledge Object...</option>
            {kos.map((ko) => (
              <option key={ko.id} value={ko.id}>
                {ko.title} ({ko.domain})
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Lesson Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Introduction to Machine Learning"
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={15}
            max={180}
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !selectedKo || !title}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent-gold text-text-inverse text-sm font-semibold hover:bg-accent-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Lesson
            </>
          )}
        </button>
      </div>
    </div>
  );
}
