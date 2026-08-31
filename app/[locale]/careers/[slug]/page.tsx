import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { JsonLd } from "@/app/_components/seo/json-ld";
import { TranslationUnavailable } from "@/app/_components/magazine/translation-unavailable";
import { Link } from "@/i18n/navigation";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import type { Locale } from "@/lib/locale";
import { toLocale } from "@/lib/locale";
import { publishedLocaleAlternates } from "@/lib/localized-route";
import {
  breadcrumbJsonLd,
  pageOpenGraph,
  seoDescription,
  seoTitle,
} from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

type CareerPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getApplyHref({
  email,
  href,
  title,
}: {
  email?: string;
  href?: string;
  title: string;
}) {
  if (href && /^(https?:|\/)/i.test(href.trim())) return href.trim();
  const safeEmail =
    email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? email
      : "hello@richfield.vn";
  return `mailto:${safeEmail}?subject=${encodeURIComponent(`Application: ${title}`)}`;
}

export async function generateMetadata({
  params,
}: CareerPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  const alternateLocale: Locale = locale === "en" ? "vi" : "en";
  const [{ openPositions }, alternateContent] = await Promise.all([
    getRichfieldContent(locale),
    getRichfieldContent(alternateLocale),
  ]);
  const position = openPositions.find((item) => item.slug === slug);
  const alternatePosition = alternateContent.openPositions.find(
    (item) => item.slug === slug,
  );
  if (!position && !alternatePosition) return {};
  const availableLocales = [
    ...(position ? [locale] : []),
    ...(alternatePosition ? [alternateLocale] : []),
  ];
  const path = `/careers/${slug}`;
  const meta = await getTranslations({ locale, namespace: "meta" });

  if (!position && alternatePosition) {
    const t = await getTranslations({ locale, namespace: "careerDetailPage" });
    return {
      alternates: publishedLocaleAlternates({
        availableLocales,
        canonicalLocale: alternateLocale,
        path,
      }),
      description: t("translationDescription"),
      robots: { follow: true, index: false },
      title: t("translationTitle"),
    };
  }

  const title = position?.title ?? meta("careers.title");
  const description = seoDescription(
    position?.summary ?? "",
    meta("careers.description"),
  );

  return {
    alternates: publishedLocaleAlternates({
      availableLocales,
      canonicalLocale: locale,
      path,
    }),
    description,
    openGraph: pageOpenGraph({
      description,
      locale,
      path,
      title,
    }),
    title: seoTitle(title, meta("careers.title")),
  };
}

export default async function CareerPage({ params }: CareerPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "careerDetailPage" });
  const alternateLocale: Locale = locale === "en" ? "vi" : "en";
  const [{ openPositions }, alternateContent] = await Promise.all([
    getRichfieldContent(locale),
    getRichfieldContent(alternateLocale),
  ]);
  const position = openPositions.find((item) => item.slug === slug);
  const alternatePosition = alternateContent.openPositions.find(
    (item) => item.slug === slug,
  );
  if (!position && !alternatePosition) notFound();

  const detailHref = `/careers/${slug}`;
  const languageAvailability = {
    [locale]: Boolean(position),
    [alternateLocale]: Boolean(alternatePosition),
  };

  if (!position && alternatePosition) {
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
          browseHref="/careers"
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
  if (!position) notFound();

  const applyHref = getApplyHref({
    email: position.applyEmail,
    href: position.href,
    title: position.title,
  });
  const external = /^https?:/i.test(applyHref);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd({
          items: [
            { name: "Richfield Group", path: "/" },
            { name: t("allOpportunities"), path: "/careers" },
            { name: position.title, path: `/careers/${position.slug}` },
          ],
          locale,
        })}
      />
      <RunningHead
        locale={locale}
        languageAvailability={languageAvailability}
        languageHrefs={{ en: detailHref, vi: detailHref }}
      />
      <main className="v2-bg-morph min-h-screen px-6 pb-[var(--v2-section)] pt-[calc(var(--v2-runhead)+var(--v2-section))] text-ink sm:px-10 lg:px-12">
        <article className="mx-auto max-w-5xl">
          <Link className="v2-mono v2-size-folio text-gold-strong" href="/careers">
            {t("allOpportunities")}
          </Link>
          <div className="mt-10 grid gap-10 border-b border-current/15 pb-12 lg:grid-cols-[1fr_18rem]">
            <div>
              <p className="v2-mono v2-size-folio text-gold-strong">
                {(position.department ?? "RICHFIELD GROUP").toUpperCase()}
              </p>
              <h1 className="font-display mt-5 text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em]">
                {position.title}
              </h1>
              {position.summary ? (
                <p className="v2-size-body mt-8 max-w-2xl text-xl opacity-70">
                  {position.summary}
                </p>
              ) : null}
            </div>
            <dl className="v2-size-body grid content-start gap-5 border-l border-current/15 pl-7">
              {[
                [t("location"), position.location],
                [t("workMode"), position.workMode],
                [t("employment"), position.employmentType],
                [t("openings"), String(position.positions)],
                [t("deadline"), position.deadline],
              ].map(([label, value]) =>
                value ? (
                  <div key={label}>
                    <dt className="v2-mono v2-size-folio opacity-50">
                      {label?.toUpperCase()}
                    </dt>
                    <dd className="mt-1">{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </div>
          {position.imageUrl ? (
            <div className="relative mt-10 aspect-[16/8] overflow-hidden">
              <Image
                alt={position.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width:1024px) 1024px, 100vw"
                src={position.imageUrl}
              />
            </div>
          ) : null}
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_18rem]">
            <RichfieldProse
              content={
                position.body ??
                t("fallbackBody")
              }
              structuredContent={position.bodyContent}
            />
            <aside className="h-fit border border-current/15 bg-paper p-6">
              <p className="font-display text-2xl">{t("interested")}</p>
              <p className="v2-size-body mt-3 opacity-65">
                {t("applyIntro")}
              </p>
              <a
                className="v2-mono v2-size-folio mt-6 flex justify-center bg-ink px-5 py-4 text-cream transition-colors hover:bg-gold-strong"
                href={applyHref}
                rel={external ? "noreferrer" : undefined}
                target={external ? "_blank" : undefined}
              >
                {t("applyNow")}
              </a>
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
