import type { JSONContent } from "@tuturuuu/editor";

export type Milestone = {
  year: number;
  brand: string;
  country: string;
  body: string;
  bodyContent?: JSONContent | null;
  /** When true, milestone shows on /about (extended) but not on the homepage strip. */
  aboutOnly?: boolean;
};

// The company timeline as set out in the final content doc — six milestones
// from the founding partnership to the 30-year mark. `brand` doubles as the
// logo key where a milestone has a mark; company milestones leave it as
// "Group" and simply show no logo.
export const milestones: Milestone[] = [
  {
    year: 1994,
    brand: "Mars",
    country: "USA",
    body: "Mars Wrigley Vietnam selected Richfield as its distributor — the partnership that began everything.",
  },
  {
    year: 1999,
    brand: "Group",
    country: "Vietnam",
    body: "Bill Chua takes leadership from founder Chua Eng Siang.",
  },
  {
    year: 2006,
    brand: "Group",
    country: "Vietnam",
    body: "Formally incorporated as Richfield Worldwide JSC.",
  },
  {
    year: 2010,
    brand: "Group",
    country: "Vietnam",
    body: "Richfield Foods JSC established in Long An.",
  },
  {
    year: 2016,
    brand: "Warrior",
    country: "Thailand",
    body: "Became distributor of Warrior Energy Drink (TCP Group, Thailand).",
  },
  {
    year: 2024,
    brand: "Dory Rich JSC",
    country: "Vietnam",
    body: "Northern Distribution Center launched; Dory Rich JSC founded.",
  },
];

export const homepageMilestones = milestones.filter((m) => !m.aboutOnly);
