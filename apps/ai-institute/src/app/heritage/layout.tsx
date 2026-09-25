import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heritage | Bhavya Foundation",
  description:
    "Living heritage, sacred architecture, and cultural memory — the Heritage pillar.",
};

export default function HeritageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
