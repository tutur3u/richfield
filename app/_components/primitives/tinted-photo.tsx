import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** "soft" for editorial blocks, "medium" for hero. */
  intensity?: "soft" | "medium";
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

/**
 * Image with a warm-tint filter and a subtle gradient overlay so candid
 * photography stays cohesive with the cream/gold/ink editorial palette.
 * One source of truth — change the overlay here, not per page.
 */
export function TintedPhoto({
  src,
  alt,
  intensity = "soft",
  priority,
  sizes,
  fill,
  width,
  height,
  className = "",
  imgClassName = "",
  unfiltered = false,
}: Props) {
  const overlay =
    intensity === "medium"
      ? "from-gold/15 via-transparent to-ink/30"
      : "from-gold/8 via-transparent to-ink/15";

  const filter = unfiltered
    ? ""
    : "[filter:saturate(0.88)_sepia(0.06)_contrast(1.02)]";

  // Always use a positioned wrapper so the overlay div can sit absolutely
  // on top. Callers can override positioning (absolute/fixed) via className.
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
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br mix-blend-multiply ${overlay}`}
      />
    </div>
  );
}
