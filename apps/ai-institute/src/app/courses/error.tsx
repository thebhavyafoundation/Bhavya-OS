"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 text-xl">
          !
        </div>
        <h2 className="text-lg font-semibold text-[#f5f1e6] mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[#f5f1e6]/60 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm font-medium bg-[#1a3a2a] text-[#f5f1e6] rounded-lg hover:bg-[#1a3a2a]/80 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
