import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

// ---------------------------------------------------------------------------
// useCarouselScroll — drives a horizontal scroll-snap carousel that is smoothly
// scrollable by hand (touch / trackpad natively; mouse via drag-to-scroll) and
// also auto-advances on a timer. Auto-advance pauses while the pointer is over
// the track, while it has focus, and while the user is dragging or scrolling.
// Honours prefers-reduced-motion (no auto-advance, no smooth animation).
//
// The caller renders a flex/overflow-x-auto track with one full-width snap
// slide per item and spreads `handlers` onto it; `active` drives the dots and
// `goTo(i)` scrolls to a slide.
// ---------------------------------------------------------------------------

type Options = { intervalMs?: number };

export function useCarouselScroll(
  ref: RefObject<HTMLElement | null>,
  length: number,
  { intervalMs = 6500 }: Options = {},
) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const reduceRef = useRef(false);

  const indexFromScroll = (el: HTMLElement) =>
    el.clientWidth > 0 ? Math.round(el.scrollLeft / el.clientWidth) : 0;

  const goTo = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(length - 1, i));
      el.scrollTo({
        left: clamped * el.clientWidth,
        behavior: reduceRef.current ? "auto" : "smooth",
      });
    },
    [ref, length],
  );

  // Track the active slide as the track scrolls (rAF-throttled).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    reduceRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setActive(Math.max(0, Math.min(length - 1, indexFromScroll(el))));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, length]);

  // Auto-advance, paused on hover / focus / drag / reduced-motion.
  useEffect(() => {
    if (length <= 1) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el || pausedRef.current || draggingRef.current) return;
      const next = (indexFromScroll(el) + 1) % length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [ref, length, intervalMs]);

  // Mouse drag-to-scroll (touch & trackpad already scroll natively).
  const drag = useRef({ down: false, startX: 0, startLeft: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    draggingRef.current = true;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft };
    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current.down) return;
    const el = ref.current;
    if (!el) return;
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };

  const endDrag = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    draggingRef.current = false;
    const el = ref.current;
    if (el) goTo(indexFromScroll(el));
  };

  const handlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onMouseEnter: () => {
      pausedRef.current = true;
    },
    onMouseLeave: () => {
      pausedRef.current = false;
      endDrag();
    },
    onFocus: () => {
      pausedRef.current = true;
    },
    onBlur: () => {
      pausedRef.current = false;
    },
  };

  return { active, goTo, handlers };
}
