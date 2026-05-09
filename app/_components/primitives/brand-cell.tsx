import Image from "next/image";

type Props = {
  name: string;
  country: string;
  logoSrc?: string;
  feature?: boolean;
  featureCaption?: string;
};

export function BrandCell({
  name,
  country,
  logoSrc,
  feature = false,
  featureCaption,
}: Props) {
  // Cells are not interactive at launch — no hover state, no cursor
  // change. When client provides per-brand pages we'll wrap in <Link>.
  const wrapperBase =
    "flex flex-col items-center justify-center gap-3 bg-cream px-6 py-12";
  const span = feature ? "sm:col-span-2" : "";

  if (feature) {
    return (
      <div className={`${wrapperBase} ${span} relative bg-ink`}>
        <span
          aria-hidden
          className="absolute left-1/2 top-6 h-px w-12 -translate-x-1/2 bg-gold"
        />
        <span className="font-display text-[clamp(32px,3.5vw,44px)] italic leading-none text-gold">
          {name}
        </span>
        {featureCaption ? (
          <span className="text-[10px] uppercase tracking-[0.32em] text-paper/70">
            {featureCaption}
          </span>
        ) : null}
      </div>
    );
  }

  if (logoSrc) {
    return (
      <div className={wrapperBase}>
        <Image
          src={logoSrc}
          alt={name}
          width={140}
          height={48}
          className="h-12 w-auto object-contain"
        />
        <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
          {country}
        </span>
      </div>
    );
  }

  return (
    <div className={wrapperBase}>
      <span className="font-display text-[24px] italic text-ink">{name}</span>
      <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
        {country}
      </span>
    </div>
  );
}
