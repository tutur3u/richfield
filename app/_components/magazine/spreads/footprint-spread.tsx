import { AtlasMap } from "@/app/_components/magazine/media/atlas-map";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";

export function FootPrintSpread() {
  return (
    <Spread
      id="atlas"
      bg="transparent"
      surfaceClass="v2-plate-fade-top"
    >

      {/* White ground for the map. It fades into the page gradient only at the
          top (morphing down from what-we-do) and stays white to the bottom, so
          it meets the white joint-venture spread below edge-to-edge with no
          beige gap between them. The headline hangs top-left over a ghost "3"
          (three countries, three generations). */}
      <div className="grid grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)]">
        <div className="relative col-span-12 hyphens-auto lg:col-span-4" lang="en">

          <div className="relative z-10">
            <Eyebrow className="mb-[var(--v2-rhythm)]">FOOTPRINT</Eyebrow>

            <h2 className="font-display v2-size-standfirst mb-[var(--v2-rhythm)] text-ink">
              <span className="block">3 countries.</span>
              <span className="block">
                3 <em className="italic text-gold-strong">generations</em>.
              </span>
              <span className="block">1 promise.</span>
            </h2>

            <p className="v2-size-body text-justify opacity-90">
              The Richfield Group spans three countries and three generations of
              family leadership, combining international scale with hands-on
              knowledge of every market we serve.
            </p>
          </div>
        </div>

        {/* Map plate — client asset, original ratio preserved. */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <AtlasMap />
        </div>
      </div>
    </Spread>
  );
}
