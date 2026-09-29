"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { CertificateRecord } from "@/lib/certificate";

interface CertificateCardProps {
  certificate: CertificateRecord;
  qrDataUrl: string;
  verifyUrl: string;
}

function formatCompletedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CertificateCard({
  certificate,
  qrDataUrl,
  verifyUrl,
}: CertificateCardProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function downloadPng() {
    const node = sheetRef.current;
    if (!node) return;
    setExporting(true);
    setExportError(null);
    try {
      const background = getComputedStyle(node).backgroundColor;
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: background || undefined,
      });
      const link = document.createElement("a");
      link.download = `${certificate.credentialId}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setExportError(
        "The PNG could not be rendered here. Screenshot the certificate or use the verification link.",
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div ref={sheetRef} className="certificate-sheet">
        <div className="certificate-sheet-inner">
          <header className="certificate-header">
            <img
              src="/brand/logo-full.png"
              alt="Bhavya Foundation"
              width={220}
              height={64}
              className="certificate-logo"
            />
            <p className="certificate-issuer">Bhavya Foundation</p>
          </header>

          <div className="certificate-rule" aria-hidden="true" />

          <div className="certificate-body">
            <div className="certificate-copy">
              <h1 className="certificate-title">Certificate of Completion</h1>
              <p className="certificate-preamble">This records that</p>
              <p className="certificate-holder">{certificate.holderName}</p>
              <p className="certificate-preamble">has completed</p>
              <p className="certificate-course">{certificate.subjectTitle}</p>
              {certificate.subjectLevel && (
                <p className="certificate-level">
                  Level: {certificate.subjectLevel}
                </p>
              )}
              <p className="certificate-date">
                Completed {formatCompletedDate(certificate.issuedAt)}
              </p>
            </div>

            <aside className="certificate-verification">
              <img
                src={qrDataUrl}
                alt={`QR code linking to ${verifyUrl}`}
                width={168}
                height={168}
                className="certificate-qr"
              />
              <p className="certificate-qr-label">Scan to verify</p>
              <p className="certificate-id">{certificate.credentialId}</p>
              <p className="certificate-verify-url">{verifyUrl}</p>
            </aside>
          </div>

          <footer className="certificate-footer">
            <span>Issued as a record of completed course lessons.</span>
            <span>{formatCompletedDate(certificate.issuedAt)}</span>
          </footer>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={downloadPng}
          disabled={exporting}
          className="btn-primary disabled:cursor-wait disabled:opacity-70"
        >
          {exporting ? "Rendering PNG..." : "Download PNG"}
        </button>
        <a
          href={verifyUrl}
          className="btn-secondary"
          target="_blank"
          rel="noreferrer"
        >
          Open verification page
        </a>
      </div>
      {exportError && (
        <p role="status" className="mt-3 text-sm text-status-error">
          {exportError}
        </p>
      )}
    </div>
  );
}
