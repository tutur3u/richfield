export type Photo = {
  src: string;
  alt: string;
  /** Source aspect ratio (w/h) — used to size containers without layout shift. */
  ratio: number;
};

export const peoplePhotos = {
  heroAerial: {
    src: "/photos/people/selected-2026-05-03.webp",
    alt: "Aerial drone view: the Richfield team spelling 'RICHFIELD' on the beach",
    ratio: 16 / 9,
  },
  gala: {
    src: "/photos/people/selected-2026-05-01.webp",
    alt: "Richfield 30-year Gala Dinner — leadership lineup in front of the anniversary backdrop",
    ratio: 3 / 2,
  },
  galaWide: {
    src: "/photos/people/selected-2026-05-04.webp",
    alt: "Richfield Group Gala Dinner — the full team on stage",
    ratio: 3 / 2,
  },
  campusGroup: {
    src: "/photos/people/selected-2026-05-05.webp",
    alt: "Richfield team portrait in front of the modern campus",
    ratio: 3 / 2,
  },
  teamBuilding: {
    src: "/photos/people/selected-2026-05-02.webp",
    alt: "Annual team-building event at the beach",
    ratio: 3 / 2,
  },
  teamBuildingEnergy: {
    src: "/photos/people/selected-2026-05-06.webp",
    alt: "Team energy at the annual beach team-building",
    ratio: 3 / 2,
  },
  teamConga: {
    src: "/photos/people/selected-2026-05-07.webp",
    alt: "The Richfield team in a conga line on the beach",
    ratio: 3 / 2,
  },
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
  "Mars · Wrigley": [
    { src: "/photos/products/mars-snickers.webp", name: "Snickers", alt: "Snickers chocolate bar" },
    { src: "/photos/products/mars-m-m.webp", name: "M&M's", alt: "M&M's candies" },
    { src: "/photos/products/mars-doublemint.webp", name: "Doublemint", alt: "Doublemint chewing gum" },
    { src: "/photos/products/mars-cool-air.webp", name: "Cool Air", alt: "Cool Air mint gum" },
    { src: "/photos/products/mars-mars-wrigley.webp", name: "Mars · Wrigley", alt: "Mars and Wrigley assortment" },
  ],
  "Glico (Pocky)": [
    { src: "/photos/products/glico-pocky-pocky-chocolate.webp", name: "Pocky Chocolate", alt: "Pocky Chocolate sticks" },
    { src: "/photos/products/glico-pocky-pocky-strawberry.webp", name: "Pocky Strawberry", alt: "Pocky Strawberry sticks" },
    { src: "/photos/products/glico-pocky-pocky-matcha.webp", name: "Pocky Matcha", alt: "Pocky Matcha sticks" },
    { src: "/photos/products/glico-pocky-pocky-milk.webp", name: "Pocky Milk", alt: "Pocky Milk sticks" },
    { src: "/photos/products/glico-pocky-pocky-cookie.webp", name: "Pocky Cookie", alt: "Pocky Cookie sticks" },
    { src: "/photos/products/glico-pocky-pocky-double-chocolate.webp", name: "Pocky Double Chocolate", alt: "Pocky Double Chocolate sticks" },
    { src: "/photos/products/glico-pocky-pocky-passion-fruit.webp", name: "Pocky Passion Fruit", alt: "Pocky Passion Fruit sticks" },
    { src: "/photos/products/glico-pocky-pocky-blueberry-yogurt.webp", name: "Pocky Blueberry Yogurt", alt: "Pocky Blueberry Yogurt sticks" },
  ],
  NewChoice: [
    { src: "/photos/products/newchoice-pink-bear.webp", name: "Bear Pink 750g", alt: "NewChoice Bear Pink tropical jelly" },
    { src: "/photos/products/newchoice-yellow-bear.webp", name: "Bear Yellow 750g", alt: "NewChoice Bear Yellow mixed-fruit jelly" },
    { src: "/photos/products/newchoice-rau-cau-gau-nau-750g-huong-vi-pudding-1579.webp", name: "Bear Brown 750g", alt: "NewChoice Bear Brown pudding jelly" },
    { src: "/photos/products/newchoice-thach-rau-cau-doraemon-hu-7264.webp", name: "Doraemon Jar", alt: "NewChoice Doraemon jelly jar" },
    { src: "/photos/products/newchoice-thach-new-choice-huong-vi-dua-hau-1957.webp", name: "Watermelon", alt: "NewChoice watermelon jelly" },
    { src: "/photos/products/newchoice-fruit-jelly.webp", name: "Fruit Pudding Cup", alt: "NewChoice fruit pudding cup" },
  ],
  AMOS: [
    { src: "/photos/products/amos-amos.webp", name: "AMOS Crayons", alt: "AMOS crayons set" },
    { src: "/photos/products/amos-bunny.webp", name: "Bunny Edition", alt: "AMOS Bunny edition" },
    { src: "/photos/products/amos-hero.webp", name: "AMOS Studio Pack", alt: "AMOS studio pack" },
  ],
  "Red Bull": [
    { src: "/photos/products/red-bull-classic.webp", name: "Red Bull Classic", alt: "Red Bull Classic energy drink" },
    { src: "/photos/products/red-bull-blue.webp", name: "Red Bull Blue", alt: "Red Bull Blue bottle" },
    { src: "/photos/products/redbull-rb-extra.webp", name: "Red Bull Extra", alt: "Red Bull Extra energy drink" },
  ],
  Warrior: [
    { src: "/photos/products/warrior-grape-can.webp", name: "Warrior Grape Can", alt: "Warrior Grape energy drink can" },
    { src: "/photos/products/warrior-strawberry.webp", name: "Warrior Strawberry", alt: "Warrior Strawberry bottle" },
    { src: "/photos/products/redbull-warrior-nho-chai.webp", name: "Warrior Grape Bottle", alt: "Warrior Grape bottle" },
    { src: "/photos/products/redbull-warrior-dau-lon.webp", name: "Warrior Strawberry Can", alt: "Warrior Strawberry can" },
  ],
  BiC: [
    { src: "/photos/products/bic-lighters-1.webp", name: "BiC Lighter", alt: "BiC pocket lighter" },
    { src: "/photos/products/bic-lighters-2.webp", name: "BiC Mini Lighter", alt: "BiC mini lighter" },
    { src: "/photos/products/bic-lighters-3.webp", name: "BiC J3 Slim", alt: "BiC J3 slim lighter" },
    { src: "/photos/products/bic-shavers-1.webp", name: "BiC Easy Clic", alt: "BiC Easy Clic razor" },
    { src: "/photos/products/bic-shavers-2.webp", name: "BiC Hybrid 3", alt: "BiC Hybrid 3-blade razor" },
    { src: "/photos/products/bic-shavers-3.webp", name: "BiC Lady 2", alt: "BiC Lady 2-blade razor" },
  ],
};

export const partnerLogos: Record<string, string> = {
  "Mars · Wrigley": "/photos/logos/mars-wrigley.webp",
  TCP: "/photos/logos/tcp.webp",
  BiC: "/photos/logos/bic.webp",
  "Red Bull": "/photos/logos/red-bull.webp",
  "Glico (Pocky)": "/photos/logos/glico-pocky.webp",
  Glico: "/photos/logos/glico.webp",
  AMOS: "/photos/logos/amos.webp",
  NewChoice: "/photos/logos/newchoice.webp",
  Warrior: "/photos/logos/warrior.webp",
  "Wei Long": "/photos/logos/weilong.webp",
  Caretex: "/photos/logos/care.webp",
  "Dory Rich": "/photos/logos/dory-rich.webp",
};
