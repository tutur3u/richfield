import { CoverSpread } from "@/app/_components/magazine/spreads/cover-spread";
import { BrandsHeroSpread } from "@/app/_components/magazine/spreads/brands-hero-spread";
import { FootPrintSpread } from "@/app/_components/magazine/spreads/footprint-spread";
import { GroupOverviewSpread } from "@/app/_components/magazine/spreads/group-overview-spread";
import { JointVentureSpread } from "@/app/_components/magazine/spreads/joint-venture-spread";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { MagazineFlow } from "@/app/_components/magazine/chrome/magazine-flow";
import { WhatWeDoSpread } from "@/app/_components/magazine/spreads/what-we-do-spread";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import { toLocale } from "@/lib/locale";
import { setRequestLocale } from "next-intl/server";

// The homepage opens the magazine: the cover, what we do, the footprint, the
// Dory Rich venture, and the brand portfolio on one cream canvas. The company
// story lives under the About Us nav (Our Story, Who We Are); the action pages
// — What We Do, Careers, Contact — are their own routes. Each spread carries
// its own <section id> for deep links.
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const { brands } = await getRichfieldContent(locale);

  return (
    <>
      <RunningHead locale={locale} transparentOverHero />
      <main className="v2-bg-morph text-ink">
        <CoverSpread locale={locale} />

        <MagazineFlow>
          <GroupOverviewSpread locale={locale} />
          {/* <PeopleMosaic /> */}
          {/* What we do (teaser) → footprint → joint venture */}
          <WhatWeDoSpread locale={locale} />
          <FootPrintSpread locale={locale} />
          <JointVentureSpread locale={locale} />
          {/* Brands → contact close */}
          <BrandsHeroSpread brands={brands} locale={locale} />
        </MagazineFlow>
      </main>
    </>
  );
}
