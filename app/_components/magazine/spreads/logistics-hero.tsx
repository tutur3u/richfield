"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { EASE_OUT_EXPO } from "@/app/_components/magazine/_ease";

const ADVANCE_MS = 7000;

/** Supporting standfirst beneath the hero headline. */
const HERO_SUBHEAD =
  "Operated by Richfield Foods. Ambient and cold storage, co-packing, and the trucks that reach every province.";

type HeroPhoto = {
  src: string;
  alt: string;
  objectPosition?: string;
};

// Warehouse + logistics photography from the Phú Tường (Long An) facility.
const HERO_SEQUENCE: HeroPhoto[] = [
  {
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0832.webp",
    alt: "A container truck at the Richfield Foods warehouse loading bay",
    objectPosition: "center 55%",
  },
  {
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0892.webp",
    alt: "A forklift loading pallets beside a delivery truck at the distribution centre",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0781.webp",
    alt: "Workers loading product onto a truck on the warehouse dock",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0844.webp",
    alt: "Cases being loaded into a truck at the Richfield Foods dock",
    objectPosition: "center 45%",
  },
];

/**
 * Logistics chapter opener, built to match the homepage cover: a full-bleed
 * crossfading photo carousel of the distribution centre with a slow zoom, a
 * letterbox scrim for legibility, and a bottom block (eyebrow → headline →
 * standfirst) that rises in on first paint. Auto-advance pauses on hover/focus
 * and is disabled under reduced motion.
 */
export function LogisticsHero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SEQUENCE.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const photo = HERO_SEQUENCE[index];

  const enter = (delay: number) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay },
        };

  return (
    <section
      aria-label="Warehouse and logistics"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="v2-display relative isolate z-10 flex min-h-[100svh] flex-col overflow-hidden bg-ink text-cream"
    >
      {/* Full-bleed photo carousel — crossfade + slow zoom. */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={photo.src}
          className="absolute inset-0 -z-10"
          initial={reduce ? false : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{
            opacity: { duration: reduce ? 0 : 1.2, ease: EASE_OUT_EXPO },
            scale: { duration: reduce ? 0 : 8, ease: "linear" },
          }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover v2-photo-duotone"
            style={{ objectPosition: photo.objectPosition ?? "center" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Letterbox + right-veil scrims. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[linear-gradient(180deg,oklch(0.22_0.015_158/0.82)_0%,oklch(0.22_0.015_158/0.28)_22%,oklch(0.22_0.015_158/0.26)_45%,oklch(0.22_0.015_158/0.94)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[28%] lg:block
                   bg-[linear-gradient(270deg,oklch(0.22_0.015_158/0.55)_0%,oklch(0.22_0.015_158/0)_100%)]"
      />

      <div className="flex-1" aria-hidden />

      {/* Bottom block — eyebrow, headline, standfirst. */}
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-12 sm:px-10 sm:pb-14 lg:pb-20">
        <div className="max-w-full">
          <motion.div
            className="v2-mono v2-size-eyebrow mb-[var(--v2-rhythm)] flex items-center gap-3 text-gold"
            {...enter(0.35)}
          >
            <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
            WAREHOUSE &amp; LOGISTICS
          </motion.div>

          <h1 className="font-display v2-headline max-w-full text-balance">
            <motion.span className="block" {...enter(0.55)}>
              Two strategically located hubs
            </motion.span>
            <motion.span className="block" {...enter(0.73)}>
              serve the full length of the{" "}
              <em className="italic text-gold">country</em>.
            </motion.span>
          </h1>

          <motion.p
            className="mt-[var(--v2-rhythm)] max-w-full text-[clamp(17px,1.4vw,22px)] leading-relaxed text-cream/90 [text-shadow:0_1px_4px_rgb(0_0_0_/_0.6)] lg:max-w-[48ch]"
            {...enter(0.95)}
          >
            {HERO_SUBHEAD}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
