import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import {
  PhotoCycle,
  type CyclePhoto,
} from "@/app/_components/magazine/media/photo-cycle";
import { GroupStatsPanel } from "@/app/_components/magazine/spreads/group-stats-panel";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { groupIntro } from "@/content/en/stats";

// The Richfield team, end to end: the branded beach formations, the company
// heart formation, and the anniversary gala. Hand-scrollable, auto-advancing.
const NETWORK_PHOTOS: CyclePhoto[] = [
  {
    src: "/photos/people/richfield.webp",
    alt: "The Richfield team in a conga line on the beach at dusk.",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/group-company-1920.webp",
    alt: "The Richfield Worldwide team arranged in a heart formation.",
    objectPosition: "center 40%",
  },
  {
    src: "/photos/people/selected-2026-05-03.webp",
    alt: "Aerial drone view of the Richfield team spelling out RICHFIELD on the beach.",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/people/selected-2026-05-04.webp",
    alt: "The Richfield team on stage at the 30-year anniversary gala dinner.",
    objectPosition: "center 38%",
  },
];

/**
 * Group overview — the editorial open beneath the cover. A grid-breaking
 * feature statement opens the chapter; the client copy then runs down the left
 * against a distribution-network photo carousel that bleeds off the right edge
 * of the page; the headline figures close on a curvy beige panel (giant gold
 * numerals) that lifts them off the white page. This is the dominant home of
 * the group stats; the cover no longer repeats them.
 */
export function GroupOverviewSpread() {
  return (
    <Spread
      id="group"
      bg="transparent"
      className="flex flex-col gap-y-[var(--v2-flow)] !pb-0"
    >
      {/* Chapter open — a feature statement that breaks the grid (leaves a
          wide right margin). */}
      <RevealOnScroll className="flex flex-col gap-y-[var(--v2-rhythm)]">
        <Eyebrow>RICHFIELD GROUP</Eyebrow>
        <h2 className="font-display v2-size-standfirst text-balance text-ink">
          One of Vietnam&rsquo;s largest{" "}
          <em className="italic text-gold-strong">FMCG</em> distribution
          networks.
        </h2>
      </RevealOnScroll>

      {/* Statement copy in a comfortable measure on the left; the photo
          carousel starts in the right half and bleeds off the right edge of
          the page so it dominates. */}
      <div className="grid grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)]">
        <RevealOnScroll
          lang="en"
          className="col-span-12 flex max-w-[52ch] flex-col gap-y-[var(--v2-rhythm)] hyphens-auto lg:col-span-5"
        >
          <p className="v2-dropcap v2-size-body text-justify opacity-90">
            {groupIntro[0]}
          </p>
          <p className="v2-size-body text-justify opacity-90">
            {groupIntro[1]}
          </p>
          <p className="v2-size-body text-justify opacity-90">
            {groupIntro[2]}
          </p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={120} className="col-span-12 lg:col-span-7 lg:col-start-6">
          <figure className="flex flex-col gap-[clamp(10px,1vw,16px)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden lg:mr-[calc(-1*(max((100vw-1500px)/2,0px)+48px))]">
              <PhotoCycle
                photos={NETWORK_PHOTOS}
                sizes="(max-width: 1024px) 100vw, 60vw"
                label="Richfield distribution network gallery"
              />
            </div>
          </figure>
        </RevealOnScroll>
      </div>

      {/* Headline figures — a full-bleed beige panel the page waves into on both
          edges. With the Spread's bottom band removed (!pb-0 above) the bottom
          wave is the seam into the next chapter. */}
      <RevealOnScroll as="div">
        <GroupStatsPanel />
      </RevealOnScroll>
    </Spread>
  );
}
