import Link from "next/link";
import { Heart, LineChart, ReceiptText } from "lucide-react";
import { requirePolicy } from "@/lib/require-role";
import { EmptyState } from "@bhavya/platform-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Donor Workspace | Bhavya Foundation",
  description: "Your giving record, supported initiatives, and impact.",
};

export default async function DonorWorkspacePage() {
  const user = await requirePolicy("/os/donor");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Donor Workspace
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          {user.name} · {user.email}
        </p>
      </div>

      <div className="glass rounded-xl p-5 mb-8 border-[#c9a227]/25">
        <h2 className="text-sm font-semibold text-text-primary mb-2">
          Donation infrastructure
        </h2>
        <p className="text-xs text-text-tertiary leading-relaxed">
          Online donation processing is not yet connected, so no payment can be
          taken here — and none will be pretended. To donate, please contact{" "}
          <a
            href="mailto:donate@bhavya.foundation"
            className="underline text-[#c9a227]"
          >
            donate@bhavya.foundation
          </a>
          . Every confirmed donation is recorded by the institution and will
          appear in your history below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-accent-gold" />
            Donation history
          </h2>
          <EmptyState
            title="No donations recorded yet"
            description="Confirmed donations and receipts will appear here."
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-accent-gold" />
            Impact
          </h2>
          <p className="text-xs text-text-tertiary mb-4">
            Follow the work your giving supports.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/impact"
              className="px-4 py-2 rounded-lg bg-[#c9a227] text-[#0a0f0d] text-xs font-semibold hover:bg-[#c9a227]/90 transition-colors"
            >
              View impact
            </Link>
            <Link
              href="/missions"
              className="px-4 py-2 rounded-lg border border-[#1a3a2a]/40 text-xs text-[#8a7359] hover:text-[#f5f1e6] transition-colors"
            >
              Missions
            </Link>
            <Link
              href="/transparency"
              className="px-4 py-2 rounded-lg border border-[#1a3a2a]/40 text-xs text-[#8a7359] hover:text-[#f5f1e6] transition-colors"
            >
              Transparency
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
