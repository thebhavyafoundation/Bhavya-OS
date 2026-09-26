import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Final CTA — ivory closer. One clear invitation.
 */
export function FinalCta() {
  return (
    <section className="section-ivory" aria-label="Join the journey">
      <div
        className="container"
        style={{
          paddingTop: "var(--space-24)",
          paddingBottom: "var(--space-24)",
        }}
      >
        <div className="home-final">
          <span className="editorial-label">Invitation</span>
          <h2 className="home-final-title">
            A kinder, more resilient India is possible.
          </h2>
          <p
            className="editorial-lead"
            style={{ maxWidth: "560px", margin: "0 auto" }}
          >
            Volunteer, partner, research, or support the work — there is a place
            for you in what lasts.
          </p>
          <Link href="/get-involved" className="btn btn-gold">
            Join the journey <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
