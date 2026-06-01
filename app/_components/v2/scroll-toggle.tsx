"use client";

import { useSmoothScroll } from "./lenis-provider";

/**
 * On-page switch to turn the Lenis smooth-scroll engine on or off. Off falls
 * back to native browser scrolling; content fade-ins keep working either way.
 */
export function ScrollToggle() {
  const { enabled, setEnabled } = useSmoothScroll();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Smooth scrolling"
      onClick={() => setEnabled(!enabled)}
      className="v2-mono v2-size-folio fixed bottom-4 right-4 z-50 inline-flex items-center gap-3 rounded-full border border-cream/25 bg-ink/70 px-4 py-2 text-cream backdrop-blur-md transition-colors duration-200 hover:border-gold/70 sm:bottom-6 sm:right-6"
    >
      <span className="opacity-80">SMOOTH SCROLL</span>
      <span
        aria-hidden
        className={`relative inline-block h-4 w-7 rounded-full border transition-colors duration-200 ${
          enabled ? "border-gold bg-gold/25" : "border-cream/40 bg-cream/10"
        }`}
      >
        <span
          className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-all duration-200 ease-out ${
            enabled ? "left-[14px] bg-gold" : "left-[3px] bg-cream/70"
          }`}
        />
      </span>
    </button>
  );
}
