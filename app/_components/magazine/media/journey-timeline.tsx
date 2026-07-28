import type { CSSProperties } from "react";
import Image from "next/image";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { getContent } from "@/content";
import type { Milestone } from "@/content/en/milestones";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import type { Locale } from "@/lib/locale";

/**
 * Milestone brand names don't always match the partnerLogos keys (which use the
 * full distribution name). Bridge the few that differ so every milestone can
 * show its mark.
 */
const LOGO_ALIASES: Record<string, string> = {
  Mars: "Mars · Wrigley",
  "Dory Rich JSC": "Dory Rich",
};

function logoFor(
  partnerLogos: Record<string, string>,
  brand: string,
): string | undefined {
  return partnerLogos[LOGO_ALIASES[brand] ?? brand];
}

/**
 * v2-native company timeline for the Directory opener. Each milestone's brand
 * mark floats on a shelf above the hairline; the dated entries below the line
 * all start at the same baseline.
 *
 * Hover is a spotlight: pointing at one milestone dims every other entry to a
 * recede state and pulls the focused one forward — its dot blooms a gold halo,
 * its mark lifts, and a gold rule sweeps in under the year. Driven by two named
 * groups (group/tl on the list, group/item on each entry) so siblings dim
 * without disturbing the scroll-reveal transition on the <li>.
 */
export function JourneyTimeline({
  milestones,
  locale = "en",
}: {
  milestones: Milestone[];
  locale?: Locale;
}) {
  const { partnerLogos } = getContent(locale);

  return (
    <div
      className="relative"
      style={
        {
          "--tl-logo-h": "clamp(44px, 5vw, 64px)",
          "--tl-line":
            "calc(clamp(44px, 5vw, 64px) + clamp(14px, 1.6vw, 20px))",
        } as CSSProperties
      }
    >
      {/* Connecting hairline — dropped a notch below the logo band so the marks
          sit on a shelf above it. lg only; the vertical stack uses the per-item
          connector instead. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-[var(--tl-line)] hidden h-px bg-current/15 lg:block"
      />

      <ol className="group/tl flex flex-col lg:grid lg:grid-cols-6 lg:gap-x-[clamp(20px,2.4vw,40px)]">
        {milestones.map((m, i) => {
          const logo = logoFor(partnerLogos, m.brand);
          const isLast = i === milestones.length - 1;
          return (
            <RevealOnScroll
              key={`${m.year}-${m.brand}`}
              as="li"
              delayMs={i * 80}
              className="group/item relative flex items-start gap-x-[clamp(16px,4vw,28px)] pb-[clamp(40px,9vw,60px)] last:pb-0 lg:block lg:gap-x-0 lg:pb-0"
            >
              {/* Vertical connector to the next dot — mobile only; the lg row
                  uses the shared horizontal hairline instead. */}
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute left-[4px] top-[15px] bottom-0 w-px bg-current/15 lg:hidden"
                />
              ) : null}

              {/* Dot — recedes when a sibling is spotlit; on hover it grows and
                  blooms a soft gold halo. */}
              <span
                aria-hidden
                className="relative z-10 mt-[10px] block h-2.5 w-2.5 shrink-0 rounded-full bg-gold [box-shadow:0_0_0_0_oklch(0.72_0.16_78/0)] transition-[scale,background-color,box-shadow,opacity] duration-300 ease-out group-hover/tl:opacity-30 group-hover/item:bg-gold-strong group-hover/item:!opacity-100 group-hover/item:[box-shadow:0_0_0_6px_oklch(0.72_0.16_78/0.24)] motion-safe:group-hover/item:scale-[1.6] lg:absolute lg:left-0 lg:top-[var(--tl-line)] lg:mt-0 lg:-translate-y-1/2"
              />

              {/* Whole entry — dims to a recede state while another milestone is
                  spotlit, snaps back to full when it's the one hovered. */}
              <div className="min-w-0 flex-1 transition-opacity duration-500 ease-out group-hover/tl:opacity-30 group-hover/item:!opacity-100">
                {/* Logo band — floats above the line, fixed height at lg so
                    every dated entry below the line starts at the same
                    baseline. */}
                <div className="mb-[clamp(14px,1.6vw,24px)] flex items-end lg:mb-[clamp(30px,3.2vw,44px)] lg:h-[var(--tl-logo-h)]">
                  {logo ? (
                    <span className="relative block h-[clamp(38px,4.6vw,64px)] w-[clamp(120px,14vw,210px)] origin-bottom-left opacity-85 transition-[opacity,translate,scale] duration-300 ease-out group-hover/item:opacity-100 motion-safe:group-hover/item:-translate-y-1.5 motion-safe:group-hover/item:scale-[1.06]">
                      <Image
                        src={logo}
                        alt={m.brand}
                        fill
                        sizes="210px"
                        className="object-contain object-left-bottom"
                      />
                    </span>
                  ) : null}
                </div>

                {/* Year — deepens to gold-strong with a gold rule that sweeps in
                    underneath on hover. */}
                <div className="font-display relative inline-block text-[clamp(1.9rem,2.6vw,2.6rem)] leading-none tracking-[-0.02em] text-gold transition-colors duration-300 ease-out after:absolute after:-bottom-[7px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-gold-strong after:transition-transform after:duration-[400ms] after:ease-out after:content-[''] group-hover/item:text-gold-strong motion-safe:group-hover/item:after:scale-x-100">
                  {m.year}
                </div>

                <div className="v2-mono v2-size-folio mt-[10px] opacity-55 transition-opacity duration-300 ease-out group-hover/item:opacity-80">
                  {m.country}
                </div>
                <div className="v2-size-body mt-2 max-w-none text-pretty text-[clamp(13px,0.95vw,15px)] leading-[1.5] opacity-60 transition-opacity duration-300 ease-out group-hover/item:opacity-90 lg:max-w-[24ch]">
                  <RichfieldProse
                    compact
                    content={m.body}
                    structuredContent={m.bodyContent}
                  />
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </ol>
    </div>
  );
}
