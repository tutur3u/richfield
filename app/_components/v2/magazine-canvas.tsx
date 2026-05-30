"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Snap from "lenis/snap";
import { useLenis } from "./lenis-provider";

/**
 * MagazineCanvas — one sticky pinned canvas, multiple spreads stacked in
 * the SAME viewport frame, crossfading on scroll.
 *
 * Why: the previous MagazineMorph chained two separate sticky sections
 * with a viewport of dead air between them. That dead air is fundamental
 * to position:sticky (sticky-child needs scroll runway to "scroll off")
 * and breaks the magazine illusion — you scroll through nothing between
 * spreads. This component instead puts every spread in a single sticky
 * container, absolutely-positioned in the same frame, so a "page-turn"
 * is a literal in-place cross-dissolve: the new spread takes the exact
 * pixel real-estate of the old one.
 *
 * Scroll timeline (for N spreads):
 *   Each spread has a "reading center" at i / (N-1).
 *   Each adjacent pair has a "morph center" at (center[i] + center[i+1]) / 2.
 *   A morph window of width 2×MORPH_HALF straddles each morph center:
 *     - spread[i].opacity = 1 throughout its reading window, fades to 0
 *       during morph windows on either side
 *     - bg interpolates spread[i].bg → spread[i+1].bg through each morph
 *     - subtle blur peaks during morphs to read as metamorphosis not fade
 *
 * Sizing: totalHeight controls the scroll runway. Larger = longer reading
 * window per spread, smaller = snappier morphs. 220svh is a good default
 * for 3-4 spreads.
 *
 * Reduced motion: degrades to plain stacked sections (no overlap, no
 * morph), each filling its own viewport.
 *
 * Constraint: each spread MUST fit within 100svh — there is no scroll
 * within a spread. This matches the magazine spread metaphor.
 */

/** Half-width of each morph window, in [0,1] scroll progress. 0.025 →
 *  morph window = 5% of total scroll, which on a 220svh canvas with
 *  120svh sticky-time = ~6svh = a single trackpad swipe. */
const MORPH_HALF = 0.025;

/** Peak blur during morph window, in CSS pixels. */
const MORPH_BLUR = 8;

export type CanvasSpread = {
  /** OKLCH color literal for the surface during this spread's reading. */
  bg: string;
  /** When true, the spread renders with cream type (paired with a dark bg). */
  textOnDark?: boolean;
  /** The spread's composed content. Must fit in 100svh. */
  content: React.ReactNode;
};

type Props = {
  spreads: CanvasSpread[];
  /** Total CSS height of the canvas outer. The sticky-time is this minus
   *  one viewport. Default 220svh = 120svh of sticky-time on a 100svh
   *  viewport, giving ~30svh of scroll per spread on 4 spreads. */
  totalHeight?: string;
};

