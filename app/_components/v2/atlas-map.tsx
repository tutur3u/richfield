"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * STORY 03 map plate — the dominant element of the spread. Fills its grid
 * column, right-aligned so its edge meets the page padding, and capped by
 * viewport height so it stays the hero without overflowing. The
 * client-supplied footprint map carries its own labels and headcounts, so
 * this is a plain motion-island image: a one-time scroll-triggered scale +
 * fade. Aspect ratio is locked to the source (560 x 484) so nothing crops.
 */
export function AtlasMap() {
  const reduce = useReducedMotion();

  return (
    <motion.figure
      initial={reduce ? false : { scale: 1.03, opacity: 0.7 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduce ? 0 : 1.2, ease: EASE_OUT_EXPO }}
      className="flex flex-col gap-[clamp(10px,1vw,16px)]"
    >
      <div className="relative ml-auto aspect-[1153/1148] w-full max-w-[calc(74svh*1153/1148)]">
        <Image
          src="/photos/map/headcount-map.webp"
          alt="Richfield operating footprint across China (50, sourcing and brands), Vietnam (1,000+ at headquarters and growing), and Malaysia (150, origin in the 1990s)."
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain"
          priority={false}
        />
      </div>
      <figcaption className="v2-mono v2-size-folio opacity-50">
        OPERATING FOOTPRINT · ASIA
      </figcaption>
    </motion.figure>
  );
}
