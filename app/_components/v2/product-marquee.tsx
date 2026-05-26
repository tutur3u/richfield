import Image from "next/image";

export type MarqueeItem = {
  src: string;
  name: string;
  alt: string;
};

type Props = {
  items: MarqueeItem[];
  ariaLabel: string;
  /** Animation duration in seconds. Defaults to 60s. */
  durationSeconds?: number;
};

export function ProductMarquee({ items, ariaLabel, durationSeconds = 60 }: Props) {
  const doubled = [...items, ...items];
  return (
    <section
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden"
    >
      <div
        data-testid="marquee-track"
        className="marquee-track marquee-track--left flex w-max items-end gap-6 py-2"
        style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
      >
        {doubled.map((item, i) => (
          <figure
            key={`${item.src}-${i}`}
            className="flex w-[clamp(160px,18vw,220px)] shrink-0 flex-col gap-2 rounded-sm bg-current/[0.03] p-3"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="220px"
                className="object-contain"
              />
            </div>
            <figcaption className="v2-mono v2-size-folio truncate opacity-70">
              {item.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
