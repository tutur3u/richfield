import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// GraphicNumeral — an oversized Fraunces figure or letter used as composition,
// not as a label: the dominant graphic element that anchors a spread (the
// magazine "139 / 62" giant figure, or a letterform behind a portrait). It is
// always decorative (aria-hidden) and should sit on a real number — a chapter
// index, a footprint figure — never invented filler. Callers position it
// absolutely behind a `relative z-10` content block, or hang it in a margin.
// Scales with the viewport via clamp, so it reflows on a phone like a website,
// not a fixed print plate.
// ---------------------------------------------------------------------------

type Tone = "gold" | "ghost" | "solid";

const TONE: Record<Tone, string> = {
  // Watermark behind content — inherits the surface's text colour.
  ghost: "text-current opacity-[0.06]",
  // The gold-gradient numeral treatment shared with the stat figures.
  gold: "bg-[linear-gradient(165deg,var(--color-sunrise)_0%,var(--color-gold-strong)_92%)] bg-clip-text text-transparent",
  solid: "text-gold-strong",
};

type GraphicNumeralProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export function GraphicNumeral({
  children,
  tone = "ghost",
  className = "",
}: GraphicNumeralProps) {
  return (
    <span
      aria-hidden
      className={`font-display block select-none italic leading-[0.8] tracking-[-0.03em] text-[clamp(7rem,22vw,18rem)] ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
