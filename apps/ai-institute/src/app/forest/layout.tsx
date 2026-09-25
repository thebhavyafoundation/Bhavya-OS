import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forest | Bhavya Foundation",
  description:
    "Ecosystem restoration, water security, and biodiversity — the Forest pillar.",
};

export default function ForestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
