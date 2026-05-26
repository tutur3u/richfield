"use client";

type Country = {
  code: string;
  label: string;
  headcount: string;
  note: string;
  anchor: { left: string; top: string };
  align: "left" | "right";
};

const COUNTRIES: Country[] = [
  {
    code: "CN",
    label: "China",
    headcount: "50",
    note: "Sourcing and Brands",
    anchor: { left: "62%", top: "16%" },
    align: "right",
  },
  {
    code: "VN",
    label: "Vietnam",
    headcount: "1,000+",
    note: "HQ and growing",
    anchor: { left: "55%", top: "50%" },
    align: "right",
  },
  {
    code: "MY",
    label: "Malaysia",
    headcount: "150",
    note: "Origin · 1990s",
    anchor: { left: "30%", top: "82%" },
    align: "left",
  },
];

export function FieldAtlasSpread() {
  return (
    <div
      id="atlas"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,160px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 06—07 · STORY 03</span>
      </div>

      <div className="grid grid-cols-12 gap-10 lg:gap-16">
        <div className="col-span-12 lg:col-span-5">
          <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold-strong">
            <span aria-hidden className="inline-block h-px w-8 bg-gold-rule" />
            STORY 03 · THE FOOTPRINT
          </p>
          <h2 className="v2-italic v2-size-feature mb-8 max-w-[20ch] text-balance">
            An international group with deep local roots.{" "}
            <em className="text-gold-strong">three</em> countries,{" "}
            <em className="text-gold-strong">three</em> generations.
          </h2>
          <p className="v2-size-body max-w-[48ch] opacity-80">
            International scale meets hands-on knowledge of every market we serve.
          </p>

          <ul
            aria-label="Offices and headcounts"
            className="mt-10 flex flex-col"
          >
            {COUNTRIES.map((c) => (
              <li key={c.code} className="border-t border-current/15 py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="v2-italic text-[clamp(1.6rem,2.2vw,2rem)] leading-none">
                    {c.label}
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="v2-display text-[clamp(1.4rem,1.9vw,1.8rem)] leading-none">
                      {c.headcount}
                    </span>
                    <span className="v2-mono v2-size-folio opacity-60">team</span>
                  </span>
                </div>
                <p className="v2-mono v2-size-folio mt-2 opacity-60">{c.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <figure
          aria-label="Diagram of Richfield's three operating countries: China, Vietnam, Malaysia"
          className="col-span-12 lg:col-span-7"
        >
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-sm border border-current/10">
            <svg
              aria-hidden
              viewBox="0 0 1600 1100"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <pattern
                  id="v2-atlas-dots"
                  x="0"
                  y="0"
                  width="28"
                  height="28"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.2" fill="currentColor" className="text-current opacity-20" />
                </pattern>
              </defs>
              <rect width="1600" height="1100" fill="url(#v2-atlas-dots)" />
              <path
                d="M 990 220 Q 720 350 870 540"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 8"
                className="text-gold-strong"
              />
              <path
                d="M 870 540 Q 600 740 480 900"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 8"
                className="text-gold-strong"
              />
            </svg>
            {COUNTRIES.map((c) => (
              <FieldAtlasPin key={c.code} country={c} />
            ))}
          </div>
        </figure>
      </div>
    </div>
  );
}

function FieldAtlasPin({ country }: { country: Country }) {
  const isRight = country.align === "right";
  return (
    <div
      style={{
        left: country.anchor.left,
        top: country.anchor.top,
        transform: "translate(-50%, -50%)",
      }}
      className="absolute flex items-center gap-3"
    >
      <span className="relative inline-flex h-3 w-3">
        <span aria-hidden className="absolute inset-0 rounded-full bg-gold/50 motion-safe:animate-ping" />
        <span aria-hidden className="relative inline-flex h-full w-full rounded-full bg-gold ring-2 ring-current/10" />
      </span>
      <div className={`flex flex-col gap-1 ${isRight ? "items-start" : "items-end"}`}>
        <span className="v2-italic text-[clamp(1.4rem,1.9vw,1.8rem)] leading-none">
          {country.label}
        </span>
        <span className="v2-mono v2-size-folio opacity-70">
          {country.headcount} TEAM
        </span>
      </div>
    </div>
  );
}
