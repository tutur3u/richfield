"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { coverSequence } from "@/app/_lib/cover-portrait-pool";

import { EASE_OUT_EXPO } from "@/app/_components/magazine/_ease";
const ADVANCE_MS = 7000;

/** Supporting standfirst copy beneath the cover headline. */
const COVER_SUBHEAD =
  "One of Vietnam's largest FMCG distribution networks. Bringing the world's most loved brands to over 180,000 retail outlets nationwide.";

export function CoverSpread() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance through the cover sequence. Disabled under reduced motion.
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % coverSequence.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduce, paused]);

  // The currently displayed cover portrait.
  const portrait = coverSequence[index];

  // Static-entry helper (load choreography on first paint only). Subsequent
  // photo changes use the crossfade inside the AnimatePresence below.
  const enter = (delay: number) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay },
        };

  // Pause-on-interact wiring — keyboard focus or pointer hover both pause.
  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);

  return (
    <section
      aria-label="Issue 30 cover"
      aria-roledescription="carousel"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="v2-display relative isolate z-10 flex min-h-[100svh] flex-col overflow-hidden bg-ink text-cream"
    >
      {/* Full-bleed cover photograph carousel — crossfade between entries.
          AnimatePresence keeps incoming + outgoing photos mounted long enough
          for the opacity tween to read as a real dissolve. */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={portrait.src}
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
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover v2-photo-duotone"
            style={{ objectPosition: portrait.objectPosition ?? "center" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Letterbox + right-veil scrims — keep the headline legible over the
          photo. Fixed (don't transition with the carousel). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[linear-gradient(180deg,oklch(0.22_0.015_158/0.78)_0%,oklch(0.22_0.015_158/0.20)_22%,oklch(0.22_0.015_158/0.15)_45%,oklch(0.22_0.015_158/0.85)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[28%] lg:block
                   bg-[linear-gradient(270deg,oklch(0.22_0.015_158/0.55)_0%,oklch(0.22_0.015_158/0)_100%)]"
      />

      <div className="flex-1" aria-hidden />

      {/* Bottom block — eyebrow, headline, standfirst, pagination, overlaid on
          the photo. Text sizes/fonts match the rest of the issue. */}
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-12 sm:px-10 sm:pb-14 lg:pb-20">
        <div className="max-w-full lg:max-w-[60%]">
          <motion.div
            className="v2-mono v2-size-eyebrow mb-[var(--v2-rhythm)] flex items-center gap-3 text-gold"
            {...enter(0.35)}
          >
            <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
            ESTABLISHED 1994
          </motion.div>

          <h1 className="font-display v2-headline max-w-full text-balance lg:max-w-[20ch]">
            <motion.span className="block" {...enter(0.55)}>
              From market entry
            </motion.span>
            <motion.span className="block" {...enter(0.73)}>
              to <em className="italic text-gold">nationwide</em> distribution.
            </motion.span>
          </h1>

          <motion.p
            className="mt-[var(--v2-rhythm)] max-w-full text-[clamp(17px,1.4vw,22px)] leading-relaxed text-cream/90 [text-shadow:0_1px_4px_rgb(0_0_0_/_0.6)] lg:max-w-[46ch]"
            {...enter(0.95)}
          >
            {COVER_SUBHEAD}
          </motion.p>

          {/* <CoverPagination
            count={coverSequence.length}
            active={index}
            onSelect={setIndex}
          /> */}
        </div>
      </div>
    </section>
  );
}
