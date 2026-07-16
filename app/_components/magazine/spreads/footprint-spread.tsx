import { AtlasMap } from "@/app/_components/magazine/media/atlas-map";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { ItalicText } from "@/app/_components/primitives/italic-text";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/locale";

export function FootPrintSpread({ locale = "en" }: { locale?: Locale }) {
  const t = useTranslations("home.footprint");
  return (
    <Spread
      id="atlas"
      bg="white"
      surfaceClass="v2-plate-fade-top"
    >

      {/* White ground for the map. It fades into the page gradient only at the
          top (morphing down from what-we-do) and stays white to the bottom, so
          it meets the white joint-venture spread below edge-to-edge with no
          beige gap between them. The headline hangs top-left over a ghost "3"
          (three countries, three generations). */}
      <div className="grid grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)]">
        <div className="relative col-span-12 hyphens-auto lg:col-span-4" lang={locale}>

          <RevealOnScroll className="relative z-10">
            <Eyebrow className="mb-[var(--v2-rhythm)]">{t("eyebrow")}</Eyebrow>

            <h2 className="font-display v2-size-standfirst mb-[var(--v2-rhythm)] text-ink">
              <span className="block">{t("headlineLine1")}</span>
              <span className="block">{t("headlineLine2")}</span>
              <span className="block">
                <ItalicText text={t("headlineLine3")} />
              </span>
            </h2>

            <p className="v2-size-body text-justify opacity-90">
              {t("body")}
            </p>
          </RevealOnScroll>
        </div>

        {/* Map plate — client asset, original ratio preserved. */}
        <RevealOnScroll delayMs={120} className="col-span-12 lg:col-span-8 lg:col-start-5">
          <AtlasMap locale={locale} />
        </RevealOnScroll>
      </div>
    </Spread>
  );
}
