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
 * Also exposes the Lenis instance through `LenisContext` so consumers
 * (e.g. MagazineCanvas registering snap targets) can reach it without a
 * global. Value is `null` until Lenis is initialized, and stays `null`
 * forever under reduced-motion — consumers must treat null as "no Lenis".
 */

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
