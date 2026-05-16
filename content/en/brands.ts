import { partnerLogos } from "./photography";

export type Brand = {
  name: string;
  country: string;
  year?: number;
  logoSrc?: string;
  category?: "Confectionery" | "Beverages" | "Personal & Lifestyle" | "Stationery & Crafts";
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
    category: "Confectionery",
  },
  { name: "TCP", country: "Thailand", year: 2014, category: "Beverages" },
  {
    name: "BiC",
    country: "France",
    year: 2018,
    category: "Stationery & Crafts",
  },
  { name: "Red Bull", country: "Austria", category: "Beverages" },
  {
    name: "Glico (Pocky)",
    country: "Japan",
    year: 2026,
    category: "Confectionery",
  },
  {
    name: "AMOS",
    country: "China",
    year: 2022,
    category: "Stationery & Crafts",
  },
  {
    name: "NewChoice",
    country: "Taiwan",
    year: 1999,
    category: "Confectionery",
  },
  { name: "Warrior", country: "Thailand", category: "Beverages" },
  { name: "Wei Long", country: "China", category: "Confectionery" },
];

export const brands: Brand[] = brandDetails.map((brand) => ({
  ...brand,
  logoSrc: partnerLogos[brand.name],
}));

export const homepageBrands = brands;

export const featuredPartners = [
  { name: "Mars", country: "USA", year: 1994, story: "Our founding partner. Wrigley's was our first imported brand the year the US trade embargo lifted." },
  { name: "TCP", country: "Thailand", year: 2014, story: "Warrior and Red Bull anchor the energy and lifestyle category in Vietnam." },
  { name: "Glico", country: "Japan", year: 2026, story: "Pocky and confectionery; our newest international partnership." },
];
