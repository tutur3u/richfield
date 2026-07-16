"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locale";

/**
 * The two hubs as a sticky-media scrollytelling spread. On desktop the facility
 * photograph pins to the left, full-bleed (flush to the top, bottom, and left
 * edge), and crossfades as you scroll: whichever hub block is crossing the
 * viewport centre is "active", and scroll progress through that block advances
 * through the hub's own photo set. Below lg it collapses to a normal stack
 * (content then lead photo per hub). The location is the eyebrow.
 */
export function HubScrollytelling({ locale = "en" }: { locale?: Locale }) {
  const { warehouseHubs } = getContent(locale);

  // Flatten every hub photo into one ordered slide list; remember where each
  // hub's slides begin so an (activeHub, sub) pair maps to a flat index.
  const { slides, offsets } = useMemo(() => {
    const slides: { src: string; alt: string }[] = [];
    const offsets: number[] = [];
    for (const hub of warehouseHubs) {
      offsets.push(slides.length);
      slides.push(...hub.photos);
    }
    return { slides, offsets };
  }, [warehouseHubs]);

  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      let progress = 0;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
          // 0 when the block's top reaches centre, 1 when its bottom does.
          progress = Math.min(0.999, Math.max(0, (mid - r.top) / r.height));
        }
      });
      const photos = warehouseHubs[best].photos;
      const sub = Math.min(photos.length - 1, Math.floor(progress * photos.length));
      setActive(offsets[best] + sub);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [offsets, warehouseHubs]);

  return (
    <section className="v2-display relative w-full bg-cream text-ink">
      <div className="lg:grid lg:grid-cols-2">
        {/* Left — full-bleed sticky photo, flush to the top, bottom, and left
            edge; crossfades through the active hub's photos (lg only). */}
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <div className="relative h-full w-full">
              {slides.map((slide, i) => (
                <Image
                  key={`${slide.src}-${i}`}
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="50vw"
                  className={`object-cover v2-photo-duotone transition-opacity duration-700 ease-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right — the hub content, one tall block each. */}
        <div className="flex flex-col px-6 sm:px-10 lg:px-[clamp(40px,5vw,88px)]">
          {warehouseHubs.map((hub, i) => (
            <article
              key={hub.name}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="flex flex-col justify-center py-[var(--v2-section)] lg:min-h-screen lg:max-w-[600px] lg:py-[12vh]"
            >
              <RevealOnScroll as="div" delayMs={0}>
                <p className="v2-mono v2-size-folio text-gold-strong">
                  {hub.location}
                </p>
              </RevealOnScroll>
              <RevealOnScroll as="div" delayMs={90}>
                <h2 className="font-display mt-[var(--v2-rhythm)] text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.0] tracking-[-0.022em]">
                  {hub.name}
                </h2>
              </RevealOnScroll>

              <RevealOnScroll as="div" delayMs={150} className="mt-[var(--v2-flow)]">
                <span
                  aria-hidden
                  className="v2-rule-gold v2-draw-rule block w-full origin-left"
                />
              </RevealOnScroll>
              <dl>
                {hub.facts.map((fact, idx) => (
                  <RevealOnScroll
                    key={fact.label}
                    as="div"
                    delayMs={210 + idx * 70}
                    className="flex items-baseline justify-between gap-8 border-b border-ink/15 py-[var(--v2-rhythm)]"
                  >
                    <dt className="v2-mono v2-size-folio shrink-0 opacity-55">
                      {fact.label}
                    </dt>
                    <dd className="font-display max-w-[24ch] text-right text-[clamp(1.15rem,1.7vw,1.6rem)] leading-tight tracking-[-0.01em]">
                      {fact.value}
                    </dd>
                  </RevealOnScroll>
                ))}
              </dl>

              {/* Photo closes each hub on mobile (no sticky there). */}
              <div className="relative mt-[var(--v2-flow)] aspect-[4/5] w-full overflow-hidden lg:hidden">
                <Image
                  src={hub.photos[0].src}
                  alt={hub.photos[0].alt}
                  fill
                  sizes="100vw"
                  className="object-cover v2-photo-duotone"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
