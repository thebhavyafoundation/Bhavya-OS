"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { getIntent } from "@/lib/participation-intents";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = getIntent(searchParams.get("intent"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const result = await register(email, password, name);
    setLoading(false);
    if (result.success) {
      router.push(
        intent.id === "learn"
          ? "/onboarding"
          : `/onboarding?intent=${intent.id}`,
      );
    } else {
      setError(result.error || "Registration failed");
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
          <h1 className="text-2xl font-bold text-[#f5f1e6]">
            {intent.id === "learn" ? "Create your account" : intent.headline}
          </h1>
          <p className="text-sm text-[#8a7359] mt-1">
            {intent.id === "learn"
              ? "Start your AI learning journey"
              : intent.sub}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8a7359] mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#0d1410] border border-[#1a3a2a]/40 text-[#f5f1e6] text-sm placeholder-[#8a7359]/40 focus:outline-none focus:border-[#c9a227]/40 transition-colors"
              placeholder="Your name"
            />
          </div>
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-[#8a7359]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#c9a227] hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
