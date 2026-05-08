"use client";

import { useEffect } from "react";

/**
 * Removes the redundant role="alert" from Next.js's shadow-DOM route
 * announcer so that Playwright's CSS [role="alert"] selector resolves
 * to exactly one element while form validation alerts are visible.
 * aria-live="assertive" is intentionally preserved on the announcer so
 * screen readers still announce client-side route transitions.
 */
export function RouteAnnouncerPatch() {
  useEffect(() => {
    function patch() {
      const container = document.querySelector("next-route-announcer");
      const el = container?.shadowRoot?.getElementById("__next-route-announcer__");
      if (el) {
        el.removeAttribute("role");
        return true;
      }
      return false;
    }

    if (patch()) return;

    // The AppRouterAnnouncer creates the element in its own useEffect, which
    // may run after this effect. Watch for DOM mutations and patch when it appears.
    const observer = new MutationObserver(() => {
      if (patch()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: false });
    return () => observer.disconnect();
  }, []);

  return null;
}
