"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { roleHome, type Role } from "@/lib/roles";
import { safeRedirect } from "@/lib/participation-intents";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const redirect = safeRedirect(searchParams.get("redirect"));
      if (redirect) {
        router.push(redirect);
        return;
      }
      try {
        const me = await fetch("/api/auth/me");
        const body = me.ok ? await me.json() : null;
        const role = body?.user?.role as Role | undefined;
        router.push(role ? roleHome(role) : "/dashboard");
      } catch {
        router.push("/dashboard");
      }
    } else {
      setError(result.error || "Login failed");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SiteHeader />
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "var(--space-16) var(--space-4) var(--space-24)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            alignSelf: "flex-start",
            paddingTop: "var(--space-8)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "var(--space-8)" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-3xl, 1.875rem)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-2)",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              Sign in to continue learning
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-ivory-200)",
                  border: "1px solid var(--color-border-primary)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-primary)",
                  outline: "none",
                  transition: "border-color var(--duration-fast) ease",
                }}
                placeholder="you@example.com"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-gold)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-primary)";
                }}
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={{
                  width: "100%",
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-ivory-200)",
                  border: "1px solid var(--color-border-primary)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-primary)",
                  outline: "none",
                  transition: "border-color var(--duration-fast) ease",
                }}
                placeholder="8+ characters"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-gold)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-primary)";
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "#b91c1c",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
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
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-brand-gold)",
                color: "var(--color-forest-950)",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                border: "none",
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
                transition:
                  "opacity var(--duration-fast) ease, background var(--duration-fast) ease",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              textAlign: "center",
              marginTop: "var(--space-6)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{
                color: "var(--color-brand-gold)",
                textDecoration: "none",
              }}
            >
              Create one
            </Link>
          </motion.p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
