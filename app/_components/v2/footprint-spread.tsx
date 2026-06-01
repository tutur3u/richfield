import { AtlasMap } from "@/app/_components/v2/atlas-map";
import { AtlasRoster } from "@/app/_components/v2/atlas-roster";

type Office = { readonly country: string; readonly role: string };

const OFFICES: readonly Office[] = [
  { country: "Vietnam", role: "HQ · HCMC" },
  { country: "Malaysia", role: "Origin · 1990s" },
  { country: "China", role: "Sourcing & Brands" },
];

export function FootPrintSpread() {
  return (
    <section
      id="atlas"
      className="v2-display relative flex w-full flex-col lg:min-h-[100svh]"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-y-[var(--v2-flow)] px-6 pb-[clamp(24px,3.5vw,48px)] pt-[calc(var(--v2-runhead)+clamp(8px,1.5vw,20px))] sm:px-10 lg:px-12">
        {/* Editorial spread — the map plate dominates the right; the group
            standfirst and office roster sit beside it. The grid fills the
            space below the folio and is vertically centred (items-center),
            so the breathing room above and below the content reads as one
            uniform band. Body copy keeps the same justified rhythm as
            STORY 01. */}
        <div className="grid flex-1 grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-[clamp(28px,3vw,44px)]">
          <div
            className="col-span-12 hyphens-auto lg:col-span-5"
            lang="en"
          >
            <p className="v2-mono v2-size-eyebrow mb-[var(--v2-rhythm)] flex items-center gap-3 text-gold-strong">
              <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
              FOOTPRINT
            </p>

            <h2 className="font-display v2-headline mb-[var(--v2-rhythm)] text-ink">
              <span className="block">Three countries.</span>
              <span className="block">
                Three <em className="italic text-gold-strong">generations</em>.
              </span>
              <span className="block">One promise.</span>
            </h2>

            <p className="v2-size-body text-left sm:text-justify opacity-90">
              The Richfield Group spans three countries and three generations of family leadership, combining international scale with hands-on knowledge of every market we serve.
            </p>

            <AtlasRoster offices={OFFICES} />
          </div>

          {/* Map plate — client asset, original ratio preserved. */}
          <div className="col-span-12 lg:col-span-7">
            <AtlasMap />
          </div>
        </div>
      </div>
    </section>
  );
}
