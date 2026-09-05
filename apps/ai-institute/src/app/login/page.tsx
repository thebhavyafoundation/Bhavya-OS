"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { roleHome, type Role } from "@/lib/roles";
import { safeRedirect } from "@/lib/participation-intents";

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
      // Middleware-provided ?redirect= wins when it is a safe in-app path;
      // otherwise route by the authenticated user's primary role.
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
    <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#8a7359] flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#f5f1e6]">Welcome back</h1>
          <p className="text-sm text-[#8a7359] mt-1">
            Sign in to continue learning
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8a7359] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#0d1410] border border-[#1a3a2a]/40 text-[#f5f1e6] text-sm placeholder-[#8a7359]/40 focus:outline-none focus:border-[#c9a227]/40 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8a7359] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl bg-[#0d1410] border border-[#1a3a2a]/40 text-[#f5f1e6] text-sm placeholder-[#8a7359]/40 focus:outline-none focus:border-[#c9a227]/40 transition-colors"
              placeholder="8+ characters"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#c9a227] text-[#0a0f0d] font-semibold text-sm hover:bg-[#c9a227]/90 transition-colors disabled:opacity-30"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-[#8a7359]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#c9a227] hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
