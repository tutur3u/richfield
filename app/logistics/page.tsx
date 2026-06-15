import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { LogisticsHero } from "@/app/_components/magazine/spreads/logistics-hero";
import { HubScrollytelling } from "@/app/_components/magazine/spreads/hub-scrollytelling";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { YouTubeEmbed } from "@/app/_components/primitives/youtube-embed";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Warehouse & Logistics",
  description:
    "End-to-end handling, north and south. Two distribution centres, ambient and cold storage, co-packing capability.",
  alternates: { canonical: "/logistics" },
};

export default function LogisticsPage() {
  return (
    <>
      <RunningHead />
      <main className="bg-cream text-ink">
        <LogisticsHero />

        <HubScrollytelling />

        {/* Inside the operation — a cinematic video stage on the forest field,
            sized to one viewport. */}
        <section className="v2-display relative flex w-full flex-col justify-center overflow-clip bg-cream text-ink lg:min-h-screen">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-y-[var(--v2-rhythm)] px-6 py-[clamp(36px,4vw,60px)] sm:px-10 lg:px-12">
            {/* Masthead: kicker + headline left, lede right, over a drawn rule. */}
            <RevealOnScroll as="div" className="flex flex-col gap-y-[var(--v2-rhythm)]">
              <div className="flex flex-col gap-y-[var(--v2-rhythm)]">
                <p className="v2-mono v2-size-folio text-gold-strong">
                  INSIDE THE OPERATION
                </p>
                <h2 className="font-display text-[clamp(2.3rem,4vw,3.4rem)] leading-[1.0] tracking-[-0.022em] lg:text-nowrap">
                  A walk through the{" "}
                  <em className="italic text-gold-strong">distribution centre</em>.
                </h2>
              </div>
              <span
                aria-hidden
                className="v2-rule-gold v2-draw-rule mt-[var(--v2-rhythm)] block w-full origin-left opacity-50"
              />
            </RevealOnScroll>

            {/* The film: the dominant element. */}
            <RevealOnScroll as="div" delayMs={120}>
              <YouTubeEmbed
                videoId="-_zNf5wSr8g"
                title="Richfield warehouse and distribution centre tour"
                caption="Richfield distribution centre · facility tour"
                poster="/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0781.webp"
              />
            </RevealOnScroll>
          </div>
        </section>

      </main>
    </>
  );
}
