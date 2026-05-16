export type Photo = {
  src: string;
  alt: string;
  /** Source aspect ratio (w/h) — used to size containers without layout shift. */
  ratio: number;
};

export const peoplePhotos = {
  groupCompany: {
    src: "/photos/people/group-company-1920.webp",
    alt: "The Richfield team gathered for the annual company portrait",
    ratio: 3 / 2,
  },
  groupCompanyWide: {
    src: "/photos/people/group-company-1280.webp",
    alt: "The Richfield team gathered for the annual company portrait",
    ratio: 3 / 2,
  },
  grandOpening: {
    src: "/photos/people/grand-opening-2026-1280.webp",
    alt: "Ribbon cutting at the 2026 office opening",
    ratio: 4 / 3,
  },
  happyTime: {
    src: "/photos/people/happy-time-2025-11-1280.webp",
    alt: "Team social evening, November 2025",
    ratio: 4 / 3,
  },
  workshop1: {
    src: "/photos/people/workshop-1-1280.webp",
    alt: "Sales team training workshop",
    ratio: 4 / 3,
  },
  workshop2: {
    src: "/photos/people/workshop-2-1280.webp",
    alt: "Cross-functional planning workshop",
    ratio: 4 / 3,
  },
  workshop3: {
    src: "/photos/people/workshop-3-1280.webp",
    alt: "Field team workshop in session",
    ratio: 4 / 3,
  },
  workshopRoom: {
    src: "/photos/people/workshop-room-1280.webp",
    alt: "Training room set up for a workshop",
    ratio: 4 / 3,
  },
  unionCongress: {
    src: "/photos/people/union-congress-2025-1280.webp",
    alt: "Annual Union Congress, 2025",
    ratio: 4 / 3,
  },
  celebration: {
    src: "/photos/people/celebration-1280.webp",
    alt: "A team celebration moment",
    ratio: 4 / 3,
  },
  candid1: {
    src: "/photos/people/candid-1-1280.webp",
    alt: "A moment from the office floor",
    ratio: 3 / 2,
  },
  candid2: {
    src: "/photos/people/candid-2-1280.webp",
    alt: "Teammates between meetings",
    ratio: 3 / 2,
  },
} satisfies Record<string, Photo>;

export type ProductPhoto = {
  src: string;
  name: string;
  alt: string;
};

export const productPhotos: Record<string, ProductPhoto[]> = {
  "Glico (Pocky)": [
    { src: "/photos/products/glico-pocky-chocolate.webp", name: "Pocky Chocolate", alt: "Pocky Chocolate sticks" },
    { src: "/photos/products/glico-pocky-strawberry.webp", name: "Pocky Strawberry", alt: "Pocky Strawberry sticks" },
    { src: "/photos/products/glico-pocky-matcha.webp", name: "Pocky Matcha", alt: "Pocky Matcha sticks" },
    { src: "/photos/products/glico-pocky-milk.webp", name: "Pocky Milk", alt: "Pocky Milk sticks" },
  ],
  "Red Bull": [
    { src: "/photos/products/red-bull-classic.webp", name: "Red Bull Classic", alt: "Red Bull Classic energy drink" },
    { src: "/photos/products/red-bull-blue.webp", name: "Red Bull Blue", alt: "Red Bull Blue bottle" },
    { src: "/photos/products/warrior-grape-can.webp", name: "Warrior Grape", alt: "Warrior Grape energy drink can" },
    { src: "/photos/products/warrior-strawberry.webp", name: "Warrior Strawberry", alt: "Warrior Strawberry bottle" },
  ],
  "Mars · Wrigley": [
    { src: "/photos/products/mars-mm.webp", name: "M&M's", alt: "M&M's candies" },
    { src: "/photos/products/mars-snickers.webp", name: "Snickers", alt: "Snickers chocolate bar" },
    { src: "/photos/products/mars-doublemint.webp", name: "Doublemint", alt: "Doublemint chewing gum" },
    { src: "/photos/products/mars-cool-air.webp", name: "Cool Air", alt: "Cool Air mint gum" },
  ],
  AMOS: [
    { src: "/photos/products/amos-hero.webp", name: "AMOS Crayons", alt: "AMOS crayons set" },
    { src: "/photos/products/amos-bunny.webp", name: "Bunny Edition", alt: "AMOS Bunny edition" },
  ],
  BiC: [
    { src: "/photos/products/bic-lighter-1.webp", name: "BiC Lighter", alt: "BiC pocket lighter" },
    { src: "/photos/products/bic-lighter-2.webp", name: "BiC Mini Lighter", alt: "BiC mini lighter" },
    { src: "/photos/products/bic-shaver-1.webp", name: "BiC Easy Clic", alt: "BiC Easy Clic razor" },
    { src: "/photos/products/bic-shaver-2.webp", name: "BiC Hybrid 3", alt: "BiC Hybrid 3-blade razor" },
  ],
  NewChoice: [
    { src: "/photos/products/newchoice-pink-bear.webp", name: "Bear Pink 750g", alt: "NewChoice Bear Pink tropical jelly" },
    { src: "/photos/products/newchoice-yellow-bear.webp", name: "Bear Yellow 750g", alt: "NewChoice Bear Yellow mixed-fruit jelly" },
    { src: "/photos/products/newchoice-doraemon.webp", name: "Doraemon Jar", alt: "NewChoice Doraemon jelly jar" },
    { src: "/photos/products/newchoice-fruit-jelly.webp", name: "Fruit Pudding", alt: "NewChoice fruit pudding cup" },
  ],
};

export const partnerLogos: Record<string, string> = {
  "Mars · Wrigley": "/photos/logos/mars-wrigley.webp",
  TCP: "/photos/logos/tcp.webp",
  BiC: "/photos/logos/bic.webp",
  "Red Bull": "/photos/logos/red-bull.webp",
  "Glico (Pocky)": "/photos/logos/glico-pocky.webp",
  AMOS: "/photos/logos/amos.webp",
  NewChoice: "/photos/logos/newchoice.webp",
  Warrior: "/photos/logos/warrior.webp",
  "Wei Long": "/photos/logos/weilong.webp",
};
