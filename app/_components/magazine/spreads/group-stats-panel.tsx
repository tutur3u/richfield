import {
  ChartLineUp,
  UsersThree,
  Handshake,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { groupStats } from "@/content/en/stats";

// One premium line-icon per headline figure, in the same order as groupStats:
// steady growth, the workforce, the distributor network, the retail footprint.
const STAT_ICONS: readonly Icon[] = [
  ChartLineUp,
  UsersThree,
  Handshake,
  Storefront,
];

// A gentle organic wave drawn along an edge of the beige panel. The top copy
// is filled white (the page above), the bottom copy is flipped and filled paper
// (the next chapter) — so each curve is the seam, with no third-colour band.
const WAVE_PATH =
  "M0,24 C120,38 240,38 360,24 C480,10 600,10 720,24 C840,38 960,38 1080,24 C1200,10 1320,10 1440,24 L1440,0 L0,0 Z";

function Wave({ edge }: { edge: "top" | "bottom" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className={`absolute inset-x-0 z-[2] h-[clamp(24px,4vw,48px)] w-full ${
        edge === "top" ? "top-0 fill-white" : "bottom-0 -scale-y-100 fill-paper"
      }`}
    >
      <path d={WAVE_PATH} />
    </svg>
  );
}

function StatFigure({
  figure,
  label,
  Icon,
}: {
  figure: string;
  label: string;
  Icon?: Icon;
}) {
  // The first/last cells bleed to the viewport edges so their hover wash runs
  // full width; the rest are bounded by the hairline dividers. Cell padding
  // (not the <dl>) carries the height, so the wash fills wave-to-wave.
  return (
    <div className="group flex flex-col justify-center gap-2 overflow-hidden border-l border-line/70 py-[clamp(32px,4.5vw,48px)] pl-[clamp(16px,2vw,32px)] pr-[clamp(12px,1.6vw,24px)] transition-colors duration-300 ease-out hover:bg-[oklch(0.90_0.035_82)] [&:nth-child(odd)]:border-l-0 lg:py-[clamp(52px,6vw,80px)] lg:[&:nth-child(3)]:border-l lg:[&:first-child]:-ml-[calc(max((100vw-1500px)/2,0px)+48px)] lg:[&:first-child]:pl-[calc(max((100vw-1500px)/2,0px)+48px+clamp(16px,2vw,32px))] lg:[&:last-child]:-mr-[calc(max((100vw-1500px)/2,0px)+48px)] lg:[&:last-child]:pr-[calc(max((100vw-1500px)/2,0px)+48px+clamp(12px,1.6vw,24px))]">
      <div className="relative isolate flex flex-col gap-2">
        {Icon ? (
          <Icon
            aria-hidden
            weight="light"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[clamp(5.5rem,10vw,10rem)] text-gold-strong opacity-[0.05]"
          />
        ) : null}
        <dt className="font-display origin-left bg-[linear-gradient(165deg,var(--color-gold)_0%,var(--color-gold-rule)_95%)] bg-clip-text text-[clamp(2rem,4.3vw,4rem)] leading-[0.9] tracking-[-0.02em] text-transparent transition-transform duration-300 ease-out group-hover:scale-[1.04]">
          {figure}
        </dt>
        <dd className="v2-size-body opacity-80 transition-opacity duration-300 ease-out group-hover:opacity-100">
          {label}
        </dd>
      </div>
    </div>
  );
}

/**
 * The headline figures, on a full-bleed beige panel the page waves into on both
 * edges. Giant gold numerals sit over a faint icon watermark; hovering a figure
 * washes its whole column (wave-to-wave) in a bolder beige.
 */
export function GroupStatsPanel() {
  return (
    <div className="v2-bleed-x relative overflow-hidden bg-cream">
      <Wave edge="top" />
      <dl className="relative z-[1] mx-auto grid max-w-[1500px] grid-cols-2 px-6 sm:px-10 lg:grid-cols-4 lg:px-12">
        {groupStats.map(([figure, label], i) => (
          <StatFigure
            key={label}
            figure={figure}
            label={label}
            Icon={STAT_ICONS[i]}
          />
        ))}
      </dl>
      <Wave edge="bottom" />
    </div>
  );
}
