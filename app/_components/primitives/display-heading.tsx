type Level = 1 | 2 | 3;

const sizeClass: Record<Level, string> = {
  1: "text-[clamp(56px,7vw,96px)] leading-[1] tracking-[-0.025em]",
  2: "text-[clamp(40px,5vw,72px)] leading-[1.05] tracking-[-0.02em]",
  3: "text-[clamp(28px,3vw,44px)] leading-[1.1] tracking-[-0.015em]",
};

function parseItalics(text: string): Array<{ text: string; italic: boolean }> {
  const out: Array<{ text: string; italic: boolean }> = [];
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf("*", i);
    if (open === -1) {
      out.push({ text: text.slice(i), italic: false });
      break;
    }
    if (open > i) out.push({ text: text.slice(i, open), italic: false });
    const close = text.indexOf("*", open + 1);
    if (close === -1) {
      out.push({ text: text.slice(open), italic: false });
      break;
    }
    out.push({ text: text.slice(open + 1, close), italic: true });
    i = close + 1;
  }
  return out;
}

type Props = {
  level: Level;
  children: string;
  tone?: "ink" | "white" | "gold";
  className?: string;
  italicTone?: "gold" | "ink" | "white";
};

const toneClass = { ink: "text-ink", white: "text-paper", gold: "text-gold" };

export function DisplayHeading({
  level,
  children,
  tone = "ink",
  italicTone = "gold",
  className = "",
}: Props) {
  const Tag = (`h${level}` as unknown) as keyof React.JSX.IntrinsicElements;
  const segments = parseItalics(children);
  return (
    <Tag
      className={`font-display font-normal ${sizeClass[level]} ${toneClass[tone]} ${className}`}
    >
      {segments.map((s, idx) =>
        s.italic ? (
          <em key={idx} className={`italic ${toneClass[italicTone]}`}>
            {s.text}
          </em>
        ) : (
          <span key={idx}>{s.text}</span>
        ),
      )}
    </Tag>
  );
}
