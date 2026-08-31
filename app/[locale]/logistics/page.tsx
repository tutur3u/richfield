import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { LogisticsHero } from "@/app/_components/magazine/spreads/logistics-hero";
import { HubScrollytelling } from "@/app/_components/magazine/spreads/hub-scrollytelling";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { YouTubeEmbed } from "@/app/_components/primitives/youtube-embed";
import { ItalicText } from "@/app/_components/primitives/italic-text";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates, toLocale } from "@/lib/locale";
import { pageOpenGraph } from "@/lib/seo";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const meta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: meta("logistics.title"),
    description: meta("logistics.description"),
    alternates: localeAlternates(locale, "/logistics"),
    openGraph: pageOpenGraph({
      description: meta("logistics.description"),
      locale,
      path: "/logistics",
      title: meta("logistics.title"),
    }),
  };
}

export default async function LogisticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "logisticsPage" });
  return (
    <>
      <RunningHead locale={locale} transparentOverHero />
      <main className="bg-cream text-ink">
        <LogisticsHero locale={locale} />

        <HubScrollytelling locale={locale} />

        {/* Inside the operation — a cinematic video stage on the forest field,
            sized to one viewport. */}
        <section className="v2-display relative flex w-full flex-col justify-center overflow-clip bg-cream text-ink lg:min-h-screen">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-y-[var(--v2-rhythm)] px-6 py-[clamp(36px,4vw,60px)] sm:px-10 lg:px-12">
            {/* Masthead: kicker + headline left, lede right, over a drawn rule. */}
            <RevealOnScroll as="div" className="flex flex-col gap-y-[var(--v2-rhythm)]">
              <div className="flex flex-col gap-y-[var(--v2-rhythm)]">
                <p className="v2-mono v2-size-folio text-gold-strong">
                  {t("operationKicker")}
                </p>
                <h2 className="font-display text-[clamp(2.3rem,4vw,3.4rem)] leading-[1.0] tracking-[-0.022em] lg:text-nowrap">
                  <ItalicText text={t("operationHeading")} />
                </h2>
              </div>
              <span
                aria-hidden
                className="v2-rule-gold v2-draw-rule mt-[var(--v2-rhythm)] block w-full origin-left opacity-50"
              />
            </RevealOnScroll>

            {/* The film: the dominant element. */}
            <RevealOnScroll as="div" delayMs={120}>
              <YouTubeEmbed
                videoId="-_zNf5wSr8g"
                title={t("videoTitle")}
                caption={t("videoCaption")}
                poster="/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0781.webp"
              />
            </RevealOnScroll>
          </div>
        </section>

      </main>
    </>
  );
}
