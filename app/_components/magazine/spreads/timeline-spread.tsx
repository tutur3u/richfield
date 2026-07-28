import { JourneyTimeline } from "@/app/_components/magazine/media/journey-timeline";
import { PhotoCycle, type CyclePhoto } from "@/app/_components/magazine/media/photo-cycle";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import type { Milestone } from "@/content/en/milestones";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import { useTranslations } from "next-intl";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locale";

// Anniversary gallery — the Nov 2024 Nha Trang 30th-anniversary trip the coda
// describes: the beach formation, the gala dinner, and the team activities.
// Alt text is zipped in from the locale's story strings.
const ANNIVERSARY_PHOTOS: Omit<CyclePhoto, "alt">[] = [
  {
    src: "/photos/people/selected-2026-05-03.webp",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/people/anniv-gala-1600.webp",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/anniv-cycle-1600.webp",
    objectPosition: "center 60%",
  },
  {
    src: "/photos/people/anniv-towers-1600.webp",
    objectPosition: "center 50%",
  },
];

/**
 * "Our Story · Timeline" — the six company milestones across a hairline, then
 * the 30th-anniversary note set as a gold-ruled coda beside a company photo.
 */
export function TimelineSpread({
  milestones,
  locale = "en",
}: {
  milestones: Milestone[];
  locale?: Locale;
}) {
  const { anniversary30 } = getContent(locale);
  const t = useTranslations("story.timelineSpread");
  const anniversaryPhotoAlts = t.raw("anniversaryPhotoAlts") as string[];
  const anniversaryPhotos: CyclePhoto[] = ANNIVERSARY_PHOTOS.map((p, i) => ({
    ...p,
    alt: anniversaryPhotoAlts[i],
  }));

  return (
    <Spread id="timeline" bg="cream" className="flex flex-col gap-y-[var(--v2-flow)]">
      <RevealOnScroll className="flex flex-col gap-y-[var(--v2-rhythm)]">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
      </RevealOnScroll>

      <JourneyTimeline milestones={milestones} locale={locale} />

      {/* Anniversary coda — text hangs left, a company photo anchors the right
          so the chapter closes on a face rather than empty paper. */}
      <div className="grid grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)] border-t border-current/15 pt-[var(--v2-flow)]">
        <RevealOnScroll className="col-span-12 lg:col-span-6">
          <Eyebrow className="mb-[var(--v2-rhythm)]">
            {anniversary30.title.toUpperCase()}
          </Eyebrow>
          <RichfieldProse
            compact
            content={anniversary30.body}
          />
        </RevealOnScroll>
        <RevealOnScroll delayMs={80} className="col-span-12 lg:col-span-6">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <PhotoCycle
              photos={anniversaryPhotos}
              sizes="(max-width: 1024px) 100vw, 50vw"
              label={t("galleryLabel")}
              locale={locale}
            />
          </div>
        </RevealOnScroll>
      </div>
    </Spread>
  );
}
