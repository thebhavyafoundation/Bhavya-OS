import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Bhavya Foundation",
  description: "Frequently asked questions about Bhavya Foundation.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
