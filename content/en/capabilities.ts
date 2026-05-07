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
    name: "Import / Export",
    shortBody:
      "Customs declaration and full import support for international partners.",
    longBody:
      "Customs declaration and full import support for international partners. From documentation to bonded-warehouse handling, we manage the path from port to distribution centre, on schedules that protect retailer commitments.",
    href: "/distribution#import-export",
  },
  {
    number: "02",
    name: "Warehouse & Logistics",
    shortBody:
      "Two distribution centres in Long An and Hanoi, ambient and cold storage, end-to-end handling.",
    longBody:
      "Two distribution centres in Long An and Hanoi cover the country end to end. Ambient and cold storage (18°C–25°C), co-packing infrastructure, and a network of vehicles serving every province.",
    href: "/logistics",
  },
  {
    number: "03",
    name: "General Trade",
    shortBody:
      "Nationwide coverage with 800+ salesmen across every province and city.",
    longBody:
      "Nationwide coverage with 800+ salesmen across every province and city, supported by 300+ sub-distributors and a network of 180,000 retail outlets. Grocery, wholesaler, HORECA, wet market, independent pharmacy.",
    href: "/distribution#gt",
  },
  {
    number: "04",
    name: "Modern Trade",
    shortBody:
      "Retailer partnerships across every chain, with trade-marketing display and event support.",
    longBody:
      "Retailer partnerships across every chain in Vietnam, with trade-marketing display and event support. Super and Hyper, Convenience, Mini and Foodstore, Health and Beauty, Mom and Baby, Specialty.",
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
