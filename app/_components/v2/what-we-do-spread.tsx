import { pillars } from "@/content/en/capabilities";

const SIGNATURE_STATS: Record<string, string> = {
  "Warehouse & Logistics": "TWO DCS · LONG AN · HANOI",
  "General Trade": "180,000 OUTLETS · 800+ SALESMEN",
  "Modern Trade": "EVERY CHAIN IN VIETNAM",
};

const DISPLAY_NUMBERS = ["01", "02", "03"];

const INCLUDED_PILLARS = ["Warehouse & Logistics", "General Trade", "Modern Trade"];

const filteredPillars = pillars.filter((p) => INCLUDED_PILLARS.includes(p.name));

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

      <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold">
        <span aria-hidden className="inline-block h-px w-8 bg-gold/70" />
        STORY 02 · WHAT WE DO
      </p>
      <h2 className="v2-italic v2-size-feature mb-16 max-w-[22ch] text-balance">
        Three ways we move brands to market.
      </h2>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
        {filteredPillars.map((p, i) => (
          <article key={p.name} className="flex flex-col gap-5 border-t border-current/15 pt-6">
            <span className="v2-italic text-[clamp(2.2rem,3.4vw,3rem)] leading-none text-gold">
              {DISPLAY_NUMBERS[i]}
            </span>
            <h3 className="v2-display text-[clamp(1.4rem,2vw,1.9rem)] leading-tight tracking-[-0.02em]">
              {p.name}
            </h3>
            <p className="v2-size-body max-w-[42ch] opacity-80">{p.longBody}</p>
            <p className="v2-mono v2-size-folio mt-auto pt-4 opacity-70">
              <span aria-hidden className="v2-rule-gold mr-3 inline-block w-6 align-middle" />
              {SIGNATURE_STATS[p.name]}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
