import { partnerLogos } from "./photography";

export type BrandCategory = "Food" | "Beverages" | "Non-Food";

export type Brand = {
  name: string;
  country: string;
  year?: number;
  logoSrc?: string;
  category?: BrandCategory;
  /** Soft brand-coloured wash (≈10–18% chroma) behind the brand spread.
   * Tailwind arbitrary-value bg utility — keep cohesive but distinct. */
  accent?: string;
  /** One-line editorial caption — the role this brand plays in the portfolio. */
  story?: string;
  /** When true, this brand appears on the homepage feature cell (2x1). */
  feature?: boolean;
  /** Caption beneath a feature cell. */
  featureCaption?: string;
};

const brandDetails: Array<Omit<Brand, "logoSrc">> = [
  {
    name: "Mars · Wrigley",
    country: "USA",
    year: 1994,
    feature: true,
    featureCaption: "Founding partner · Since 1994",
    category: "Food",
    accent: "bg-[oklch(0.86_0.12_28/0.18)]",
    story:
      "Our founding partner. Wrigley's was our first imported brand the year the US trade embargo lifted.",
  },
  {
    name: "TCP",
    country: "Thailand",
    year: 2014,
    category: "Beverages",
    accent: "bg-[oklch(0.78_0.18_30/0.16)]",
    story:
      "Warrior and Red Bull anchor the energy and lifestyle category in Vietnam.",
  },
  {
    name: "BiC",
    country: "France",
    year: 2018,
    category: "Non-Food",
    accent: "bg-[oklch(0.55_0.12_258/0.14)]",
    story:
      "Stationery, lighters, and shavers — the everyday-consumer lineup with global reach.",
  },
  {
    name: "Red Bull",
    country: "Austria",
    category: "Beverages",
    accent: "bg-[oklch(0.62_0.22_28/0.16)]",
    story:
      "The original wings-giving energy drink. Across Vietnam's convenience and modern trade.",
  },
  {
    name: "Glico (Pocky)",
    country: "Japan",
    year: 2026,
    category: "Food",
    accent: "bg-[oklch(0.82_0.13_15/0.16)]",
    story:
      "Pocky and confectionery; our newest international partnership.",
  },
  {
    name: "AMOS",
    country: "China",
    year: 2022,
    category: "Food",
    accent: "bg-[oklch(0.78_0.13_215/0.14)]",
    story:
      "Bubble-gum specialist. Distinctive packs, kid-favourite flavours, fast-moving shelf turn.",
  },
  {
    name: "NewChoice",
    country: "Taiwan",
    year: 1999,
    category: "Food",
    accent: "bg-[oklch(0.86_0.14_92/0.18)]",
    story:
      "Bear-jar jellies and rau câu pudding — a household staple across Vietnam since 1999.",
  },
  {
    name: "Warrior",
    country: "Thailand",
    category: "Beverages",
    accent: "bg-[oklch(0.76_0.18_55/0.16)]",
    story:
      "TCP Group's youth-focused energy line — fruit-forward and growing fast.",
  },
  {
    name: "Wei Long",
    country: "China",
    category: "Food",
    accent: "bg-[oklch(0.66_0.2_28/0.14)]",
    story:
      "Spicy gluten snacks. Cult Asian street-food favourite, freshly landed in Vietnam.",
  },
  {
    name: "Caretex",
    country: "Vietnam",
    category: "Non-Food",
    accent: "bg-[oklch(0.65_0.1_148/0.16)]",
    story:
      "Personal care manufactured locally for the Vietnamese market.",
  },
];

export const brands: Brand[] = brandDetails.map((brand) => ({
  ...brand,
  logoSrc: partnerLogos[brand.name],
}));

export const homepageBrands = brands;

export const featuredPartners: Array<{
  name: string;
  logoKey: string;
  country: string;
  year: number;
  story: string;
}> = [
  {
    name: "Mars · Wrigley",
    logoKey: "Mars · Wrigley",
    country: "USA",
    year: 1994,
    story:
      "Our founding partner. Wrigley's was our first imported brand the year the US trade embargo lifted.",
  },
  {
    name: "TCP",
    logoKey: "TCP",
    country: "Thailand",
    year: 2014,
    story:
      "Warrior and Red Bull anchor the energy and lifestyle category in Vietnam.",
  },
  {
    name: "Glico",
    logoKey: "Glico (Pocky)",
    country: "Japan",
    year: 2026,
    story:
      "Pocky and confectionery; our newest international partnership.",
  },
];
