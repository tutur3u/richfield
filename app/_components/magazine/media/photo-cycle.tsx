"use client";

import { useRef } from "react";
import Image from "next/image";

import { useCarouselScroll } from "@/app/_components/use-carousel-scroll";

export type CyclePhoto = {
  src: string;
  alt: string;
  objectPosition?: string;
};

/**
 * PhotoCycle — a horizontal photo carousel you can scroll by hand (swipe on
 * touch, two-finger on a trackpad, drag with the mouse) that also auto-advances
 * on a timer. Snap-to-slide keeps it tidy; the scrollbar is hidden via
 * .v2-scroll-rail; hairline dot controls jump to a slide. The caller sets the
 * frame (aspect/size); this fills it. Used by the lead photo and the
 * 30th-anniversary coda.
 */
export function PhotoCycle({
  photos,
  sizes,
  label,
}: {
  photos: CyclePhoto[];
  sizes: string;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { active, goTo, handlers } = useCarouselScroll(trackRef, photos.length);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={trackRef}
        className="v2-scroll-rail flex h-full w-full cursor-grab snap-x snap-mandatory select-none overflow-x-auto overscroll-x-contain active:cursor-grabbing"
        {...handlers}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className="relative h-full w-full shrink-0 basis-full snap-center"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={sizes}
              className="pointer-events-none object-cover v2-photo-duotone"
              style={{ objectPosition: photo.objectPosition ?? "center" }}
              draggable={false}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Subtle bottom-fade so the dots stay legible on bright photos. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16
                   bg-[linear-gradient(180deg,transparent_0%,oklch(0.22_0.015_158/0.45)_100%)]"
      />

      <div
        role="tablist"
        aria-label="Photo selection"
        className="absolute bottom-3 right-3 flex items-center gap-2"
      >
        {photos.map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              onClick={() => goTo(i)}
              className="relative outline-none before:absolute before:left-1/2 before:top-1/2 before:h-10 before:w-4 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
            >
              <span
                aria-hidden
                className={`block h-px transition-[width,background-color] duration-700 ease-out
                  ${isActive ? "w-6 bg-cream" : "w-3 bg-cream/50 hover:bg-cream/80"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
