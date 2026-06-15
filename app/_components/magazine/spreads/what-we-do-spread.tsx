import Link from "next/link";
import { gtFormats, mtFormats, pillars } from "@/content/en/capabilities";
import { PillarPhoto } from "@/app/_components/magazine/media/pillar-photo";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";

type PillarMeta = {
  photo: { src: string; alt: string; objectPosition?: string };
  stat: string;
  display: string;
  /** Italic continuation sentence appended after the shortBody — keeps the
      formats / facets visible without taking a separate block. */
  formats: string;
};

const PILLAR_META: Record<string, PillarMeta> = {
  "Warehouse & Logistics": {
    photo: {
      src: "/photos/people/facility/warehouse-dock.webp",
      alt: "Loading pallets at a Richfield distribution centre.",
      objectPosition: "center 55%",
    },
    stat: "TWO DCS · LONG AN · HANOI",
    display: "Warehouse & Logistics",
    formats: "Ambient, cold storage 18–25°C, co-packing.",
  },
  "General Trade": {
    photo: {
      src: "/photos/people/facility/general-trade-store.webp",
      alt: "A traditional-trade neighbourhood store stocked with brands.",
      objectPosition: "center 50%",
    },
    stat: "180,000+ POINTS · 300+ SUB-DISTRIBUTORS",
    display: "General Trade",
    formats: `${gtFormats.slice(0, 4).join(", ").toLowerCase()}.`,
  },
  "Modern Trade": {
    photo: {
      src: "/photos/people/facility/modern-trade-aisle.webp",
      alt: "Shoppers in a modern-trade supermarket aisle.",
      objectPosition: "center 50%",
    },
    stat: "EVERY CHAIN IN VIETNAM",
    display: "Modern Trade",
    formats: `${mtFormats.slice(0, 4).join(", ").toLowerCase()}.`,
  },
};

const INCLUDED_PILLARS = [
  "Warehouse & Logistics",
  "General Trade",
  "Modern Trade",
] as const;

const filteredPillars = pillars.filter((p) =>
  (INCLUDED_PILLARS as readonly string[]).includes(p.name),
);

export function WhatWeDoSpread() {
  return (
    <Spread id="what" bg="transparent" className="flex flex-col gap-y-[var(--v2-flow)]">
      {/* Headline block — hangs left with a wide right gutter. */}
      <div className="flex flex-col gap-y-[var(--v2-rhythm)] hyphens-auto" lang="en">
        <Eyebrow tone="gold">WHAT WE DO</Eyebrow>

        <h2 className="font-display v2-size-standfirst text-balance">
          Three ways we move brands to{" "}
          <em className="italic text-gold-strong">markets</em>.
        </h2>

        <p className="v2-size-body text-justify opacity-90">
          Richfield Group began as a family business in Malaysia and has grown
          across three generations. Today we operate as one of the largest FMCG
          distributors in Vietnam, backed by an international group with deep
          local knowledge of every market we serve.
        </p>
      </div>

      {/* Three pillar columns — pillar leads with the image, then long body and
          a quiet folio stat line. */}
      <div className="v2-pillar-row hyphens-auto grid grid-cols-1 gap-x-[clamp(24px,2.8vw,48px)] gap-y-[var(--v2-flow)] lg:grid-cols-3" lang="en">
          {filteredPillars.map((p, i) => {
            const meta = PILLAR_META[p.name];
            return (
              <Link
                key={p.name}
                href={p.href}
                className="group flex flex-col gap-[clamp(12px,1.2vw,18px)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden outline outline-1 -outline-offset-1 outline-black/10">
                  <PillarPhoto
                    src={meta.photo.src}
                    alt={meta.photo.alt}
                    objectPosition={meta.photo.objectPosition}
                    delay={i * 0.16}
                  />
                </div>

                <h3 className="font-display flex items-center gap-2 text-[clamp(1.3rem,1.7vw,1.55rem)] leading-[1.1] tracking-[-0.018em] transition-colors duration-[700ms] ease-[var(--ease-out-expo)] group-hover:text-gold-strong">
                  {meta.display}
                  <span aria-hidden className="text-gold-strong opacity-0 transition-[translate,opacity] duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
                </h3>

                <p className="v2-size-body text-justify opacity-90">
                  {p.shortBody}
                  {/* <span className="v2-italic opacity-70">{meta.formats}</span> */}
                </p>

                <p className="v2-mono v2-size-folio mt-auto opacity-55">
                  {meta.stat}
                </p>
              </Link>
            );
          })}
      </div>
    </Spread>
  );
}
