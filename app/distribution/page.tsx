import type { Metadata } from "next";
import Image from "next/image";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { RetailerWall } from "@/app/_components/sections/retailer-wall";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Distribution",
  description:
    "From the warehouse floor to every shelf. General trade and modern trade across Vietnam.",
  alternates: { canonical: "/distribution" },
};

export default function DistributionPage() {
  return (
    <>
      <RunningHead />
      <main className="bg-cream text-ink">
        {/* General Trade — opens the chapter. Same column rhythm as
            our-story (copy + a plate on the left, two plates on the right), but
            on desktop the whole spread is locked to one viewport: images are
            height-driven (flex-1 + object-cover) so nothing scrolls. Below lg it
            relaxes to an aspect-ratio stack. */}
        <section
          id="gt"
          className="v2-display relative w-full bg-cream text-ink lg:h-[100svh]"
        >
          <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col gap-[var(--v2-flow)] px-6 pb-[var(--v2-section)] pt-[calc(var(--v2-runhead)+var(--v2-section)/2)] sm:px-10 lg:flex-row lg:items-stretch lg:gap-[var(--v2-col-gap)] lg:px-12 lg:pb-[calc(var(--v2-section)/2)]">
            {/* Left column: copy, then a plate filling the remaining height. */}
            <div className="flex flex-col gap-[var(--v2-flow)] lg:w-[47%] lg:min-h-0">
              <RevealOnScroll className="flex flex-col gap-[var(--v2-rhythm)]">
                <Eyebrow>01 / 02 · GENERAL TRADE</Eyebrow>
                <h2 className="font-display v2-size-standfirst">
                  General <em className="italic text-gold-strong">Trade</em>
                </h2>
                <p className="v2-size-body opacity-90">
                  Our largest channel. 300+ sub-distributors reaching traditional
                  retail points across all provinces: markets, grocery stores,
                  and specialty shops. Traditional trade has been our foundation
                  since 1994.
                </p>
              </RevealOnScroll>

              <RevealOnScroll as="figure" className="relative w-full overflow-hidden max-lg:aspect-[4/3] lg:min-h-0 lg:flex-1">
                <Image
                  src="/photos/RF Website/Distribution Channels/General Trade/Tap-hoa-2.webp"
                  alt="A traditional tap hoa grocery store stocked with packaged goods."
                  fill
                  sizes="(max-width:1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </RevealOnScroll>
            </div>

            {/* Right column: two plates splitting the viewport height. */}
            <div className="flex flex-col gap-[var(--v2-flow)] lg:min-h-0 lg:flex-1">
              <RevealOnScroll as="figure" delayMs={120} className="relative w-full overflow-hidden max-lg:aspect-[3/2] lg:min-h-0 lg:flex-1">
                <Image
                  src="/photos/RF Website/Distribution Channels/General Trade/Wholesaler Market.webp"
                  alt="A wholesaler market aisle lined with cased products."
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </RevealOnScroll>
              <RevealOnScroll as="figure" delayMs={240} className="relative w-full overflow-hidden max-lg:aspect-[3/2] lg:min-h-0 lg:flex-1">
                <Image
                  src="/photos/RF Website/Distribution Channels/General Trade/Independent Pharmacies.webp"
                  alt="An independent pharmacy counter and shelving."
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Modern Trade — the heading + the partner wall, one section. */}
        <RetailerWall />

      </main>
    </>
  );
}
