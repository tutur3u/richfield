import type { Metadata } from "next";
import Image from "next/image";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { ItalicText } from "@/app/_components/primitives/italic-text";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { Link } from "@/i18n/navigation";
import type { RichfieldArticle } from "@/lib/richfield-content";
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
    alternates: localeAlternates("/news"),
    description: meta("news.description"),
    title: meta("news.title"),
  };
}

function formatDate(value: string | null, locale: string) {
  if (!value) return null;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(value));
}

function StoryMeta({
  article,
  locale,
}: {
  article: RichfieldArticle;
  locale: string;
}) {
  const date = formatDate(article.publishedAt, locale);

  if (!article.category && !date) return null;

  return (
    <div className="v2-mono v2-size-folio flex flex-wrap items-center gap-x-3 gap-y-2 text-gold-strong">
      {article.category ? <span>{article.category}</span> : null}
      {article.category && date ? (
        <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-45" />
      ) : null}
      {date ? <time dateTime={article.publishedAt ?? undefined}>{date}</time> : null}
    </div>
  );
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "newsPage" });
  const { articles } = await getRichfieldContent(locale);
  const [leadArticle, ...latestArticles] = articles;

  return (
    <>
      <RunningHead locale={locale} />
      <main className="v2-bg-morph min-h-screen text-ink">
        <header className="px-6 pb-12 pt-[calc(var(--v2-runhead)+clamp(3.5rem,7vw,7rem))] sm:px-10 lg:px-12">
          <RevealOnScroll className="mx-auto grid max-w-[1500px] gap-8 border-b border-ink/15 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] lg:items-end lg:pb-16">
            <div>
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h1 className="font-display mt-6 max-w-5xl text-[clamp(3.25rem,7vw,7.25rem)] leading-[0.92] tracking-[-0.035em] text-balance">
                <ItalicText text={t("heading")} emClassName="text-gold-strong" />
              </h1>
            </div>
            <p className="v2-size-body max-w-xl text-ink/70 lg:pb-1">
              {t("intro")}
            </p>
          </RevealOnScroll>
        </header>

        <div className="mx-auto max-w-[1500px] px-6 pb-[var(--v2-section)] sm:px-10 lg:px-12">
          {!leadArticle ? (
            <div className="border-b border-current/15 py-16">
              <p className="font-display text-3xl">{t("emptyTitle")}</p>
              <p className="v2-size-body mt-3 opacity-65">
                {t("emptyBody")}
              </p>
            </div>
          ) : (
            <>
              <section aria-labelledby="lead-story-heading">
                <article className="group border-b border-ink/15 pb-14 lg:pb-20">
                  <Link
                    className="grid gap-7 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] lg:items-stretch lg:gap-12"
                    href={`/news/${leadArticle.slug}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink/5 lg:aspect-[16/9]">
                      {leadArticle.imageUrl ? (
                        <Image
                          alt=""
                          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
                          fill
                          priority
                          sizes="(min-width:1024px) 62vw, 100vw"
                          src={leadArticle.imageUrl}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(181,135,50,0.18),rgba(16,39,31,0.06))]" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center py-1 lg:py-10">
                      <div className="mb-6 flex items-center gap-3">
                        <span className="v2-mono v2-size-folio text-gold-strong">
                          {t("leadStory")}
                        </span>
                        <span aria-hidden className="h-px flex-1 bg-gold/40" />
                      </div>
                      <StoryMeta article={leadArticle} locale={locale} />
                      <h2
                        className="font-display mt-5 text-[clamp(2.35rem,3.5vw,3.75rem)] leading-[1.02] tracking-[-0.025em] text-balance"
                        id="lead-story-heading"
                      >
                        {leadArticle.title}
                      </h2>
                      {leadArticle.summary ? (
                        <p className="v2-size-body mt-6 max-w-xl text-ink/70">
                          {leadArticle.summary}
                        </p>
                      ) : null}
                      <span className="v2-mono v2-size-folio mt-9 inline-flex items-center gap-3 text-gold-strong">
                        {t("readStory")}
                        <span
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </article>
              </section>

              {latestArticles.length > 0 ? (
                <section
                  aria-labelledby="latest-news-heading"
                  className="pt-14 lg:pt-20"
                >
                  <div className="mb-9 flex flex-col gap-3 border-b border-ink/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <Eyebrow>{t("latestEyebrow")}</Eyebrow>
                      <h2
                        className="font-display mt-3 text-[clamp(2.5rem,4vw,4.5rem)] leading-none tracking-[-0.025em]"
                        id="latest-news-heading"
                      >
                        {t("latestHeading")}
                      </h2>
                    </div>
                    <p className="v2-mono v2-size-folio text-ink/55">
                      {t("storyCount", { count: articles.length })}
                    </p>
                  </div>

                  <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                    {latestArticles.map((article) => (
                      <article className="group min-w-0" key={article.slug}>
                        <Link
                          className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold"
                          href={`/news/${article.slug}`}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
                            {article.imageUrl ? (
                              <Image
                                alt=""
                                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
                                fill
                                sizes="(min-width:1280px) 31vw, (min-width:768px) 48vw, 100vw"
                                src={article.imageUrl}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(181,135,50,0.16),rgba(16,39,31,0.05))]" />
                            )}
                          </div>
                          <div className="flex flex-1 flex-col border-b border-ink/20 pb-8 pt-6 transition-colors duration-300 group-hover:border-gold-strong">
                            <StoryMeta article={article} locale={locale} />
                            <h3 className="font-display mt-4 text-[clamp(1.8rem,2.5vw,2.65rem)] leading-[1.04] tracking-[-0.02em] text-balance">
                              {article.title}
                            </h3>
                            {article.summary ? (
                              <p className="mt-4 line-clamp-3 text-[1rem] leading-7 text-ink/65">
                                {article.summary}
                              </p>
                            ) : null}
                            <span className="v2-mono v2-size-folio mt-auto inline-flex items-center gap-3 pt-7 text-gold-strong">
                              {t("readStory")}
                              <span
                                aria-hidden
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              >
                                →
                              </span>
                            </span>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          )}
        </div>
      </main>
    </>
  );
}
