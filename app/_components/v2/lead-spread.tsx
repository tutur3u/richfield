"use client";

import Image from "next/image";

/**
 * LeadSpread — Issue 30, Story 01.
 *
 * Composed as a real magazine feature opener: folio frame at the top, the
 * italic Newsreader standfirst spanning the full measure, then a two-
 * column body with a wide hero photo on the left and the editorial body
 * + by-the-numbers strip on the right.
 *
 * Numbers + framing pulled directly from /client-doc/web-redesign/content
 * — 600,000 retail outlets, 200+ sub-distributors, 1,000+ field salesmen,
 * 30+ years. Tagline copy ("From market entry to nationwide distribution")
 * is the client's tentative master tagline.
 *
 * Photo: only high-res people images from /public/photos/people/ are used
 * here. The warehouse and distribution folders are PowerPoint slide
 * collages — visually unusable for editorial.
 *
 * Rendered inside MagazineMorph, so it page-turns from cream → ink into
 * the FIELD NOTE spread that follows.
 */

type Stat = readonly [figure: string, label: string];

const STATS: readonly Stat[] = [
  ["600,000", "RETAIL OUTLETS"],
  ["200+", "SUB-DISTRIBUTORS"],
  ["1,000+", "FIELD SALESMEN"],
  ["30+", "YEARS · SINCE 1994"],
];

export function LeadSpread() {
  return (
    <div className="v2-display w-full">
      {/* Folio frame — magazine page header with section + page range. */}
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 02—03 · STORY 01</span>
      </div>

      {/* Eyebrow + full-width italic standfirst — the typographic statement. */}
      <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold opacity-90">
        <span aria-hidden className="inline-block h-px w-8 bg-gold/80" />
        STORY 01 — ABOUT THE GROUP
      </p>
      <h2 className="v2-italic mb-10 max-w-[22ch] text-balance text-[clamp(2.4rem,5.2vw,4.8rem)] leading-[1.02] tracking-[-0.025em]">
        From market entry to nationwide distribution.
      </h2>

      {/* Body grid — wide hero photo on the left, editorial text + stats
          on the right. The photo's natural aspect is 16:9; lg:h-[44svh]
          on lg+ gives a wide-cinematic frame that barely crops. */}
      <div className="grid grid-cols-12 gap-8 sm:gap-10 lg:gap-14">
        <figure className="col-span-12 lg:col-span-7">
          <div
            className="relative w-full overflow-hidden
                       aspect-video
                       lg:aspect-auto lg:h-[44svh]"
          >
            <Image
              src="/photos/people/candid-1-1280.webp"
              alt="Richfield Worldwide annual Town Hall — the whole company gathered on stage."
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover v2-photo-duotone"
              style={{ objectPosition: "center 38%" }}
            />
          </div>
          <figcaption className="v2-mono v2-size-folio mt-4 flex items-center gap-3 opacity-60">
            <span aria-hidden className="v2-rule-gold inline-block w-8" />
            FIG. 01 · ANNUAL TOWN HALL · THE WHOLE COMPANY · 2026
          </figcaption>
        </figure>

        <div className="col-span-12 lg:col-span-5 lg:pt-1">
          {/* Body — drop cap on the first paragraph, smaller follow-up. */}
          <p className="v2-size-body max-w-[58ch] opacity-85">
            <span
              aria-hidden
              className="v2-display float-left mr-3 mt-1 text-[5rem] font-light leading-[0.82] tracking-[-0.04em]"
            >
              R
            </span>
            ichfield Worldwide JSC is one of the largest FMCG distributors in Vietnam — a single
            network reaching every province and city in the country, carrying brands people love,
            doing the same thing well for thirty years.
          </p>
          <p className="v2-size-body mt-5 max-w-[58ch] opacity-70">
            Rooted in a Malaysian family business now in its third generation, Richfield has grown
            alongside Mars, Red Bull, BiC, Glico, AMOS, and Newchoice — partners who chose us
            because the brands they make needed distribution that behaved like the brand itself.
          </p>

          {/* Four-figure stat strip — the magazine "by the numbers" device. */}
          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
            {STATS.map(([figure, label]) => (
              <div key={label} className="border-t border-current/15 pt-3">
                <dt className="v2-display text-[clamp(1.45rem,2.2vw,2rem)] leading-none tracking-[-0.022em]">
                  {figure}
                </dt>
                <dd className="v2-mono v2-size-folio mt-2 opacity-60">{label}</dd>
              </div>
            ))}
          </dl>

          <p className="v2-mono v2-size-folio mt-9 opacity-55">
            <span aria-hidden className="v2-rule-gold mr-3 inline-block w-6 align-middle" />
            BY THE EDITORS · ISSUE 30 · MAY 2026
          </p>
        </div>
      </div>
    </div>
  );
}
