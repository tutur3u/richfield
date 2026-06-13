import Image from "next/image";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { CtaLink } from "@/app/_components/magazine/primitives/cta-link";
import { organizations, whoWeAreIntro } from "@/content/en/organizations";

/**
 * "Who We Are" — an asymmetric opener (headline hangs left, standfirst sits in
 * the right column) over the three operating companies, read as an issue index.
 *
 * Motion ("Issue Index"):
 *  - The opener rises + fades on page load, staggered (eyebrow → headline →
 *    standfirst) via `.v2-enter` + inline animation-delay.
 *  - Each company is a full-width ledger entry: a gold hairline draws itself in
 *    as the entry reveals on scroll, and a giant ghost numeral drifts vertically
 *    behind the company name (CSS scroll-driven `animation-timeline: view()`).
 *  - Hovering one entry spotlights it — siblings recede to 40% and the focused
 *    entry's numeral deepens from ink-ghost to gold. Pure Tailwind group state.
 *
 * All effects are transform/opacity only and degrade to the static layout under
 * `prefers-reduced-motion` (see the "Issue Index" block in globals.css).
 * `head` clears the fixed running-head when this opens a standalone page.
 */
export function OrganizationsSpread({ head = false }: { head?: boolean }) {
  return (
    <Spread
      id="organizations"
      bg="white"
      head={head}
      className="flex flex-col gap-y-[var(--v2-flow)]"
    >
      <div
        className="grid grid-cols-12 gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-rhythm)] hyphens-auto"
        lang="en"
      >
        <div className="col-span-12 flex flex-col gap-y-[var(--v2-rhythm)] lg:col-span-5">
          <Eyebrow className="v2-enter">WHO WE ARE</Eyebrow>
          <h1
            className="v2-enter font-display v2-size-standfirst text-balance"
            style={{ animationDelay: "90ms" }}
          >
            One group, <em className="italic text-gold-strong">three</em>{" "}
            companies.
          </h1>
        </div>
        <p
          className="v2-enter col-span-12 self-end text-left v2-size-body opacity-90 sm:text-justify lg:col-span-6 lg:col-start-7"
          style={{ animationDelay: "180ms" }}
        >
          {whoWeAreIntro}
        </p>
      </div>

      <ol className="group/index flex flex-col">
        {organizations.map((org, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <RevealOnScroll key={org.name} as="li" delayMs={i * 90}>
              <div className="group/item relative overflow-clip transition-opacity duration-500 ease-out group-hover/index:opacity-40 hover:!opacity-100">
                {/* Top hairline that draws itself in from the left on reveal. */}
                <span
                  aria-hidden
                  className="v2-rule-gold v2-draw-rule block w-full origin-left"
                />

                {/* Giant index numeral — drifts on scroll, watermark behind the
                    company name; deepens to gold when this entry is spotlit. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-[0.04em] top-1/2 z-0 -translate-y-1/2 select-none"
                >
                  <span className="v2-numeral-drift block font-display italic leading-[0.78] tracking-[-0.04em] text-[clamp(7rem,24vw,17rem)] text-ink opacity-[0.05] transition-[color,opacity] duration-500 ease-out group-hover/item:text-gold-strong group-hover/item:opacity-[0.13]">
                    {n}
                  </span>
                </span>

                <div className="relative z-10 grid grid-cols-12 gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-rhythm)] pt-[clamp(28px,3.5vw,52px)] pb-[clamp(40px,5vw,76px)]">
                  <div className="col-span-12 lg:col-span-7">
                    <h2 className="font-display text-[clamp(1.7rem,2.6vw,2.5rem)] leading-[1.08] tracking-[-0.02em] text-balance">
                      {org.name}
                    </h2>
                    <p className="v2-mono v2-size-folio mt-2 opacity-55">
                      {org.established.toUpperCase()}
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-5 lg:col-start-8">
                    {org.logo ? (
                      <span className="relative mb-[var(--v2-rhythm)] block h-[clamp(56px,6vw,82px)] w-[clamp(170px,20vw,240px)] opacity-85 transition-opacity duration-500 ease-out group-hover/item:opacity-100">
                        <Image
                          src={org.logo}
                          alt=""
                          aria-hidden
                          fill
                          sizes="180px"
                          className="object-contain object-left"
                        />
                      </span>
                    ) : null}
                    <p className="v2-size-body max-w-[42ch] text-pretty opacity-90">
                      {org.body}
                    </p>
                    <CtaLink
                      href={org.href}
                      external={org.external}
                      className="mt-[var(--v2-rhythm)]"
                    >
                      {org.linkLabel}
                    </CtaLink>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </ol>
    </Spread>
  );
}
