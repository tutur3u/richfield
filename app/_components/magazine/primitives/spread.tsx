import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Spread — the one wrapper every magazine chapter routes through. It owns the
// uniform vertical band (half of --v2-section on top + half on bottom, so the
// gap between two stacked chapters sums to one band) and the standard editorial
// frame (centred max-w, responsive side padding). Horizontal composition is the
// caller's job (asymmetric grids, offsets, bleeds) — vertical rhythm is not, so
// it stays identical across the whole site.
//
//   <Spread id="story" bg="cream">…grid / blocks…</Spread>
//
// `bleed` drops the frame for full-width photo bands (the caller draws its own
// inner padding). `flush` removes the TOP band so a chapter butts against the
// previous one — used to fuse the spreads of a single movement.
// ---------------------------------------------------------------------------

type Surface = "cream" | "white" | "paper" | "ink" | "transparent";

const SURFACE: Record<Surface, string> = {
  cream: "bg-cream text-ink",
  white: "bg-white text-ink",
  paper: "bg-paper text-ink",
  ink: "bg-ink text-cream",
  // No fill: the spread inherits whatever is behind it (the page gradient), so
  // it morphs across spreads instead of stamping a flat plate.
  transparent: "text-ink",
};

type SpreadProps = {
  children: ReactNode;
  id?: string;
  bg?: Surface;
  /** Full-width: no max-w / side padding / band. Caller frames its own content. */
  bleed?: boolean;
  /** Drop the top band so this chapter sits flush under the previous one. */
  flush?: boolean;
  /** First section on a page with no cover above it — adds the fixed-header
      height to the top band so the opening content clears the running-head. */
  head?: boolean;
  /** Extra classes on the inner frame (e.g. an asymmetric max-w or alignment). */
  className?: string;
  /** Extra classes on the full-bleed <section> itself (e.g. a surface gradient
      that fades into the page so the spread morphs instead of stamping a plate). */
  surfaceClass?: string;
};

export function Spread({
  children,
  id,
  bg = "cream",
  bleed = false,
  flush = false,
  head = false,
  className = "",
  surfaceClass = "",
}: SpreadProps) {
  const topPad = flush
    ? "pt-0"
    : head
      ? "pt-[calc(var(--v2-runhead)+var(--v2-section)/2)]"
      : "pt-[calc(var(--v2-section)/2)]";
  if (bleed) {
    return (
      <section id={id} className={`v2-display relative w-full ${SURFACE[bg]} ${surfaceClass}`}>
        {children}
      </section>
    );
  }
  return (
    <section id={id} className={`v2-display relative w-full ${SURFACE[bg]} ${surfaceClass}`}>
      <div
        className={`mx-auto w-full max-w-[1500px] px-6 pb-[calc(var(--v2-section))] sm:px-10 lg:px-12 ${topPad} ${className}`}
      >
        {children}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Eyebrow — the recurring kicker: a short gold rule + a tracked, upper-case
// label in the sans. One component so the treatment is identical everywhere and
// easy to demote (omit the rule) for quieter chapters.
// ---------------------------------------------------------------------------

type EyebrowProps = {
  children: ReactNode;
  /** Colour of the label + rule. */
  tone?: "gold" | "gold-strong" | "cream";
  /** Hide the leading rule for a quieter opener. */
  rule?: boolean;
  className?: string;
};

const TONE: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  gold: "text-gold",
  "gold-strong": "text-gold-strong",
  cream: "text-cream/70",
};

export function Eyebrow({
  children,
  tone = "gold-strong",
  rule = true,
  className = "",
}: EyebrowProps) {
  return (
    <p
      className={`v2-mono v2-size-eyebrow flex items-center gap-3 ${TONE[tone]} ${className}`}
    >
      {/* {rule ? (
        <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
      ) : null} */}
      {children}
    </p>
  );
}
