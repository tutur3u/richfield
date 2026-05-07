"use client";

import { useRef } from "react";

/**
 * Returns a ref. The wrapper component renders content visible on
 * server and on client; we deliberately do not arm a hidden state.
 *
 * Earlier versions hid below-fold content until an IntersectionObserver
 * fired, but that created a flash-of-hidden-content on hydration and
 * broke discovery for crawlers, no-JS users, and screenshot tools.
 * The visual reveal was a nice-to-have; visibility is not.
 *
 * The hook stays in place so callers can later opt into a different
 * reveal strategy (CSS @starting-style, GSAP timeline) without
 * touching every consumer.
 */
export function useRevealOnScroll<T extends HTMLElement>(_threshold = 0.15) {
  const ref = useRef<T>(null);
  return { ref, armed: false } as const;
}
