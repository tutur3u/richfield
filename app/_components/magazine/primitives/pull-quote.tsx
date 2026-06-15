import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// PullQuote — an oversized serif quote that breaks the body measure, opened by
// a decorative gold quote mark. Used to lift one of the company's own lines
// (its promise, a venture statement) into display scale. The quote glyph is
// aria-hidden so screen readers hear the sentence once.
// ---------------------------------------------------------------------------

type PullQuoteProps = {
  children: ReactNode;
  /** Optional attribution line below the quote. */
  cite?: ReactNode;
  tone?: "ink" | "gold";
  className?: string;
};

export function PullQuote({
  children,
  cite,
  tone = "ink",
  className = "",
}: PullQuoteProps) {
  return (
    <figure className={`relative ${className}`}>
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -left-1 -top-[0.45em] select-none text-[clamp(3rem,5vw,5.5rem)] leading-none text-gold/40"
      >
        &ldquo;
      </span>
      <blockquote
        className={`font-display relative text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.08] tracking-[-0.02em] ${
          tone === "gold" ? "text-gold-strong" : ""
        }`}
      >
        {children}
      </blockquote>
      {cite ? (
        <figcaption className="v2-mono v2-size-folio mt-[var(--v2-rhythm)] not-italic opacity-55">
          {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}
