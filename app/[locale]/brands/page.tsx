import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { JourneyTimeline } from "@/app/_components/magazine/media/journey-timeline";
import { ShelfExplorer } from "@/app/_components/magazine/spreads/shelf-explorer";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { ItalicText } from "@/app/_components/primitives/italic-text";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates, toLocale } from "@/lib/locale";
import { getRichfieldContent } from "@/lib/richfield-delivery";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const meta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: meta("brands.title"),
    description: meta("brands.description"),
    alternates: localeAlternates("/brands"),
  };
}

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const { brandTimeline, shelfCategories } = await getRichfieldContent(locale);
  const t = await getTranslations({ locale, namespace: "brandsPage" });

  return (
    <>
      <RunningHead locale={locale} />
      <main className="bg-cream text-ink">
        {/* Intro + collaboration timeline — one cream movement. */}
        <Spread
          id="brands"
          bg="cream"
          head
          className="flex flex-col gap-y-[var(--v2-flow)]"
        >
          <RevealOnScroll lang={locale} className="flex w-full flex-col gap-y-[var(--v2-rhythm)] hyphens-auto">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display v2-size-standfirst w-full text-pretty">
              <ItalicText text={t("heading")} />
            </h1>
            <p className="v2-size-body w-full opacity-90">
              {t("intro")}
            </p>
          </RevealOnScroll>

          <RevealOnScroll className="flex flex-col gap-y-[var(--v2-rhythm)]">
            <Eyebrow>{t("collabEyebrow")}</Eyebrow>
            <JourneyTimeline milestones={brandTimeline} locale={locale} />
          </RevealOnScroll>
        </Spread>

        {/* The portfolio — every product, by category. */}
        <Spread id="portfolio" bg="white">
          <ShelfExplorer categories={shelfCategories} locale={locale} />
        </Spread>

      </main>
    </>
  );
}
