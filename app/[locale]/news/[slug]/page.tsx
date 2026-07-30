import { extractPlainText } from "@tuturuuu/editor";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { TranslationUnavailable } from "@/app/_components/magazine/translation-unavailable";
import { Link } from "@/i18n/navigation";
import type { RichfieldArticle } from "@/lib/richfield-content";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import type { Locale } from "@/lib/locale";
import { toLocale } from "@/lib/locale";
import { publishedLocaleAlternates } from "@/lib/localized-route";
import { getTranslations, setRequestLocale } from "next-intl/server";

type NewsArticlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
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
  const path = `/news/${slug}`;

  if (!article && alternateArticle) {
    const t = await getTranslations({ locale, namespace: "newsPage" });
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
    openGraph: article
      ? {
          authors: article.author ? [article.author] : undefined,
          description: article.summary,
          images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
          publishedTime: article.publishedAt ?? undefined,
          title: article.title,
          type: "article",
        }
      : undefined,
    title: article?.title,
    twitter: article
      ? {
          card: article.imageUrl ? "summary_large_image" : "summary",
          description: article.summary,
          images: article.imageUrl ? [article.imageUrl] : undefined,
          title: article.title,
        }
      : undefined,
  };
}

function formatDate(value: string | null, locale: string) {
  if (!value) return null;
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(value),
  );
}

