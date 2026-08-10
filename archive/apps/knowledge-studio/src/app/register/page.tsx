"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
      }}
    >
      <div
        style={{
          width: 380,
          padding: 32,
          background: "#111827",
          borderRadius: 16,
          border: "1px solid #1e293b",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#e2e8f0",
            marginBottom: 4,
          }}
        >
          Create Account
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 24 }}>
          Join Knowledge Studio
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginBottom: 4,
              }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#1e1e2e",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#e2e8f0",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginBottom: 4,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#1e1e2e",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#e2e8f0",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginBottom: 4,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#1e1e2e",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#e2e8f0",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>
          {error && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "0.85rem",
                marginBottom: 12,
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 0",
              background: "#2563eb",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p
          style={{
            color: "#64748b",
            fontSize: "0.8rem",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: "#60a5fa" }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
