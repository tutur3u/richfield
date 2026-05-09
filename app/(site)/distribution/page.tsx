import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { KpiStrip } from "@/app/_components/primitives/kpi-strip";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { gtFormats, mtFormats, importExportBody } from "@/content/en/capabilities";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Distribution",
  description:
    "From the warehouse floor to every shelf. General trade, modern trade, and import / export across Vietnam.",
  alternates: { canonical: "/distribution" },
};

const KPIS = [
  { label: "Salesmen", value: "800+" },
  { label: "Sub-distributors", value: "300+" },
  { label: "Retail outlets", value: "180K" },
];

export default function DistributionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Distribution"
        heading="From the warehouse floor to *every shelf*."
        lede="Nationwide reach through general trade and modern trade, anchored by import and export support that brings international brands into Vietnam."
      />

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto max-w-[1300px]">
          <KpiStrip items={KPIS} tone="on-cream" />
        </div>
      </section>

      <section
        id="gt"
        className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
      >
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Eyebrow tone="gold">General Trade</Eyebrow>
            <DisplayHeading level={2}>General Trade.</DisplayHeading>
            <p className="max-w-[55ch] text-[17px] leading-[1.55] text-muted">
              Nationwide coverage with 800+ salesmen across every province and
              city, supported by 300+ sub-distributors and a network of 180,000
              retail outlets.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px] uppercase tracking-[0.16em] text-muted">
              {gtFormats.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <Image
            src="/photos/distribution/gt.png"
            alt="Outlet types we serve in general trade"
            width={1200}
            height={800}
            className="h-auto w-full rounded-sm bg-paper"
          />
        </div>
      </section>

      <section
        id="mt"
        className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
      >
        <div className="mx-auto flex max-w-[1300px] flex-col gap-10">
          <div className="flex flex-col gap-6">
            <Eyebrow tone="gold">Modern Trade</Eyebrow>
            <DisplayHeading level={2}>Modern Trade.</DisplayHeading>
            <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
              Retailer partnerships across every chain in Vietnam, with
              trade-marketing display and event support.
            </p>
          </div>
          <Image
            src="/photos/distribution/mt.png"
            alt="Modern trade chains we distribute to"
            width={2000}
            height={900}
            className="h-auto w-full rounded-sm bg-paper"
          />
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] uppercase tracking-[0.16em] text-muted">
            {mtFormats.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-8 lg:grid-cols-2">
          <figure className="flex flex-col gap-3">
            <Image
              src="/photos/distribution/events.png"
              alt="Trade marketing events and activities"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
            <figcaption className="text-[14px] text-muted">
              Trade marketing events and activations across the country.
            </figcaption>
          </figure>
          <figure className="flex flex-col gap-3">
            <Image
              src="/photos/distribution/special-display.png"
              alt="In-store special displays and merchandising"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
            <figcaption className="text-[14px] text-muted">
              Special displays and merchandising for partner brands.
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        id="import-export"
        className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
      >
        <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
          <Eyebrow tone="gold">Import &amp; Export</Eyebrow>
          <DisplayHeading level={2}>Import &amp; Export.</DisplayHeading>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
            {importExportBody}
          </p>
          <SoftCta href="/contact">
            Detailed capability brief on request. Get in touch
          </SoftCta>
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
