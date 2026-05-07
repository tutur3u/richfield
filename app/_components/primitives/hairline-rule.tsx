type Tone = "line" | "white-15" | "gold";

const toneClass: Record<Tone, string> = {
  line: "bg-line",
  "white-15": "bg-paper/15",
  gold: "bg-gold",
};

export function HairlineRule({
  tone = "line",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`h-px w-full origin-left ${toneClass[tone]} ${className}`}
    />
  );
}
