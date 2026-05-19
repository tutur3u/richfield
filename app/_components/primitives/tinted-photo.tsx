import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** "soft" for editorial blocks, "medium" for hero. */
  intensity?: "soft" | "medium";
  /** Overlay flavour. "warm" keeps the legacy gold→ink wash. "cream" drops the
   *  cream gradient used on the homepage hero — no dark blends. */
  tone?: "warm" | "cream";
  priority?: boolean;
  sizes?: string;
  /** Use with a parent that establishes the height (e.g. via aspect-ratio). */
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  /** Render the photo without the warm-tint CSS filter (used for product shots on white). */
  unfiltered?: boolean;
};

export function TintedPhoto({
  src,
  alt,
  intensity = "soft",
  tone = "warm",
  priority,
  sizes,
  fill,
  width,
  height,
  className = "",
  imgClassName = "",
  unfiltered = false,
}: Props) {
  const onCream = tone === "cream";

  const warmOverlay =
    intensity === "medium"
      ? "from-gold/15 via-transparent to-ink/30"
      : "from-gold/8 via-transparent to-ink/15";

  // Cream tone uses an explicit cream gradient (matches hero.tsx). Lower
  // intensity still reads through enough photo to feel airy; higher intensity
  // gives full type-friendly legibility for hero overlays.
  const creamOverlayClass =
    "absolute inset-0 bg-[linear-gradient(180deg,oklch(0.96_0.018_82/0.55)_0%,oklch(0.96_0.018_82/0.18)_50%,oklch(0.96_0.018_82/0.55)_100%)]";

  const filter = unfiltered || onCream
    ? ""
    : "[filter:saturate(0.88)_sepia(0.06)_contrast(1.02)]";

  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className)
    ? ""
    : "relative";
  return (
    <div className={`${wrapperPosition} overflow-hidden ${className}`}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${filter} ${imgClassName}`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 1280}
          height={height ?? 800}
          priority={priority}
          sizes={sizes}
          className={`h-full w-full object-cover ${filter} ${imgClassName}`}
        />
      )}
      {onCream ? (
        <div aria-hidden className={`pointer-events-none ${creamOverlayClass}`} />
      ) : (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br mix-blend-multiply ${warmOverlay}`}
        />
      )}
    </div>
  );
}
