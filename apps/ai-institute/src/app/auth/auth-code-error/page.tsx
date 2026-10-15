"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AuthCodeError() {
  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = "/login";
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Authentication Failed
        </h1>
        <p className="mb-6 text-gray-600">
          We couldn&apos;t complete your sign-in. This might be due to an
          expired or invalid authentication link.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Return to Login
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Redirecting automatically in 5 seconds...
        </p>
      </div>
    </main>
  );
}
