"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { partnerLogos } from "@/content/en/photography";
import {
  shelfCategories,
  type BannerWeight,
  type ShelfBanner,
  type ShelfCategory,
  type ShelfPackshot,
} from "@/content/en/shelf";

// --- Masonry geometry -------------------------------------------------------
// A 12-column dense grid on desktop, packed by JS-computed row spans so every
// tile keeps its native aspect ratio (no cropping) while sizes vary. Banner
// tiles span by editorial weight; packshot boxes are square. Heights are
// derived from the measured column width, so the layout reflows on resize.

const GAP = 14; // px — must match the inline `gap` below for the row math.
const ROW_UNIT = 8; // px — auto-row height; smaller = finer packing.

type Metrics = { cols: number; colWidth: number };

function colsFor(width: number): number {
  if (width < 640) return 2;
  if (width < 1024) return 6;
  return 12;
}

// Column span for a tile, by kind and column count. Every span is a multiple
// of the base column unit (4 of 12 on desktop = a 3-column field, 3 of 6 on
// tablet = 2 columns), so banners (1 or 2 units wide) and boxes (1 unit)
// always tile to a full row and the dense flow leaves no holes.
function spanFor(kind: BannerWeight | "box", cols: number): number {
  if (cols <= 2) return kind === "box" ? 1 : 2;
  if (cols <= 6) {
    return { hero: 6, wide: 3, feature: 3, box: 3 }[kind];
  }
  return { hero: 8, wide: 4, feature: 4, box: 4 }[kind];
}

function useGridMetrics(): [React.RefObject<HTMLDivElement | null>, Metrics] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({ cols: 12, colWidth: 110 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth;
      if (width === 0) return;
      const cols = colsFor(window.innerWidth);
      const colWidth = (width - GAP * (cols - 1)) / cols;
      setMetrics((prev) =>
        prev.cols === cols && Math.abs(prev.colWidth - colWidth) < 0.5
          ? prev
          : { cols, colWidth },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return [ref, metrics];
}

function tileWidth(colSpan: number, colWidth: number): number {
  return colSpan * colWidth + (colSpan - 1) * GAP;
}

function rowSpanFor(heightPx: number): number {
  return Math.max(1, Math.round((heightPx + GAP) / (ROW_UNIT + GAP)));
}

// --- Tiles ------------------------------------------------------------------

function BannerTile({
  banner,
  metrics,
}: {
  banner: ShelfBanner;
  metrics: Metrics;
}) {
  const colSpan = spanFor(banner.weight, metrics.cols);
  const w = tileWidth(colSpan, metrics.colWidth);
  const rowSpan = rowSpanFor(w / banner.ratio);
  const style: CSSProperties = {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
  };
  return (
    <figure className="group relative overflow-hidden" style={style}>
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        sizes="(min-width:1024px) 40vw, (min-width:640px) 50vw, 100vw"
        className="v2-photo-tint object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />
    </figure>
  );
}

function PackshotTile({
  packshot,
  metrics,
}: {
  packshot: ShelfPackshot;
  metrics: Metrics;
}) {
  const colSpan = spanFor("box", metrics.cols);
  const w = tileWidth(colSpan, metrics.colWidth);
  const rowSpan = rowSpanFor(w); // square box
  const style: CSSProperties = {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
  };
  return (
    <figure
      className="group relative overflow-hidden border border-current/12 transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold/55"
      style={{
        ...style,
        background: "color-mix(in oklch, currentColor 3.5%, transparent)",
      }}
    >
      <Image
        src={packshot.src}
        alt={packshot.alt}
        fill
        sizes="(min-width:1024px) 22vw, (min-width:640px) 30vw, 45vw"
        className="object-contain p-[clamp(8px,1vw,18px)] pb-[clamp(20px,2vw,34px)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklch, currentColor 6%, transparent) 0%, transparent 100%)",
        }}
      />
      <figcaption className="v2-mono v2-size-folio absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 py-2 opacity-75">
        <span className="truncate">{packshot.name}</span>
        <span className="shrink-0 opacity-55">{packshot.brand}</span>
      </figcaption>
    </figure>
  );
}

// Interleave banners and packshots so the dense grid mixes the two treatments
// rather than clustering all banners then all boxes.
type Tile =
  | { type: "banner"; data: ShelfBanner }
  | { type: "packshot"; data: ShelfPackshot };

function interleave(category: ShelfCategory): Tile[] {
  const banners: Tile[] = category.banners.map((b) => ({ type: "banner", data: b }));
  const packs: Tile[] = category.packshots.map((p) => ({ type: "packshot", data: p }));
  const out: Tile[] = [];
  // Lead with the hero banner if present, then weave ~2 boxes per banner.
  const ratio = packs.length && banners.length ? Math.ceil(packs.length / banners.length) : 1;
  let bi = 0;
  let pi = 0;
  while (bi < banners.length || pi < packs.length) {
    if (bi < banners.length) out.push(banners[bi++]);
    for (let k = 0; k < ratio && pi < packs.length; k++) out.push(packs[pi++]);
  }
  return out;
}

