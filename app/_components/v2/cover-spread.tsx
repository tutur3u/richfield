"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { coverSequence } from "@/app/_lib/cover-portrait-pool";
import { FolioStrip } from "@/app/_components/v2/folio-strip";
import { VerticalTOC } from "@/app/_components/v2/vertical-toc";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const ADVANCE_MS = 7000;

/** Editorial standfirst — one of the few pieces of copy on the cover. */
const STANDFIRST_LINES = [
  "We carry what people love,",
  "country by country,",
  "for thirty years.",
] as const;

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

  // Static-entry helper (Apple-grade load choreography on first paint only).
  // Subsequent photo changes use the crossfade defined inside the
  // AnimatePresence below — not this `enter` helper.
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
      className="v2-display relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-cream"
    >
      {/* Cover photograph carousel — crossfade between sequence entries.
          AnimatePresence keeps incoming + outgoing photos in the DOM long
          enough for the opacity tween to look like a real dissolve. */}
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

      {/* Letterbox + right-veil — fixed (don't transition with the photo). */}
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

      {/* Top folio strip — masthead + issue stamp. */}
      <motion.header
        className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pt-6 sm:px-10 sm:pt-8 lg:pt-10"
        {...enter(0.15)}
      >
        <FolioStrip />
      </motion.header>

      <div className="flex-1" aria-hidden />

      {/* Bottom block — standfirst (left), TOC (right, lg+ only),
          pagination dots (bottom-right, all viewports). */}
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-12 sm:px-10 sm:pb-14 lg:pb-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-9">
            {/* Eyebrow */}
            <motion.div
              className="v2-mono v2-size-eyebrow mb-6 flex items-center gap-3 text-gold"
              {...enter(0.35)}
            >
              <span aria-hidden className="inline-block h-px w-8 bg-gold/80" />
              VIETNAM · MALAYSIA · CHINA · SINCE 1994
            </motion.div>

            {/* Standfirst — italic Newsreader, three staggered lines. */}
            <h1 className="v2-italic v2-size-standfirst max-w-[22ch] text-balance">
              {STANDFIRST_LINES.map((line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  {...enter(0.55 + i * 0.18)}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Caption — crossfades with the photo. Live region so AT
                announces the new caption when the cover advances. */}
            <div className="mt-10 min-h-[2lh]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.figcaption
                  key={portrait.src}
                  className="v2-mono v2-size-folio max-w-[60ch] opacity-80"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: EASE_OUT_EXPO }}
                >
                  <span aria-hidden className="v2-rule-gold mr-4 inline-block w-10 align-middle" />
                  {portrait.caption}
                </motion.figcaption>
              </AnimatePresence>
            </div>
          </div>

          {/* Vertical TOC — desktop only. */}
          <motion.aside
            className="col-span-3 hidden self-end lg:block"
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 1.4 }}
          >
            <VerticalTOC />
          </motion.aside>
        </div>

        {/* Pagination dots — mono numerals + animated underline marking the
            current slot. Click to advance manually. */}
        <CoverPagination
          count={coverSequence.length}
          active={index}
          onSelect={setIndex}
        />
      </div>
    </section>
  );
}

function CoverPagination({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Cover photo selection"
      className="v2-mono v2-size-folio mt-10 flex items-center gap-5 opacity-80"
    >
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={`Show cover photo ${i + 1} of ${count}`}
            onClick={() => onSelect(i)}
            className="group flex items-center gap-2 outline-none"
          >
            <span className={isActive ? "" : "opacity-50 group-hover:opacity-80 transition-opacity"}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden
              className={`block h-px transition-all duration-700 ease-out
                ${isActive ? "w-10 bg-gold" : "w-4 bg-cream/40 group-hover:bg-cream/70"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
