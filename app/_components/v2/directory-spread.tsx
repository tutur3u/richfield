import { homepageMilestones } from "@/content/en/milestones";
import { JourneyTimeline } from "@/app/_components/v2/journey-timeline";
import { ShelfExplorer } from "@/app/_components/v2/shelf-explorer";

// ---------------------------------------------------------------------------
// Intro spread — the directory chapter opener. The dominant headline sits up
// top; the milestone timeline runs beneath it. Content keeps one vertical
// rhythm and is centred as a single group (the folio stays pinned at the top).
// The full brand roster lives on the consolidated shelf spread below.
// ---------------------------------------------------------------------------

// The opener timeline spotlights the international partner acquisitions; the
// Dory Rich JV is the subject of its own §05 spread, so it's omitted here.
const journeyMilestones = homepageMilestones.filter(
  (m) => m.brand !== "Dory Rich JSC",
);

export function DirectoryIntroSpread() {
  return (
    <section
      id="brands"
      className="v2-display relative flex min-h-[100svh] w-full flex-col lg:h-[100svh]"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-6 py-[clamp(24px,3.5vw,48px)] sm:px-10 lg:px-12">
        <header className="v2-mono v2-size-folio flex items-center gap-6 opacity-55">
          <span>RICHFIELD WORLDWIDE JSC</span>
          <span aria-hidden className="v2-rule flex-1" />
        </header>

        {/* Content — one vertical rhythm, centred as a single group. */}
        <div className="flex flex-1 flex-col justify-center gap-y-[clamp(22px,3vw,46px)]">
          {/* Headline block — full width. */}
          <div className="hyphens-auto" lang="en">
            <p className="v2-mono v2-size-eyebrow mb-[clamp(10px,0.9vw,16px)] flex items-center gap-3 text-gold-strong">
              <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
              DIRECTORY
            </p>

            <h2 className="font-display mb-[clamp(14px,1.4vw,22px)] text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.026em] text-ink">
              Trusted by the most{" "}
              <em className="italic text-gold-strong">recognized</em> brands
            </h2>

            <p className="v2-size-body text-left sm:text-justify opacity-90">
              From confectionery and beverages to personal care and stationery — Richfield carries the brands shoppers already reach for, in partnerships that often run for decades.
            </p>
          </div>

          {/* Journey timeline. */}
          <div>
            <p className="v2-mono v2-size-eyebrow mb-[clamp(16px,2vw,30px)] flex items-center gap-3 text-gold-strong">
              <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
              OUR JOURNEY
            </p>
            <JourneyTimeline milestones={journeyMilestones} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Categories spread — "The full shelf." A category-tabbed editorial mosaic.
// One category fills the viewport at a time (the Coca-Cola all-brands model);
// within it, wide TVC banners and bordered product boxes interlock in an
// asymmetric grid that preserves every image's native aspect ratio.
// ---------------------------------------------------------------------------

export function DirectoryCategoriesSpread() {
  return (
    <section
      id="brands-shelf"
      className="v2-display relative flex min-h-[100svh] w-full flex-col lg:h-[100svh]"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-6 py-[clamp(24px,3.5vw,48px)] sm:px-10 lg:min-h-0 lg:px-12">
        <header className="v2-mono v2-size-folio mb-[clamp(12px,1.5vw,22px)] flex items-center gap-6 opacity-55">
          <span>RICHFIELD WORLDWIDE JSC</span>
          <span aria-hidden className="v2-rule flex-1" />
        </header>

        <ShelfExplorer />
      </div>
    </section>
  );
}

// Backwards-compat export — `<DirectorySpread />` renders the opener plus the
// consolidated shelf, so callers that still embed it (e.g. tests) keep working.
export function DirectorySpread() {
  return (
    <>
      <DirectoryIntroSpread />
      <DirectoryCategoriesSpread />
    </>
  );
}
