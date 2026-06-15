import type { CSSProperties, ReactNode } from "react";

// Two fixed-height wave silhouettes (top edge, bottom edge) plus a solid middle,
// composited as a CSS mask. The waves stay a constant height at any viewport
// (they don't stretch with the band), so a tall stacked band on mobile keeps the
// same crisp edge as a short row on desktop, and the mask never slices into the
// content. The cut areas above/below the waves reveal whatever is behind (the
// page gradient), so the band never depends on the surface it sits on.
const WAVE_TOP =
  "url(\"data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%201440%2040'%20preserveAspectRatio%3D'none'%3E%3Cpath%20fill%3D'black'%20d%3D'M0%2C24%20C200%2C0%20360%2C0%20540%2C20%20C720%2C40%20900%2C40%201080%2C20%20C1240%2C2%201340%2C2%201440%2C16%20L1440%2C40%20L0%2C40%20Z'%2F%3E%3C%2Fsvg%3E\")";
const WAVE_BOT =
  "url(\"data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%201440%2040'%20preserveAspectRatio%3D'none'%3E%3Cpath%20fill%3D'black'%20d%3D'M0%2C0%20L1440%2C0%20L1440%2C24%20C1240%2C40%201080%2C40%20900%2C20%20C720%2C0%20540%2C0%20360%2C20%20C200%2C38%20100%2C38%200%2C24%20Z'%2F%3E%3C%2Fsvg%3E\")";

const MASK = `${WAVE_TOP}, linear-gradient(#000, #000), ${WAVE_BOT}`;
const WH = "clamp(20px, 3.2vw, 44px)";
const SIZE = `100% ${WH}, 100% calc(100% - ${WH} - ${WH}), 100% ${WH}`;

const maskStyle: CSSProperties = {
  WebkitMaskImage: MASK,
  maskImage: MASK,
  WebkitMaskPosition: "top, center, bottom",
  maskPosition: "top, center, bottom",
  WebkitMaskSize: SIZE,
  maskSize: SIZE,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
};

/**
 * A full-bleed band whose top and bottom edges are crisp, curvy organic waves.
 * The mask clips the band, its fill, and any per-column hover wash to the wave
 * silhouette, so the cut edges reveal the page background behind them. Nothing
 * here paints the page background, so a morphing gradient keeps working
 * underneath and the waves never depend on the surface they sit on. `fill` sets
 * the band colour.
 */
export function WavyBand({
  children,
  className = "",
  fill = "oklch(0.84 0.055 82 / 0.5)",
}: {
  children: ReactNode;
  className?: string;
  fill?: string;
}) {
  return (
    <div
      className={`v2-bleed-x relative overflow-hidden ${className}`}
      style={{ ...maskStyle, backgroundColor: fill }}
    >
      {children}
    </div>
  );
}
