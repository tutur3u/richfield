type Tone = "gold" | "muted" | "ink-on-green" | "ink";

const toneClass: Record<Tone, string> = {
  gold: "text-gold",
  muted: "text-muted",
  "ink-on-green": "text-gold",
  ink: "text-ink",
};

export function Eyebrow({
  children,
  tone = "gold",
  as: Tag = "span",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  as?: "span" | "p" | "div";
  className?: string;
}) {
  return (
    <Tag
      className={`inline-block text-[11px] font-medium uppercase tracking-[0.32em] ${toneClass[tone]} ${className}`}
    >
      {children}
    </Tag>
  );
}
