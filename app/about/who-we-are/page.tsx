import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { OrganizationsSpread } from "@/app/_components/magazine/spreads/organizations-spread";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "One group, three companies — Richfield Worldwide, Richfield Foods, and Dory Rich — covering distribution, logistics, and energy drinks.",
  alternates: { canonical: "/about/who-we-are" },
};

// Who We Are — the three operating companies, each linking to its detail.
export default function WhoWeArePage() {
  return (
    <>
      <RunningHead />
      <main className="bg-white text-ink">
        <OrganizationsSpread head />
      </main>
    </>
  );
}
