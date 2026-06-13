// The five core values, in Vietnamese with their English gloss and meaning —
// from the "Life at Richfield" section of the final content doc.
export type CoreValue = {
  vi: string;
  en: string;
  meaning: string;
};

export const lifeAtRichfieldIntro =
  "Richfield is a place where people stay. Our 400+ employees with over 10 years of tenure — and 200+ with over 15 — aren't here by accident. We invest in the people who build this company, and we show it through how we treat them every day.";

export const coreValues: CoreValue[] = [
  {
    vi: "Tôn Trọng",
    en: "Respect",
    meaning: "Valuing each person's contribution",
  },
  {
    vi: "Liêm Chính",
    en: "Integrity",
    meaning: "Transparency & fairness in all dealings",
  },
  {
    vi: "Cam Kết",
    en: "Commitment",
    meaning: "Dedication to our people, partners & customers",
  },
  {
    vi: "Giúp Đỡ",
    en: "Helpfulness",
    meaning: "Mutual support & collaborative problem-solving",
  },
  {
    vi: "Thân Thiện",
    en: "Friendliness",
    meaning: "Warm, approachable, human-centered workplace",
  },
];

// "What this looks like in practice" — the day-to-day care, beyond salary.
export const benefitsIntro =
  "The care employees describe isn't just felt in moments of crisis — it's built into how Richfield operates every day. Beyond a competitive salary, the company provides:";

export const benefits: string[] = [
  "Company-sponsored health insurance",
  "Regular health check-ups & preventive care",
  "Beach outings, team trips & recreational activities",
  "Internal celebrations: Women's Day, Children's Day, National Day, Christmas, Tết",
  "Union support: emergency assistance for illness, hardship, and employee children's welfare",
  "Work-life balance and family-life initiatives",
];
