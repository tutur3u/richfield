import type { Metadata } from "next";
import Image from "next/image";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { ItalicText } from "@/app/_components/primitives/italic-text";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { Link } from "@/i18n/navigation";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import { localeAlternates, toLocale } from "@/lib/locale";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const meta = await getTranslations({ locale, namespace: "meta" });

  return {
    alternates: localeAlternates("/insights"),
    description: meta("insights.description"),
    title: meta("insights.title"),
  };
}

function formatDate(value: string | null, locale: string) {
  if (!value) return null;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(value));
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "insightsPage" });
  const { articles } = await getRichfieldContent(locale);

  return (
    <>
      <RunningHead locale={locale} />
      <main className="v2-bg-morph min-h-screen px-6 pb-[var(--v2-section)] pt-[calc(var(--v2-runhead)+var(--v2-section))] text-ink sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-[var(--v2-flow)]">
          <RevealOnScroll className="max-w-4xl">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display v2-size-standfirst mt-6 text-balance">
              <ItalicText text={t("heading")} emClassName="text-gold-strong" />
            </h1>
            <p className="v2-size-body mt-5 max-w-2xl opacity-75">
              {t("intro")}
            </p>
          </RevealOnScroll>

          {articles.length === 0 ? (
            <div className="border-y border-current/15 py-16">
              <p className="font-display text-3xl">{t("emptyTitle")}</p>
              <p className="v2-size-body mt-3 opacity-65">
                {t("emptyBody")}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article, index) => (
                <RevealOnScroll
                  as="article"
                  className="group relative flex h-full flex-col overflow-hidden border border-current/15 bg-paper/75"
                  delayMs={index * 55}
                  key={article.slug}
                >
                  {article.imageUrl ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        alt={article.title}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        fill
                        sizes="(min-width:1280px) 31vw, (min-width:768px) 48vw, 100vw"
                        src={article.imageUrl}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="v2-mono v2-size-folio flex flex-wrap gap-x-3 text-gold-strong">
                      {article.category ? <span>{article.category.toUpperCase()}</span> : null}
                      {formatDate(article.publishedAt, locale) ? (
                        <time>{formatDate(article.publishedAt, locale)}</time>
                      ) : null}
                    </div>
                    <h2 className="font-display mt-4 text-[clamp(1.7rem,2.4vw,2.3rem)] leading-tight">
                      <Link
                        className="after:absolute after:inset-0"
                        href={`/insights/${article.slug}`}
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="v2-size-body mt-4 line-clamp-3 opacity-70">
                      {article.summary}
                    </p>
                    <span className="v2-mono v2-size-folio mt-auto pt-8 text-gold-strong">
                      {t("readStory")}
                    </span>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
