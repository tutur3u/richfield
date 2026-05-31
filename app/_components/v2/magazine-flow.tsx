"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { useLenis, useSmoothScroll } from "./lenis-provider";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export type MagazineFlowSectionProps = {
  bg: string;
  textOnDark?: boolean;
  id?: string;
  children: ReactNode;
};

export function MagazineFlowSection({
  bg,
  textOnDark = false,
  id,
  children,
}: MagazineFlowSectionProps) {
  return (
    <section
      id={id}
      data-bg={bg}
      data-text-on-dark={textOnDark ? "true" : "false"}
      className={`relative ${textOnDark ? "text-cream" : "text-ink"}`}
      style={{ background: bg }}
    >
      {children}
    </section>
  );
}

type SectionMeta = { bg: string; textOnDark: boolean };

type MagazineFlowProps = {
  children: ReactNode;
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const SNAP_DURATION_S = 1.1;
// How early the global background flips, measured as the fraction of a viewport
// the destination section covers before the switch. Small = "the moment we
// leave a section"; 1 = only once it has fully arrived. Applied symmetrically to
// up and down so forward and backward feel the same.
const SWITCH_FRACTION = 0.15;
// Scroll behaves as a hard "wall" at each section's end: downward scroll is
// clamped there every frame, so even a very hard fling physically stops at the
// end of a section — it cannot carry through. The wall releases only on a
// fresh, deliberate downward gesture.
//
// A new gesture is told apart from the dying momentum of the fling that hit the
// wall by an idle gap: trackpad/mouse momentum events arrive continuously (tiny
// gaps), whereas lifting and swiping again leaves a pause. A downward wheel
// event with at least this gap since the previous one counts as a fresh push.
const RELEASE_IDLE_MS = 180;

export function MagazineFlow({ children }: MagazineFlowProps) {
  const reduce = useReducedMotion();
  const { enabled: smoothScroll } = useSmoothScroll();
  const sectionEls = useRef<Array<HTMLElement | null>>([]);
  const lenis = useLenis();
  const [snapping, setSnapping] = useState(false);

  // No Lenis means no snap/morph: fall back to native scroll with opaque
  // section backgrounds. Triggered by reduced-motion or the ScrollToggle.
  const nativeScroll = reduce || !smoothScroll;

  const sections: SectionMeta[] = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const typedChild = child as ReactElement<MagazineFlowSectionProps>;
      const { bg, textOnDark } = typedChild.props;
      return {
        bg: bg ?? "oklch(0.96 0.018 82)",
        textOnDark: textOnDark ?? false,
      };
    });

  // bg motion value, initialised to section 0's bg. The Lenis snap callbacks
  // animate this value when a seam is crossed.
  const initialBg = sections[0]?.bg ?? "oklch(0.96 0.018 82)";
  const bg = useMotionValue<string>(initialBg);

  useEffect(() => {
    if (!lenis || reduce) return;
    const els = sectionEls.current.filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    const sectionTops = () =>
      els.map((el) => el.getBoundingClientRect().top + window.scrollY);

    let currentIndex = -1;

    // Active section drives the global background. We flip it the moment we
    // *leave* a section, symmetric for both directions: going down the next
    // section takes over as it enters from the bottom; going up the previous
    // one takes over as it enters from the top. SWITCH_FRACTION sets how far
    // into the seam that happens (small = early "leave", 1 = old "arrive").
    const activeSectionIndex = (dir: number, tops: number[]) => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const offset = dir >= 0 ? vh * (1 - SWITCH_FRACTION) : vh * SWITCH_FRACTION;
      let best = 0;
      tops.forEach((top, i) => {
        if (top <= sy + offset) best = i;
      });
      return best;
    };

    const syncBg = (animated: boolean, dir: number, tops: number[]) => {
      const next = activeSectionIndex(dir, tops);
      if (next === currentIndex) return;
      currentIndex = next;
      if (animated) {
        animate(bg, sections[next].bg, {
          duration: SNAP_DURATION_S,
          ease: EASE_OUT_EXPO,
        });
      } else {
        bg.set(sections[next].bg);
      }
    };

    // Initialise immediately so first paint matches the section in view
    // (handles deep-links to a #section anchor).
    syncBg(false, 1, sectionTops());

    // The end of each section is a hard wall. `currentSection` is the section
    // whose wall is currently in force; it advances ONLY on an explicit release
    // (a fresh downward gesture), never via momentum. The wall for a section is
    // the scroll position where its bottom rests against the viewport bottom
    // (`tops[currentSection + 1] - vh`), measured against that section's own
    // box, so a tall section and a one-viewport section behave identically: you
    // can read down to the wall, but no fling carries past it.
    let currentSection = 0;
    let crossing = false; // true while a release animation is in flight
    let lastWheelTs = 0;

    // Recompute which section currently fills the viewport top, so scrolling
    // back UP frees the walls behind you (you can revisit earlier sections).
    const geomSection = (tops: number[], sy: number) => {
      let g = 0;
      tops.forEach((top, i) => {
        if (top <= sy + 1) g = i;
      });
      return g;
    };

    // Hold the scroll at the current section's wall: any downward overshoot is
    // snapped straight back, killing the fling's momentum so it stops dead at
    // the end. Upward scrolling is never clamped.
    const enforceWall = (tops: number[]) => {
      if (crossing) return;
      const vh = window.innerHeight;
      const sy = lenis.scroll;
      const g = geomSection(tops, sy);
      if (g < currentSection) currentSection = g; // went back up — release walls
      if (currentSection + 1 >= tops.length) return; // last section: no wall
      const wall = tops[currentSection + 1] - vh;
      if (sy > wall + 1) {
        // immediate jump cancels the running momentum, so the fling stops dead
        // at the wall instead of vibrating against it.
        lenis.scrollTo(wall, { immediate: true, force: true });
      }
    };

    // Release the wall and advance one section. Lands at the next section's
    // top so a tall next section can again be read down to its own wall.
    const releaseToNext = () => {
      if (crossing) return;
      const tops = sectionTops();
      if (currentSection + 1 >= tops.length) return;
      crossing = true;
      setSnapping(true);
      currentSection += 1;
      lenis.scrollTo(tops[currentSection], {
        duration: SNAP_DURATION_S,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        lock: true,
        force: true,
        onComplete: () => {
          crossing = false;
          setSnapping(false);
        },
      });
    };

    // A fresh, deliberate downward gesture releases the wall. The dying
    // momentum of the fling that hit the wall arrives as a continuous stream of
    // wheel events (tiny gaps); a real new swipe follows a pause, so we require
    // an idle gap since the previous wheel event.
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const gap = now - lastWheelTs;
      lastWheelTs = now;
      if (crossing || e.deltaY <= 0 || gap < RELEASE_IDLE_MS) return;
      const tops = sectionTops();
      if (currentSection + 1 >= tops.length) return;
      const wall = tops[currentSection + 1] - window.innerHeight;
      // Only release when actually parked at the wall (i.e. at the section end).
      if (lenis.scroll >= wall - 2) releaseToNext();
    };

    let lastScroll = window.scrollY;
    const onScroll = () => {
      const sy = window.scrollY;
      const dir = sy >= lastScroll ? 1 : -1;
      lastScroll = sy;
      const tops = sectionTops();
      syncBg(true, dir, tops);
      enforceWall(tops);
    };
    lenis.on("scroll", onScroll);
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      lenis.off("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
    };
  // bg motion value and sections list are stable across renders for the same
  // children. Restricting deps to lenis/reduce avoids rebuilding the scroll
  // handler on every parent re-render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, reduce]);

  if (nativeScroll) {
    return (
      <div className="relative">
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          const typedChild = child as ReactElement<MagazineFlowSectionProps>;
          const {
            bg: childBg,
            textOnDark,
            children: sectionChildren,
            id,
          } = typedChild.props;
          return (
            <section
              id={id}
              data-bg={childBg}
              className={`relative ${textOnDark ? "text-cream" : "text-ink"}`}
              style={{ background: childBg }}
            >
              {sectionChildren}
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        data-testid="magazine-flow-bg"
        aria-hidden
        style={{ background: bg }}
        className="pointer-events-none fixed inset-0 z-0"
      />
      <SeamScrim active={snapping} />
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        const typedChild = child as ReactElement<MagazineFlowSectionProps>;
        const { textOnDark, children: sectionChildren, id } = typedChild.props;
        return (
          <section
            id={id}
            ref={(el) => {
              sectionEls.current[index] = el;
            }}
            className={`relative ${textOnDark ? "text-cream" : "text-ink"}`}
            style={{ background: "transparent" }}
          >
            {sectionChildren}
          </section>
        );
      })}
    </div>
  );
}

// A thin gold hairline that flashes across the viewport during a snap
// transition. Reads as a "page turn" cue without being theatrical.
function SeamScrim({ active }: { active: boolean }) {
  return (
    <motion.div
      aria-hidden
      data-testid="magazine-flow-seam"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      className="pointer-events-none fixed inset-x-0 top-1/2 z-30 h-px -translate-y-1/2"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, oklch(0.62 0.14 75 / 0.6) 50%, transparent 100%)",
      }}
    />
  );
}
