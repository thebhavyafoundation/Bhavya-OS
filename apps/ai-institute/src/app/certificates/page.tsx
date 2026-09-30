import Link from "next/link";
import { requireSessionUser } from "@/lib/require-role";
import { listCertificatesByUser } from "@/lib/certificate-store";

export const dynamic = "force-dynamic";

function formatIssuedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function CertificatesIndexPage() {
  const user = await requireSessionUser("/certificates");
  const certificates = await listCertificatesByUser(user.id);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-end">
          <div>
            <h1 className="editorial-heading text-4xl text-text-primary lg:text-5xl">
              Your credentials
            </h1>
            <p className="editorial-lead mt-4 max-w-xl">
              Certificates you have claimed for completed courses. Each one has
              a public verification address that anyone can check.
            </p>
          </div>
          <p className="text-sm text-text-tertiary lg:text-right">
            {certificates.length === 0
              ? "Nothing claimed yet."
              : `${certificates.length} on record`}
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="mt-12 border border-border-primary bg-surface p-8">
            <p className="text-base leading-relaxed text-text-secondary">
              Certificates appear here once you finish every lesson of a course
              and claim it from the course page. Nothing is issued
              automatically, so there is nothing to show yet.
            </p>
            <Link href="/courses" className="btn-primary mt-6 inline-block">
              Browse courses
            </Link>
          </div>
        ) : (
          <ul className="mt-12 divide-y divide-border-primary border-y border-border-primary">
            {certificates.map((certificate) => (
              <li
                key={certificate.id}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5"
              >
                <div>
                  <Link
                    href={`/certificates/${certificate.credentialId}`}
                    className="font-display text-xl text-text-primary hover:text-accent-gold"
                  >
                    {certificate.subjectTitle}
                  </Link>
                  <p className="mt-1 text-sm text-text-tertiary">
                    {certificate.subjectLevel
                      ? `${certificate.subjectLevel} · `
                      : ""}
                    Completed {formatIssuedDate(certificate.issuedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-text-secondary">
                    {certificate.credentialId}
                  </p>
                  <Link
                    href={`/verify/${certificate.credentialId}`}
                    className="mt-1 inline-block text-xs text-accent-gold hover:underline"
                  >
                    Verify
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
