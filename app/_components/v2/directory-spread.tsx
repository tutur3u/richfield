import Image from "next/image";
import { brands } from "@/content/en/brands";
import { productPhotos, type ProductPhoto } from "@/content/en/photography";
import { ProductMarquee, type MarqueeItem } from "@/app/_components/v2/product-marquee";

type BrandEntry = {
  /** Key used to look up in `brands` array (matches brand.name) */
  key: string;
  /** Display name used as alt text and visible label */
  display: string;
};

type Band = {
  category: string;
  number: string;
  brandEntries: BrandEntry[];
  brandRegionLabel: string;
  productRegionLabel: string;
};

const BANDS: Band[] = [
  {
    category: "Food",
    number: "01 / 03",
    brandEntries: [
      { key: "Mars · Wrigley", display: "Mars · Wrigley" },
      { key: "Glico (Pocky)", display: "Glico" },
      { key: "NewChoice", display: "NewChoice" },
      { key: "AMOS", display: "AMOS" },
      { key: "Wei Long", display: "Wei Long" },
    ],
    brandRegionLabel: "Food brands",
    productRegionLabel: "Food products",
  },
  {
    category: "Beverages",
    number: "02 / 03",
    brandEntries: [
      { key: "Red Bull", display: "Red Bull" },
      { key: "Warrior", display: "Warrior" },
    ],
    brandRegionLabel: "Beverage brands",
    productRegionLabel: "Beverage products",
  },
  {
    category: "Non-Food",
    number: "03 / 03",
    brandEntries: [
      { key: "BiC", display: "BiC" },
      { key: "Caretex", display: "Caretex" },
    ],
    brandRegionLabel: "Non-Food brands",
    productRegionLabel: "Non-Food products",
  },
];

function productsForBand(brandEntries: BrandEntry[]): MarqueeItem[] {
  const items: MarqueeItem[] = [];
  for (const entry of brandEntries) {
    const list: ProductPhoto[] = productPhotos[entry.key] ?? [];
    for (const p of list) {
      items.push({ src: p.src, name: `${entry.display} · ${p.name}`, alt: p.alt });
    }
  }
  return items;
}

export function DirectorySpread() {
  return (
    <div
      id="brands"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,160px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 08—11 · STORY 04</span>
      </div>

      <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold-strong">
        <span aria-hidden className="inline-block h-px w-8 bg-gold-rule" />
        STORY 04 · THE DIRECTORY
      </p>
      <h2 className="v2-italic v2-size-feature mb-16 max-w-[22ch] text-balance">
        The brands we carry.
      </h2>

      <div className="flex flex-col gap-[clamp(48px,7vw,96px)]">
        {BANDS.map((band) => (
          <DirectoryBand key={band.category} band={band} />
        ))}
      </div>
    </div>
  );
}

function DirectoryBand({ band }: { band: Band }) {
  const brandMap = new Map(brands.map((b) => [b.name, b]));
  const products = productsForBand(band.brandEntries);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline gap-4">
        <span aria-hidden className="h-px flex-1 bg-gold-rule/60" />
        <span className="v2-mono v2-size-eyebrow text-gold-strong">
          {band.category.toUpperCase()} · {band.number}
        </span>
      </div>

      <h3 className="v2-italic text-[clamp(3rem,8vw,7rem)] leading-none">
        {band.category}
      </h3>

      <section
        aria-label={band.brandRegionLabel}
        className="flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-current/15 pt-6"
      >
        {band.brandEntries.map((entry) => {
          const brand = brandMap.get(entry.key);
          const logoSrc = brand?.logoSrc;
          return logoSrc ? (
            <div key={entry.key} className="relative h-10 w-[clamp(80px,10vw,140px)]">
              <Image
                src={logoSrc}
                alt={entry.display}
                fill
                sizes="140px"
                className="object-contain"
                style={{ filter: "grayscale(1) contrast(1.1)" }}
              />
            </div>
          ) : (
            <span key={entry.key} className="v2-display text-[clamp(1rem,1.4vw,1.2rem)]">
              {entry.display}
            </span>
          );
        })}
      </section>

      {products.length > 0 ? (
        <ProductMarquee items={products} ariaLabel={band.productRegionLabel} />
      ) : (
        <p
          role="region"
          aria-label={band.productRegionLabel}
          className="v2-mono v2-size-folio opacity-60"
        >
          PRODUCT PHOTOGRAPHY · UPDATING
        </p>
      )}
    </section>
  );
}
