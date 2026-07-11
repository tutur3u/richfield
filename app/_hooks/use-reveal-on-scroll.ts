"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

// useLayoutEffect runs on the client; useEffect is a safe no-op for SSR
// so React doesn't warn during server render.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Reveal-on-scroll via IntersectionObserver.
 *
 * SSR / no-JS: content renders visible (no `--armed` class), so crawlers,
 * screenshot tools, and reduced-motion users always see content.
 *
 * Client: in `useLayoutEffect` (sync, pre-paint) we measure the element.
 * If it's already in the viewport we leave it alone. Otherwise we add
 * `reveal--armed` via direct classList before the browser paints — this
 * avoids the flash-of-visible-then-hidden that a React state toggle would
 * produce. The IntersectionObserver removes `--armed` once the element
 * scrolls into view, triggering the CSS transition.
 *
 * Honors `prefers-reduced-motion`.
 */
export function useRevealOnScroll<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Clear any stale armed state from a prior effect run before deciding
    // afresh. Strict Mode double-invokes this effect (dev), and during a
    // client-side navigation the first run can measure the element out of
    // view (scroll isn't reset to the top yet) and arm it; without this
    // reset, the second run's `startsInView` early-return would leave that
    // arm in place with no observer to ever remove it — a permanently
    // invisible (opacity 0) section.
    el.classList.remove("reveal--armed");

    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const startsInView =
      rect.top < window.innerHeight && rect.bottom > 0;
    if (startsInView) return;

    el.classList.add("reveal--armed");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.remove("reveal--armed");
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  // `armed` stays false at the React level so SSR markup only ever
  // contains `reveal` (visible). The `--armed` class is applied
  // imperatively on the client.
  return { ref, armed: false } as const;
}
