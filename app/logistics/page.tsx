import type { Metadata } from "next";
import Image from "next/image";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { LogisticsHero } from "@/app/_components/magazine/spreads/logistics-hero";
import { YouTubeEmbed } from "@/app/_components/primitives/youtube-embed";
import { warehouseHubs } from "@/content/en/hubs";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Warehouse & Logistics",
  description:
    "End-to-end handling, north and south. Two distribution centres, ambient and cold storage, co-packing capability.",
  alternates: { canonical: "/logistics" },
};

// Facility photography keyed by hub.
const HUB_PHOTO: Record<string, string> = {
  "Northern Hub": "/photos/warehouse/warehouse-2.png",
  "Southern Hub": "/photos/warehouse/warehouse-1.png",
};

export default function LogisticsPage() {
  return (
    <>
      <RunningHead />
      <main className="bg-cream text-ink">
        <LogisticsHero />

        {/* Facility tour */}
        <section className="v2-display relative flex w-full flex-col bg-paper">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-y-[var(--v2-flow)] px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
            <div className="flex flex-col gap-y-[var(--v2-rhythm)]">
              <p className="v2-mono v2-size-folio text-gold-strong">INSIDE THE OPERATION</p>
              <h2 className="font-display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.0] tracking-[-0.022em] max-w-[24ch]">
                A walk through the{" "}
                <em className="italic text-gold-strong">distribution centre</em>.
              </h2>
              <p className="v2-size-body max-w-[60ch] opacity-90">
                Press play for a tour of our facilities — receiving, ambient and
                cold storage, picking lanes, and the trucks that move product to
                every province.
              </p>
            </div>
            <YouTubeEmbed
              videoId="-_zNf5wSr8g"
              title="Richfield warehouse and distribution centre tour"
              caption="Richfield distribution centre — facility tour"
            />
          </div>
        </section>

        {/* Two distribution centres */}
        <section className="v2-display relative flex w-full flex-col bg-cream">
          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-x-[var(--v2-col-gap)] gap-y-[clamp(40px,5vw,72px)] px-6 py-[var(--v2-section)] sm:px-10 lg:grid-cols-2 lg:px-12">
            {warehouseHubs.map((hub) => (
              <article key={hub.name} className="flex flex-col gap-y-[var(--v2-rhythm)]">
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={HUB_PHOTO[hub.name]}
                    alt={`${hub.name} — ${hub.location}`}
                    fill
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="v2-mono v2-size-folio text-gold-strong">
                  {hub.name.toUpperCase()}
                </p>
                <h3 className="font-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.05] tracking-[-0.02em]">
                  {hub.location}
                </h3>
                <ul className="v2-size-body flex flex-col gap-1 opacity-90">
                  <li>{hub.facility}</li>
                  <li>{hub.pallets}</li>
                  <li>{hub.cold}</li>
                </ul>
                <p className="v2-mono v2-size-folio opacity-55">
                  COVERAGE · {hub.coverage.toUpperCase()}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Co-packing */}
        <section className="v2-display relative flex w-full flex-col bg-paper">
          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-8 px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
            <div className="col-span-12 lg:col-span-6">
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src="/photos/warehouse/co-packing.png"
                  alt="Richfield co-packing facility"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="col-span-12 flex flex-col gap-y-[var(--v2-rhythm)] lg:col-span-6">
              <p className="v2-mono v2-size-folio text-gold-strong">CO-PACKING</p>
              <h2 className="font-display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.0] tracking-[-0.022em]">
                Primary and secondary packing under one roof.
              </h2>
              <p className="v2-size-body max-w-[55ch] opacity-90">
                Primary and secondary packing lines with hand-washing and
                pest-control infrastructure. Co-packing serves both
                Richfield-distributed brands and joint-venture production through
                Dory Rich.
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
