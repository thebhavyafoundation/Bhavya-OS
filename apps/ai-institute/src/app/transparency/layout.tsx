import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparency | Bhavya Foundation",
  description: "Governance, financials, and public accountability.",
};

export default function TransparencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
