import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { findCertificateByCredentialId } from "@/lib/certificate-store";
import { verificationUrl } from "@/lib/certificate";
import { CertificateCard } from "@/components/CertificateCard";

export const dynamic = "force-dynamic";

interface CertificatePageProps {
  params: Promise<{ credentialId: string }>;
}

export async function generateMetadata({ params }: CertificatePageProps) {
  const { credentialId } = await params;
  const certificate = await findCertificateByCredentialId(credentialId);
  if (!certificate) return { title: "Certificate not found" };
  return {
    title: `${certificate.subjectTitle} — ${certificate.holderName} | Bhavya Foundation`,
    description: `Certificate of completion issued to ${certificate.holderName} for ${certificate.subjectTitle}.`,
  };
}

export default async function CertificatePage({
  params,
}: CertificatePageProps) {
  const { credentialId } = await params;
  const certificate = await findCertificateByCredentialId(credentialId);
  if (!certificate) notFound();

  const verifyUrl = verificationUrl(certificate.credentialId);

  // QR module colours mirror the brand tokens --color-forest-700 on
  // --color-ivory-100; the QR encoder needs literal values, not CSS vars.
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 512,
    color: { dark: "#0e382e", light: "#f7f4ec" },
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/certificates"
            className="text-sm text-accent-gold hover:underline"
          >
            ← All credentials
          </Link>
          <Link
            href={`/verify/${certificate.credentialId}`}
            className="text-sm text-text-tertiary hover:text-accent-gold"
          >
            Verification record
          </Link>
        </div>

        <CertificateCard
          certificate={certificate}
          qrDataUrl={qrDataUrl}
          verifyUrl={verifyUrl}
        />
      </div>
    </div>
  );
}
