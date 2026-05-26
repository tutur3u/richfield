"use client";

// Legacy primitive — unused after the V2 Content Integration plan (Task 11)
// retires its imports. Kept on disk per spec §6 ("Files unused (kept on disk
// for reference)"); the conditional-hook warnings below are intentional in the
// original sketch and not worth restructuring in dead code.
/* eslint-disable react-hooks/rules-of-hooks */

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "motion/react";

/**
 * MagazineMorph — "page-turn in place" between two magazine sections.
 *
 * The section is sticky-pinned while the user scrolls past it. Content
 * stays glued to the viewport (no vertical drift), then a SLIGHT scroll
 * at the end commits the page-turn: content cross-dissolves, background
 * interpolates from `fromBg` → `toBg`. No scale, no translate — pure in-
 * place metamorphosis. The next section sits on `toBg` already, so
 * there's no hard cut.
 *
 * Scroll timeline:
 *   0.00 — 0.10   enter  (content fades + un-blurs in)
 *   0.10 — 0.86   hold   (content sits still, this is reading time)
 *   0.86 — 1.00   morph  (in-place crossfade: opacity → 0, blur → on,
 *                          bg interpolates fromBg → toBg — ~14% of the
 *                          section's scroll runway, so a single small
 *                          scroll triggers the full page-turn)
 *
 * Reduced motion: collapses to a plain section, no pinning.
 */
type Props = {
  /** OKLCH color literal for the surface during the reading window. */
  fromBg: string;
  /** OKLCH color literal the surface bleeds to as the page "turns". */
  toBg: string;
  /** Inverted? When true, the pinned content uses cream type vs ink. */
  textOnDark?: boolean;
  /** Total scrollable height of the morph zone (CSS length).
   *  150vh = ~0.5 viewport of reading + a small commit-scroll for the
   *  page-turn. Smaller = snappier, larger = more reading time. */
  scrollHeight?: string;
  children: React.ReactNode;
};

export function MagazineMorph({
  fromBg,
  toBg,
  textOnDark = false,
  scrollHeight = "150vh",
  children,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Scroll progress through the outer container — 0 when its top hits
  // the viewport top, 1 when its bottom hits the viewport bottom.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Static fallback under reduced motion.
  if (reduce) {
    return (
      <section
        className={`relative ${textOnDark ? "text-cream" : "text-ink"}`}
        style={{ background: toBg, minHeight: "100vh" }}
      >
        <div className="mx-auto flex min-h-[100vh] w-full max-w-[1500px] items-center px-6 sm:px-10">
          {children}
        </div>
      </section>
    );
  }

  // ── MotionValues driven by scrollYProgress ─────────────────────────
  // Background swaps over the last 14% of scroll — sharp enough that a
  // single small scroll completes the morph.
  const bg = useTransform(scrollYProgress, [0, 0.86, 1.0], [fromBg, fromBg, toBg]);

  // Content opacity: very quick fade-in, long hold, quick fade-out.
  // (Reading window: 10% → 86% of progress = ~75% of the runway.)
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.86, 1.0],
    [0, 1, 1, 0],
  );

  // Blur — softens as content fades, helps the in-place dissolve read
  // as a *morph* not just a fade. NO scale, NO translate: the content
  // stays exactly where it is.
  const blurPx = useTransform(
    scrollYProgress,
    [0, 0.10, 0.86, 1.0],
    [10, 0, 0, 14],
  );
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.section
      ref={ref}
      className={`relative ${textOnDark ? "text-cream" : "text-ink"}`}
      style={{
        background: bg as unknown as MotionValue<string>,
        height: scrollHeight,
      }}
      aria-roledescription="pinned magazine spread"
    >
      {/* Sticky child glued to the viewport while the parent scrolls past. */}
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
        <motion.div
          style={{ opacity, filter }}
          className="mx-auto w-full max-w-[1500px] px-6 sm:px-10"
        >
          {children}
        </motion.div>

        <ScrollHint progress={scrollYProgress} />
      </div>
    </motion.section>
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  // Fade out well before the morph starts so the hint never overlaps
  // the page-turn itself.
  const hintOpacity = useTransform(
    progress,
    [0.10, 0.55, 0.80],
    [0.55, 0.55, 0],
  );
  return (
    <motion.div
      aria-hidden
      style={{ opacity: hintOpacity }}
      className="v2-mono v2-size-folio pointer-events-none absolute inset-x-0 bottom-8 flex items-center justify-center gap-3"
    >
      <span aria-hidden className="inline-block h-px w-8 bg-current/40" />
      A SLIGHT SCROLL TURNS THE PAGE
      <span aria-hidden className="inline-block h-px w-8 bg-current/40" />
    </motion.div>
  );
}
