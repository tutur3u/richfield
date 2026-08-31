import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { OrganizationsSpread } from "@/app/_components/magazine/spreads/organizations-spread";
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
    title: meta("whoWeAre.title"),
    description: meta("whoWeAre.description"),
    alternates: localeAlternates(locale, "/about/who-we-are"),
    openGraph: pageOpenGraph({
      description: meta("whoWeAre.description"),
      locale,
      path: "/about/who-we-are",
      title: meta("whoWeAre.title"),
    }),
  };
}

// Who We Are — the three operating companies, each linking to its detail.
export default async function WhoWeArePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <>
      <RunningHead locale={locale} />
      <main className="bg-white text-ink">
        <OrganizationsSpread head locale={locale} />
      </main>
    </>
  );
}
