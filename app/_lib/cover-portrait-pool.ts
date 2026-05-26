/**
 * v2 CoverSpread — deterministic 4-photo sequence.
 *
 * Same order for every visitor on every visit. The cover auto-cycles
 * through these four moments so a returning user always lands on a
 * familiar face of the site, then sees the rotation play out as they
 * watch.
 *
 * Order (per client direction): beach (the "sunset-mood" shot) →
 * people → beach (RICHFIELD spelled out) → people. Four spreads, then
 * the cycle loops.
 *
 * Swap any entry to change the cover lineup; downstream carousel
 * code doesn't care about the array length.
 */

export type CoverPortrait = {
  src: string;
  alt: string;
  /** Magazine folio caption — telegraphic, dated, editorial voice. */
  caption: string;
  /** Optional CSS object-position override for cover cropping. */
  objectPosition?: string;
};

export const coverSequence: CoverPortrait[] = [
  {
    // 1 — beach, conga line, overcast/dusk light (the "sunset-mood" pick).
    src: "/photos/people/selected-2026-05-07.webp",
    alt: "The Richfield team in a conga line on the beach at dusk",
    caption: "ANNUAL OFF-SITE · BY THE SEA · 2026",
    objectPosition: "center 45%",
  },
  {
    // 2 — people, heart formation in green áo dài (the strongest people moment).
    src: "/photos/people/group-company-1920.webp",
    alt: "The Richfield Worldwide team arranged in a heart formation",
    caption: "THE WHOLE COMPANY · ANNUAL PORTRAIT",
    objectPosition: "center 40%",
  },
  {
    // 3 — beach, aerial RICHFIELD letters spelled in red shirts on sand.
    src: "/photos/people/selected-2026-05-03.webp",
    alt: "Aerial drone view of the Richfield team spelling out RICHFIELD on the beach",
    caption: "ONE TEAM · ONE NAME · 2026",
    objectPosition: "center 50%",
  },
  {
    // 4 — people, gala dinner anniversary stage with full team.
    src: "/photos/people/selected-2026-05-04.webp",
    alt: "The Richfield team on stage at the 30-year anniversary Gala Dinner",
    caption: "30 YEARS · GALA DINNER · MAY 2026",
    objectPosition: "center 38%",
  },
];
