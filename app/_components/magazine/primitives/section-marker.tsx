import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// SectionMarker — the circled chapter number/letter beside a tracked label
// that opens a magazine section (the reference's circled "A", "1"). Pairs with
// a headline block to give a chapter a clear "this is section N" opener.
// ---------------------------------------------------------------------------

type SectionMarkerProps = {
  /** The mark inside the circle, e.g. "03". */
  n: string;
  /** Optional tracked label after the circle. */
  label?: ReactNode;
  className?: string;
};

export function SectionMarker({ n, label, className = "" }: SectionMarkerProps) {
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current/30 text-[12px] font-medium tabular-nums">
        {n}
      </span>
      {label ? (
        <span className="v2-mono v2-size-eyebrow opacity-80">{label}</span>
      ) : null}
    </p>
  );
}
