"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth scroll for /v2 — the Framer-SaaS feel.
 *
 * Initializes Lenis on mount, hooks its tick into rAF, and tears down on
 * unmount. Respects `prefers-reduced-motion: reduce` by skipping the
 * Lenis lifecycle entirely (native scroll wins).
 *
 * The smooth-scroll engine can also be turned off at runtime via the
 * `enabled` flag (driven by the on-page ScrollToggle). When off, Lenis is
 * destroyed and the browser's native scroll takes over; scroll-triggered
 * fade-ins keep working because they ride IntersectionObserver, not Lenis.
 *
 * Exposes the Lenis instance through `useLenis()` (null whenever Lenis is
 * not running) and the toggle through `useSmoothScroll()`.
 */

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  enabled: true,
  setEnabled: () => {},
});

export function useLenis(): Lenis | null {
  return useContext(SmoothScrollContext).lenis;
}

export function useSmoothScroll(): {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
} {
  const { enabled, setEnabled } = useContext(SmoothScrollContext);
  return { enabled, setEnabled };
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // smoothWheel default true; touch scroll keeps native.
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- subscribing to a Lenis instance created in this effect; consumers need the live ref
    setLenis(instance);

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, [enabled]);

  return (
    <SmoothScrollContext.Provider value={{ lenis, enabled, setEnabled }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
