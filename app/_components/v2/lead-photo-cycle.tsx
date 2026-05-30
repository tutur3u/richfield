"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const ADVANCE_MS = 6500;

type Photo = {
  src: string;
  alt: string;
  objectPosition?: string;
};

/** All 3:2 source aspect — matches the wrapper's aspect-[3/2] so no crop. */
const PHOTOS: Photo[] = [
  {
    src: "/photos/people/selected-2026-05-05.webp",
    alt: "The Richfield team in front of the modern campus, 2026.",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/people/happy-time-2025-11-1280.webp",
    alt: "A Richfield team gathering, late 2025.",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/workshop-1-1280.webp",
    alt: "A Richfield training workshop in session.",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/celebration-1280.webp",
    alt: "A Richfield celebration moment.",
    objectPosition: "center 45%",
  },
];

export function LeadPhotoCycle() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PHOTOS.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const photo = PHOTOS[index];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Richfield team gallery"
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={photo.src}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{
            opacity: { duration: reduce ? 0 : 1.0, ease: EASE_OUT_EXPO },
            scale: { duration: reduce ? 0 : 7, ease: "linear" },
          }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover v2-photo-duotone"
            style={{ objectPosition: photo.objectPosition ?? "center" }}
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

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
        {PHOTOS.map((_, i) => {
          const isActive = i === index;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={isActive}
              aria-label={`Show photo ${i + 1} of ${PHOTOS.length}`}
              onClick={() => setIndex(i)}
              className="outline-none"
            >
              <span
                aria-hidden
                className={`block h-px transition-all duration-700 ease-out
                  ${isActive ? "w-6 bg-cream" : "w-3 bg-cream/50 hover:bg-cream/80"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
