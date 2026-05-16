import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { productsEditorial } from "@/content/en/products";
import { productPhotos } from "@/content/en/photography";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Brands you already love. Hundreds of SKUs across confectionery, beverages, personal care, and stationery.",
  alternates: { canonical: "/products" },
};

const BRAND_ORDER = [
  "Glico (Pocky)",
  "Red Bull",
  "Mars · Wrigley",
  "BiC",
  "AMOS",
  "NewChoice",
];

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        heading="Brands you *already* love."
        lede="A working selection from the hundreds of SKUs we move across Vietnam each year."
      />

      <section className="bg-cream px-6 py-[clamp(72px,8vw,120px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-[clamp(64px,8vw,96px)]">
          {BRAND_ORDER.map((brand, brandIdx) => {
            const items = productPhotos[brand];
            if (!items?.length) return null;
            return (
              <div key={brand} className="flex flex-col gap-8">
                <div className="flex items-end justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <Eyebrow tone="gold">Brand 0{brandIdx + 1}</Eyebrow>
                    <h2 className="font-display text-[clamp(28px,3vw,40px)] italic text-ink">
                      {brand}
                    </h2>
                  </div>
                  <HairlineRule className="hidden flex-1 sm:block" />
                </div>

                <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((p, idx) => (
                    <RevealOnScroll
                      key={p.src}
                      delayMs={idx * 60}
                      className="flex flex-col items-center justify-end gap-4 bg-paper px-6 py-10"
                    >
                      <div className="flex h-40 w-full items-center justify-center">
                        <Image
                          src={p.src}
                          alt={p.alt}
                          width={240}
                          height={240}
                          sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 40vw"
                          className="h-full w-auto object-contain"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span className="text-[14px] text-ink">{p.name}</span>
                        <span className="text-[10px] uppercase tracking-[0.24em] text-muted">
                          {brand}
                        </span>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto flex max-w-[60ch] flex-col gap-6">
          <p className="text-[17px] leading-[1.55] text-ink">
            {productsEditorial}
          </p>
          <SoftCta href="/brands">Explore the brand portfolio</SoftCta>
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
