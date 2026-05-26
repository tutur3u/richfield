type TocEntry = {
  /** Display number ("01", "02", ...) */
  no: string;
  /** Anchor target on the same page */
  href: string;
  /** Section title */
  label: string;
};

const DEFAULT_TOC: TocEntry[] = [
  { no: "01", href: "#lead",   label: "The lead" },
  { no: "02", href: "#what",   label: "What we do" },
  { no: "03", href: "#atlas",  label: "Field atlas" },
  { no: "04", href: "#brands", label: "The directory" },
  { no: "05", href: "#jv",     label: "Dory Rich" },
  { no: "06", href: "#numbers",label: "By the numbers" },
];

type Props = {
  entries?: TocEntry[];
  className?: string;
};

export function VerticalTOC({ entries = DEFAULT_TOC, className = "" }: Props) {
  return (
    <nav
      aria-label="Issue contents"
      className={`v2-mono v2-size-folio flex w-full flex-col gap-3 ${className}`}
    >
      <span className="opacity-50">CONTENTS</span>
      <span aria-hidden className="v2-rule" />
      <ol className="flex flex-col gap-2">
        {entries.map((e) => (
          <li key={e.no} className="flex items-baseline gap-3">
            <span className="opacity-50">{e.no}</span>
            <a
              href={e.href}
              className="transition-opacity duration-200 hover:opacity-60 focus-visible:opacity-60"
            >
              {e.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
