export type CareerPillar = {
  heading: string;
  body: string;
};

export const whyRichfield: CareerPillar[] = [
  {
    heading: "People-Centered Philosophy",
    body: "We see our people as long-term partners in a shared journey, built on trust, ambition, and sustainable growth.",
  },
  {
    heading: "Comprehensive Benefits",
    body: "Competitive compensation, healthcare, and structured development across every level of the business.",
  },
  {
    heading: "Professional & Global Environment",
    body: "An international group spanning Vietnam, Malaysia, and China; daily exposure to the world's most loved brands.",
  },
  {
    heading: "A Legacy of Growth, A Future of Opportunity",
    body: "Three generations of family leadership, decades of partnerships, and clear paths for people who fit our story.",
  },
];

export const heritageBlock =
  "Rooted in over 30 years of trust, Richfield Group began as a family business in Malaysia and has grown across three generations. Today, we continue to build not just a company, but a community where people are valued as partners, not just employees. We see our people as long-term partners in a shared journey, built on trust, ambition, and sustainable growth.";

export type OpenPosition = {
  title: string;
  positions: number;
  location: string;
  deadline: string;
  href?: string;
};

export const openPositions: OpenPosition[] = [];
