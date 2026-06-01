import Image from "next/image";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { partnerLogos } from "@/content/en/photography";
import type { Milestone } from "@/content/en/milestones";

/**
 * Milestone brand names don't always match the partnerLogos keys (which use the
 * full distribution name). Bridge the few that differ so every milestone can
 * show its mark.
 */
const LOGO_ALIASES: Record<string, string> = {
  Mars: "Mars · Wrigley",
  "Dory Rich JSC": "Dory Rich",
};

function logoFor(brand: string): string | undefined {
  return partnerLogos[LOGO_ALIASES[brand] ?? brand];
}

/**
 * v2-native company timeline for the Directory opener. Gold serif years sit
 * over a hairline punctuated by gold dots; each milestone shows its brand mark
 * over the country and a short note. A single horizontal row at lg (where all
 * milestones fit across the width); below that it flattens into a vertical
 * stack rather than a horizontal scroll rail.
 */
export function JourneyTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="relative">
      {/* Connecting hairline through the dot row — only meaningful in the
          horizontal lg layout, hidden in the vertical stack below it. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-[5px] hidden h-px bg-current/15 lg:block"
      />

      <ol className="flex flex-col lg:grid lg:grid-cols-6 lg:gap-x-[clamp(20px,2.4vw,40px)]">
        {milestones.map((m, i) => {
          const logo = logoFor(m.brand);
          const isLast = i === milestones.length - 1;
          return (
            <RevealOnScroll
              key={`${m.year}-${m.brand}`}
              as="li"
              delayMs={i * 80}
              className="relative flex items-start gap-x-[clamp(16px,4vw,28px)] pb-[clamp(40px,9vw,60px)] last:pb-0 lg:block lg:gap-x-0 lg:pb-0"
            >
              {/* Vertical connector to the next dot — mobile only; the lg row
                  uses the shared horizontal hairline instead. */}
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute left-[4px] top-[15px] bottom-0 w-px bg-current/15 lg:hidden"
                />
              ) : null}

              <span
                aria-hidden
                className="relative z-10 mt-[10px] block h-2.5 w-2.5 shrink-0 rounded-full bg-gold lg:mt-0"
              />

              <div className="min-w-0 flex-1">
                <div className="font-display mt-0 text-[clamp(1.9rem,2.6vw,2.6rem)] leading-none tracking-[-0.02em] text-gold lg:mt-[clamp(12px,1.3vw,20px)]">
                  {m.year}
                </div>

                {logo ? (
                  <div className="mt-[clamp(14px,1.6vw,24px)]">
                    <span className="relative block h-[clamp(38px,4.6vw,72px)] w-[clamp(120px,14vw,210px)]">
                      <Image
                        src={logo}
                        alt={m.brand}
                        fill
                        sizes="210px"
                        className="object-contain object-left"
                      />
                    </span>
                  </div>
                ) : (
                  <div className="v2-display mt-[clamp(12px,1.2vw,18px)] text-[clamp(15px,1.05vw,17px)] font-medium leading-tight">
                    {m.brand}
                  </div>
                )}

                <div className="v2-mono v2-size-folio mt-2 opacity-55">
                  {m.country}
                </div>
                <p className="v2-size-body mt-2 max-w-none text-[clamp(13px,0.95vw,15px)] leading-[1.5] opacity-60 lg:max-w-[24ch]">
                  {m.body}
                </p>
              </div>
            </RevealOnScroll>
          );
        })}
      </ol>
    </div>
  );
}
