import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { featuredProducts, productsEditorial } from "@/content/en/products";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Brands you already love. Hundreds of SKUs across confectionery, beverages, personal care, and stationery.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        heading="Brands you *already* love."
      />

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto max-w-[1300px]">
          <ul className="flex gap-px overflow-x-auto bg-line">
            {featuredProducts.map((p) => (
              <li
                key={p.name}
                className="flex min-w-[260px] flex-col items-center justify-center gap-4 bg-cream px-10 py-16"
              >
                <span className="font-display text-[28px] italic text-gold">
                  {p.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
                  {p.brand}
                </span>
              </li>
            ))}
          </ul>
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
