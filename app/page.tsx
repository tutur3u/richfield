import { CoverSpread } from "@/app/_components/magazine/spreads/cover-spread";
import { BrandsHeroSpread } from "@/app/_components/magazine/spreads/brands-hero-spread";
import { FootPrintSpread } from "@/app/_components/magazine/spreads/footprint-spread";
import { GroupOverviewSpread } from "@/app/_components/magazine/spreads/group-overview-spread";
import { JointVentureSpread } from "@/app/_components/magazine/spreads/joint-venture-spread";
import { PeopleMosaic } from "@/app/_components/magazine/spreads/people-mosaic";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { MagazineFlow } from "@/app/_components/magazine/chrome/magazine-flow";
import { WhatWeDoSpread } from "@/app/_components/magazine/spreads/what-we-do-spread";

// The homepage opens the magazine: the cover, what we do, the footprint, the
// Dory Rich venture, and the brand portfolio on one cream canvas. The company
// story lives under the About Us nav (Our Story, Who We Are); the action pages
// — What We Do, Careers, Contact — are their own routes. Each spread carries
// its own <section id> for deep links.
export default function HomePage() {
  return (
    <>
      <RunningHead />
      <main className="bg-cream text-ink">
        <CoverSpread />

        <MagazineFlow>
          <GroupOverviewSpread />
          {/* <PeopleMosaic /> */}
          {/* What we do (teaser) → footprint → joint venture */}
          <WhatWeDoSpread />
          <FootPrintSpread />
          <JointVentureSpread />
          {/* Brands → contact close */}
          <BrandsHeroSpread />
        </MagazineFlow>
      </main>
    </>
  );
}
