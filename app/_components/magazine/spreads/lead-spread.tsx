import { LeadPhotoCycle } from "@/app/_components/magazine/media/lead-photo-cycle";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { ourStoryIntro } from "@/content/en/story";

export function LeadSpread({ head = false }: { head?: boolean }) {
  return (
    <Spread id="story" bg="cream" head={head}>
      {/* Asymmetric editorial grid (unified with the other spreads): the
          headline + body hang left, the photo carousel anchors the right. No
          float — so the tall photo can't overflow into the next chapter. */}
      <div className="grid grid-cols-12 items-start gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)]">
        <div className="col-span-12 hyphens-auto lg:col-span-6" lang="en">
          <Eyebrow className="mb-[var(--v2-rhythm)]">OUR STORY</Eyebrow>

          <h1 className="font-display v2-size-standfirst mb-[var(--v2-rhythm)] max-w-[16ch]">
            From a{" "}
            <em className="italic text-gold-strong">single partnership</em>
          </h1>

          <p className="v2-dropcap v2-size-body text-left sm:text-justify opacity-90">
            {ourStoryIntro}
          </p>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <LeadPhotoCycle />
          </div>
        </div>
      </div>
    </Spread>
  );
}
