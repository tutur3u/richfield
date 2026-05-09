import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { SectionHeading } from "@/app/_components/primitives/section-heading";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { Timeline } from "@/app/_components/sections/timeline";
import { FootprintMap } from "@/app/_components/sections/footprint-map";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { milestones } from "@/content/en/milestones";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About",
  description:
    "Three countries. Three generations. One promise. Richfield Group's story across Vietnam, Malaysia, and China.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  "People-first",
  "Long-term partnerships",
  "Sustainable growth",
  "Community impact",
];

const HERITAGE_PARAGRAPHS = [
  "Richfield JSC Group is proud to be one of the largest FMCG distributors in Vietnam. At present, our distribution network is the largest distribution system in the country, covering all provinces and cities nationwide with more than 300 sub-distributors and nearly 180,000 retail outlets nationwide.",
  "We began as a family business in Malaysia and grew across three generations into the international group we are today. The same trust and craft that started the business still anchors how we work.",
  "Our partnerships are long. Many run for decades. Each new brand we take on becomes part of how we move product across the country, market by market, year by year.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        heading="Three countries. Three *generations*. One promise."
        lede="Richfield Group is one of Vietnam's largest FMCG distributors. We've spent more than thirty years building a distribution network that reaches every province, supported by family-business values that started in Malaysia."
      />

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            {HERITAGE_PARAGRAPHS.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-[60ch] text-[17px] leading-[1.6] text-ink">
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col">
            <SectionHeading heading="Values" eyebrow="What we stand for" level={3} />
            <ul className="mt-8 flex flex-col">
              {VALUES.map((v) => (
                <li
                  key={v}
                  className="border-t border-line py-6 font-display text-[28px] text-ink"
                >
                  {v}
                </li>
              ))}
              <HairlineRule />
            </ul>
          </div>
        </div>
      </section>

      <Timeline
        milestones={milestones}
        variant="detail"
        eyebrow="Our journey"
        heading="A story of *partnerships* over thirty years."
      />

      <FootprintMap />

      <SoftCtaCloser />
    </>
  );
}
