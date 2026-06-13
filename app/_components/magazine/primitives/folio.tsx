import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Folio — the running page marker that runs in a corner of every chapter:
//   01 ── THE GROUP
// Carries the "issue" identity across the home page without a contents page.
// Same hairline-rule idiom as Eyebrow (spread.tsx), but quieter and numbered.
// ---------------------------------------------------------------------------

type FolioProps = {
  /** Chapter number, e.g. "01". */
  number: string;
  /** Chapter label, e.g. "THE GROUP". Omit for a bare number. */
  label?: ReactNode;
  /** Pull the marker to the right edge of its container. */
  align?: "left" | "right";
  className?: string;
};

export function Folio({
  number,
  label,
  align = "left",
  className = "",
}: FolioProps) {
  return (
    <p
      className={`v2-mono v2-size-folio flex items-center gap-3 opacity-55 ${
        align === "right" ? "justify-end" : ""
      } ${className}`}
    >
      <span>{number}</span>
      {label ? (
        <>
          <span
            aria-hidden
            className="inline-block h-px w-8 bg-current opacity-40"
          />
          <span>{label}</span>
        </>
      ) : null}
    </p>
  );
}
