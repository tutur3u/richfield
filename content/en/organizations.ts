// The three operating companies, as described in the "Who We Are" section of
// the final content doc.
export type Organization = {
  name: string;
  established: string;
  body: string;
  href: string;
  linkLabel: string;
  external?: boolean;
  /** Company mark, shown as a lockup above the name. Omit for a name-only entry. */
  logo?: string;
};

export const whoWeAreIntro =
  "Richfield provides full-service FMCG distribution — from supplier selection and import, through packaging, warehousing, transportation, and sales. We handle the entire journey so our brand partners can focus on what they do best.";

export const organizations: Organization[] = [
  {
    name: "Richfield Worldwide JSC",
    established: "Est. 1994",
    body: "Our core distribution company. Covering all provinces via general trade, modern trade, B2B, and e-commerce — with 180,000+ retail points nationwide.",
    href: "/distribution",
    linkLabel: "Distribution channels",
    logo: "/photos/logos/richfield.webp",
  },
  {
    name: "Richfield Foods JSC",
    established: "Est. 2010",
    body: "Our packaging and cold storage facility. Located at Duc Hoa 1 Industrial Park, Long An — 20,000 m² of ISO & HACCP certified space with cold storage systems maintained at 18–25°C.",
    href: "/logistics",
    linkLabel: "Logistics & warehousing",
  },
  {
    name: "Dory Rich JSC",
    established: "Est. October 2024",
    body: "Our dedicated energy drink distribution company, focused exclusively on Warrior Energy Drink and Red Bull.",
    href: "https://doryrich.com.vn",
    linkLabel: "Visit Dory Rich",
    external: true,
    logo: "/photos/logos/dory-rich.webp",
  },
];
