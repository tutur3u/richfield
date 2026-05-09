import { SectionHeading } from "./section-heading";

type Tone = "cream" | "green";

const bgClass: Record<Tone, string> = {
  cream: "bg-cream",
  green: "bg-green",
};

export function PageHeader({
  eyebrow,
  heading,
  lede,
  tone = "cream",
}: {
  eyebrow: string;
  heading: string;
  lede?: string;
  tone?: Tone;
}) {
  return (
    <header
      className={`${bgClass[tone]} px-6 pt-[clamp(120px,16vw,200px)] pb-[clamp(72px,9vw,120px)] sm:px-10`}
    >
      <div className="mx-auto max-w-[1300px]">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          level={1}
          lede={lede}
          tone={tone === "cream" ? "on-cream" : "on-green"}
        />
      </div>
    </header>
  );
}
