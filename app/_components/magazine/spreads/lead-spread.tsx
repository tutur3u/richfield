import Image from "next/image";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { ItalicText } from "@/app/_components/primitives/italic-text";
import { useTranslations } from "next-intl";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locale";

const MARS_WRIGLEY_LOGO = "/photos/logos/mars-wrigley.webp";

/** The Mars · Wrigley wordmark set inline, standing in for the words
    "Mars Wrigley" where the intro names our first partner. */
function MarsWrigleyMark() {
  return (
    <span className="relative mx-1 inline-block h-[1.9em] w-[4em] align-middle">
      <Image
        src={MARS_WRIGLEY_LOGO}
        alt="Mars · Wrigley"
        fill
        sizes="120px"
        className="object-contain object-center"
      />
    </span>
  );
}

/**
 * "Our Story" and "The Founder" as two stacked blocks. Our Story runs full
 * width; the Mars · Wrigley wordmark is set inline in the intro where it names
 * the first partner. The Founder profile follows as its own section — on mobile
 * it reads eyebrow → name → portrait → bio; on desktop the portrait sits beside
 * the write-up.
 */
export function LeadSpread({
  head = false,
  locale = "en",
}: {
  head?: boolean;
  locale?: Locale;
}) {
  const { ourStoryIntro, founder } = getContent(locale);
  const t = useTranslations("story.leadSpread");

  const introParts = ourStoryIntro.split("Mars Wrigley");
  const hasMark = introParts.length === 2;

  return (
    <Spread id="story" bg="cream" head={head}>
      <div
        className="flex flex-col gap-[clamp(56px,7vw,104px)] [hyphens:none]"
        lang={locale}
      >
        {/* Our Story — headline full width, intro with the inline wordmark. */}
        <div className="v2-lede flex flex-col gap-[clamp(12px,1.5vw,20px)]">
          <RevealOnScroll>
            <Eyebrow className="mb-[clamp(12px,1.5vw,20px)]">
              {t("storyEyebrow")}
            </Eyebrow>

            <h1 className="font-display v2-size-standfirst">
              <ItalicText text={t("heading")} />
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <p className="v2-dropcap v2-size-body text-justify opacity-90">
              {hasMark ? (
                <>
                  {introParts[0]}
                  <MarsWrigleyMark />
                  {introParts[1]}
                </>
              ) : (
                ourStoryIntro
              )}
            </p>
          </RevealOnScroll>
        </div>

        {/* The Founder — own section. Mobile order: eyebrow+name → portrait →
            bio. Desktop: portrait left, write-up right. */}
        <div className="flex flex-col gap-[clamp(12px,1.5vw,20px)] lg:flex-row lg:items-start lg:gap-[var(--v2-col-gap)]">
          <figure
            id="founder"
            className="overflow-hidden max-lg:order-2 lg:w-[38%] lg:shrink-0"
          >
            <RevealOnScroll as="div" className="relative aspect-[2/3] w-full overflow-hidden">
              <Image
                src={founder.photo}
                alt={t("founderPhotoAlt", { name: founder.name, role: founder.role })}
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover v2-photo-duotone"
              />
            </RevealOnScroll>
            <figcaption className="v2-mono v2-size-folio mt-3 opacity-65">
              {founder.name.toUpperCase()} · {founder.role.toUpperCase()}
            </figcaption>
          </figure>

          {/* Write-up dissolves on mobile so its parts reflow around the
              portrait; on desktop it's the right column. */}
          <div className="max-lg:contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-[clamp(12px,1.5vw,20px)]">
            <RevealOnScroll className="max-lg:order-1">
              <Eyebrow className="mb-[clamp(12px,1.5vw,20px)]">
                {t("founderEyebrow")}
              </Eyebrow>

              <h2 className="font-display v2-size-standfirst">
                {founder.name}
                <span className="text-gold-strong">.</span>
              </h2>
            </RevealOnScroll>

            <RevealOnScroll className="max-lg:order-3">
              {founder.bio.map((para, i) => (
                <p
                  key={i}
                  className={`v2-size-body text-justify opacity-90 ${i === 0 ? "v2-dropcap" : "mt-[var(--v2-rhythm)]"}`}
                >
                  {para}
                </p>
              ))}

              <blockquote className="mt-[var(--v2-flow)] border-l-2 border-gold-strong pl-5">
                <p className="v2-italic text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.25] text-gold-strong">
                  “{founder.motto}”
                </p>
              </blockquote>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </Spread>
  );
}
