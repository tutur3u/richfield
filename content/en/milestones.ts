export type Milestone = {
  year: number;
  brand: string;
  country: string;
  body: string;
  /** When true, milestone shows on /about (extended) but not on the homepage strip. */
  aboutOnly?: boolean;
};

export const milestones: Milestone[] = [
  {
    year: 1992,
    brand: "Group",
    country: "Cambodia & Vietnam",
    body: "Richfield first ventures across the border, importing Wrigley's into Cambodia and Vietnam ahead of the trade embargo lifting.",
    aboutOnly: true,
  },
  {
    year: 1994,
    brand: "Mars",
    country: "USA",
    body: "Wrigley's becomes our first imported brand the year the US trade embargo lifts.",
  },
  {
    year: 1999,
    brand: "NewChoice",
    country: "Taiwan",
    body: "First Taiwanese partner; the snack category joins the portfolio.",
  },
  {
    year: 2014,
    brand: "TCP",
    country: "Thailand",
    body: "Warrior and Red Bull bring the energy and lifestyle category.",
  },
  {
    year: 2018,
    brand: "BiC",
    country: "France",
    body: "Stationery and lighters expand the everyday-consumer footprint.",
  },
  {
    year: 2022,
    brand: "AMOS",
    country: "China",
    body: "Art supplies and creative materials enter the lineup.",
  },
  {
    year: 2024,
    brand: "Dory Rich JSC",
    country: "Vietnam",
    body: "Joint venture with TCP Group brings manufacturing and distribution under one roof.",
  },
  {
    year: 2026,
    brand: "Glico",
    country: "Japan",
    body: "Pocky and confectionery; the latest international partnership.",
  },
];

export const homepageMilestones = milestones.filter((m) => !m.aboutOnly);
