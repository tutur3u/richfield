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
