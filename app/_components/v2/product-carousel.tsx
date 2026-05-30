"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type CarouselItem = {
  src: string;
  name: string;
  alt: string;
  brand?: string;
};

type Props = {
  items: CarouselItem[];
  ariaLabel: string;
  /** Tinted background behind product squares. Defaults to a faint current-color wash. */
  tileBg?: string;
};

export function ProductCarousel({ items, ariaLabel, tileBg }: Props) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const handler = () => {
      const tiles = Array.from(rail.querySelectorAll<HTMLElement>("[data-tile]"));
      if (tiles.length === 0) return;
      const railRect = rail.getBoundingClientRect();
      const centerX = railRect.left + railRect.width / 2;
      let nearest = 0;
      let nearestDist = Infinity;
      tiles.forEach((tile, i) => {
        const tileRect = tile.getBoundingClientRect();
        const tileCenter = tileRect.left + tileRect.width / 2;
        const dist = Math.abs(tileCenter - centerX);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      });
      setActiveIndex(nearest);
    };

    rail.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => rail.removeEventListener("scroll", handler);
  }, [items.length]);

  const scrollBy = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const tile = rail.querySelector<HTMLElement>("[data-tile]");
    const step = tile ? tile.offsetWidth + 24 : rail.clientWidth * 0.6;
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section aria-label={ariaLabel} className="relative">
      <div
        ref={railRef}
        className="v2-scroll-rail flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
        style={{ scrollPaddingLeft: "0", scrollPaddingRight: "0" }}
      >
        {items.map((item, i) => (
          <figure
            key={`${item.src}-${i}`}
            data-tile
            className="snap-start flex w-[clamp(180px,22vw,260px)] shrink-0 flex-col gap-3"
          >
            <div
              className="relative aspect-square w-full overflow-hidden"
              style={{ background: tileBg ?? "color-mix(in oklch, currentColor 4%, transparent)" }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="260px"
                className="object-contain p-4"
              />
            </div>
            <figcaption className="flex flex-col gap-1">
              {item.brand ? (
                <span className="v2-mono v2-size-folio opacity-55">
                  {item.brand}
                </span>
              ) : null}
              <span className="v2-display text-[clamp(14px,1vw,16px)] leading-tight tracking-tight">
                {item.name}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-6">
        <span className="v2-mono v2-size-folio opacity-65">
          {String(activeIndex + 1).padStart(2, "0")}
          <span className="opacity-50"> / </span>
          {String(items.length).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous product"
            className="v2-mono v2-size-folio flex h-9 w-9 items-center justify-center rounded-full border border-current/25 transition-opacity hover:opacity-70"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next product"
            className="v2-mono v2-size-folio flex h-9 w-9 items-center justify-center rounded-full border border-current/25 transition-opacity hover:opacity-70"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
