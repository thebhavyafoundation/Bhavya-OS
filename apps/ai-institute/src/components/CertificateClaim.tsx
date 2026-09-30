"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { CertificateRecord } from "@/lib/certificate";

interface StatusResponse {
  eligible: boolean;
  completedLessons: number;
  totalLessons: number;
  hasProfile: boolean;
  certificate: CertificateRecord | null;
}

interface CertificateClaimProps {
  courseId: string;
}

export function CertificateClaim({ courseId }: CertificateClaimProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [fetching, setFetching] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setFetching(false);
      return;
    }
    setFetching(true);
    try {
      const res = await fetch(
        `/api/certificates?courseId=${encodeURIComponent(courseId)}`,
      );
      if (res.ok) {
        setStatus((await res.json()) as StatusResponse);
        setError(null);
      } else {
        setStatus(null);
      }
    } catch {
      setError("Certificate status is unavailable right now.");
    } finally {
      setFetching(false);
    }
  }, [courseId, isAuthenticated]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function claim() {
    setClaiming(true);
    setError(null);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const payload = (await res.json()) as {
        credentialId?: string;
        error?: string;
      };
      if (res.ok && payload.credentialId) {
        router.push(`/certificates/${payload.credentialId}`);
        return;
      }
      setError(payload.error ?? "The certificate could not be issued.");
      if (res.status !== 500) await loadStatus();
    } catch {
      setError("The certificate could not be issued.");
    } finally {
      setClaiming(false);
    }
  }

  if (authLoading || fetching) {
    return (
      <section className="mt-12 border border-border-primary bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Certificate of completion
        </h2>
        <p className="mt-2 text-sm text-text-tertiary">
          Checking your progress...
        </p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mt-12 border border-border-primary bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Certificate of completion
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
          Finish every lesson in this course to claim a verifiable credential.
          Sign in to track progress against your own record.
        </p>
        <Link href="/login" className="btn-secondary mt-4 inline-block">
          Sign in
        </Link>
      </section>
    );
  }

  if (!status || !status.hasProfile) {
    return (
      <section className="mt-12 border border-border-primary bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Certificate of completion
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
          Complete onboarding to start recording lessons on this course.
        </p>
        <Link href="/onboarding" className="btn-secondary mt-4 inline-block">
          Continue onboarding
        </Link>
      </section>
    );
  }

  const progress =
    status.totalLessons > 0
      ? Math.round((status.completedLessons / status.totalLessons) * 100)
      : 0;

  return (
    <section className="mt-12 border border-border-primary bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">
          Certificate of completion
        </h2>
        <span className="font-mono text-xs text-text-tertiary">
          {status.completedLessons} of {status.totalLessons} lessons complete
        </span>
      </div>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden bg-bg-tertiary"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Lessons completed"
      >
        <div
          className="h-full bg-accent-gold transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {status.certificate ? (
        <p className="mt-4 text-sm text-text-secondary">
          Issued on{" "}
          <Link
            href={`/certificates/${status.certificate.credentialId}`}
            className="font-medium text-accent-gold hover:underline"
          >
            {new Date(status.certificate.issuedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Link>{" "}
          — credential {status.certificate.credentialId}
        </p>
      ) : status.eligible ? (
        <div className="mt-4">
          <p className="text-sm text-text-secondary">
            Every lesson is complete. Claim the credential to receive a
            certificate you can share and verify.
          </p>
          <button
            type="button"
            onClick={claim}
            disabled={claiming}
            className="btn-primary mt-4 disabled:cursor-wait disabled:opacity-70"
          >
            {claiming ? "Issuing..." : "Claim certificate"}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-tertiary">
          Complete the remaining {status.totalLessons - status.completedLessons}{" "}
          lessons to claim your certificate.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-status-error">
          {error}
        </p>
      )}
    </section>
  );
}
