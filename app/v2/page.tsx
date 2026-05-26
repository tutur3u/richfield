import type { Metadata } from "next";
import Link from "next/link";
import { ColophonSpread } from "@/app/_components/v2/colophon-spread";
import { CoverSpread } from "@/app/_components/v2/cover-spread";
import { DirectorySpread } from "@/app/_components/v2/directory-spread";
import { FieldAtlasSpread } from "@/app/_components/v2/field-atlas-spread";
import { JointVentureSpread } from "@/app/_components/v2/joint-venture-spread";
import { LeadSpread } from "@/app/_components/v2/lead-spread";
import { LenisProvider } from "@/app/_components/v2/lenis-provider";
import {
  MagazineFlow,
  MagazineFlowSection,
} from "@/app/_components/v2/magazine-flow";
import { WhatWeDoSpread } from "@/app/_components/v2/what-we-do-spread";

const CREAM = "oklch(0.96 0.018 82)";
const INK = "oklch(0.22 0.015 158)";

export const metadata: Metadata = {
  title: "Richfield · Issue 30 · v2 preview",
  description:
    "Prototype of the Issue 30 · Worldwide editorial direction. Side-by-side comparison with the current homepage at /.",
  robots: { index: false, follow: false },
};

export default function V2HomePage() {
  return (
    <LenisProvider>
      <main className="bg-cream text-ink">
        <Link
          href="/"
          className="v2-mono v2-size-folio fixed left-4 top-4 z-50 rounded-full border border-cream/30 bg-ink/70 px-4 py-2 text-cream backdrop-blur-md transition-colors duration-200 hover:bg-ink/90"
        >
          ← V2 PREVIEW · BACK TO CURRENT
        </Link>

        <CoverSpread />

        <MagazineFlow>
          <MagazineFlowSection bg={CREAM}>
            <LeadSpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={INK} textOnDark>
            <WhatWeDoSpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={CREAM}>
            <FieldAtlasSpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={CREAM}>
            <DirectorySpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={INK} textOnDark>
            <JointVentureSpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={CREAM}>
            <ColophonSpread />
          </MagazineFlowSection>
        </MagazineFlow>
      </main>
    </LenisProvider>
  );
}
