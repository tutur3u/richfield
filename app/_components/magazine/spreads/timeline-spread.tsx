import { JourneyTimeline } from "@/app/_components/magazine/media/journey-timeline";
import { PhotoCycle, type CyclePhoto } from "@/app/_components/magazine/media/photo-cycle";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import type { Milestone } from "@/content/en/milestones";
import { anniversary30 } from "@/content/en/story";

// Anniversary gallery — the Nov 2024 Nha Trang 30th-anniversary trip the coda
// describes: the beach formation, the gala dinner, and the team activities.
const ANNIVERSARY_PHOTOS: CyclePhoto[] = [
  {
    src: "/photos/people/selected-2026-05-03.webp",
    alt: "Richfield staff spell out RICHFIELD on the Nha Trang beach, seen from above, for the 30th anniversary.",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/people/anniv-gala-1600.webp",
    alt: "The Richfield team on stage at the 30th-anniversary gala dinner in Nha Trang.",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/anniv-cycle-1600.webp",
    alt: "Colleagues lined up with bicycles during the 30th-anniversary team activities.",
    objectPosition: "center 60%",
  },
  {
    src: "/photos/people/anniv-towers-1600.webp",
    alt: "The Richfield team at the Po Nagar Cham towers during the Nha Trang anniversary trip.",
    objectPosition: "center 50%",
  },
];

/**
 * "Our Story · Timeline" — the six company milestones across a hairline, then
 * the 30th-anniversary note set as a gold-ruled coda beside a company photo.
 */
export function TimelineSpread({ milestones }: { milestones: Milestone[] }) {
  return (
    <Spread id="timeline" bg="cream" className="flex flex-col gap-y-[var(--v2-flow)]">
      <RevealOnScroll className="flex flex-col gap-y-[var(--v2-rhythm)]">
        <Eyebrow>THE TIMELINE</Eyebrow>
      </RevealOnScroll>

      <JourneyTimeline milestones={milestones} />

      {/* Anniversary coda — text hangs left, a company photo anchors the right
          so the chapter closes on a face rather than empty paper. */}
      <div className="grid grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)] border-t border-current/15 pt-[var(--v2-flow)]">
        <RevealOnScroll className="col-span-12 lg:col-span-6">
          <Eyebrow className="mb-[var(--v2-rhythm)]">
            {anniversary30.title.toUpperCase()}
          </Eyebrow>
          <p className="v2-size-body opacity-90">{anniversary30.body}</p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={80} className="col-span-12 lg:col-span-6">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <PhotoCycle
              photos={ANNIVERSARY_PHOTOS}
              sizes="(max-width: 1024px) 100vw, 50vw"
              label="30th-anniversary gallery"
            />
          </div>
        </RevealOnScroll>
      </div>
    </Spread>
  );
}
