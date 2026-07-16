"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

import { EASE_OUT_EXPO } from "@/app/_components/magazine/_ease";
import type { Locale } from "@/lib/locale";

/**
 * STORY 03 map plate — the dominant element of the spread. Fills its grid
 * column, right-aligned so its edge meets the page padding, and capped by
 * viewport height so it stays the hero without overflowing. The
 * client-supplied footprint map carries its own labels and headcounts, so
 * this is a plain motion-island image: a one-time scroll-triggered scale +
 * fade. Aspect ratio is locked to the source (1210 x 1300) so nothing crops.
 */
export function AtlasMap(_props: { locale?: Locale }) {
  const reduce = useReducedMotion();
  const t = useTranslations("atlasMap");

  return (
    <motion.figure
      initial={reduce ? false : { scale: 1.03, opacity: 0.7 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduce ? 0 : 1.2, ease: EASE_OUT_EXPO }}
      className="flex flex-col gap-[clamp(10px,1vw,16px)]"
    >
      <div className="relative ml-auto aspect-[1210/1300] w-full max-w-[calc(86svh*1210/1300)]">
        <Image
          src="/photos/map/footprint.webp"
          alt={t("alt")}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain"
          priority={false}
        />
      </div>
      <figcaption className="v2-mono v2-size-folio opacity-50">
        {t("caption")}
      </figcaption>
    </motion.figure>
  );
}
