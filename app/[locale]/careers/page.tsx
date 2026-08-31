import type { Metadata } from "next";
import Image from "next/image";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import { Link } from "@/i18n/navigation";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { CareersHero } from "@/app/_components/magazine/spreads/careers-hero";
import { LifeValues } from "@/app/_components/sections/life-values";
import { LifeGallery } from "@/app/_components/sections/life-gallery";
import { CtaLink } from "@/app/_components/magazine/primitives/cta-link";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { ItalicText } from "@/app/_components/primitives/italic-text";
import { getContent } from "@/content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates, toLocale } from "@/lib/locale";
import { getRichfieldContent } from "@/lib/richfield-delivery";
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
    title: meta("careers.title"),
    description: meta("careers.description"),
    alternates: localeAlternates(locale, "/careers"),
    openGraph: pageOpenGraph({
      description: meta("careers.description"),
      locale,
      path: "/careers",
      title: meta("careers.title"),
    }),
  };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const { imageLibrary, leaders, openPositions } = await getRichfieldContent(locale);
  const { benefits, benefitsIntro, testimonials, communityIntro, communityPrograms, peopleFirstIntro } =
    getContent(locale);
  const t = await getTranslations({ locale, namespace: "careersPage" });
  const careerHeroImages = imageLibrary.filter(
    (image) =>
      image.pageSection === "careers" &&
      (image.usageTags.includes("hero") || image.usageTags.includes("people")),
  );
  const careerGalleryImages = imageLibrary.filter(
    (image) =>
      image.pageSection === "careers" &&
      (image.usageTags.includes("gallery") || image.usageTags.includes("people")),
  );

  return (
    <>
      <RunningHead locale={locale} transparentOverHero />
      <main className="v2-bg-morph text-ink">
        <CareersHero photos={careerHeroImages} locale={locale} />

        {/* Jump straight to the roles. The vacancies list closes the page,
            which reads well as a narrative but buried the one thing most
            visitors came for behind five sections of scrolling. */}
        <div className="v2-display border-y border-current/12 px-6 sm:px-10 lg:px-12">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 py-5">
            <p className="v2-mono v2-size-folio opacity-70">
              {t("vacanciesEyebrow")}
            </p>
            <a
              className="v2-mono v2-size-folio w-fit text-gold-strong underline decoration-gold-strong underline-offset-[6px]"
              href="#vacancies"
            >
              {openPositions.length === 0
                ? t("jumpToRolesNone")
                : openPositions.length === 1
                  ? t("jumpToRolesOne")
                  : t("jumpToRolesMany", { count: openPositions.length })}
            </a>
          </div>
        </div>

        {/* Life at Richfield — intro + core values (thumb-index foldout) */}
        <LifeValues locale={locale} />

        {/* Life at Richfield — the year in pictures, divided by event. */}
        <LifeGallery images={careerGalleryImages} locale={locale} />

        {/* Why Richfield — people-first leadership */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-y-[var(--v2-flow)]">
            <RevealOnScroll className="flex w-full flex-col gap-y-[var(--v2-rhythm)]">
              <Eyebrow>{t("whyEyebrow")}</Eyebrow>
              <h2 className="font-display v2-size-standfirst w-full text-balance">
                <ItalicText text={t("whyHeading")} />
              </h2>
              <p className="v2-size-body w-full text-justify opacity-90">{peopleFirstIntro}</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 gap-x-[var(--v2-col-gap)] gap-y-[clamp(40px,5vw,64px)] lg:grid-cols-2">
              {leaders.map((leader) => (
                <RevealOnScroll as="article" key={leader.name} className="flex flex-col gap-y-[var(--v2-rhythm)]">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={leader.photo}
                      alt={`${leader.name}, ${leader.role}.`}
                      fill
                      sizes="(min-width:1024px) 42vw, 100vw"
                      className="object-cover v2-photo-duotone"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-[clamp(1.6rem,2.2vw,2rem)] leading-[1.1] tracking-[-0.018em]">
                      {leader.name}
                    </h3>
                    <p className="v2-mono v2-size-folio mt-1 text-gold-strong">
                      {leader.role.toUpperCase()}
                    </p>
                  </div>
                  <RichfieldProse
                    compact
                    content={leader.bio}
                    structuredContent={leader.bioContent}
                  />
                  {leader.quote ? (
                    <blockquote className="border-l-2 border-gold-strong pl-5">
                      <p className="v2-italic text-[clamp(1.2rem,1.8vw,1.5rem)] leading-[1.3] text-gold-strong">
                        “{leader.quote}”
                      </p>
                    </blockquote>
                  ) : null}
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* What employees say */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-y-[var(--v2-flow)]">
            <Eyebrow>{t("saysEyebrow")}</Eyebrow>
            <div className="grid grid-cols-1 gap-[clamp(16px,2vw,24px)] lg:grid-cols-2">
              {testimonials.map((t, i) => (
                <RevealOnScroll
                  as="figure"
                  key={t.author}
                  delayMs={i * 90}
                  className="flex flex-col gap-5 rounded-sm border border-line bg-paper p-7 sm:p-9"
                >
                  <span
                    aria-hidden
                    className="font-display text-[2.75rem] leading-[0.6] text-gold-strong"
                  >
                    “
                  </span>
                  <blockquote className="text-[clamp(1.3rem,2vw,1.7rem)] leading-[1.32]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="v2-mono v2-size-folio mt-auto border-t border-current/12 pt-4 opacity-65">
                    {t.author.toUpperCase()} · {t.tenure} · {t.role}
                  </figcaption>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* What this looks like in practice — benefits */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)] lg:grid-cols-[28ch_1fr]">
            <RevealOnScroll className="flex flex-col gap-y-[var(--v2-rhythm)]">
              <Eyebrow>{t("practiceEyebrow")}</Eyebrow>
              <p className="v2-size-body max-w-[34ch] text-justify opacity-90">{benefitsIntro}</p>
            </RevealOnScroll>
            <ul className="flex flex-col">
              {benefits.map((b, i) => (
                <RevealOnScroll as="li" key={b} delayMs={i * 60} className="flex items-baseline gap-4 border-t border-current/15 py-4">
                  <span className="v2-mono v2-size-folio text-gold-strong">{String(i + 1).padStart(2, "0")}</span>
                  <span className="v2-size-body opacity-90">{b}</span>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </section>

        {/* Community & Impact */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-y-[var(--v2-flow)]">
            <RevealOnScroll className="flex w-full flex-col gap-y-[var(--v2-rhythm)]">
              <Eyebrow>{t("communityEyebrow")}</Eyebrow>
              <h2 className="font-display v2-size-standfirst w-full text-balance">
                <ItalicText text={t("communityHeading")} />
              </h2>
              <p className="v2-size-body w-full text-justify opacity-90">{communityIntro}</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 gap-x-[var(--v2-col-gap)] gap-y-[clamp(32px,4vw,48px)] lg:grid-cols-3">
              {communityPrograms.map((p, i) => (
                <RevealOnScroll as="article" key={p.title} delayMs={i * 80} className="flex flex-col gap-y-[var(--v2-rhythm)]">
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={p.photo}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-display text-[clamp(1.4rem,1.9vw,1.7rem)] leading-[1.12] tracking-[-0.018em]">
                    {p.title}
                  </h3>
                  <p className="v2-size-body opacity-90">{p.body}</p>
                  {p.videoUrl ? (
                    <CtaLink href={p.videoUrl} external>
                      {t("watchFilm")}
                    </CtaLink>
                  ) : null}
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Vacancies. scroll-mt clears the fixed running head so the heading is
            not hidden under the bar when the jump link lands here. */}
        <section
          className="v2-display scroll-mt-[var(--v2-runhead)] px-6 py-[var(--v2-section)] text-ink sm:px-10 lg:px-12"
          id="vacancies"
        >
          <RevealOnScroll className="mx-auto flex max-w-[1500px] flex-col gap-y-[var(--v2-flow)]">
            <Eyebrow>{t("vacanciesEyebrow")}</Eyebrow>
            {openPositions.length === 0 ? (
              <div className="flex flex-col gap-4 border-t border-current/15 pt-8">
                <p className="v2-size-body max-w-[60ch] opacity-90">
                  {t("noVacancies")}
                </p>
                <Link
                  href="/contact"
                  className="v2-mono v2-size-folio w-fit text-gold-strong underline decoration-gold-strong underline-offset-[6px]"
                >
                  {t("getInTouch")}
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {openPositions.map((position, index) => (
                  <RevealOnScroll
                    as="article"
                    className="group relative flex flex-col overflow-hidden border border-current/15 bg-paper/75 transition-colors hover:border-gold-strong"
                    delayMs={index * 55}
                    key={position.slug}
                  >
                    {position.imageUrl ? (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          alt=""
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                          fill
                          sizes="(min-width:768px) 50vw, 100vw"
                          src={position.imageUrl}
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="v2-mono v2-size-folio flex flex-wrap gap-x-3 text-gold-strong">
                      <span>{(position.department ?? "Richfield Group").toUpperCase()}</span>
                      {position.employmentType ? (
                        <span>{position.employmentType.toUpperCase()}</span>
                      ) : null}
                    </div>
                    <h3 className="font-display mt-5 text-[clamp(1.8rem,3vw,2.7rem)] leading-tight">
                      <Link
                        className="after:absolute after:inset-0"
                        href={`/careers/${position.slug}`}
                      >
                        {position.title}
                      </Link>
                    </h3>
                    {position.summary ? (
                      <p className="v2-size-body mt-4 line-clamp-3 opacity-70">
                        {position.summary}
                      </p>
                    ) : null}
                    <dl className="v2-size-body mt-8 grid grid-cols-2 gap-4 border-t border-current/15 pt-5">
                      <div>
                        <dt className="v2-mono v2-size-folio opacity-45">{t("location")}</dt>
                        <dd className="mt-1">{position.location}</dd>
                      </div>
                      <div>
                        <dt className="v2-mono v2-size-folio opacity-45">{t("positions")}</dt>
                        <dd className="mt-1">{position.positions}</dd>
                      </div>
                      <div>
                        <dt className="v2-mono v2-size-folio opacity-45">{t("workMode")}</dt>
                        <dd className="mt-1">{position.workMode ?? "On-site"}</dd>
                      </div>
                      <div>
                        <dt className="v2-mono v2-size-folio opacity-45">{t("deadline")}</dt>
                        <dd className="mt-1">{position.deadline}</dd>
                      </div>
                    </dl>
                    <span className="v2-mono v2-size-folio mt-7 text-gold-strong">
                      {t("viewPosition")}
                    </span>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            )}
          </RevealOnScroll>
        </section>

      </main>
    </>
  );
}
