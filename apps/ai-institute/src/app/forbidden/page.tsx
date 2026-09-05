import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Not Permitted | Bhavya Foundation",
  description:
    "You don't have permission to access this area of Bhavya Foundation.",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/25 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-[#c9a227]" />
        </div>
        <h1 className="text-2xl font-bold text-[#f5f1e6] mb-2">
          You don&apos;t have permission to access this area.
        </h1>
        <p className="text-sm text-[#8a7359] mb-8">
          This workspace is limited to specific roles. If you believe you should
          have access, contact the institution rather than creating another
          account — one person, one Bhavya identity.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-[#1a3a2a]/40 text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/app"
            className="px-5 py-2.5 rounded-xl bg-[#c9a227] text-[#0a0f0d] text-sm font-semibold hover:bg-[#c9a227]/90 transition-colors"
          >
            My Bhavya
          </Link>
        </div>
      </div>
    </div>
  );
}
