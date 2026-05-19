"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CarouselPhoto = { src: string; alt: string };

type Props = {
  photos: CarouselPhoto[];
  /** ms between slide transitions. */
  intervalMs?: number;
  priority?: boolean;
  sizes?: string;
  /** Use with a parent that has explicit height. */
  fill?: boolean;
  className?: string;
  imgClassName?: string;
};

export function PhotoCarousel({
  photos,
  intervalMs = 6000,
  priority,
  sizes,
  fill,
  className = "",
  imgClassName = "",
}: Props) {
  const [active, setActive] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || photos.length <= 1) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mql.matches;
    if (mql.matches) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % photos.length);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [photos.length, intervalMs]);

  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className)
    ? ""
    : "relative";

  return (
    <div className={`${wrapperPosition} overflow-hidden ${className}`}>
      {photos.map((p, idx) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.alt}
          fill={fill}
          width={fill ? undefined : 1600}
          height={fill ? undefined : 900}
          priority={priority && idx === 0}
          sizes={sizes}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            idx === active ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      ))}
    </div>
  );
}
