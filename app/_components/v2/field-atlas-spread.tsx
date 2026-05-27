"use client";

import Image from "next/image";

type Country = {
  code: string;
  label: string;
  headcount: string;
  note: string;
  anchor: { left: string; top: string };
  align: "left" | "right";
  halo: string;
};

// Operating territories per the customer's official footprint map.
// Coordinates are tuned to a 1600x1100 SE-Asia viewBox where:
//   Myanmar  — top-left landmass
//   Vietnam  — long S-curve along the east coast (HQ, largest team)
//   Cambodia — south-central, between Thailand and Vietnam
const COUNTRIES: Country[] = [
  {
    code: "MM",
    label: "Myanmar",
    headcount: "75",
    note: "Distribution territory",
    anchor: { left: "22%", top: "22%" },
    align: "left",
    halo: "M 80,80 L 460,90 L 500,260 L 460,440 L 380,560 L 320,680 L 280,760 L 220,720 L 200,580 L 160,420 L 100,260 Z",
  },
  {
    code: "VN",
    label: "Vietnam",
    headcount: "1,820",
    note: "HQ and growing",
    anchor: { left: "72%", top: "35%" },
    align: "right",
    halo: "M 1000,180 C 1080,220 1120,320 1100,440 C 1080,540 1040,640 980,740 C 940,820 900,880 860,920 C 820,940 800,920 820,860 C 840,780 880,700 920,600 C 960,500 980,400 980,300 C 980,240 980,200 1000,180 Z",
  },
  {
    code: "KH",
    label: "Cambodia",
    headcount: "151",
    note: "Distribution territory",
    anchor: { left: "50%", top: "72%" },
    align: "right",
    halo: "M 580,720 C 660,700 760,720 820,780 C 860,840 840,900 760,920 C 680,940 600,920 540,860 C 500,820 520,760 580,720 Z",
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
            International scale meets hands-on knowledge of every market we
            serve.
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
                    <span className="v2-mono v2-size-folio opacity-60">
                      team
                    </span>
                  </span>
                </div>
                <p className="v2-mono v2-size-folio mt-2 opacity-60">
                  {c.note}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-current/15 pt-6">
            <div>
              <dt className="v2-mono v2-size-folio opacity-55">FOUNDED</dt>
              <dd className="v2-display mt-1 text-[clamp(1.4rem,2vw,1.8rem)] leading-none">
                1994
              </dd>
            </div>
            <div>
              <dt className="v2-mono v2-size-folio opacity-55">GENERATIONS</dt>
              <dd className="v2-display mt-1 text-[clamp(1.4rem,2vw,1.8rem)] leading-none">
                Three
              </dd>
            </div>
            <div>
              <dt className="v2-mono v2-size-folio opacity-55">OPERATING UMBRELLA</dt>
              <dd className="v2-size-body mt-1 opacity-80">
                Richfield Worldwide JSC
              </dd>
            </div>
            <div>
              <dt className="v2-mono v2-size-folio opacity-55">PRIMARY HQ</dt>
              <dd className="v2-size-body mt-1 opacity-80">
                Ho Chi Minh City, Vietnam
              </dd>
            </div>
          </dl>

          <figure className="mt-10 flex flex-col gap-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src="/photos/people/workshop-room-1280.webp"
                alt="A Richfield team workspace — the rooms behind the network."
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover v2-photo-duotone"
              />
            </div>
            <figcaption className="v2-mono v2-size-folio flex items-center gap-3 opacity-65">
              <span aria-hidden className="v2-rule-gold inline-block w-6" />
              FIG. 03·01 · LOCAL ROOTS · BEHIND THE NETWORK
            </figcaption>
          </figure>
        </div>

        <figure
          aria-label="Diagram of Richfield's three operating territories: Myanmar, Vietnam, Cambodia"
          className="col-span-12 lg:col-span-7"
        >
          <div className="relative aspect-[16/11] w-full overflow-hidden border border-current/10">
            <svg
              aria-hidden
              viewBox="0 0 1600 1100"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <pattern
                  id="v2-atlas-grid"
                  x="0"
                  y="0"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 80 0 L 0 0 0 80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-current opacity-10"
                  />
                </pattern>
              </defs>

              <rect width="1600" height="1100" fill="url(#v2-atlas-grid)" />

              {/* Latitude curves — diagrammatic atlas feel */}
              {[180, 360, 540, 720, 900].map((y) => (
                <path
                  key={y}
                  d={`M 0 ${y} Q 800 ${y - 24} 1600 ${y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-current opacity-15"
                />
              ))}

              {/* Country territory halos */}
              {COUNTRIES.map((c) => (
                <path
                  key={`halo-${c.code}`}
                  d={c.halo}
                  fill="currentColor"
                  className="text-gold-strong opacity-[0.08]"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}

              {/* Connector arcs MM → VN → KH */}
              <path
                d="M 350 380 Q 700 280 1140 460"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 8"
                className="text-gold-strong"
              />
              <path
                d="M 1140 460 Q 920 700 800 800"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 8"
                className="text-gold-strong"
              />

              {/* Compass tick lower-left */}
              <g className="text-current opacity-50" stroke="currentColor" strokeWidth="1">
                <line x1="80" y1="1000" x2="80" y2="960" />
                <line x1="68" y1="990" x2="92" y2="990" />
              </g>
              <text
                x="80"
                y="1040"
                textAnchor="middle"
                className="fill-current opacity-50"
                style={{ fontSize: 22, letterSpacing: "0.32em" }}
              >
                N
              </text>
            </svg>

            {COUNTRIES.map((c) => (
              <FieldAtlasPin key={c.code} country={c} />
            ))}
          </div>
          <figcaption className="v2-mono v2-size-folio mt-4 flex items-center gap-3 opacity-65">
            <span aria-hidden className="v2-rule-gold inline-block w-6" />
            FIG. 03·02 · ASIA · THREE COUNTRIES · ONE GROUP
          </figcaption>
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
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gold/50 motion-safe:animate-ping"
        />
        <span
          aria-hidden
          className="relative inline-flex h-full w-full rounded-full bg-gold ring-2 ring-current/10"
        />
      </span>
      <div
        className={`flex flex-col gap-1 ${isRight ? "items-start" : "items-end"}`}
      >
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
