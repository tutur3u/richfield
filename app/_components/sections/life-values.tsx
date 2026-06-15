import {
  Handshake,
  Scales,
  SealCheck,
  HandHeart,
  Smiley,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { coreValues, lifeAtRichfieldIntro } from "@/content/en/values";

// One line-icon per value, in coreValues order: respect, integrity,
// commitment, helpfulness, friendliness. Sits as a faint watermark behind
// each headword, exactly as the home-page stats ribbon does.
const VALUE_ICONS: readonly Icon[] = [
  Handshake,
  Scales,
  SealCheck,
  HandHeart,
  Smiley,
];

// The same organic seam the group-stats ribbon waves on, here filled with the
// surrounding cream so the beige band reads as a tinted ribbon inside the
// cream section.
const WAVE_PATH =
  "M0,24 C120,38 240,38 360,24 C480,10 600,10 720,24 C840,38 960,38 1080,24 C1200,10 1320,10 1440,24 L1440,0 L0,0 Z";

function Wave({ edge }: { edge: "top" | "bottom" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className={`absolute inset-x-0 z-[2] h-[clamp(20px,3.5vw,40px)] w-full fill-cream ${
        edge === "top" ? "top-0" : "bottom-0 -scale-y-100"
      }`}
    >
      <path d={WAVE_PATH} />
    </svg>
  );
}

/**
 * "Life at Richfield" — the chapter opener (standfirst + lede) over the five
 * core values, set in the home-page STATS-RIBBON UI crossed with the
 * thumb-index foldout: a full-bleed beige band with a wavy cream seam, a faint
 * gold value-icon watermark behind each headword. At rest each panel shows only
 * its Vietnamese word and English gloss (compact). Hover or focus springs that
 * panel open (flex-grow), washes its column a deeper beige, and discloses the
 * meaning, while the siblings recede. First and last cells bleed to the
 * viewport edges so the wash runs the full width. Below lg the panels relax
 * into a plain stacked list with every meaning visible.
 *
 * All effects are flex-grow / grid-rows / opacity; the globals.css reduce block
 * collapses each transition to an instant state change with the layout intact,
 * and every meaning is in the DOM at rest (no-JS and screen-reader complete).
 */
export function LifeValues() {
  return (
    <section className="v2-display bg-cream pt-[var(--v2-section)]">
      <div className="flex flex-col gap-y-[var(--v2-flow)]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-y-[var(--v2-flow)] px-6 sm:px-10 lg:px-12">
          <RevealOnScroll className="flex max-w-[68ch] flex-col gap-y-[var(--v2-rhythm)]">
            <Eyebrow>LIFE AT RICHFIELD</Eyebrow>
            <h2 className="font-display v2-size-standfirst max-w-[20ch]">
              People are valued as{" "}
              <em className="italic text-gold-strong">partners</em>.
            </h2>
            <p className="v2-size-body opacity-90">{lifeAtRichfieldIntro}</p>
          </RevealOnScroll>

          <Eyebrow>CORE VALUES</Eyebrow>
        </div>

        <div className="v2-bleed-x relative overflow-hidden bg-[oklch(0.93_0.032_82)]">
          <Wave edge="top" />
          <ul className="group/index relative z-[1] mx-auto flex max-w-[1500px] flex-col px-6 sm:px-10 lg:h-[clamp(240px,24vw,300px)] lg:flex-row lg:px-12">
            {coreValues.map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <li
                  key={v.en}
                  tabIndex={0}
                  className="group/item relative flex flex-col justify-center overflow-hidden border-t border-current/10 py-[clamp(24px,4vw,36px)] pl-[clamp(16px,2vw,28px)] pr-[clamp(12px,1.6vw,24px)] outline-none transition-[opacity,background-color] duration-300 ease-out first:border-t-0 hover:bg-[oklch(0.89_0.04_82)] focus-within:bg-[oklch(0.89_0.04_82)] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-gold-strong group-hover/index:opacity-55 hover:opacity-100 focus-within:opacity-100 max-lg:[&:last-child]:border-b-0 lg:h-full lg:basis-0 lg:grow lg:justify-start lg:border-t-0 lg:py-[clamp(28px,3.5vw,44px)] lg:[transition-property:flex-grow,opacity,background-color] lg:duration-500 lg:ease-[var(--ease-out-expo)] lg:hover:grow-[2.2] lg:focus-within:grow-[2.2] lg:[&:first-child]:-ml-[calc(max((100vw-1500px)/2,0px)+48px)] lg:[&:first-child]:pl-[calc(max((100vw-1500px)/2,0px)+48px+clamp(16px,2vw,28px))] lg:[&:last-child]:-mr-[calc(max((100vw-1500px)/2,0px)+48px)] lg:[&:last-child]:pr-[calc(max((100vw-1500px)/2,0px)+48px+clamp(12px,1.6vw,24px))]"
                >
                  <div className="relative isolate flex flex-col gap-1.5">
                    {Icon ? (
                      <Icon
                        aria-hidden
                        weight="light"
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[clamp(4.5rem,8vw,8rem)] text-gold-strong opacity-[0.06] transition-opacity duration-500 ease-out group-hover/item:opacity-[0.12]"
                      />
                    ) : null}

                    <p className="origin-left font-display text-[clamp(1.7rem,2.5vw,2.4rem)] leading-[0.98] tracking-[-0.02em] text-balance transition-transform duration-500 ease-out lg:group-hover/item:scale-[1.03] lg:group-focus-within/item:scale-[1.03]">
                      {v.en}
                    </p>

                    {/* Meaning: visible on mobile; on lg it stays collapsed
                        (grid 0fr) until the panel is hovered or focused. */}
                    <span className="grid lg:[grid-template-rows:0fr] lg:[transition:grid-template-rows_550ms_var(--ease-out-expo)] lg:group-hover/item:[grid-template-rows:1fr] lg:group-focus-within/item:[grid-template-rows:1fr]">
                      <span className="min-h-0 overflow-hidden">
                        <span className="mt-2 block max-w-[34ch] v2-size-body opacity-80 lg:mt-3 lg:opacity-0 lg:transition-opacity lg:duration-500 lg:ease-[var(--ease-out-expo)] lg:group-hover/item:opacity-100 lg:group-focus-within/item:opacity-100">
                          {v.meaning}
                        </span>
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <Wave edge="bottom" />
        </div>
      </div>
    </section>
  );
}
