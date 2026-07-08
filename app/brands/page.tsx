import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { JourneyTimeline } from "@/app/_components/magazine/media/journey-timeline";
import { ShelfExplorer } from "@/app/_components/magazine/spreads/shelf-explorer";
import { getRichfieldContent } from "@/lib/richfield-delivery";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "The brands Richfield carries — three decades of partnerships across confectionery, beverages, and personal care, and the full shelf of products behind them.",
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  const { brandTimeline, shelfCategories } = await getRichfieldContent();

  return (
    <>
      <RunningHead />
      <main className="bg-cream text-ink">
        {/* Intro + collaboration timeline — one cream movement. */}
        <Spread
          id="brands"
          bg="cream"
          head
          className="flex flex-col gap-y-[var(--v2-flow)]"
        >
          <div className="flex w-full flex-col gap-y-[var(--v2-rhythm)] hyphens-auto" lang="en">
            <Eyebrow>OUR BRANDS</Eyebrow>
            <h1 className="font-display v2-headline">
              Trusted by the world&rsquo;s most{" "}
              <em className="italic text-gold-strong">loved</em> brands.
            </h1>
            <p className="v2-size-body w-full opacity-90">
              100+ products across confectionery, beverages, personal care, and
              more. Richfield carries the brands shoppers already reach for, in
              partnerships that often run for decades.
            </p>
          </div>

          <div className="flex flex-col gap-y-[var(--v2-rhythm)]">
            <Eyebrow>THE COLLABORATIONS</Eyebrow>
            <JourneyTimeline milestones={brandTimeline} />
          </div>
        </Spread>

        {/* The portfolio — every product, by category. */}
        <Spread id="portfolio" bg="white">
          <ShelfExplorer categories={shelfCategories} />
        </Spread>

      </main>
    </>
  );
}
