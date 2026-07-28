import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { TranslationUnavailable } from "@/app/_components/magazine/translation-unavailable";
import { Link } from "@/i18n/navigation";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import type { Locale } from "@/lib/locale";
import { toLocale } from "@/lib/locale";
import { publishedLocaleAlternates } from "@/lib/localized-route";
import { getTranslations, setRequestLocale } from "next-intl/server";

type InsightPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  const alternateLocale: Locale = locale === "en" ? "vi" : "en";
  const [{ articles }, alternateContent] = await Promise.all([
    getRichfieldContent(locale),
    getRichfieldContent(alternateLocale),
  ]);
  const article = articles.find((item) => item.slug === slug);
  const alternateArticle = alternateContent.articles.find(
    (item) => item.slug === slug,
  );

  if (!article && !alternateArticle) return {};
  const availableLocales = [
    ...(article ? [locale] : []),
    ...(alternateArticle ? [alternateLocale] : []),
  ];
  const path = `/insights/${slug}`;

  if (!article && alternateArticle) {
    const t = await getTranslations({ locale, namespace: "insightsPage" });
    return {
      alternates: publishedLocaleAlternates({
        availableLocales,
        canonicalLocale: alternateLocale,
        path,
      }),
      description: t("translationDescription"),
      robots: { follow: true, index: false },
      title: t("translationMetaTitle"),
    };
  }

  return {
    alternates: publishedLocaleAlternates({
      availableLocales,
      canonicalLocale: locale,
      path,
    }),
    description: article?.summary,
    title: article?.title,
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "insightsPage" });
  const alternateLocale: Locale = locale === "en" ? "vi" : "en";
  const [{ articles }, alternateContent] = await Promise.all([
    getRichfieldContent(locale),
    getRichfieldContent(alternateLocale),
  ]);
  const article = articles.find((item) => item.slug === slug);
  const alternateArticle = alternateContent.articles.find(
    (item) => item.slug === slug,
  );
  if (!article && !alternateArticle) notFound();

  const detailHref = `/insights/${slug}`;
  const languageAvailability = {
    [locale]: Boolean(article),
    [alternateLocale]: Boolean(alternateArticle),
  };

  if (!article && alternateArticle) {
    return (
      <>
        <RunningHead
          locale={locale}
          languageAvailability={languageAvailability}
          languageHrefs={{ en: detailHref, vi: detailHref }}
        />
        <TranslationUnavailable
          availableHref={detailHref}
          availableLabel={t("translationAvailable")}
          availableLocale={alternateLocale}
          browseHref="/insights"
          browseLabel={t("browseCurrent")}
          description={t("translationDescription")}
          eyebrow={t("translationEyebrow")}
          heading={t("translationTitle")}
          locale={locale}
          readLabel={t("readAlternative")}
        />
      </>
    );
  }
  if (!article) notFound();

  return (
    <>
      <RunningHead
        locale={locale}
        languageAvailability={languageAvailability}
        languageHrefs={{ en: detailHref, vi: detailHref }}
      />
      <main className="v2-bg-morph min-h-screen px-6 pb-[var(--v2-section)] pt-[calc(var(--v2-runhead)+var(--v2-section))] text-ink sm:px-10 lg:px-12">
        <article className="mx-auto max-w-4xl">
          <Link className="v2-mono v2-size-folio text-gold-strong" href="/insights">
            {t("allInsights")}
          </Link>
          <div className="v2-mono v2-size-folio mt-10 flex flex-wrap gap-3 text-gold-strong">
            {article.category ? <span>{article.category.toUpperCase()}</span> : null}
            {article.publishedAt ? (
              <time>
                {new Date(article.publishedAt).toLocaleDateString(locale, {
                  dateStyle: "long",
                })}
              </time>
            ) : null}
          </div>
          <h1 className="font-display mt-5 text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em]">
            {article.title}
          </h1>
          <p className="v2-size-body mt-8 max-w-2xl text-xl opacity-70">
            {article.summary}
          </p>
          {article.author ? (
            <p className="v2-mono v2-size-folio mt-6">
              BY {article.author.toUpperCase()}
            </p>
          ) : null}
          {article.imageUrl ? (
            <div className="relative mt-12 aspect-[16/9] overflow-hidden">
              <Image
                alt={article.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width:1024px) 896px, 100vw"
                src={article.imageUrl}
              />
            </div>
          ) : null}
          <div className="mt-12 border-t border-current/15 pt-12">
            <RichfieldProse content={article.body} />
          </div>
        </article>
      </main>
    </>
  );
}
