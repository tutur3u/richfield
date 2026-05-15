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
  size = "tall",
}: {
  eyebrow: string;
  heading: string;
  lede?: string;
  tone?: Tone;
  /** "tall" fills the viewport on desktop (editorial entrance), "compact"
   * keeps the heading short so neighboring content fits in the first view
   * (used by /contact). */
  size?: "tall" | "compact";
}) {
  const heightCls =
    size === "tall"
      ? "min-h-[88svh] pt-[clamp(120px,16vw,180px)] pb-[clamp(64px,8vw,120px)]"
      : "pt-[clamp(120px,14vw,160px)] pb-[clamp(48px,6vw,80px)]";

  return (
    <header
      className={`${bgClass[tone]} ${heightCls} relative flex flex-col justify-center px-6 sm:px-10`}
    >
      <div className="mx-auto w-full max-w-[1500px]">
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
