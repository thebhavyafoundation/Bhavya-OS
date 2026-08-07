"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#0a0f0d] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
    >
      Skip to content
    </a>
  );
}
