// Second-generation leadership — verbatim from the final content doc. Used in
// the Careers "Why Richfield" section.
export type Leader = {
  name: string;
  role: string;
  photo: string;
  bio: string;
  quote?: string;
};

export const peopleFirstIntro =
  "Richfield's competitive advantage isn't technology or scale alone — it's the way leadership genuinely cares for people. Bill Chua and Phùng Thị Thu Thủy are consistently described by employees as naturally kind: present in both victories and hardships. Employees notice these things — and they stay because of them.";

export const leaders: Leader[] = [
  {
    name: "Mr. Bill Chua",
    role: "Chairman",
    photo: "/photos/leadership/bill-chua.webp",
    bio: "Bill took the helm from his father in 1999 and has led Richfield through every chapter of its growth since — from a regional distributor to a nationwide network of 1,700+ people. Those who have worked closely with him describe a leader whose strength shows up quietly: simple in manner, generous in spirit, decisive when it matters. When cash flow was strained, Bill borrowed from the bank to ensure salaries were paid on time.",
  },
  {
    name: "Mrs. Phùng Thị Thu Thủy",
    role: "Chairwoman",
    photo: "/photos/leadership/thuy.webp",
    bio: "Thủy's warmth can be felt by employees across the country. She visits. She remembers people. She shows up at milestones and in difficult moments alike. She has visited employee homes in hardship and is always willing to help. Beyond the business, she is a passionate advocate for Vietnamese cultural heritage — particularly the áo dài, Vietnam's traditional dress — championing its preservation as something worth protecting alongside everything else the company builds.",
    quote: "I do business to have resources to help others.",
  },
];
