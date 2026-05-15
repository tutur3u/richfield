import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { KpiStrip } from "@/app/_components/primitives/kpi-strip";
import { YouTubeEmbed } from "@/app/_components/primitives/youtube-embed";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { JvFeature } from "@/app/_components/sections/jv-feature";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { importExportBody } from "@/content/en/capabilities";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Warehouse & Logistics",
  description:
    "End-to-end handling, north and south. Two distribution centres, ambient and cold storage, co-packing capability.",
  alternates: { canonical: "/logistics" },
};

const KPIS = [
  { label: "Distribution centres", value: "2" },
  { label: "Storage", value: "Ambient + cold" },
  { label: "Co-packing", value: "Capable" },
];

export default function LogisticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Warehouse & Logistics"
        heading="End-to-end handling, north and *south*."
        lede="Two distribution centres cover Vietnam end to end. Ambient and cold storage, co-packing infrastructure, and vehicles serving every province."
      />

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto max-w-[1300px]">
          <KpiStrip items={KPIS} tone="on-cream" />
        </div>
      </section>

      <section
        aria-labelledby="warehouse-tour-heading"
        className="bg-ink pb-[clamp(80px,10vw,140px)] pt-[clamp(80px,10vw,140px)] text-paper"
      >
        <RevealOnScroll className="mx-auto mb-[clamp(40px,5vw,72px)] flex max-w-[1500px] flex-col gap-4 px-6 sm:px-10">
          <Eyebrow tone="gold">Inside the operation</Eyebrow>
          <h2
            id="warehouse-tour-heading"
            className="max-w-[24ch] font-display text-[clamp(32px,4vw,56px)] leading-[1.1]"
          >
            A walk through the *distribution centre*.
          </h2>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-paper/70">
            Press play for a tour of our facilities — receiving, ambient and
            cold storage, picking lanes, and the trucks that move product to
            every province.
          </p>
        </RevealOnScroll>
        <div className="px-3 sm:px-6">
          <RevealOnScroll className="mx-auto w-full max-w-[1500px]" delayMs={120}>
            <YouTubeEmbed
              videoId="-_zNf5wSr8g"
              title="Richfield warehouse and distribution centre tour"
              caption="Richfield distribution centre — facility tour"
            />
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          <RevealOnScroll as="article" className="flex flex-col gap-4">
            <Image
              src="/photos/warehouse/warehouse-1.png"
              alt="Long An distribution centre"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
            <Eyebrow tone="gold">South DC</Eyebrow>
            <h3 className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
              Long An.
            </h3>
            <p className="max-w-[55ch] text-[15px] leading-[1.55] text-muted">
              Our southern hub covers Ho Chi Minh City and the Mekong Delta.
              Ambient and cold storage, dedicated trucking lanes, and direct
              connections to the country's busiest retail corridors.
            </p>
          </RevealOnScroll>
          <RevealOnScroll as="article" delayMs={120} className="flex flex-col gap-4">
            <Image
              src="/photos/warehouse/warehouse-2.png"
              alt="Hanoi distribution centre"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
            <Eyebrow tone="gold">North DC</Eyebrow>
            <h3 className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
              Hanoi.
            </h3>
            <p className="max-w-[55ch] text-[15px] leading-[1.55] text-muted">
              Our northern hub serves Hanoi and the surrounding provinces.
              Same handling standards, same temperature ranges, same SLA.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[1fr_1.2fr]">
          <RevealOnScroll>
            <Image
              src="/photos/warehouse/co-packing.png"
              alt="Richfield co-packing facility"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
          </RevealOnScroll>
          <RevealOnScroll className="flex flex-col gap-6" delayMs={120}>
            <Eyebrow tone="gold">Co-packing</Eyebrow>
            <DisplayHeading level={2}>Primary and secondary packing under one roof.</DisplayHeading>
            <p className="max-w-[55ch] text-[17px] leading-[1.55] text-muted">
              Primary and secondary packing lines with hand-washing and
              pest-control infrastructure. Co-packing serves both
              Richfield-distributed brands and joint-venture production through
              Dory Rich.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <JvFeature variant="slim" />

      <section className="bg-cream px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
          <Eyebrow tone="gold">Import &amp; Export</Eyebrow>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
            {importExportBody}
          </p>
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
