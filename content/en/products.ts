export type FeaturedProduct = {
  name: string;
  brand: string;
  imageSrc?: string;
};

export const featuredProducts: FeaturedProduct[] = [
  { name: "M&M's", brand: "Mars" },
  { name: "Pocky", brand: "Glico" },
  { name: "Red Bull", brand: "TCP" },
  { name: "Warrior", brand: "TCP" },
  { name: "BiC Lighter", brand: "BiC" },
];

export const productsEditorial =
  "We distribute hundreds of SKUs across confectionery, beverages, personal care, and stationery. The full product catalogue is in development.";
