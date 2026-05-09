import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { BrandCell } from "@/app/_components/primitives/brand-cell";
import { JvFeature } from "@/app/_components/sections/jv-feature";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { brands, featuredPartners } from "@/content/en/brands";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Across confectionery, beverages, personal care, and stationery, Richfield distributes the brands shoppers in Vietnam already know.",
  alternates: { canonical: "/brands" },
};

const CATEGORIES: Array<NonNullable<(typeof brands)[number]["category"]>> = [
  "Confectionery",
  "Beverages",
  "Personal & Lifestyle",
  "Stationery & Crafts",
];

export default function BrandsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our brands"
        heading="The complete *portfolio*."
        lede="Across confectionery, beverages, personal care, and stationery, Richfield distributes the brands shoppers in Vietnam already know. Each partnership is a long-term relationship; many have run for decades."
      />

      <section className="bg-cream px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-px bg-line sm:grid-cols-3">
          {featuredPartners.map((p) => (
            <article
              key={p.name}
              className="flex flex-col gap-4 bg-paper p-10"
            >
              <span className="font-display text-[40px] italic text-gold">
                {p.name}
              </span>
              <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
                {p.country} · Since {p.year}
              </span>
              <p className="max-w-[40ch] text-[15px] leading-[1.55] text-muted">
                {p.story}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-16">
          {CATEGORIES.map((category) => {
            const cells = brands.filter((b) => b.category === category);
            if (!cells.length) return null;
            return (
              <div key={category} className="flex flex-col gap-6">
                <Eyebrow tone="gold">{category}</Eyebrow>
                <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
                  {cells.map((b) => (
                    <BrandCell
                      key={b.name}
                      name={b.name}
                      country={b.country}
                      logoSrc={b.logoSrc}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <JvFeature variant="slim" />
      <SoftCtaCloser />
    </>
  );
}
