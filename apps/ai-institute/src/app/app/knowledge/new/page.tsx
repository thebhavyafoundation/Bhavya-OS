"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface Concept {
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface Definition {
  term: string;
  definition: string;
}

interface Example {
  title: string;
  description: string;
}

interface Misconception {
  belief: string;
  correction: string;
}

interface Exercise {
  prompt: string;
  type: "mcq" | "short-answer" | "reflection" | "project";
  solution?: string;
}

interface KOForm {
  title: string;
  domain: string;
  description: string;
  grade: number;
  subject: string;
  concepts: Concept[];
  definitions: Definition[];
  examples: Example[];
  misconceptions: Misconception[];
  exercises: Exercise[];
  prerequisites: string[];
  related: string[];
}

const emptyForm: KOForm = {
  title: "",
  domain: "",
  description: "",
  grade: 9,
  subject: "AI",
  concepts: [],
  definitions: [],
  examples: [],
  misconceptions: [],
  exercises: [],
  prerequisites: [],
  related: [],
};

export default function NewKnowledgeObjectPage() {
  const router = useRouter();
  const [form, setForm] = useState<KOForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (form.title.length > 200)
      errors.title = "Title must be 200 characters or fewer";
    if (!form.domain.trim()) errors.domain = "Domain is required";
    if (form.domain.length > 100)
      errors.domain = "Domain must be 100 characters or fewer";
    if (form.description.length > 2000)
      errors.description = "Description must be 2000 characters or fewer";
    if (form.grade < 1 || form.grade > 12)
      errors.grade = "Grade must be between 1 and 12";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/studio/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const msgs = data.errors.map(
            (e: { field: string; message: string }) =>
              `${e.field}: ${e.message}`,
          );
          setError(msgs.join("; "));
        } else {
          setError(data.error || "Failed to create knowledge object");
        }
        return;
      }

      // Success — navigate to knowledge list
      router.push("/app/knowledge");
    } catch {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  const addConcept = () => {
    setForm({
      ...form,
      concepts: [
        ...form.concepts,
        { name: "", description: "", difficulty: "beginner" },
      ],
    });
  };

  const removeConcept = (i: number) => {
    setForm({ ...form, concepts: form.concepts.filter((_, idx) => idx !== i) });
  };

  const updateConcept = (i: number, patch: Partial<Concept>) => {
    const concepts = [...form.concepts];
    concepts[i] = { ...concepts[i], ...patch };
    setForm({ ...form, concepts });
  };

  const addDefinition = () => {
    setForm({
      ...form,
      definitions: [...form.definitions, { term: "", definition: "" }],
    });
  };

  const removeDefinition = (i: number) => {
    setForm({
      ...form,
      definitions: form.definitions.filter((_, idx) => idx !== i),
    });
  };

  const updateDefinition = (i: number, patch: Partial<Definition>) => {
    const definitions = [...form.definitions];
    definitions[i] = { ...definitions[i], ...patch };
    setForm({ ...form, definitions });
  };

  const addExample = () => {
    setForm({
      ...form,
      examples: [...form.examples, { title: "", description: "" }],
    });
  };

  const removeExample = (i: number) => {
    setForm({ ...form, examples: form.examples.filter((_, idx) => idx !== i) });
  };

  const updateExample = (i: number, patch: Partial<Example>) => {
    const examples = [...form.examples];
    examples[i] = { ...examples[i], ...patch };
    setForm({ ...form, examples });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "var(--space-3)",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    color: "var(--text)",
    fontSize: "var(--text-sm)",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "var(--space-2)",
    display: "block",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/app/knowledge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              color: "var(--text-secondary)",
              fontSize: "var(--text-sm)",
              textDecoration: "none",
              marginBottom: "var(--space-4)",
            }}
          >
            <ArrowLeft size={16} />
            Back to Knowledge
          </Link>
          <h1
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            Create Knowledge Object
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-2)",
            }}
          >
            Create a new knowledge object. It will be saved as a draft until
            published.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "var(--space-4)",
              background: "var(--color-status-error-bg, #fef2f2)",
              border: "1px solid var(--color-status-error-border, #fecaca)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-status-error-text, #991b1b)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-6)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Introduction to Artificial Intelligence"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.title
                  ? "var(--color-status-error, #ef4444)"
                  : undefined,
              }}
            />
            {fieldErrors.title && (
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-status-error, #ef4444)",
                  marginTop: "var(--space-1)",
                }}
              >
                {fieldErrors.title}
              </div>
            )}
          </div>

          {/* Domain + Subject */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            <div>
              <label style={labelStyle}>Domain *</label>
              <input
                type="text"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="e.g., AI, Forest, Heritage"
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.domain
                    ? "var(--color-status-error, #ef4444)"
                    : undefined,
                }}
              />
              {fieldErrors.domain && (
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-status-error, #ef4444)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {fieldErrors.domain}
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g., AI, Computer Science"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Brief description of this knowledge object..."
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
                borderColor: fieldErrors.description
                  ? "var(--color-status-error, #ef4444)"
                  : undefined,
              }}
            />
            {fieldErrors.description && (
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-status-error, #ef4444)",
                  marginTop: "var(--space-1)",
                }}
              >
                {fieldErrors.description}
              </div>
            )}
          </div>

          {/* Grade */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <label style={labelStyle}>Grade Level</label>
            <input
              type="number"
              min={1}
              max={12}
              value={form.grade}
              onChange={(e) =>
                setForm({ ...form, grade: parseInt(e.target.value) || 9 })
              }
              style={{
                ...inputStyle,
                width: 120,
                borderColor: fieldErrors.grade
                  ? "var(--color-status-error, #ef4444)"
                  : undefined,
              }}
            />
            {fieldErrors.grade && (
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-status-error, #ef4444)",
                  marginTop: "var(--space-1)",
                }}
              >
                {fieldErrors.grade}
              </div>
            )}
          </div>

          {/* Concepts */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-3)",
              }}
            >
              <label style={{ ...labelStyle, marginBottom: 0 }}>Concepts</label>
              <button
                type="button"
                onClick={addConcept}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-1)",
                  padding: "var(--space-1) var(--space-3)",
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "var(--text-xs)",
                  cursor: "pointer",
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {form.concepts.map((concept, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={concept.name}
                  onChange={(e) => updateConcept(i, { name: e.target.value })}
                  placeholder="Concept name"
                  style={{ ...inputStyle, flex: 2 }}
                />
                <input
                  type="text"
                  value={concept.description}
                  onChange={(e) =>
                    updateConcept(i, { description: e.target.value })
                  }
                  placeholder="Description"
                  style={{ ...inputStyle, flex: 3 }}
                />
                <select
                  value={concept.difficulty}
                  onChange={(e) =>
                    updateConcept(i, {
                      difficulty: e.target.value as Concept["difficulty"],
                    })
                  }
                  style={{ ...inputStyle, flex: 1 }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeConcept(i)}
                  style={{
                    padding: "var(--space-2)",
                    color: "var(--color-status-error, #ef4444)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Definitions */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-3)",
              }}
            >
              <label style={{ ...labelStyle, marginBottom: 0 }}>
                Definitions
              </label>
              <button
                type="button"
                onClick={addDefinition}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-1)",
                  padding: "var(--space-1) var(--space-3)",
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "var(--text-xs)",
                  cursor: "pointer",
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {form.definitions.map((def, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={def.term}
                  onChange={(e) =>
                    updateDefinition(i, { term: e.target.value })
                  }
                  placeholder="Term"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="text"
                  value={def.definition}
                  onChange={(e) =>
                    updateDefinition(i, { definition: e.target.value })
                  }
                  placeholder="Definition"
                  style={{ ...inputStyle, flex: 3 }}
                />
                <button
                  type="button"
                  onClick={() => removeDefinition(i)}
                  style={{
                    padding: "var(--space-2)",
                    color: "var(--color-status-error, #ef4444)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Examples */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-3)",
              }}
            >
              <label style={{ ...labelStyle, marginBottom: 0 }}>Examples</label>
              <button
                type="button"
                onClick={addExample}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-1)",
                  padding: "var(--space-1) var(--space-3)",
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "var(--text-xs)",
                  cursor: "pointer",
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {form.examples.map((ex, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={ex.title}
                  onChange={(e) => updateExample(i, { title: e.target.value })}
                  placeholder="Example title"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="text"
                  value={ex.description}
                  onChange={(e) =>
                    updateExample(i, { description: e.target.value })
                  }
                  placeholder="Description"
                  style={{ ...inputStyle, flex: 3 }}
                />
                <button
                  type="button"
                  onClick={() => removeExample(i)}
                  style={{
                    padding: "var(--space-2)",
                    color: "var(--color-status-error, #ef4444)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              justifyContent: "flex-end",
            }}
          >
            <Link
              href="/app/knowledge"
              style={{
                padding: "var(--space-3) var(--space-6)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "var(--space-3) var(--space-6)",
                background: submitting
                  ? "var(--text-tertiary)"
                  : "var(--forest)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Creating..." : "Create Knowledge Object"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
