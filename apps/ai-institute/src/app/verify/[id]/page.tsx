import { notFound } from "next/navigation";
import { getAsyncDb } from "@/lib/db";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const db = getAsyncDb();
  const cert = await db.get("SELECT * FROM certificates WHERE id = ?", id);
  if (!cert) return { title: "Certificate Not Found" };
  return {
    title: `Certificate ${cert.id} — ${cert.learner_name} — Bhavya Foundation`,
    description: `Verified certificate for ${cert.module_id} — Score: ${cert.quiz_score}%`,
  };
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getAsyncDb();
  const cert = await db.get("SELECT * FROM certificates WHERE id = ?", id);

  if (!cert) notFound();

  const verifyUrl = `https://bhavyafoundation.org/verify/${cert.id}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-16)",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-primary)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-12)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--color-brand-forest)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              marginBottom: "var(--space-2)",
            }}
          >
            Certificate of Completion
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
            }}
          >
            Verified on Bhavya Foundation
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-border-primary)",
            borderBottom: "1px solid var(--color-border-primary)",
            padding: "var(--space-6) 0",
            marginBottom: "var(--space-8)",
          }}
        >
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-2)",
            }}
          >
            This certifies that
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--color-brand-forest)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              marginBottom: "var(--space-6)",
            }}
          >
            {cert.learner_name}
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-base)",
              marginBottom: "var(--space-2)",
            }}
          >
            has successfully completed the module
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--color-brand-forest)",
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
            }}
          >
            {cert.module_id}
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-4)",
              background: "var(--color-bg-primary)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-primary)",
            }}
          >
            <p
              style={{
                fontSize: "var(--text-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--color-text-secondary)",
                marginBottom: "var(--space-1)",
              }}
            >
              Module Band
            </p>
            <p
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 600,
                color: "var(--color-brand-forest)",
              }}
            >
              {cert.band}
            </p>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-4)",
              background: "var(--color-bg-primary)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-primary)",
            }}
          >
            <p
              style={{
                fontSize: "var(--text-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--color-text-secondary)",
                marginBottom: "var(--space-1)",
              }}
            >
              Quiz Score
            </p>
            <p
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 600,
                color: "var(--color-brand-forest)",
              }}
            >
              {cert.quiz_score}%
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            marginBottom: "var(--space-8)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "var(--text-sm)",
            }}
          >
            <span style={{ color: "var(--color-text-secondary)" }}>
              Certificate ID
            </span>
            <code
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-primary)",
              }}
            >
              {cert.id}
            </code>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "var(--text-sm)",
            }}
          >
            <span style={{ color: "var(--color-text-secondary)" }}>Issued</span>
            <span style={{ color: "var(--color-text-primary)" }}>
              {new Date(cert.issued_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "var(--text-sm)",
            }}
          >
            <span style={{ color: "var(--color-text-secondary)" }}>
              Verification URL
            </span>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-brand-forest)",
                textDecoration: "underline",
              }}
            >
              {verifyUrl}
            </a>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-border-primary)",
            paddingTop: "var(--space-6)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            This certificate is issued by Bhavya Foundation upon successful
            completion of all module lessons and a module quiz score of 80% or
            higher. It represents demonstrated competence, not accredited
            certification. Verify authenticity at{" "}
            <a
              href={verifyUrl}
              style={{
                color: "var(--color-brand-forest)",
                textDecoration: "underline",
              }}
            >
              bhavyafoundation.org/verify
            </a>
            .
          </p>
        </div>

        <div style={{ marginTop: "var(--space-8)", textAlign: "center" }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <linearGradient
                id="goldGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--color-accent-gold)" />
                <stop offset="100%" stopColor="#b8860b" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="3"
            />
            <circle
              cx="60"
              cy="60"
              r="42"
              fill="none"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />
            <text
              x="60"
              y="68"
              fontFamily="var(--font-display)"
              fontSize="24"
              fill="url(#goldGradient)"
              textAnchor="middle"
              fontWeight="600"
            >
              BVF
            </text>
          </svg>
          <p
            style={{
              marginTop: "var(--space-3)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-secondary)",
            }}
          >
            Official Seal — Bhavya Foundation
          </p>
        </div>
      </div>
    </div>
  );
}
