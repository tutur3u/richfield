import type { Metadata } from "next";
import Link from "next/link";
import { CoverSpread } from "@/app/_components/v2/cover-spread";
import { LenisProvider } from "@/app/_components/v2/lenis-provider";
import { LeadSpread } from "@/app/_components/v2/lead-spread";
import { MagazineCanvas } from "@/app/_components/v2/magazine-canvas";

// OKLCH color literals matching globals.css tokens. Hard-coded as strings
// because Motion's color interpolation needs literals (not CSS vars).
const CREAM = "oklch(0.96 0.018 82)";
const INK   = "oklch(0.22 0.015 158)";
const GOLD  = "oklch(0.74 0.115 82)";

export const metadata: Metadata = {
  title: "Richfield · Issue 30 · v2 preview",
  description:
    "Prototype of the Issue 30 · Worldwide editorial direction. Side-by-side comparison with the current homepage at /.",
  robots: { index: false, follow: false },
};

export default function V2HomePage() {
  return (
    <LenisProvider>
      <main className="bg-cream text-ink">
        {/* Preview banner — small fixed pill linking back to the current
            site for easy side-by-side comparison. */}
        <Link
          href="/"
          className="v2-mono v2-size-folio fixed left-4 top-4 z-50
                     rounded-full border border-cream/30 bg-ink/70 px-4 py-2
                     text-cream backdrop-blur-md
                     transition-colors duration-200 hover:bg-ink/90"
        >
          ← V2 PREVIEW · BACK TO CURRENT
        </Link>

        <CoverSpread />

        {/* One pinned canvas holding every spread after the cover. Each
            "page-turn" is an in-place cross-dissolve: the new spread takes
            the exact pixel real-estate of the previous one, while the bg
            interpolates between their surfaces. No inter-section dead
            air; one trackpad swipe per page-turn. */}
        <MagazineCanvas
          totalHeight="220svh"
          spreads={[
            { bg: CREAM, content: <LeadSpread /> },
            { bg: INK, textOnDark: true, content: <FeatureQuote /> },
            { bg: GOLD, content: <JVSpread /> },
            { bg: CREAM, content: <CloserColophon /> },
          ]}
        />
      </main>
    </LenisProvider>
  );
}

// ─── spread compositions (inline for now — extract if reused) ─────────

function FeatureQuote() {
  return (
    <div className="v2-display">
      <p className="v2-mono v2-size-eyebrow mb-8 text-gold opacity-90">
        <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-gold/80" />
        FIELD NOTE · A QUOTE
      </p>
      <blockquote className="v2-italic v2-size-feature max-w-[26ch] text-balance">
        &ldquo;A distributor is not a logistics company. We are the last hand
        that touches the brand before it reaches the person who chose it.&rdquo;
      </blockquote>
      <p className="v2-mono v2-size-folio mt-10 opacity-60">
        — INTERNAL · LEADERSHIP TOWN HALL · 2026
      </p>
    </div>
  );
}

function JVSpread() {
  return (
    <div className="v2-display w-full">
      <div className="v2-mono v2-size-folio mb-10 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 06—07 · STORY 02</span>
      </div>
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-7">
          <p className="v2-mono v2-size-eyebrow mb-6 flex items-center gap-3 opacity-80">
            <span aria-hidden className="inline-block h-px w-8 bg-ink/40" />
            THE JOINT VENTURE · STORY 02
          </p>
          <h2 className="v2-italic v2-size-feature max-w-[20ch] text-balance">
            Dory Rich — where distribution becomes manufacturing.
          </h2>
        </div>
        <p className="col-span-12 v2-size-body opacity-80 lg:col-span-4 lg:col-start-9 lg:pt-2">
          In 2024, Richfield and TCP formed Dory Rich JSC — a joint venture that
          brings manufacturing under the same umbrella that already carries the
          brands. One relationship, end-to-end.
        </p>
      </div>
    </div>
  );
}

function CloserColophon() {
  return (
    <p className="v2-mono v2-size-folio opacity-60">
      <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-ink/30" />
      COLOPHON · ISSUE 30 — RICHFIELD WORLDWIDE JSC · 1994 — 2026 · NEXT ISSUE · 2031
    </p>
  );
}
