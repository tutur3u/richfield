import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { RetailerWall } from "@/app/_components/sections/retailer-wall";
import { gtFormats, mtFormats } from "@/content/en/capabilities";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Distribution",
  description:
    "From the warehouse floor to every shelf. General trade and modern trade across Vietnam.",
  alternates: { canonical: "/distribution" },
};

export default function DistributionPage() {
  return (
    <>
      <RunningHead />
      <main className="bg-cream text-ink">
        {/* Intro */}
        <section className="v2-display relative flex w-full flex-col bg-cream">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-y-[var(--v2-rhythm)] px-6 pb-[var(--v2-section)] pt-[calc(var(--v2-runhead)+var(--v2-section))] sm:px-10 lg:px-12">
            <Eyebrow>DISTRIBUTION</Eyebrow>
            <h1 className="font-display v2-headline max-w-[18ch]">
              From the warehouse floor to{" "}
              <em className="italic text-gold-strong">every shelf</em>.
            </h1>
            <p className="v2-size-body max-w-[60ch] opacity-90">
              Nationwide reach through general trade and modern trade. Two
              channels, one network, moving international brands into every
              province in Vietnam.
            </p>
          </div>
        </section>

        {/* General Trade */}
        <section id="gt" className="v2-display relative flex w-full flex-col bg-white">
          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-12 items-center gap-x-[var(--v2-col-gap)] gap-y-8 px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
            <div className="col-span-12 flex flex-col gap-y-[var(--v2-rhythm)] lg:col-span-6">
              <p className="v2-mono v2-size-folio text-gold-strong">01 / 02</p>
              <h2 className="font-display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.0] tracking-[-0.022em]">
                General Trade
              </h2>
              <p className="v2-size-body max-w-[55ch] opacity-90">
                Our largest channel. 300+ sub-distributors reaching traditional
                retail points across all provinces — markets, grocery stores,
                and specialty shops. Traditional trade has been our foundation
                since 1994.
              </p>
              <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 v2-mono text-[11px] uppercase tracking-[0.16em] opacity-60">
                {gtFormats.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="v2-mono v2-size-folio opacity-55">
                300+ SUB-DISTRIBUTORS · 180,000+ POINTS
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src="/photos/distribution/gt.png"
                  alt="Outlet types served across general trade."
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Modern Trade — the featured chapter. */}
        <section
          id="mt"
          className="v2-display relative flex w-full flex-col bg-ink text-cream"
        >
          <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-y-[var(--v2-flow)] px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
            <div className="flex flex-col gap-y-[var(--v2-rhythm)]">
              <p className="v2-mono v2-size-folio text-gold">02 / 02 · FEATURED</p>
              <h2 className="font-display v2-headline max-w-[16ch] text-cream">
                Modern <em className="italic text-gold">Trade</em>.
              </h2>
              <p className="v2-size-body max-w-[60ch] text-cream/85">
                40+ modern trade and e-commerce partners including supermarket
                chains and convenience stores, with trade-marketing display and
                event support.
              </p>
              <p className="v2-mono v2-size-folio text-cream/55">
                40+ MT & E-COMMERCE PARTNERS
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 v2-mono text-[11px] uppercase tracking-[0.16em] text-cream/70">
              {mtFormats.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <div className="grid grid-cols-1 gap-[clamp(10px,1.4vw,20px)] sm:grid-cols-2">
              {[
                { src: "/photos/distribution/events.png", alt: "Trade-marketing events and activations across the country." },
                { src: "/photos/distribution/special-display.png", alt: "In-store special displays and merchandising for partner brands." },
              ].map((img) => (
                <figure key={img.src} className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/15 pt-[clamp(24px,3vw,40px)]">
              <Link
                href="/#brands"
                className="v2-mono v2-size-folio group inline-flex items-center gap-2 text-gold transition-opacity hover:opacity-80"
              >
                See the brands we carry
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contact"
                className="v2-mono v2-size-folio group inline-flex items-center gap-2 text-cream/70 transition-opacity hover:opacity-100"
              >
                Get in touch
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Brand showcase — the wall the client likes, kept intact. */}
        <RetailerWall />

      </main>
    </>
  );
}
