import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Link } from "@/i18n/navigation";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import { localeAlternates, toLocale } from "@/lib/locale";
import { getTranslations, setRequestLocale } from "next-intl/server";

type InsightPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  const { articles } = await getRichfieldContent(locale);
  const article = articles.find((item) => item.slug === slug);

  if (!article) return {};
  return {
    alternates: localeAlternates(`/insights/${article.slug}`),
    description: article.summary,
    title: article.title,
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "insightsPage" });
  const { articles } = await getRichfieldContent(locale);
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <>
      <RunningHead locale={locale} />
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
