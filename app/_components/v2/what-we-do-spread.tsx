import { pillars } from "@/content/en/capabilities";

const SIGNATURE_STATS: Record<string, string> = {
  "Warehouse & Logistics": "TWO DCS · LONG AN · HANOI",
  "General Trade": "180,000 OUTLETS · 800+ SALESMEN",
  "Modern Trade": "EVERY CHAIN IN VIETNAM",
};

const DISPLAY_NUMBERS = ["01", "02", "03"];

const INCLUDED_PILLARS = [
  "Warehouse & Logistics",
  "General Trade",
  "Modern Trade",
];

const filteredPillars = pillars.filter((p) =>
  INCLUDED_PILLARS.includes(p.name),
);

export function WhatWeDoSpread() {
  return (
    <div
      id="what"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,160px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 04—05 · STORY 02</span>
      </div>

      <div className="grid grid-cols-12 gap-10 lg:gap-16">
        <div className="col-span-12 lg:col-span-7">
          <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold">
            <span aria-hidden className="inline-block h-px w-8 bg-gold/70" />
            STORY 02 · WHAT WE DO
          </p>
          <h2 className="v2-italic v2-size-feature max-w-[18ch] text-balance">
            Three ways we move brands to market.
          </h2>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:pt-2">
          <p className="v2-size-body max-w-[42ch] opacity-80">
            Distribution is one job and three jobs. A pallet leaves a Long An
            dock, becomes a route, becomes a shelf. We do all three under one
            roof, which is why the brands we carry travel without losing
            anything along the way.
          </p>
        </div>
      </div>

      <figure className="mt-[clamp(48px,6vw,80px)] grid grid-cols-12 items-baseline gap-x-8 gap-y-4 border-y border-current/20 py-8">
        <span
          aria-hidden
          className="v2-italic col-span-12 text-[clamp(4rem,7vw,7rem)] leading-none text-gold lg:col-span-2"
        >
          &ldquo;
        </span>
        <blockquote className="v2-italic col-span-12 text-[clamp(1.8rem,2.8vw,2.4rem)] leading-[1.12] tracking-[-0.018em] text-balance lg:col-span-8">
          A pallet, a route, a shelf. Three jobs done by the same hands so
          nothing the brand built up gets lost between the dock and the door.
        </blockquote>
        <p className="v2-mono v2-size-folio col-span-12 self-end opacity-65 lg:col-span-2 lg:text-right">
          <span aria-hidden className="v2-rule-gold mr-3 inline-block w-6 align-middle" />
          OUR OPERATING RULE
        </p>
      </figure>

      <div className="mt-[clamp(56px,7vw,96px)] grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-3">
        {filteredPillars.map((p, i) => (
          <article
            key={p.name}
            className="flex flex-col gap-5 border-t border-current/15 pt-8"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="v2-italic text-[clamp(3rem,5vw,4.5rem)] leading-none text-gold">
                {DISPLAY_NUMBERS[i]}
              </span>
              <span className="v2-mono v2-size-folio opacity-50">
                {String(i + 1).padStart(2, "0")} / 03
              </span>
            </div>

            <h3 className="v2-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.05] tracking-[-0.02em]">
              {p.name}
            </h3>

            <p className="v2-size-body max-w-[44ch] opacity-80">{p.longBody}</p>

            <p className="v2-mono v2-size-folio mt-auto flex items-center gap-3 pt-5 opacity-75">
              <span aria-hidden className="v2-rule-gold inline-block w-6" />
              {SIGNATURE_STATS[p.name]}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
