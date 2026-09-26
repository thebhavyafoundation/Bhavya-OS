"use client";

import Link from "next/link";
import { BhavyaLogo } from "@/components/BhavyaLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <BhavyaLogo size="sm" />
        </div>
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <p className="text-lg text-text-tertiary mb-8">Page not found</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-accent-gold text-text-primary hover:bg-accent-gold/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
