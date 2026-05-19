import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import {
  brands,
  featuredPartners,
  type Brand,
  type BrandCategory,
} from "@/content/en/brands";
import { partnerLogos, productPhotos } from "@/content/en/photography";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Across food, beverages, and non-food categories, Richfield distributes the brands shoppers in Vietnam already know.",
  alternates: { canonical: "/brands" },
};

const CATEGORIES: BrandCategory[] = ["Food", "Beverages", "Non-Food"];

export default function BrandsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our brands"
        heading="The complete *portfolio*."
        lede="Across food, beverages, and non-food categories, Richfield distributes the brands shoppers in Vietnam already know. Each partnership is a long-term relationship; many have run for decades."
        align="split"
        accent={<BrandsHeroCollage />}
      />

      <section
        aria-labelledby="featured-partners-heading"
        className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10"
      >
        <div className="mx-auto flex max-w-[1300px] flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow tone="gold">Featured partners</Eyebrow>
            <h2
              id="featured-partners-heading"
              className="font-display text-[clamp(28px,3vw,40px)] text-ink"
            >
              Three relationships that anchor the portfolio.
            </h2>
          </div>
          <div className="grid gap-px bg-line sm:grid-cols-3">
            {featuredPartners.map((p) => {
              const logo = partnerLogos[p.logoKey];
              return (
                <article
                  key={p.name}
                  className="flex flex-col gap-6 bg-paper p-10"
                >
                  <div className="flex h-16 items-start">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={`${p.name} logo`}
                        width={180}
                        height={64}
                        className="h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-display text-[32px] italic text-gold">
                        {p.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
                    {p.country} · Since {p.year}
                  </span>
                  <p className="max-w-[40ch] text-[15px] leading-[1.55] text-muted">
                    {p.story}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {CATEGORIES.map((category, catIdx) => {
        const items = brands.filter((b) => b.category === category);
        if (!items.length) return null;
        return (
          <section
            key={category}
            aria-label={`${category} brands`}
            className={`relative px-6 py-[clamp(72px,9vw,120px)] sm:px-10 ${
              catIdx % 2 === 0 ? "bg-cream" : "bg-paper"
            }`}
          >
            <div className="mx-auto flex max-w-[1500px] flex-col gap-[clamp(72px,9vw,120px)]">
              <div className="flex items-end gap-6 px-2">
                <span className="font-display text-[clamp(80px,10vw,144px)] leading-none text-gold/40">
                  {String(catIdx + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 flex-col gap-2 pb-3">
                  <Eyebrow tone="gold">{category}</Eyebrow>
                  <h2 className="font-display text-[clamp(28px,3.2vw,44px)] leading-[1.1] text-ink">
                    {category === "Food" && "Snacks, sweets, and everyday confectionery."}
                    {category === "Beverages" && "Energy and lifestyle drinks across the country."}
                    {category === "Non-Food" && "Stationery, lighters, shavers, personal care."}
                  </h2>
                </div>
              </div>

              {items.map((brand, idx) => (
                <RevealOnScroll
                  key={brand.name}
                  delayMs={idx * 60}
                  as="article"
                >
                  <BrandSpread brand={brand} reversed={idx % 2 === 1} />
                </RevealOnScroll>
              ))}
            </div>
          </section>
        );
      })}

      <SoftCtaCloser />
    </>
  );
}

function BrandSpread({
  brand,
  reversed = false,
}: {
  brand: Brand;
  reversed?: boolean;
}) {
  const products = productPhotos[brand.name] ?? [];
  const accent = brand.accent ?? "";
  const partnerSince = brand.year ? `Partnered since ${brand.year}` : "Long-time partner";

  return (
    <div className={`relative isolate overflow-hidden rounded-sm ${accent}`}>
      <div
        className={`relative grid gap-10 p-[clamp(28px,4vw,56px)] lg:gap-16 lg:p-[clamp(40px,5vw,80px)] ${
          reversed
            ? "lg:grid-cols-[1.6fr_1fr]"
            : "lg:grid-cols-[1fr_1.6fr]"
        }`}
      >
        {/* TYPE PANEL */}
        <div
          className={`flex flex-col gap-6 ${reversed ? "lg:order-2" : ""}`}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[clamp(14px,1.2vw,16px)] text-gold">
              ·
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted">
              {brand.category}
            </span>
          </div>
          <h3 className="sr-only">{brand.name}</h3>
          {brand.logoSrc ? (
            <div className="flex h-[clamp(72px,9vw,120px)] items-center">
              <Image
                src={brand.logoSrc}
                alt={`${brand.name} logo`}
                width={320}
                height={160}
                sizes="(min-width: 1024px) 280px, 60vw"
                className="h-full w-auto max-w-full object-contain object-left"
              />
            </div>
          ) : (
            <p
              aria-hidden
              className="font-display text-[clamp(32px,3.8vw,52px)] leading-[1.05] tracking-[-0.01em] text-ink"
            >
              {brand.name}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.32em] text-muted">
            <span>{brand.country}</span>
            <span aria-hidden className="text-line">·</span>
            <span>{partnerSince}</span>
            {products.length ? (
              <>
                <span aria-hidden className="text-line">·</span>
                <span>{products.length} SKUs shown</span>
              </>
            ) : null}
          </div>
          {brand.story ? (
            <p className="max-w-[44ch] text-[15px] leading-[1.6] text-muted">
              {brand.story}
            </p>
          ) : null}
        </div>

        {/* IMAGE COLLAGE */}
        <div className={reversed ? "lg:order-1" : ""}>
          {products.length === 0 ? (
            <EmptyCollage brand={brand} />
          ) : products.length === 1 ? (
            <SoloHero product={products[0]} />
          ) : products.length === 2 ? (
            <DuoHero products={products} />
          ) : (
            <MagazineCollage products={products} />
          )}
        </div>
      </div>
    </div>
  );
}

function BrandsHeroCollage() {
  // Floating SKU collage — six product cut-outs arranged with offset rotations
  // for editorial motion. Each tile drifts subtly on hover.
  const tiles = [
    { src: "/photos/products/mars-snickers.webp", alt: "Snickers" },
    { src: "/photos/products/glico-pocky-pocky-strawberry.webp", alt: "Pocky Strawberry" },
    { src: "/photos/products/red-bull-classic.webp", alt: "Red Bull Classic" },
    { src: "/photos/products/amos-amos.webp", alt: "AMOS Crayons" },
    { src: "/photos/products/newchoice-pink-bear.webp", alt: "NewChoice Bear" },
    { src: "/photos/products/bic-lighters-1.webp", alt: "BiC Lighter" },
  ];
  const offsets = [
    "rotate-[-6deg] translate-y-2",
    "rotate-[4deg] -translate-y-3",
    "rotate-[-3deg] translate-y-6",
    "rotate-[5deg] translate-y-1",
    "rotate-[-4deg] -translate-y-2",
    "rotate-[3deg] translate-y-5",
  ];
  return (
    <div className="relative grid w-full max-w-[520px] grid-cols-3 gap-3 sm:gap-4">
      {tiles.map((t, idx) => (
        <figure
          key={t.src}
          className={`group relative aspect-square overflow-hidden rounded-sm bg-paper/85 ring-1 ring-line/60 backdrop-blur-[2px] transition-transform duration-500 hover:rotate-0 hover:-translate-y-1 hover:ring-gold/70 ${offsets[idx]}`}
        >
          <Image
            src={t.src}
            alt={t.alt}
            fill
            sizes="(min-width: 1024px) 160px, 30vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </figure>
      ))}
    </div>
  );
}

type Product = { src: string; name: string; alt: string };

function MagazineCollage({ products }: { products: Product[] }) {
  // Hero + supporting grid. Use the first product as a 2x2 hero on desktop,
  // surrounded by 3–5 single-cell supporters. Mobile collapses to 2-col grid.
  const hero = products[0];
  const supporters = products.slice(1, 6);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      <ProductCell
        product={hero}
        className="col-span-2 row-span-2 aspect-square sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2"
        featured
      />
      {supporters.map((p, idx) => (
        <ProductCell
          key={p.src}
          product={p}
          className={`aspect-square ${
            // Slight asymmetry: middle supporter gets a wider span on lg screens
            idx === 1 ? "lg:col-span-1" : ""
          }`}
        />
      ))}
    </div>
  );
}

function DuoHero({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ProductCell product={products[0]} className="aspect-[4/5]" featured />
      <ProductCell product={products[1]} className="aspect-[4/5]" featured />
    </div>
  );
}

function SoloHero({ product }: { product: Product }) {
  return <ProductCell product={product} className="aspect-[4/3]" featured />;
}

function EmptyCollage({ brand }: { brand: Brand }) {
  return (
    <div className="flex aspect-[4/3] flex-col items-start justify-end gap-4 rounded-sm border border-dashed border-gold/40 bg-paper/50 p-8">
      <HairlineRule className="w-12" />
      <p className="font-display text-[clamp(24px,2.4vw,30px)] italic leading-[1.2] text-ink/80">
        Distribution active.
      </p>
      <p className="max-w-[36ch] text-[14px] leading-[1.55] text-muted">
        {brand.name} SKU photography coming soon. Talk to our partnerships team
        if you need a brief now.
      </p>
    </div>
  );
}

function ProductCell({
  product,
  className = "",
  featured = false,
}: {
  product: Product;
  className?: string;
  featured?: boolean;
}) {
  return (
    <figure
      className={`group relative flex items-center justify-center overflow-hidden rounded-sm bg-paper/85 backdrop-blur-[2px] ring-1 ring-line/60 transition-transform duration-500 hover:-translate-y-0.5 hover:ring-gold/70 ${className}`}
    >
      <Image
        src={product.src}
        alt={product.alt}
        width={featured ? 600 : 320}
        height={featured ? 600 : 320}
        sizes={
          featured
            ? "(min-width: 1024px) 360px, (min-width: 640px) 36vw, 80vw"
            : "(min-width: 1024px) 180px, (min-width: 640px) 22vw, 40vw"
        }
        className={`h-[78%] w-[78%] object-contain transition-transform duration-500 group-hover:scale-[1.04] ${
          featured ? "" : ""
        }`}
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-paper/90 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="truncate">{product.name}</span>
      </figcaption>
    </figure>
  );
}
