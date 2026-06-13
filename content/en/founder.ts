// Founder profile — Chua Eng Siang. Verbatim from the final content doc.
export const founder = {
  name: "Chua Eng Siang",
  role: "Founder",
  photo: "/photos/leadership/chua-eng-siang.webp",
  motto: "Don't be afraid, just do it.",
  bio: [
    "Chua Eng Siang was born in 1939 to a family of Chinese immigrants in Malaysia — raised in a fishing village where life was modest. Together with his uncles, his father ran a small wholesale fish business that grew steadily over time. When local supply became limited, they began sourcing imported fish from Thailand, and what started as necessity became the foundation of a lifetime in trade.",
    "For decades, Chua Eng Siang traveled across Southeast Asia — Thailand, Indonesia, Cambodia — building experience in seafood import-export and an instinct for opportunity that took him further than the fishing village could have predicted. He came to Vietnam in 1990, and in 1994 established Richfield with the support of Wrigley's Vietnam, entrusting the business to his son, Chua Bill, who had just returned from university in Australia.",
    "His philosophy was simple: “Don't be afraid, just do it.” He embodied it daily — waking before 5 AM and working 12 or more hours a day. Five of his children now manage FMCG and seafood export businesses he founded. Humble, caring, and modest — he remains the quiet foundation of everything Richfield stands for.",
  ],
} as const;

export type Founder = typeof founder;
