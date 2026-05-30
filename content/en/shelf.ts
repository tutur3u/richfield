// The Full Shelf — imagery for the §05 directory mosaic.
//
// Two kinds of asset, routed to two treatments:
//   • banner  — wide TVC / campaign frames, shown full-bleed at their native
//     aspect ratio (no crop). `ratio` is the intrinsic w/h; `weight` controls
//     how many columns the tile claims.
//   • packshot — a clean isolated product, shown inside a bordered box with the
//     product centred (object-contain), so its own aspect is preserved too.
//
// Categories mirror the Coca-Cola "all brands" model: one category fills the
// viewport at a time, switched by the tab rail.

export type BannerWeight = "hero" | "wide" | "feature";

export type ShelfBanner = {
  src: string;
  alt: string;
  brand: string;
  /** Intrinsic width / height, used to preserve aspect ratio without cropping. */
  ratio: number;
  weight: BannerWeight;
};

export type ShelfPackshot = {
  src: string;
  alt: string;
  brand: string;
  name: string;
  /** When true, the box claims extra columns to break grid monotony. */
  feature?: boolean;
};

export type ShelfCategory = {
  id: "food" | "beverages" | "non-food";
  label: string;
  descriptor: string;
  /** Roster names — drives the tab count and the credit line. */
  brands: string[];
  banners: ShelfBanner[];
  packshots: ShelfPackshot[];
};

const P = "/photos/products";

