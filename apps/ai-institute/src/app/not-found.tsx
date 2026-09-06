"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <p className="text-lg text-text-tertiary mb-8">Page not found</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[#c9a227] text-[#0a0f0d] text-sm font-semibold hover:bg-[#c9a227]/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
