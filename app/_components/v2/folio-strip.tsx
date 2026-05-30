import { site } from "@/content/en/site";

type Props = {
  /** Issue stamp text, e.g. "ISSUE 30 · 1994 — 2026" */
  issue?: string;
  className?: string;
};

export function FolioStrip({
  issue = `ISSUE 30  ·  ${site.founded} — 2026`,
  className = "",
}: Props) {
  return (
    <div
      className={`v2-mono v2-size-folio flex w-full items-center justify-between gap-6 [text-shadow:0_1px_2px_rgb(0_0_0_/_0.35)] ${className}`}
    >
      <span className="whitespace-nowrap">{site.legalName.toUpperCase()}</span>
      <span aria-hidden className="v2-rule-gold hidden flex-1 md:block [text-shadow:none]" />
      <span className="whitespace-nowrap text-right">{issue}</span>
    </div>
  );
}
