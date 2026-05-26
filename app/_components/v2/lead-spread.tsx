import Image from "next/image";

type Stat = readonly [figure: string, label: string];

const STATS: readonly Stat[] = [
  ["180,000", "RETAIL OUTLETS"],
  ["300+", "SUB-DISTRIBUTORS"],
  ["800+", "FIELD SALESMEN"],
  ["30+", "YEARS · SINCE 1994"],
];

export function LeadSpread() {
  return (
    <div id="lead" className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(64px,9vw,120px)] sm:px-10 lg:px-12">
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 02—03 · STORY 01</span>
      </div>

      <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold-strong">
        <span aria-hidden className="inline-block h-px w-8 bg-gold-rule" />
        STORY 01 · ABOUT THE GROUP
      </p>
      <h2 className="v2-italic v2-size-feature mb-12 max-w-[22ch] text-balance">
        From market entry to nationwide distribution.
      </h2>

      <div className="grid grid-cols-12 gap-8 sm:gap-10 lg:gap-14">
        <figure className="col-span-12 lg:col-span-7">
          <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:h-[52svh]">
            <Image
              src="/photos/people/candid-1-1280.webp"
              alt="Richfield Worldwide annual Town Hall. The whole company gathered on stage."
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover v2-photo-duotone"
              style={{ objectPosition: "center 38%" }}
            />
          </div>
          <figcaption className="v2-mono v2-size-folio mt-4 flex items-center gap-3 opacity-60">
            <span aria-hidden className="v2-rule-gold inline-block w-8" />
            FIG. 01 · ANNUAL TOWN HALL · 2026
          </figcaption>
        </figure>

        <div className="col-span-12 lg:col-span-5 lg:pt-1">
          <p className="v2-size-body max-w-[58ch] opacity-85">
            <span
              aria-hidden
              className="v2-display float-left mr-3 mt-1 text-[5rem] font-light leading-[0.82] tracking-[-0.04em]"
            >
              R
            </span>
            ichfield Worldwide JSC is one of Vietnam&apos;s largest FMCG distributors. One network reaching every province and city, carrying brands people love, doing the same thing well for thirty years.
          </p>
          <p className="v2-size-body mt-5 max-w-[58ch] opacity-70">
            Rooted in a Malaysian family business now in its third generation, Richfield has grown alongside Mars, Red Bull, BiC, Glico, AMOS, and Newchoice. Partners who chose us because the brands they make needed distribution that behaved like the brand itself.
          </p>

          <div className="mt-10 rounded-sm border border-current/15 bg-current/[0.02] p-5">
            <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold-strong">
              <span aria-hidden className="inline-block h-px w-6 bg-gold-rule" />
              BY THE NUMBERS · VIETNAM
            </p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
              {STATS.map(([figure, label]) => (
                <div key={label} className="border-t border-current/15 pt-3">
                  <dt className="v2-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none tracking-[-0.022em]">
                    {figure}
                  </dt>
                  <dd className="v2-mono v2-size-folio mt-2 opacity-60">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="v2-mono v2-size-folio mt-9 opacity-55">
            <span aria-hidden className="v2-rule-gold mr-3 inline-block w-6 align-middle" />
            BY THE EDITORS · ISSUE 30 · MAY 2026
          </p>
        </div>
      </div>
    </div>
  );
}
