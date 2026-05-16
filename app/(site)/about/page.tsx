import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { SectionHeading } from "@/app/_components/primitives/section-heading";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { TintedPhoto } from "@/app/_components/primitives/tinted-photo";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { Timeline } from "@/app/_components/sections/timeline";
import { FootprintMap } from "@/app/_components/sections/footprint-map";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { milestones } from "@/content/en/milestones";
import { peoplePhotos } from "@/content/en/photography";

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

      <section
        aria-labelledby="about-team-heading"
        className="relative isolate overflow-hidden bg-ink text-paper"
      >
        <TintedPhoto
          src={peoplePhotos.grandOpening.src}
          alt={peoplePhotos.grandOpening.alt}
          intensity="medium"
          sizes="100vw"
          fill
          className="absolute inset-0 -z-10 min-h-[70svh]"
          imgClassName="object-[center_35%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,24,21,0.92)_0%,rgba(18,24,21,0.75)_24%,rgba(18,24,21,0.4)_50%,rgba(18,24,21,0.1)_75%,rgba(18,24,21,0)_95%)]"
        />
        <div className="relative flex min-h-[70svh] flex-col justify-center px-6 py-[clamp(96px,12vw,160px)] sm:px-10">
          <div className="mx-auto w-full max-w-[1500px]">
            <RevealOnScroll className="flex max-w-[60ch] flex-col gap-7">
              <Eyebrow tone="gold">Our team</Eyebrow>
              <DisplayHeading
                id="about-team-heading"
                level={2}
                tone="white"
                className="max-w-[18ch]"
              >
                The faces behind *thirty years* of partnership.
              </DisplayHeading>
              <p className="max-w-[52ch] text-[clamp(15px,1.4vw,17px)] leading-[1.55] text-paper/80">
                From the founding family in Malaysia to teammates across our
                Vietnam offices and distribution centres — the network is the
                people who run it.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          <RevealOnScroll className="flex flex-col gap-6">
            {HERITAGE_PARAGRAPHS.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-[60ch] text-[17px] leading-[1.6] text-ink">
                {p}
              </p>
            ))}
          </RevealOnScroll>
          <RevealOnScroll className="flex flex-col" delayMs={120}>
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
          </RevealOnScroll>
        </div>
      </section>

      <section
        aria-labelledby="about-community-heading"
        className="relative isolate overflow-hidden bg-ink text-paper"
      >
        <TintedPhoto
          src={peoplePhotos.unionCongress.src}
          alt={peoplePhotos.unionCongress.alt}
          intensity="medium"
          sizes="100vw"
          fill
          className="absolute inset-0 -z-10 min-h-[65svh]"
          imgClassName="object-[right_center]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,24,21,0.92)_0%,rgba(18,24,21,0.75)_24%,rgba(18,24,21,0.4)_50%,rgba(18,24,21,0.1)_75%,rgba(18,24,21,0)_95%)]"
        />
        <div className="relative flex min-h-[65svh] flex-col justify-center px-6 py-[clamp(96px,12vw,160px)] sm:px-10">
          <div className="mx-auto w-full max-w-[1500px]">
            <RevealOnScroll className="flex max-w-[60ch] flex-col gap-7">
              <Eyebrow tone="gold">Community impact</Eyebrow>
              <DisplayHeading
                id="about-community-heading"
                level={2}
                tone="white"
                className="max-w-[18ch]"
              >
                Partnership *lived out* across decades.
              </DisplayHeading>
              <p className="max-w-[52ch] text-[clamp(15px,1.4vw,17px)] leading-[1.55] text-paper/80">
                Annual Union Congress, training programmes, scholarships, and
                long-running community partnerships — the long-term view that
                anchors how we work.
              </p>
            </RevealOnScroll>
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
