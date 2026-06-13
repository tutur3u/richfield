export type Pillar = {
  number: string;
  name: string;
  shortBody: string;
  longBody: string;
  href: string;
};

export const pillars: Pillar[] = [
  {
    number: "01",
    name: "Warehouse & Logistics",
    shortBody:
      "End-to-end storage, handling, and last-mile distribution capabilities",
    longBody:
      "Two distribution centres in Long An and Hanoi cover the country end to end. Ambient and cold storage (18°C–25°C), co-packing infrastructure, and a network of vehicles serving every province.",
    href: "/logistics",
  },
  {
    number: "02",
    name: "General Trade",
    shortBody:
      "Our largest channel — 300+ sub-distributors across every province.",
    longBody:
      "Our largest channel. 300+ sub-distributors reaching traditional retail points across all provinces — markets, grocery stores, and specialty shops. Traditional trade has been our foundation since 1994.",
    href: "/distribution#gt",
  },
  {
    number: "03",
    name: "Modern Trade",
    shortBody:
      "40+ modern trade & e-commerce partners, with trade-marketing support.",
    longBody:
      "40+ modern trade and e-commerce partners including supermarket chains and convenience stores, supported by trade-marketing display and event activation. Super and Hyper, Convenience, Mini and Foodstore, Health and Beauty, Mom and Baby, Specialty.",
    href: "/distribution#mt",
  },
];

export const importExportBody =
  "Customs declaration and full import support for international partners. From documentation to bonded-warehouse handling, we manage the path from port to distribution centre.";

export const gtFormats = [
  "Grocery",
  "Wholesaler",
  "HORECA",
  "Wet market",
  "Independent pharmacy / CMH",
];

export const mtFormats = [
  "Super & Hyper",
  "Convenience",
  "Mini & Foodstore",
  "Health & Beauty",
  "Mom & Baby",
  "Specialty",
];
