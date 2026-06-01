type TocEntry = {
  no: string;
  href: string;
  label: string;
  id: string;
};

const DEFAULT_TOC: TocEntry[] = [
  { no: "01", id: "lead",     href: "#lead",     label: "About Us" },
  { no: "02", id: "what",     href: "#what",     label: "What We Do" },
  { no: "03", id: "atlas",    href: "#atlas",    label: "Footprint" },
  { no: "04", id: "brands",   href: "#brands",   label: "Portfolio" },
  { no: "05", id: "jv",       href: "#jv",       label: "Joint Venture" },
  { no: "06", id: "colophon", href: "#colophon", label: "Colophon" },
];

type Props = {
  entries?: TocEntry[];
  className?: string;
  /** ID of the currently in-view section; matches a TocEntry.id. */
  activeId?: string;
};

export function VerticalTOC({
  entries = DEFAULT_TOC,
  className = "",
  activeId,
}: Props) {
  return (
    <nav
      aria-label="Issue contents"
      className={`v2-mono v2-size-folio flex w-full flex-col gap-3 ${className}`}
    >
      <span className="opacity-50">CONTENTS</span>
      <span aria-hidden className="v2-rule" />
      <ol className="flex flex-col gap-2">
        {entries.map((e) => {
          const isActive = activeId === e.id;
          return (
            <li key={e.no} className="flex items-baseline gap-3">
              <span className="opacity-50">{e.no}</span>
              <a
                href={e.href}
                aria-current={isActive ? "location" : undefined}
                className={`transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
              >
                <span className={isActive ? "border-b-2 border-gold-strong pb-1" : ""}>
                  {e.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
