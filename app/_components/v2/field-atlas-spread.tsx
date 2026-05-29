import { AtlasMap } from "@/app/_components/v2/atlas-map";
import { AtlasRoster } from "@/app/_components/v2/atlas-roster";

type Office = { readonly country: string; readonly role: string };

const OFFICES: readonly Office[] = [
  { country: "Vietnam", role: "HQ · HCMC" },
  { country: "Malaysia", role: "Origin · 1990s" },
  { country: "China", role: "Sourcing & Brands" },
];

export function FieldAtlasSpread() {
  return (
    <section
      id="atlas"
      className="v2-display relative flex min-h-[100svh] w-full flex-col"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-y-[clamp(20px,2.2vw,34px)] px-6 py-[clamp(24px,3.5vw,48px)] sm:px-10 lg:px-12">
        {/* Top folio — single line, matches STORY 01/02. */}
        <header className="v2-mono v2-size-folio flex items-center gap-6 opacity-55">
          <span>RICHFIELD WORLDWIDE JSC</span>
          <span aria-hidden className="v2-rule flex-1" />
        </header>

        {/* Editorial spread — the map plate dominates the right; the group
            standfirst and office roster sit beside it. The grid fills the
            space below the folio and is vertically centred (items-center),
            so the breathing room above and below the content reads as one
            uniform band. Body copy keeps the same justified rhythm as
            STORY 01. */}
        <div className="grid flex-1 grid-cols-12 items-center gap-x-[clamp(24px,3vw,64px)] gap-y-[clamp(28px,3vw,44px)]">
          <div
            className="col-span-12 hyphens-auto lg:col-span-5"
            lang="en"
          >
            <p className="v2-mono v2-size-eyebrow mb-[clamp(10px,0.9vw,16px)] flex items-center gap-3 text-gold-strong">
              <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
              FOOTPRINT
            </p>

            <h2 className="font-display mb-[clamp(18px,1.8vw,28px)] text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.026em] text-ink">
              <span className="block">Three countries.</span>
              <span className="block">
                Three <em className="italic text-gold-strong">generations</em>.
              </span>
              <span className="block">One promise.</span>
            </h2>

            <p className="v2-size-body text-justify opacity-90">
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
