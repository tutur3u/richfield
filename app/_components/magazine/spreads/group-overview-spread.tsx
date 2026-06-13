import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import {
  PhotoCycle,
  type CyclePhoto,
} from "@/app/_components/magazine/media/photo-cycle";
import { GroupStatsPanel } from "@/app/_components/magazine/spreads/group-stats-panel";
import { groupIntro } from "@/content/en/stats";

// The distribution network, end to end: the DC, the two trade channels it
// serves, and a new-facility opening. Hand-scrollable, auto-advancing.
const NETWORK_PHOTOS: CyclePhoto[] = [
  {
    src: "/photos/people/facility/warehouse-dock-1600.webp",
    alt: "Richfield staff loading a delivery truck at the distribution centre.",
    objectPosition: "center 55%",
  },
  {
    src: "/photos/people/facility/general-trade-store.webp",
    alt: "A traditional-trade neighbourhood store stocked with Richfield-distributed brands.",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/people/facility/modern-trade-aisle.webp",
    alt: "Shoppers in a modern-trade supermarket aisle served by Richfield.",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/people/grand-opening-2026-1280.webp",
    alt: "The grand opening of a new Richfield facility in 2026.",
    objectPosition: "center 50%",
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
      bg="white"
      className="flex flex-col gap-y-[var(--v2-flow)] !pb-0"
    >
      {/* Chapter open — a feature statement that breaks the grid (leaves a
          wide right margin). */}
      <div className="flex flex-col gap-y-[var(--v2-rhythm)]">
        <Eyebrow>RICHFIELD GROUP</Eyebrow>
        <h2 className="font-display v2-size-standfirst text-balance text-ink">
          One of Vietnam&rsquo;s largest{" "}
          <em className="italic text-gold-strong">FMCG</em> distribution
          networks.
        </h2>
      </div>

      {/* Statement copy in a comfortable measure on the left; the photo
          carousel starts in the right half and bleeds off the right edge of
          the page so it dominates. */}
      <div className="grid grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)]">
        <div
          className="col-span-12 flex max-w-[52ch] flex-col gap-y-[var(--v2-rhythm)] hyphens-auto lg:col-span-5"
          lang="en"
        >
          <p className="v2-dropcap v2-size-body opacity-90 sm:text-justify">
            {groupIntro[0]}
          </p>
          <p className="v2-size-body opacity-90 sm:text-justify">
            {groupIntro[1]}
          </p>
          <p className="v2-size-body opacity-90 sm:text-justify">
            {groupIntro[2]}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <figure className="flex flex-col gap-[clamp(10px,1vw,16px)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden lg:mr-[calc(-1*(max((100vw-1500px)/2,0px)+48px))]">
              <PhotoCycle
                photos={NETWORK_PHOTOS}
                sizes="(max-width: 1024px) 100vw, 60vw"
                label="Richfield distribution network gallery"
              />
            </div>
          </figure>
        </div>
      </div>

      {/* Headline figures — a full-bleed beige panel the page waves into on both
          edges. With the Spread's bottom band removed (!pb-0 above) the bottom
          wave is the seam into the next chapter. */}
      <GroupStatsPanel />
    </Spread>
  );
}
