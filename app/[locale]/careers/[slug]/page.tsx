import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Link } from "@/i18n/navigation";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import { localeAlternates, toLocale } from "@/lib/locale";
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
  const { openPositions } = await getRichfieldContent(locale);
  const position = openPositions.find((item) => item.slug === slug);
  if (!position) return {};

  return {
    alternates: localeAlternates(`/careers/${position.slug}`),
    description: position.summary,
    title: position.title,
  };
}

export default async function CareerPage({ params }: CareerPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "careerDetailPage" });
  const { openPositions } = await getRichfieldContent(locale);
  const position = openPositions.find((item) => item.slug === slug);
  if (!position) notFound();

  const applyHref = getApplyHref({
    email: position.applyEmail,
    href: position.href,
    title: position.title,
  });
  const external = /^https?:/i.test(applyHref);

  return (
    <>
      <RunningHead locale={locale} />
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
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_18rem]">
            <RichfieldProse
              content={
                position.body ??
                t("fallbackBody")
              }
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
