import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PillarPhoto } from "@/app/_components/magazine/media/pillar-photo";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { ItalicText } from "@/app/_components/primitives/italic-text";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locale";

type PillarMeta = { photoAlt: string; stat: string; formats: string };

// Pillar photos, keyed by href (stable across locales — names translate).
// Alt text, the stat line, and the formats continuation live in the
// home.whatWeDo messages under the same keys.
const PILLAR_PHOTOS: Record<string, { src: string; objectPosition?: string }> =
  {
    "/logistics": {
      src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0832.webp",
      objectPosition: "center 55%",
    },
    "/distribution#gt": {
      src: "/photos/people/facility/general-trade-store.webp",
      objectPosition: "center 50%",
    },
    "/distribution#mt": {
      src: "/photos/people/facility/modern-trade-aisle.webp",
      objectPosition: "center 50%",
    },
  };

const INCLUDED_PILLARS = [
  "/logistics",
  "/distribution#gt",
  "/distribution#mt",
] as const;

export function WhatWeDoSpread({ locale = "en" }: { locale?: Locale }) {
  const { pillars } = getContent(locale);
  const t = useTranslations("home.whatWeDo");
  const pillarMeta = t.raw("pillars" as never) as Record<string, PillarMeta>;
  const filteredPillars = pillars.filter((p) =>
    (INCLUDED_PILLARS as readonly string[]).includes(p.href),
  );
  return (
    <Spread id="what" bg="transparent" className="flex flex-col gap-y-[var(--v2-flow)]">
      {/* Headline block — hangs left with a wide right gutter. */}
      <RevealOnScroll lang={locale} className="flex flex-col gap-y-[var(--v2-rhythm)] hyphens-auto">
        <Eyebrow tone="gold">{t("eyebrow")}</Eyebrow>

        <h2 className="font-display v2-size-standfirst text-balance">
          <ItalicText text={t("heading")} />
        </h2>

        <p className="v2-size-body text-justify opacity-90">
          {t("intro")}
        </p>
      </RevealOnScroll>

      {/* Three pillar columns — pillar leads with the image, then long body and
          a quiet folio stat line. */}
      <div className="v2-pillar-row hyphens-auto grid grid-cols-1 gap-x-[clamp(24px,2.8vw,48px)] gap-y-[var(--v2-flow)] lg:grid-cols-3" lang={locale}>
          {filteredPillars.map((p, i) => {
            const photo = PILLAR_PHOTOS[p.href];
            const meta = pillarMeta[p.href];
            return (
              <RevealOnScroll as="div" key={p.href} delayMs={i * 120}>
                <Link
                  href={p.href}
                  className="group flex flex-col gap-[clamp(12px,1.2vw,18px)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden outline outline-1 -outline-offset-1 outline-black/10">
                    <PillarPhoto
                      src={photo.src}
                      alt={meta.photoAlt}
                      objectPosition={photo.objectPosition}
                      delay={i * 0.16}
                    />
                  </div>

                  <h3 className="font-display flex items-center gap-2 text-[clamp(1.3rem,1.7vw,1.55rem)] leading-[1.1] tracking-[-0.018em] transition-colors duration-[700ms] ease-[var(--ease-out-expo)] group-hover:text-gold-strong">
                    {p.name}
                    <span aria-hidden className="text-gold-strong opacity-0 transition-[translate,opacity] duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
                  </h3>

                  <p className="v2-size-body text-justify opacity-90">
                    {p.shortBody}
                    {/* <span className="v2-italic opacity-70">{meta.formats}</span> */}
                  </p>

                  <p className="v2-mono v2-size-folio mt-auto opacity-55">
                    {meta.stat}
                  </p>
                </Link>
              </RevealOnScroll>
            );
          })}
      </div>
    </Spread>
  );
}
