import { Eyebrow } from "./eyebrow";
import { SectionHeading } from "./section-heading";
import { TintedPhoto } from "./tinted-photo";
import { PhotoCarousel } from "./photo-carousel";

type Tone = "cream" | "green";
type Align = "start" | "split";

type PhotoArg = { src: string; alt: string };

const bgClass: Record<Tone, string> = {
  cream: "bg-cream",
  green: "bg-green",
};

export function PageHeader({
  eyebrow,
  heading,
  headingNode,
  lede,
  tone = "cream",
  size = "tall",
  photo,
  accent,
  align = "start",
}: {
  eyebrow: string;
  /** Plain-text heading processed by DisplayHeading (*italic* markers).
   * Ignored when headingNode is provided. */
  heading?: string;
  /** Custom heading node (e.g. NumberStack). Takes precedence over heading. */
  headingNode?: React.ReactNode;
  lede?: string;
  tone?: Tone;
  /** "tall" fills the viewport on desktop (editorial entrance), "compact"
   * keeps the heading short so neighboring content fits in the first view
   * (used by /contact). */
  size?: "tall" | "compact";
  /** Full-bleed photo behind the heading. Single = static. Array = auto
   * cross-fade carousel. Cream gradient overlay is applied automatically. */
  photo?: PhotoArg | PhotoArg[];
  /** Right-rail slot for a per-page bespoke flourish (collage, badge, etc.) */
  accent?: React.ReactNode;
  /** "start" = text-only left rail. "split" = text left, accent right on lg+. */
  align?: Align;
}) {
  const heightCls =
    size === "tall"
      ? "min-h-[100svh] pt-[clamp(120px,16vw,180px)] pb-[clamp(64px,8vw,120px)]"
      : "pt-[clamp(120px,14vw,160px)] pb-[clamp(48px,6vw,80px)]";

  const onGreen = tone === "green";
  const ledeColor = onGreen ? "text-paper/80" : "text-muted";
  const photos = Array.isArray(photo) ? photo : photo ? [photo] : null;

  return (
    <header
      className={`${bgClass[tone]} ${heightCls} relative isolate flex flex-col justify-center overflow-hidden px-6 sm:px-10`}
    >
      {photos ? (
        <>
          {photos.length > 1 ? (
            <PhotoCarousel
              photos={photos}
              fill
              priority
              sizes="100vw"
              className="absolute inset-0 -z-20"
            />
          ) : (
            <TintedPhoto
              src={photos[0].src}
              alt={photos[0].alt}
              tone="cream"
              fill
              priority
              sizes="100vw"
              className="absolute inset-0 -z-20"
            />
          )}
          <div aria-hidden className="photo-overlay-left absolute inset-0 -z-10" />
        </>
      ) : null}

      <div className="relative mx-auto w-full max-w-[1500px]">
        {align === "split" && accent ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
            <HeadingStack
              eyebrow={eyebrow}
              heading={heading}
              headingNode={headingNode}
              lede={lede}
              onGreen={onGreen}
              ledeColor={ledeColor}
            />
            <div className="flex w-full justify-end lg:pl-6">{accent}</div>
          </div>
        ) : (
          <>
            <HeadingStack
              eyebrow={eyebrow}
              heading={heading}
              headingNode={headingNode}
              lede={lede}
              onGreen={onGreen}
              ledeColor={ledeColor}
            />
            {accent ? <div className="mt-10">{accent}</div> : null}
          </>
        )}
      </div>
    </header>
  );
}

function HeadingStack({
  eyebrow,
  heading,
  headingNode,
  lede,
  onGreen,
  ledeColor,
}: {
  eyebrow: string;
  heading?: string;
  headingNode?: React.ReactNode;
  lede?: string;
  onGreen: boolean;
  ledeColor: string;
}) {
  if (headingNode) {
    return (
      <div className="flex max-w-[60ch] flex-col gap-6">
        <Eyebrow tone="gold">{eyebrow}</Eyebrow>
        {headingNode}
        {lede ? (
          <p className={`max-w-[60ch] text-[17px] leading-[1.55] ${ledeColor}`}>
            {lede}
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <div className="max-w-[640px] lg:max-w-[720px]">
      <SectionHeading
        eyebrow={eyebrow}
        heading={heading ?? ""}
        level={1}
        lede={lede}
        tone={onGreen ? "on-green" : "on-cream"}
      />
    </div>
  );
}
