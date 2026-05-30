import { gtFormats, mtFormats, pillars } from "@/content/en/capabilities";
import { PillarPhoto } from "@/app/_components/v2/pillar-photo";

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
      src: "/photos/people/workshop-room-1280.webp",
      alt: "Inside a Richfield workspace — the rooms behind the network.",
      objectPosition: "center 45%",
    },
    stat: "TWO DCS · LONG AN · HANOI",
    display: "Warehouse & Logistics",
    formats: "Ambient, cold storage 18–25°C, co-packing.",
  },
  "General Trade": {
    photo: {
      src: "/photos/people/workshop-1-1280.webp",
      alt: "Sales team in a working session.",
      objectPosition: "center 40%",
    },
    stat: "180,000 OUTLETS · 800+ SALESMEN",
    display: "General Trade",
    formats: `${gtFormats.slice(0, 4).join(", ").toLowerCase()}.`,
  },
  "Modern Trade": {
    photo: {
      src: "/photos/people/workshop-2-1280.webp",
      alt: "Cross-functional planning workshop.",
      objectPosition: "center 40%",
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
    <section
      id="what"
      className="v2-display relative flex min-h-[100svh] w-full flex-col"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-between px-6 py-[clamp(24px,3.5vw,48px)] sm:px-10 lg:px-12">
        {/* Top folio */}
        <header className="v2-mono v2-size-folio flex items-center gap-6 opacity-55">
          <span>RICHFIELD WORLDWIDE JSC</span>
          <span aria-hidden className="v2-rule flex-1" />
        </header>

        {/* Headline block — full width. */}
          <div className="hyphens-auto" lang="en">
            <p className="v2-mono v2-size-eyebrow mb-[clamp(10px,0.9vw,16px)] flex items-center gap-3 text-gold">
              <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
              WHAT WE DO
            </p>

            <h2 className="font-display mb-[clamp(14px,1.4vw,22px)] text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.026em] lg:whitespace-nowrap">
              Three ways we move brands to <em className="italic text-gold-strong">markets</em>.
            </h2>

            <p className="v2-size-body text-justify opacity-90">
              Richfield Group began as a family business in Malaysia and has
              grown across three generations. Today we operate as one of the
              largest FMCG distributors in Vietnam, backed by an international
              group with deep local knowledge of every market we serve.
            </p>
          </div>

        {/* Three pillar columns — pillar leads with the image, then long
            body and a quiet italic details line that lists the retail
            formats (GT, MT) or storage facets (Warehouse). */}
        <div className="v2-pillar-row hyphens-auto grid grid-cols-1 gap-x-[clamp(24px,2.8vw,48px)] gap-y-[clamp(32px,3vw,44px)] lg:grid-cols-3" lang="en">
          {filteredPillars.map((p, i) => {
            const meta = PILLAR_META[p.name];
            return (
              <article
                key={p.name}
                className="group flex flex-col gap-[clamp(12px,1.2vw,18px)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <PillarPhoto
                    src={meta.photo.src}
                    alt={meta.photo.alt}
                    objectPosition={meta.photo.objectPosition}
                    delay={i * 0.16}
                  />
                </div>

                <h3 className="v2-display text-[clamp(1.3rem,1.7vw,1.55rem)] leading-[1.1] tracking-[-0.018em] transition-colors duration-[700ms] ease-[var(--ease-out-expo)] group-hover:text-gold-strong">
                  {meta.display}
                </h3>

                <p className="v2-size-body text-[clamp(15px,1.12vw,17px)] leading-[1.55] text-justify opacity-85">
                  {p.shortBody}
                  {/* <span className="v2-italic opacity-70">{meta.formats}</span> */}
                </p>

                <p className="v2-mono v2-size-folio mt-auto opacity-55">
                  {meta.stat}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
