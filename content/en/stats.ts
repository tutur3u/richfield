// "By the numbers" — the group's headline figures. Single source of truth for
// the group-overview section beneath the cover.
export type Stat = readonly [figure: string, label: string];

export const groupStats: readonly Stat[] = [
  ["30+", "Years of steady growth since 1994"],
  ["1,700+", "Employees across the group"],
  ["300+", "Sub-distributors nationwide"],
  ["180,000+", "Retail points served across Vietnam"],
];

// The group overview statement that opens the homepage beneath the cover —
// verbatim client copy. Two paragraphs: reach, then values.
export const groupIntro: readonly string[] = [
  "Today, our distribution network covers all provinces and cities nationwide, enabling us to serve customers and partners across the country.",
  "At Richfield, we go beyond focusing on production and business performance—we are equally committed to our people and the communities we serve. Through ongoing social and charitable initiatives, we strive to make a meaningful impact beyond our organization.",
  "Driven by a passionate and dynamic team and strengthened by long-standing partnerships with global brands such as Mars, Richfield has experienced steady growth over the past 30+ years. We continue to build on this momentum, maintaining consistent and sustainable development in the years ahead."
];
