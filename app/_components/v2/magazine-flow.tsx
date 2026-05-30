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
import Snap from "lenis/snap";
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

    let currentIndex = -1;

    // Active section = the most recent section whose top has been passed.
    // Reading inside a section keeps bg locked; crossing a seam flips it.
    const activeSectionIndex = () => {
      const sy = window.scrollY;
      let best = 0;
      els.forEach((el, i) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        // 1px tolerance for sub-pixel jitter at the exact section top.
        if (top <= sy + 1) best = i;
      });
      return best;
    };

    const syncBg = (animated: boolean) => {
      const next = activeSectionIndex();
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

    // Initialise immediately so first-paint bg matches whatever section the
    // user is looking at (handles deep-links to a #section anchor).
    syncBg(false);

    const onScroll = () => syncBg(true);
    lenis.on("scroll", onScroll);

    const snap = new Snap(lenis, {
      type: "mandatory",
      duration: SNAP_DURATION_S,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      onSnapStart: () => setSnapping(true),
      onSnapComplete: () => setSnapping(false),
    });

    const removers = els.map((el) => snap.addElement(el, { align: ["start"] }));

    return () => {
      removers.forEach((remove) => remove());
      snap.destroy();
      lenis.off("scroll", onScroll);
    };
  // bg motion value and sections list are stable across renders for the
  // same children. Restricting deps to lenis/reduce avoids rebuilding the
  // snap instance on every parent re-render.
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
