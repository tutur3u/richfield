import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { LeadSpread } from "@/app/_components/magazine/spreads/lead-spread";
import { TimelineSpread } from "@/app/_components/magazine/spreads/timeline-spread";
import { getRichfieldContent } from "@/lib/richfield-delivery";
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
    title: meta("ourStory.title"),
    description: meta("ourStory.description"),
    alternates: localeAlternates(locale, "/about/our-story"),
    openGraph: pageOpenGraph({
      description: meta("ourStory.description"),
      locale,
      path: "/about/our-story",
      title: meta("ourStory.title"),
    }),
  };
}

// Our Story — one cream movement: the narrative lead (which now folds the
// founder profile into its flow) and the timeline. The lead opens the page
// (head clears the running-head); the timeline sits flush beneath it.
export default async function OurStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const { milestones } = await getRichfieldContent(locale);

  return (
    <>
      <RunningHead locale={locale} />
      <main className="bg-cream text-ink">
        <LeadSpread head locale={locale} />
        <TimelineSpread milestones={milestones} locale={locale} />
      </main>
    </>
  );
}