function getReadingMinutes(article: RichfieldArticle) {
  const text = article.bodyContent
    ? extractPlainText(article.bodyContent)
    : article.body;
  const words = text.trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "newsPage" });
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

  const detailHref = `/news/${slug}`;
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
          browseHref="/news"
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
  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);
  const publishedDate = formatDate(article.publishedAt, locale);
  const readingMinutes = getReadingMinutes(article);

  return (
    <>
      <RunningHead
        locale={locale}
        languageAvailability={languageAvailability}
        languageHrefs={{ en: detailHref, vi: detailHref }}
      />
      <main className="v2-bg-morph min-h-screen pb-[var(--v2-section)] text-ink">
        <article>
          <header className="px-6 pb-10 pt-[calc(var(--v2-runhead)+clamp(3rem,6vw,6rem))] sm:px-10 lg:px-12 lg:pb-14">
            <div className="mx-auto max-w-6xl">
              <Link
                className="v2-mono v2-size-folio inline-flex min-h-11 items-center gap-3 text-gold-strong transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                href="/news"
              >
                <span aria-hidden>←</span>
                {t("allNews")}
              </Link>
              <div className="v2-mono v2-size-folio mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-gold-strong">
                {article.category ? <span>{article.category}</span> : null}
                {article.category && publishedDate ? (
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-current opacity-45"
                  />
                ) : null}
                {publishedDate ? (
                  <time dateTime={article.publishedAt ?? undefined}>
                    {publishedDate}
                  </time>
                ) : null}
                {(article.category || publishedDate) ? (
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-current opacity-45"
                  />
                ) : null}
                <span>{t("readingTime", { minutes: readingMinutes })}</span>
              </div>
              <h1 className="font-display mt-6 max-w-5xl text-[clamp(3rem,6.4vw,6.75rem)] leading-[0.94] tracking-[-0.04em] text-balance">
                {article.title}
              </h1>
              {article.summary ? (
                <p className="v2-size-body mt-8 max-w-3xl text-[clamp(1.15rem,1.6vw,1.4rem)] text-ink/70">
                  {article.summary}
                </p>
              ) : null}
              {article.author ? (
                <p className="v2-mono v2-size-folio mt-7 text-ink/65">
                  {t("byline", { author: article.author })}
                </p>
              ) : null}
            </div>
          </header>

          {article.imageUrl ? (
            <div className="px-6 sm:px-10 lg:px-12">
              <div className="relative mx-auto aspect-[16/9] max-w-6xl overflow-hidden bg-ink/5">
              <Image
                alt=""
                className="object-cover"
                fill
                priority
                  sizes="(min-width:1280px) 1152px, 100vw"
                src={article.imageUrl}
              />
            </div>
            </div>
          ) : null}

          <div className="mx-auto mt-10 max-w-6xl px-6 sm:px-10 lg:mt-14 lg:px-12">
            <div className="grid border-t border-ink/15 pt-10 lg:grid-cols-[11rem_minmax(0,46rem)] lg:gap-16 lg:pt-14">
              <aside className="mb-8 hidden lg:block">
                <div className="sticky top-[calc(var(--v2-runhead)+2rem)]">
                  <p className="v2-mono v2-size-folio text-gold-strong">
                    {t("storyDetails")}
                  </p>
                  <dl className="mt-5 grid gap-5 border-t border-ink/15 pt-5 text-sm leading-6 text-ink/65">
                    {publishedDate ? (
                      <div>
                        <dt className="v2-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink/45">
                          {t("published")}
                        </dt>
                        <dd className="mt-1">{publishedDate}</dd>
                      </div>
                    ) : null}
                    {article.author ? (
                      <div>
                        <dt className="v2-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink/45">
                          {t("author")}
                        </dt>
                        <dd className="mt-1">{article.author}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="v2-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink/45">
                        {t("reading")}
                      </dt>
                      <dd className="mt-1">
                        {t("readingTime", { minutes: readingMinutes })}
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>
              <div className="min-w-0">
                <RichfieldProse
                  content={article.body}
                  structuredContent={article.bodyContent}
                />
              </div>
            </div>
          </div>

          {article.gallery.length > 0 ? (
            <section
              aria-label={t("gallery")}
              className="mx-auto mt-16 max-w-6xl border-t border-current/15 px-6 pt-10 sm:px-10 lg:mt-24 lg:px-12 lg:pt-14"
            >
              <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <Eyebrow>{t("galleryEyebrow")}</Eyebrow>
                  <h2 className="font-display mt-3 text-[clamp(2.5rem,4vw,4.25rem)] leading-none tracking-[-0.025em]">
                    {t("galleryHeading")}
                  </h2>
                </div>
                <p className="v2-mono v2-size-folio text-ink/50">
                  {t("photoCount", { count: article.gallery.length })}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {article.gallery.map((image, index) => (
                  <figure
                    className={
                      index === 0
                        ? "sm:col-span-2"
                        : undefined
                    }
                    key={image.id}
                  >
                    {/* CMS media may be served from the Tuturuuu delivery host. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={image.alt}
                      className={`w-full bg-black/5 object-cover ${
                        index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                      }`}
                      loading="lazy"
                      src={image.url}
                    />
                    {image.caption ? (
                      <figcaption className="v2-size-folio mt-3 text-ink/60">
                        {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {relatedArticles.length > 0 ? (
            <section
              aria-labelledby="related-news-heading"
              className="mx-auto mt-16 max-w-6xl border-t border-ink/15 px-6 pt-10 sm:px-10 lg:mt-24 lg:px-12 lg:pt-14"
            >
              <Eyebrow>{t("relatedEyebrow")}</Eyebrow>
              <div className="mt-3 flex items-end justify-between gap-6">
                <h2
                  className="font-display text-[clamp(2.5rem,4vw,4.25rem)] leading-none tracking-[-0.025em]"
                  id="related-news-heading"
                >
                  {t("relatedHeading")}
                </h2>
                <Link
                  className="v2-mono v2-size-folio hidden text-gold-strong hover:text-ink sm:inline-flex"
                  href="/news"
                >
                  {t("viewAll")}
                </Link>
              </div>
              <div className="mt-9 grid gap-8 md:grid-cols-3">
                {relatedArticles.map((related) => (
                  <article className="group min-w-0" key={related.slug}>
                    <Link
                      className="block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold"
                      href={`/news/${related.slug}`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
                        {related.imageUrl ? (
                          <Image
                            alt=""
                            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
                            fill
                            sizes="(min-width:768px) 31vw, 100vw"
                            src={related.imageUrl}
                          />
                        ) : null}
                      </div>
                      <p className="v2-mono v2-size-folio mt-5 text-gold-strong">
                        {formatDate(related.publishedAt, locale)}
                      </p>
                      <h3 className="font-display mt-3 text-[clamp(1.65rem,2.2vw,2.25rem)] leading-[1.04] tracking-[-0.02em] text-balance">
                        {related.title}
                      </h3>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>
    </>
  );
}
