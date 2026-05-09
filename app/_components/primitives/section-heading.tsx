import { Eyebrow } from "./eyebrow";
import { DisplayHeading } from "./display-heading";

type Tone = "on-cream" | "on-ink" | "on-green";

const headingTone: Record<Tone, "ink" | "white"> = {
  "on-cream": "ink",
  "on-ink": "white",
  "on-green": "white",
};

export function SectionHeading({
  eyebrow,
  heading,
  level = 2,
  lede,
  tone = "on-cream",
  align = "left",
}: {
  eyebrow?: string;
  heading: string;
  level?: 1 | 2 | 3;
  lede?: string;
  tone?: Tone;
  align?: "left" | "center";
}) {
  const ledeColor =
    tone === "on-cream" ? "text-muted" : "text-paper/70";
  return (
    <div
      className={`flex flex-col gap-6 ${align === "center" ? "items-center text-center" : ""}`}
    >
      {eyebrow ? <Eyebrow tone="gold">{eyebrow}</Eyebrow> : null}
      <DisplayHeading level={level} tone={headingTone[tone]}>
        {heading}
      </DisplayHeading>
      {lede ? (
        <p className={`max-w-[60ch] text-[17px] leading-[1.55] ${ledeColor}`}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}
