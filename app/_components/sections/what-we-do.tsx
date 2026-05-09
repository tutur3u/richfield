import Link from "next/link";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { pillars } from "@/content/en/capabilities";

export function WhatWeDo() {
  return (
    <section
      aria-labelledby="what-we-do-heading"
      className="bg-cream px-6 py-[clamp(72px,8vw,100px)] sm:px-10"
    >
      <div className="mx-auto flex max-w-[1300px] flex-col gap-12">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">What we do</Eyebrow>
          <div id="what-we-do-heading">
            <DisplayHeading level={2} tone="ink" className="max-w-[18ch]">
              Four ways we move *brands* to market.
            </DisplayHeading>
          </div>
        </div>

        <HairlineRule />

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, idx) => (
            <RevealOnScroll
              key={p.number}
              as="article"
              delayMs={idx * 80}
              className="flex flex-col gap-4"
            >
              <span className="font-display text-[40px] italic leading-none text-gold">
                {p.number}
              </span>
              <h3 className="text-[18px] font-semibold text-ink">{p.name}</h3>
              <p className="max-w-[28ch] text-[14px] leading-[1.55] text-muted">
                {p.shortBody}
              </p>
              <Link
                href={p.href}
                className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.32em] text-gold underline decoration-gold underline-offset-[6px] hover:text-gold/80"
              >
                Read more <span aria-hidden>→</span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <HairlineRule />
      </div>
    </section>
  );
}
