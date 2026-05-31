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
// |lenis.velocity| above which a downward flick snaps forward to the next
// section. Tune against logged velocities — high enough that gentle reading
// never snaps, low enough that a deliberate flick does.
const HARD_VELOCITY = 1.2;
// After a snap fires it is "consumed" and won't fire again until the scroll has
// essentially stopped (|velocity| below this). Without it, a hard scroll
// through a tall section (e.g. section 1) carries enough leftover momentum to
// re-trigger the snap immediately and skip the next section. One flick now
// advances exactly one section.
const REARM_VELOCITY = 0.05;

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

    // Forward-only, hard-scroll snap. Never snaps upward and never snaps back
    // to a section's start — you can freely stop anywhere (mid-section or at a
    // section's end) to read. Only a deliberate downward flick, once the next
    // section has entered the viewport (i.e. you're near the end of the current
    // one), "page-turns" to the next section.
    let isSnapping = false;
    // A snap is consumed when it fires and only re-arms once the scroll has
    // essentially stopped, so the leftover momentum of a hard scroll (needed to
    // traverse a tall section) can't chain into a second snap and skip ahead.
    let armed = true;
    const maybeSnapForward = (tops: number[]) => {
      if (isSnapping) return;
      if (Math.abs(lenis.velocity) < REARM_VELOCITY) armed = true;
      if (!armed) return;
      if (lenis.velocity <= HARD_VELOCITY) return; // hard, downward scroll only
      const sy = window.scrollY;
      const vh = window.innerHeight;
      let cur = 0;
      tops.forEach((top, i) => {
        // 1px tolerance for sub-pixel jitter at the exact section top.
        if (top <= sy + 1) cur = i;
      });
      const nextIdx = cur + 1;
      if (nextIdx >= els.length) return; // nothing ahead to snap to
      const nextTop = tops[nextIdx];
      if (nextTop > sy + vh) return; // next not in view yet -> mid-section, skip
      armed = false; // consume; require a near-stop before the next snap
      isSnapping = true;
      setSnapping(true);
      lenis.scrollTo(nextTop, {
        duration: SNAP_DURATION_S,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        lock: true,
        onComplete: () => {
          isSnapping = false;
          setSnapping(false);
        },
      });
    };

    let lastScroll = window.scrollY;
    const onScroll = () => {
      const sy = window.scrollY;
      const dir = sy >= lastScroll ? 1 : -1;
      lastScroll = sy;
      const tops = sectionTops();
      syncBg(true, dir, tops);
      maybeSnapForward(tops);
    };
    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
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
