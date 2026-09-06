"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { roleHome, type Role } from "@/lib/roles";
import { safeRedirect } from "@/lib/participation-intents";
import { SiteHeader } from "@/components/SiteHeader";

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
    <div className="min-h-screen bg-bg-primary">
      <SiteHeader />
      <div className="flex items-center justify-center p-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome back
            </h1>
            <p className="text-sm text-text-tertiary mt-1">
              Sign in to continue learning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-primary text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-border-focus transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-primary text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-border-focus transition-colors"
                placeholder="8+ characters"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-accent-gold text-text-primary font-semibold text-sm hover:bg-accent-gold-hover transition-colors disabled:opacity-30"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-text-tertiary">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-accent-gold hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