export const shelfCategories: ShelfCategory[] = [
  {
    id: "food",
    label: "Food",
    descriptor: "Confectionery, snacks, and stationery treats.",
    brands: ["Mars · Wrigley", "Glico", "NewChoice", "AMOS", "Wei Long"],
    banners: [
      { src: `${P}/amos-bunny.webp`, brand: "AMOS", ratio: 3.11, weight: "hero", alt: "AMOS Peelitz gummy candy — spring campaign" },
      { src: `${P}/mars-m-m.webp`, brand: "M&M's", ratio: 1.43, weight: "wide", alt: "M&M's movie-night campaign" },
      { src: `${P}/mars-cool-air.webp`, brand: "Cool Air", ratio: 1.01, weight: "feature", alt: "Wrigley Cool Air gum campaign" },
      { src: `${P}/mars-snickers.webp`, brand: "Snickers", ratio: 1.68, weight: "wide", alt: "Snickers almond dark-chocolate campaign" },
      { src: `${P}/mars-doublemint.webp`, brand: "Doublemint", ratio: 1.40, weight: "wide", alt: "Wrigley Doublemint gum campaign" },
      { src: `${P}/amos-hero.webp`, brand: "AMOS", ratio: 1.78, weight: "wide", alt: "AMOS — A Moment of Smile campaign" },
    ],
    packshots: [
      { src: `${P}/glico-pocky-pocky-chocolate.webp`, brand: "Glico", name: "Pocky Chocolate", alt: "Pocky Chocolate sticks", feature: true },
      { src: `${P}/glico-pocky-pocky-strawberry.webp`, brand: "Glico", name: "Pocky Strawberry", alt: "Pocky Strawberry sticks" },
      { src: `${P}/glico-pocky-pocky-matcha.webp`, brand: "Glico", name: "Pocky Matcha", alt: "Pocky Matcha sticks" },
      { src: `${P}/glico-pocky-pocky-milk.webp`, brand: "Glico", name: "Pocky Milk", alt: "Pocky Milk sticks" },
      { src: `${P}/glico-pocky-pocky-cookie.webp`, brand: "Glico", name: "Pocky Cookie", alt: "Pocky Cookie sticks" },
      { src: `${P}/glico-pocky-pocky-double-chocolate.webp`, brand: "Glico", name: "Pocky Double Choc", alt: "Pocky Double Chocolate sticks" },
      { src: `${P}/glico-pocky-pocky-passion-fruit.webp`, brand: "Glico", name: "Pocky Passion Fruit", alt: "Pocky Passion Fruit sticks" },
      { src: `${P}/glico-pocky-pocky-blueberry-yogurt.webp`, brand: "Glico", name: "Pocky Blueberry", alt: "Pocky Blueberry Yogurt sticks" },
      { src: `${P}/newchoice-pink-bear.webp`, brand: "NewChoice", name: "Bear Pink", alt: "NewChoice Bear Pink tropical jelly", feature: true },
      { src: `${P}/newchoice-yellow-bear.webp`, brand: "NewChoice", name: "Bear Yellow", alt: "NewChoice Bear Yellow mixed-fruit jelly" },
      { src: `${P}/newchoice-rau-cau-gau-nau-750g-huong-vi-pudding-1579.webp`, brand: "NewChoice", name: "Bear Brown", alt: "NewChoice Bear Brown pudding jelly" },
      { src: `${P}/newchoice-doraemon.webp`, brand: "NewChoice", name: "Doraemon Jar", alt: "NewChoice Doraemon jelly jar" },
      { src: `${P}/newchoice-thach-new-choice-huong-vi-dua-hau-1957.webp`, brand: "NewChoice", name: "Watermelon", alt: "NewChoice watermelon jelly" },
      { src: `${P}/newchoice-fruit-jelly.webp`, brand: "NewChoice", name: "Pudding Cup", alt: "NewChoice fruit pudding cup" },
    ],
  },
  {
    id: "beverages",
    label: "Beverages",
    descriptor: "Energy and refreshment for the working day.",
    brands: ["Red Bull", "Warrior"],
    banners: [],
    packshots: [
      { src: `${P}/red-bull-classic.webp`, brand: "Red Bull", name: "Red Bull Classic", alt: "Red Bull Classic energy drink", feature: true },
      { src: `${P}/red-bull-blue.webp`, brand: "Red Bull", name: "Red Bull Bottle", alt: "Red Bull glass bottle" },
      { src: `${P}/redbull-rb-den.webp`, brand: "Red Bull", name: "RB Black", alt: "Red Bull black-label bottle" },
      { src: `${P}/redbull-rb-extra.webp`, brand: "Red Bull", name: "Red Bull Extra", alt: "Red Bull Extra energy drink" },
      { src: `${P}/redbull-rb-moi.webp`, brand: "Red Bull", name: "RB New", alt: "Red Bull new-label bottle" },
      { src: `${P}/warrior-grape-can.webp`, brand: "Warrior", name: "Grape Can", alt: "Warrior Grape energy drink can", feature: true },
      { src: `${P}/warrior-strawberry.webp`, brand: "Warrior", name: "Strawberry", alt: "Warrior Strawberry bottle" },
      { src: `${P}/redbull-warrior-nho-chai.webp`, brand: "Warrior", name: "Grape Bottle", alt: "Warrior Grape bottle" },
      { src: `${P}/redbull-warrior-dau-lon.webp`, brand: "Warrior", name: "Strawberry Can", alt: "Warrior Strawberry can" },
    ],
  },
  {
    id: "non-food",
    label: "Non-Food",
    descriptor: "Everyday tools and personal care.",
    brands: ["BiC", "Caretex"],
    banners: [
      { src: `${P}/bic-lighters-3.webp`, brand: "BiC", ratio: 1.77, weight: "hero", alt: "BiC lighters — brand-for-every-home campaign" },
      { src: `${P}/bic-shavers-1.webp`, brand: "BiC", ratio: 1.0, weight: "feature", alt: "BiC shaver — bathroom lifestyle scene" },
      { src: `${P}/bic-lighters-4.webp`, brand: "BiC", ratio: 2.28, weight: "wide", alt: "BiC lighters — French Tech quality" },
    ],
    packshots: [
      { src: `${P}/bic-shaver-1.webp`, brand: "BiC", name: "Easy Clic", alt: "BiC Easy Clic razor and refill" },
      { src: `${P}/bic-shaver-2.webp`, brand: "BiC", name: "Hybrid 3", alt: "BiC Hybrid 3-blade razor" },
      { src: `${P}/bic-shavers-2.webp`, brand: "BiC", name: "Lady 2", alt: "BiC Lady 2-blade razors" },
    ],
  },
];
