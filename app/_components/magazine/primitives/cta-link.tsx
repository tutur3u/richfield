import Link from "next/link";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// CtaLink — the one call-to-action treatment: a rectangular gold-outlined box
// that fills with gold on hover/focus (text flips to cream), with an arrow that
// nudges right. Use for every standalone CTA so they read consistently. The
// shared CTA_BOX class is exported for the rare non-link CTA (e.g. a form
// submit button) that can't be a <Link>/<a>.
// ---------------------------------------------------------------------------

export const CTA_BOX =
  "group inline-flex w-fit items-center gap-2 border border-gold-strong/45 px-[clamp(18px,1.8vw,28px)] py-[clamp(10px,1vw,14px)] v2-mono v2-size-folio text-gold-strong transition-[color,background-color,scale] duration-300 ease-out hover:bg-gold-strong hover:text-cream focus-visible:bg-gold-strong focus-visible:text-cream motion-safe:active:scale-[0.96]";

type Props = {
  href: string;
  children: ReactNode;
  /** Render as an external <a> (new tab) instead of a Next <Link>. */
  external?: boolean;
  /** Arrow glyph — "→" for internal, "↗" for external by default. */
  arrow?: string;
  className?: string;
};

export function CtaLink({
  href,
  children,
  external = false,
  arrow,
  className = "",
}: Props) {
  const glyph = arrow ?? (external ? "↗" : "→");
  const inner = (
    <>
      {children}
      <span
        aria-hidden
        className="transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1"
      >
        {glyph}
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${CTA_BOX} ${className}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`${CTA_BOX} ${className}`}>
      {inner}
    </Link>
  );
}
