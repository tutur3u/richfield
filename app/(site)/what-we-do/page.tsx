import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { CapabilityBlock } from "@/app/_components/primitives/capability-block";
import { JvFeature } from "@/app/_components/sections/jv-feature";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { pillars } from "@/content/en/capabilities";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "Four ways Richfield Group moves brands to market: import / export, warehouse and logistics, general trade, and modern trade.",
  alternates: { canonical: "/what-we-do" },
};

export default function WhatWeDoPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        heading="Four ways we move *brands* to market."
        lede="From customs to nationwide retail, the work spans four capabilities. Each one stands on its own; together they're how international brands reach Vietnam."
      />

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          {pillars.map((p) => (
            <CapabilityBlock key={p.number} pillar={p} />
          ))}
        </div>
      </section>

      <JvFeature variant="slim" />

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto flex max-w-[60ch] flex-col gap-6 text-center">
          <p className="font-display text-[clamp(24px,2.5vw,32px)] italic text-ink">
            Curious which brands these capabilities support?
          </p>
          <div className="self-center">
            <SoftCta href="/brands">See the portfolio</SoftCta>
          </div>
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
