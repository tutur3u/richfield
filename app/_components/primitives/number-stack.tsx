type Line = {
  numeral: string;
  label: string;
};

type Tone = "on-cream" | "on-green";

const labelTone: Record<Tone, string> = {
  "on-cream": "text-ink",
  "on-green": "text-paper",
};

export function NumberStack({
  lines,
  tone = "on-green",
  id,
  as: Tag = "h1",
}: {
  lines: Line[];
  tone?: Tone;
  id?: string;
  /** Render tag. Defaults to h1 so the stack acts as the page heading. */
  as?: "h1" | "h2" | "div";
}) {
  return (
    <Tag
      id={id}
      className="font-display font-normal flex flex-col gap-1 leading-[1] tracking-[-0.025em]"
    >
      {lines.map((l, idx) => (
        <span key={idx} className="flex items-baseline gap-3">
          <span className="text-gold text-[clamp(64px,7.5vw,108px)] leading-[0.9]">
            {l.numeral}
          </span>
          <span
            className={`text-[clamp(40px,5vw,72px)] leading-[1] ${labelTone[tone]}`}
          >
            {l.label}
          </span>
        </span>
      ))}
    </Tag>
  );
}
