import Link from "next/link";
import { findCertificateByCredentialId } from "@/lib/certificate-store";
import { verificationUrl } from "@/lib/certificate";

export const dynamic = "force-dynamic";

interface VerifyPageProps {
  params: Promise<{ credentialId: string }>;
}

function formatIssuedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: VerifyPageProps) {
  const { credentialId } = await params;
  const certificate = await findCertificateByCredentialId(credentialId);
  if (!certificate) {
    return {
      title: "Credential not found | Bhavya Foundation",
      description:
        "No credential matches this id on the Bhavya Foundation verification page.",
    };
  }
  return {
    title: `Credential ${certificate.credentialId} | Bhavya Foundation`,
    description: `Verification record for ${certificate.holderName}, ${certificate.subjectTitle}.`,
  };
}

export default async function VerifyCredentialPage({
  params,
}: VerifyPageProps) {
  const { credentialId } = await params;
  const certificate = await findCertificateByCredentialId(credentialId);

  if (!certificate) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <p className="editorial-label">Credential verification</p>
          <h1 className="editorial-heading mt-3 text-5xl text-text-primary">
            No credential found
          </h1>
          <p className="editorial-lead mt-6 max-w-xl">
            The id <span className="font-mono">{credentialId}</span> does not
            match any credential issued by Bhavya Foundation. Credentials are
            issued only when a learner completes every lesson of a course, so
            there is nothing to verify at this address.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/courses" className="btn-primary">
              Browse courses
            </Link>
            <Link href="/" className="btn-secondary">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const details = [
    { label: "Recipient", value: certificate.holderName },
    { label: "Course", value: certificate.subjectTitle },
    ...(certificate.subjectLevel
      ? [{ label: "Level", value: certificate.subjectLevel }]
      : []),
    { label: "Completed", value: formatIssuedDate(certificate.issuedAt) },
    { label: "Credential ID", value: certificate.credentialId, mono: true },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:py-28">
        <div>
          <p className="editorial-label">Credential verification</p>
          <h1 className="editorial-heading mt-3 text-5xl text-text-primary lg:text-6xl">
            This credential is on record.
          </h1>
          <p className="editorial-lead mt-6 max-w-xl">
            Bhavya Foundation issued this record to{" "}
            <span className="text-text-primary">{certificate.holderName}</span>{" "}
            after every lesson of{" "}
            <span className="text-text-primary">
              {certificate.subjectTitle}
            </span>{" "}
            was complete. The details below are read live from the issuing
            record.
          </p>

          <dl className="mt-10 max-w-xl divide-y divide-border-primary border-y border-border-primary">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <dt className="text-sm text-text-tertiary">{detail.label}</dt>
                <dd
                  className={`text-right text-base text-text-primary ${
                    detail.mono ? "font-mono text-sm" : "font-medium"
                  }`}
                >
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/certificates/${certificate.credentialId}`}
              className="btn-primary"
            >
              View certificate
            </Link>
            <Link href="/courses" className="btn-secondary">
              Browse courses
            </Link>
          </div>
        </div>

        <aside className="lg:pt-16">
          <div className="verify-status-card border border-border-gold bg-surface p-8">
            <span className="verify-status-pill inline-flex items-center gap-2 rounded-full bg-accent-gold px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest-950">
              Valid
            </span>
            <p className="mt-6 font-mono text-sm text-text-secondary">
              {certificate.credentialId}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-tertiary">
              Verify this record again at any time:
            </p>
            <p className="mt-1 break-all font-mono text-xs text-text-secondary">
              {verificationUrl(certificate.credentialId)}
            </p>
            <p className="mt-6 border-t border-border-primary pt-4 text-xs leading-relaxed text-text-muted">
              Issued by Bhavya Foundation. This page reports what the issuing
              record contains and nothing more.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
