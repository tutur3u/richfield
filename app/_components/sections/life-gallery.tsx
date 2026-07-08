"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { RichfieldImageLibraryItem } from "@/lib/richfield-content";

// A wall of life at Richfield: every frame from the curated set, no labels, no
// dividers. Two full-bleed rows drift in opposite directions on their own, and
// either row can be grabbed, dragged, or trackpad-scrolled by hand at any time.
const COUNT = 25;
const SRCS = Array.from(
  { length: COUNT },
  (_, i) => `/photos/careers-life/${String(i + 1).padStart(2, "0")}.webp`,
);
const FALLBACK_IMAGES = SRCS.map((src) => ({
  alt: "Life at Richfield.",
  src,
}));

/**
 * One marquee row: an overflow-x rail whose scrollLeft is advanced every frame
 * by a requestAnimationFrame loop. The frames are duplicated once so the strip
 * wraps seamlessly in either direction. Auto-drift pauses on hover and while the
 * user grabs, drags, or wheels the rail, then resumes after a short idle. Under
 * prefers-reduced-motion the loop never starts (the rail is still hand-scrollable).
 */
function MarqueeRow({
  images,
  dir,
  speed,
}: {
  images: Array<{ alt: string; src: string }>;
  dir: 1 | -1;
  speed: number;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = 0;
    let inited = false;
    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const pauseBriefly = () => {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
      }, 1400);
    };
    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("wheel", pauseBriefly, { passive: true });
    el.addEventListener("touchstart", pauseBriefly, { passive: true });
    el.addEventListener("touchmove", pauseBriefly, { passive: true });

    const step = (t: number) => {
      const half = el.scrollWidth / 2;
      if (half > 0 && !inited) {
        if (dir < 0) el.scrollLeft = half;
        inited = true;
      }
      if (!last) last = t;
      const dt = t - last;
      last = t;
      if (!paused) el.scrollLeft += dir * speed * (dt / 16);
      if (half > 0) {
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft <= 0) el.scrollLeft += half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("wheel", pauseBriefly);
      el.removeEventListener("touchstart", pauseBriefly);
      el.removeEventListener("touchmove", pauseBriefly);
    };
  }, [dir, speed]);

  // Pointer drag-to-scroll, so a plain mouse can hand-scroll the rail too.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={railRef}
      className="v2-scroll-rail flex cursor-grab gap-2 overflow-x-auto overscroll-x-contain touch-pan-x select-none active:cursor-grabbing sm:gap-3"
    >
      {[...images, ...images].map((image, i) => (
        <figure
          key={`${image.src}-${i}`}
          aria-hidden={i >= images.length}
          className="relative aspect-[4/3] h-[clamp(160px,21vw,280px)] shrink-0 overflow-hidden bg-cream"
        >
          <Image
            src={image.src}
            alt={i < images.length ? image.alt : ""}
            fill
            draggable={false}
            sizes="(min-width:1024px) 28vw, 50vw"
            className="object-cover v2-photo-duotone pointer-events-none"
          />
        </figure>
      ))}
    </div>
  );
}

export function LifeGallery({
  images,
}: {
  images?: RichfieldImageLibraryItem[];
}) {
  const galleryImages =
    images && images.length > 0
      ? images.map((image) => ({
          alt: image.alt,
          src: image.src,
        }))
      : FALLBACK_IMAGES;
  const rowA = galleryImages.filter((_, i) => i % 3 === 0);
  const rowB = galleryImages.filter((_, i) => i % 3 === 1);
  const rowC = galleryImages.filter((_, i) => i % 3 === 2);

  return (
    <section
      aria-label="Life at Richfield, in pictures"
      className="v2-display v2-bleed-x pt-[var(--v2-flow)]"
    >
      <h2 className="sr-only">Life at Richfield, in pictures</h2>
      <div className="flex flex-col gap-2 sm:gap-3">
        <MarqueeRow images={rowA} dir={1} speed={0.55} />
        <MarqueeRow images={rowB} dir={-1} speed={0.55} />
        <MarqueeRow images={rowC} dir={1} speed={0.55} />
      </div>
    </section>
  );
}
