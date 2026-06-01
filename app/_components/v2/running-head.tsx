"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// How early the running head flips to the next section as you scroll, as a
// fraction of a viewport. Mirrors MagazineFlow's SWITCH_FRACTION so the bar's
// active chapter + dark/light styling stay in lockstep with the global
// background morph — no white-text-on-light flashes mid-transition.
const SWITCH_FRACTION = 0.15;

// One entry per scrollable section (7 — the directory is two spreads). `chapter`
// indexes into CHAPTERS; `dark` mirrors each MagazineFlowSection's textOnDark so
// the bar inverts the logo + flips text colour over the two ink spreads.
const SECTIONS = [
  { id: "lead", chapter: 0, dark: false },
  { id: "what", chapter: 1, dark: true },
  { id: "atlas", chapter: 2, dark: false },
  { id: "brands", chapter: 3, dark: false },
  { id: "brands-shelf", chapter: 3, dark: false },
  { id: "jv", chapter: 4, dark: true },
  { id: "colophon", chapter: 5, dark: false },
] as const;

// The chapter index shown on the right. Each links to its first section.
const CHAPTERS = [
  { label: "About Us", href: "#lead" },
  { label: "What We Do", href: "#what" },
  { label: "Footprint", href: "#atlas" },
  { label: "Portfolio", href: "#brands" },
  { label: "Joint Venture", href: "#jv" },
  { label: "Colophon", href: "#colophon" },
] as const;

/**
 * Persistent masthead pinned to the top of the /v2 flow (below the cover).
 * Left: the Richfield logo. Right: the chapter index — full row with a gold
 * underline that slides to the active chapter on wide screens, collapsing to
 * just the current chapter name on narrow screens. A single passive scroll
 * listener drives both the active chapter and the bar's appearance, so it works
 * under Lenis, native scroll, and reduced motion alike.
 */
export function RunningHead() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let lastScroll = window.scrollY;

    const update = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const dir = sy >= lastScroll ? 1 : -1;
      lastScroll = sy;

      // Resolve sections fresh each tick: MagazineFlow recreates its <section>
      // nodes when smooth scroll toggles, so cached refs would go stale (a
      // detached node reports a zero rect, collapsing every top onto the
      // scroll position and pinning the active chapter to the last one).
      const tops = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        return el
          ? el.getBoundingClientRect().top + sy
          : Number.POSITIVE_INFINITY;
      });

      // Active = last section whose top has crossed the switch line. The line
      // sits 85% down the viewport going forward / 15% going back, matching the
      // background morph so colour + label flip together.
      const offset = dir >= 0 ? vh * (1 - SWITCH_FRACTION) : vh * SWITCH_FRACTION;
      let best = 0;
      tops.forEach((top, i) => {
        if (top <= sy + offset) best = i;
      });
      setIndex((prev) => (prev === best ? prev : best));

      // Show once the cover is mostly behind us (the first section is closing
      // in on the top of the viewport); hidden over the cover, which carries
      // its own masthead.
      const leadTop = tops[0];
      const show = Number.isFinite(leadTop) && sy > leadTop - vh * 0.4;
      setVisible((prev) => (prev === show ? prev : show));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const active = SECTIONS[index];
  const dark = active.dark;
  const activeChapter = active.chapter;

  return (
    <motion.div
      aria-hidden={!visible}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: EASE_OUT_EXPO }}
      className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${dark ? "border-cream/10 bg-ink/55" : "border-ink/10 bg-cream/70"} ${visible ? "" : "pointer-events-none"}`}
      style={{ height: "var(--v2-runhead)" }}
    >
      <div
        className={`mx-auto flex h-full max-w-[1500px] items-center justify-between gap-6 px-6 transition-colors duration-300 sm:px-10 lg:px-12 ${dark ? "text-cream" : "text-ink"}`}
      >
        {/* Masthead logo — inverts to white over the dark spreads. */}
        <a href="#lead" aria-label="Richfield — top of issue" className="shrink-0">
          <Image
            src="/photos/logos/richfield.webp"
            alt="Richfield Group"
            width={120}
            height={110}
            className={`h-[clamp(46px,4.4vw,56px)] w-auto object-contain transition duration-300 ${dark ? "brightness-0 invert" : ""}`}
          />
        </a>

        {/* Wide: full chapter row with a sliding gold underline. */}
        <nav
          aria-label="Issue contents"
          className="hidden items-center gap-[clamp(14px,1.4vw,24px)] lg:flex"
        >
          {CHAPTERS.map((c, i) => {
            const isActive = i === activeChapter;
            return (
              <a
                key={c.href}
                href={c.href}
                aria-current={isActive ? "location" : undefined}
                className="v2-mono v2-size-folio relative"
              >
                <span
                  className={
                    isActive
                      ? "opacity-100"
                      : "opacity-50 transition-opacity duration-200 hover:opacity-80"
                  }
                >
                  {c.label}
                </span>
                {isActive ? (
                  <motion.span
                    aria-hidden
                    layoutId="runhead-underline"
                    className="absolute -bottom-1.5 left-0 right-0 block h-px bg-gold-strong"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 480, damping: 42 }
                    }
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        {/* Narrow: just the current chapter name, crossfading on change. */}
        <div className="overflow-hidden lg:hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.a
              key={activeChapter}
              href={CHAPTERS[activeChapter].href}
              className="v2-mono v2-size-folio block whitespace-nowrap"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT_EXPO }}
            >
              {CHAPTERS[activeChapter].label}
            </motion.a>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