export function MagazineCanvas({ spreads, totalHeight = "220svh" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const lenis = useLenis();

  const N = spreads.length;

  // Reading centers along the scroll progress.
  const stops = Array.from({ length: N }, (_, i) =>
    N === 1 ? 0.5 : i / (N - 1),
  );

  // Background interpolation breakpoints — bg holds during reading,
  // crossfades between adjacent spreads' bgs during morph windows.
  const { bgPoints, bgValues } = buildBgKeyframes(spreads, stops);

  // Hooks must be called unconditionally; reduced-motion early return
  // sits below this.
  const bg = useTransform(scrollYProgress, bgPoints, bgValues);

  // Lenis snap — one snap target per spread reading center, plus a
  // top-of-page stop. Proximity mode with a viewport-relative threshold
  // so any wheel-idle inside the canvas is caught softly. Under reduced
  // motion lenis stays null and this effect is a no-op.
  useEffect(() => {
    if (!lenis || !ref.current) return;
    const section = ref.current;

    const snap = new Snap(lenis, {
      type: "proximity",
      distanceThreshold: "45%",
      debounce: 220,
      duration: 0.7,
    });

    let cleanups: Array<() => void> = [];

    const register = () => {
      cleanups.forEach((fn) => fn());
      cleanups = [];

      const topY = section.getBoundingClientRect().top + window.scrollY;
      const runway = section.offsetHeight - window.innerHeight;
      if (runway <= 0) return;

      cleanups.push(snap.add(0));
      for (let i = 0; i < N; i++) {
        const progress = N === 1 ? 0.5 : i / (N - 1);
        cleanups.push(snap.add(topY + progress * runway));
      }
    };

    register();

    const ro = new ResizeObserver(register);
    ro.observe(section);
    window.addEventListener("resize", register);

    return () => {
      cleanups.forEach((fn) => fn());
      ro.disconnect();
      window.removeEventListener("resize", register);
      snap.destroy();
    };
  }, [lenis, N]);

  if (reduce) {
    return (
      <>
        {spreads.map((s, i) => (
          <section
            key={i}
            className={`relative ${s.textOnDark ? "text-cream" : "text-ink"}`}
            style={{ background: s.bg, minHeight: "100vh" }}
          >
            <div className="mx-auto flex min-h-[100vh] w-full max-w-[1500px] items-center px-6 sm:px-10 lg:px-12">
              {s.content}
            </div>
          </section>
        ))}
      </>
    );
  }

  return (
    <motion.section
      ref={ref}
      style={{
        background: bg as unknown as MotionValue<string>,
        height: totalHeight,
      }}
      aria-roledescription="magazine canvas"
      className="relative"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {spreads.map((spread, i) => (
          <CanvasSlide
            key={i}
            progress={scrollYProgress}
            stops={stops}
            index={i}
            total={N}
            textOnDark={spread.textOnDark ?? false}
          >
            {spread.content}
          </CanvasSlide>
        ))}
      </div>
    </motion.section>
  );
}

function CanvasSlide({
  progress,
  stops,
  index,
  total,
  textOnDark,
  children,
}: {
  progress: MotionValue<number>;
  stops: number[];
  index: number;
  total: number;
  textOnDark: boolean;
  children: React.ReactNode;
}) {
  const { points: opacityPoints, values: opacityValues } = buildOpacityKeyframes(
    index,
    total,
    stops,
  );
  const { points: blurPoints, values: blurValues } = buildBlurKeyframes(
    index,
    total,
    stops,
  );

  const opacity = useTransform(progress, opacityPoints, opacityValues);
  const blur = useTransform(progress, blurPoints, blurValues);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      style={{ opacity, filter }}
      className={`absolute inset-0 flex items-center ${textOnDark ? "text-cream" : "text-ink"}`}
    >
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-12">
        {children}
      </div>
    </motion.div>
  );
}

// ─── keyframe builders ────────────────────────────────────────────────

function buildBgKeyframes(
  spreads: CanvasSpread[],
  stops: number[],
): { bgPoints: number[]; bgValues: string[] } {
  const N = spreads.length;
  const bgPoints: number[] = [0];
  const bgValues: string[] = [spreads[0].bg];

  for (let i = 0; i < N - 1; i++) {
    const morphCenter = (stops[i] + stops[i + 1]) / 2;
    bgPoints.push(morphCenter - MORPH_HALF);
    bgValues.push(spreads[i].bg);
    bgPoints.push(morphCenter + MORPH_HALF);
    bgValues.push(spreads[i + 1].bg);
  }

  bgPoints.push(1);
  bgValues.push(spreads[N - 1].bg);

  return { bgPoints, bgValues };
}

function buildOpacityKeyframes(
  index: number,
  total: number,
  stops: number[],
): { points: number[]; values: number[] } {
  const points: number[] = [];
  const values: number[] = [];

  // Fade-in side
  if (index === 0) {
    points.push(0);
    values.push(1);
  } else {
    const prevCenter = (stops[index - 1] + stops[index]) / 2;
    points.push(0, prevCenter - MORPH_HALF, prevCenter + MORPH_HALF);
    values.push(0, 0, 1);
  }

  // Fade-out side
  if (index === total - 1) {
    points.push(1);
    values.push(1);
  } else {
    const nextCenter = (stops[index] + stops[index + 1]) / 2;
    points.push(nextCenter - MORPH_HALF, nextCenter + MORPH_HALF, 1);
    values.push(1, 0, 0);
  }

  return { points, values };
}

function buildBlurKeyframes(
  index: number,
  total: number,
  stops: number[],
): { points: number[]; values: number[] } {
  const points: number[] = [];
  const values: number[] = [];

  // Fade-in side: starts blurred, sharp at reading
  if (index === 0) {
    points.push(0);
    values.push(0);
  } else {
    const prevCenter = (stops[index - 1] + stops[index]) / 2;
    points.push(0, prevCenter - MORPH_HALF, prevCenter + MORPH_HALF);
    values.push(MORPH_BLUR, MORPH_BLUR, 0);
  }

  // Fade-out side: sharp during reading, blurs to morph
  if (index === total - 1) {
    points.push(1);
    values.push(0);
  } else {
    const nextCenter = (stops[index] + stops[index + 1]) / 2;
    points.push(nextCenter - MORPH_HALF, nextCenter + MORPH_HALF, 1);
    values.push(0, MORPH_BLUR, MORPH_BLUR);
  }

  return { points, values };
}