// --- Explorer ---------------------------------------------------------------

export function ShelfExplorer() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const [gridRef, metrics] = useGridMetrics();
  const category = shelfCategories[active];
  const tiles = interleave(category);

  // Switching category should start the shelf from the top, not wherever the
  // previous category was scrolled to.
  useEffect(() => {
    if (gridRef.current) gridRef.current.scrollTop = 0;
  }, [active, gridRef]);

  return (
    <div className="flex flex-1 flex-col lg:min-h-0">
      {/* Masthead row — headline left, the Coca-Cola "all brands" category
          filter right, sharing one baseline to save vertical room. */}
      <div className="flex shrink-0 flex-col gap-x-10 gap-y-4 border-b border-current/12 pb-[clamp(8px,1vw,14px)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="v2-mono v2-size-eyebrow mb-[clamp(4px,0.5vw,8px)] flex items-center gap-3 text-gold-strong">
            <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
            THE PORTFOLIO
          </p>
          <h2 className="font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.026em]">
            The full shelf.
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Product categories"
          className="flex flex-wrap items-end gap-x-[clamp(18px,2.4vw,40px)] gap-y-2"
        >
          {shelfCategories.map((cat, i) => {
            const selected = i === active;
            return (
              <button
                key={cat.id}
                role="tab"
                id={`${baseId}-tab-${cat.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className="group relative flex items-baseline gap-1.5 pb-[clamp(6px,0.7vw,12px)] outline-none"
              >
                <span
                  className={`font-display text-[clamp(1.2rem,1.8vw,1.7rem)] leading-none tracking-[-0.02em] transition-opacity duration-300 ${
                    selected ? "text-ink opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {cat.label}
                </span>
                <span className="v2-mono text-[clamp(10px,0.8vw,12px)] opacity-50">
                  {cat.brands.length}
                </span>
                <span
                  aria-hidden
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    selected ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Active panel */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${category.id}`}
        className="flex flex-1 flex-col pt-[clamp(10px,1.3vw,18px)] lg:min-h-0"
      >
        <h3 className="sr-only">{category.label}</h3>

        {/* Descriptor + brand roster for the active category. */}
        <div className="mb-[clamp(10px,1.2vw,18px)] flex shrink-0 flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p className="v2-size-body max-w-[34ch] text-[clamp(13px,0.95vw,15px)] leading-[1.5] opacity-65">
            {category.descriptor}
          </p>
          <div
            role="region"
            aria-label={`${category.label} brands`}
            className="flex flex-wrap items-center gap-x-[clamp(16px,2vw,32px)] gap-y-3"
          >
            {category.brands.map((name) => {
              const src = partnerLogos[name];
              return src ? (
                <span
                  key={name}
                  className="relative block h-[clamp(16px,1.7vw,26px)] w-[clamp(52px,5.5vw,90px)]"
                >
                  <Image
                    src={src}
                    alt={name}
                    fill
                    sizes="100px"
                    className="object-contain object-left"
                    // style={{ filter: "grayscale(1) contrast(1.05)", opacity: 0.7 }}
                  />
                </span>
              ) : (
                <span key={name} className="v2-mono v2-size-folio opacity-55">
                  {name}
                </span>
              );
            })}
          </div>
        </div>

        {/* The mosaic. On desktop it scrolls inside the spread (data-lenis-prevent
            keeps the page's snap intact) so a long shelf never breaks the
            one-viewport rhythm; on smaller screens the spread grows naturally. */}
        <div className="relative lg:min-h-0 lg:flex-1">
          <div
            ref={gridRef}
            data-lenis-prevent
            role="region"
            aria-label={`${category.label} products`}
            className="grid [scrollbar-width:thin] lg:h-full lg:overflow-y-auto lg:pb-[clamp(24px,3vw,44px)]"
            style={{
              gridTemplateColumns: `repeat(${metrics.cols}, minmax(0, 1fr))`,
              gridAutoRows: `${ROW_UNIT}px`,
              gridAutoFlow: "row dense",
              gap: `${GAP}px`,
            }}
          >
            {tiles.map((tile) =>
              tile.type === "banner" ? (
                <BannerTile key={tile.data.src} banner={tile.data} metrics={metrics} />
              ) : (
                <PackshotTile key={tile.data.src} packshot={tile.data} metrics={metrics} />
              ),
            )}
          </div>
          {/* Soft fade hinting there's more shelf below the fold. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[clamp(28px,4vw,56px)] lg:block"
            style={{
              background:
                "linear-gradient(to top, oklch(0.96 0.018 82), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
