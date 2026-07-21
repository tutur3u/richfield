// Vietnamese content — machine-translated first pass. Needs native review before launch.
// The Full Shelf — imagery for the §05 directory mosaic.
import type { BannerWeight, ShelfBanner, ShelfPackshot, ShelfCategory } from "@/content/en/shelf";

export type { BannerWeight, ShelfBanner, ShelfPackshot, ShelfCategory };

const P = "/photos/products";

export const shelfCategories: ShelfCategory[] = [
  {
    id: "food",
    label: "Thực phẩm",
    descriptor: "Bánh kẹo, snack và đồ ngọt.",
    brands: ["Mars · Wrigley", "Glico", "NewChoice", "AMOS", "Wei Long"],
    banners: [
      { src: `${P}/amos/amos-bunny.webp`, brand: "AMOS", ratio: 3.11, weight: "hero", alt: "Kẹo dẻo AMOS Peelitz — chiến dịch mùa xuân" },
      { src: `${P}/mars-m-m.webp`, brand: "M&M's", ratio: 1.43, weight: "wide", alt: "M&M's — chiến dịch đêm xem phim" },
      { src: `${P}/mars-cool-air.webp`, brand: "Cool Air", ratio: 1.01, weight: "feature", alt: "Chiến dịch kẹo cao su Wrigley Cool Air" },
      { src: `${P}/mars-snickers.webp`, brand: "Snickers", ratio: 1.68, weight: "wide", alt: "Chiến dịch Snickers sô-cô-la đen hạnh nhân" },
      { src: `${P}/mars-doublemint.webp`, brand: "Doublemint", ratio: 1.40, weight: "wide", alt: "Chiến dịch kẹo cao su Wrigley Doublemint" },
      { src: `${P}/amos/amos-hero.webp`, brand: "AMOS", ratio: 1.78, weight: "wide", alt: "AMOS — chiến dịch A Moment of Smile" },
    ],
    packshots: [
      { src: `${P}/glico-pocky-pocky-chocolate.webp`, brand: "Glico", name: "Pocky Chocolate", alt: "Que Pocky Chocolate", feature: true },
      { src: `${P}/glico-pocky-pocky-strawberry.webp`, brand: "Glico", name: "Pocky Strawberry", alt: "Que Pocky Strawberry" },
      { src: `${P}/glico-pocky-pocky-matcha.webp`, brand: "Glico", name: "Pocky Matcha", alt: "Que Pocky Matcha" },
      { src: `${P}/glico-pocky-pocky-milk.webp`, brand: "Glico", name: "Pocky Milk", alt: "Que Pocky Milk" },
      { src: `${P}/glico-pocky-pocky-cookie.webp`, brand: "Glico", name: "Pocky Cookie", alt: "Que Pocky Cookie" },
      { src: `${P}/glico-pocky-pocky-double-chocolate.webp`, brand: "Glico", name: "Pocky Double Choc", alt: "Que Pocky Double Chocolate" },
      { src: `${P}/glico-pocky-pocky-passion-fruit.webp`, brand: "Glico", name: "Pocky Passion Fruit", alt: "Que Pocky Passion Fruit" },
      { src: `${P}/glico-pocky-pocky-blueberry-yogurt.webp`, brand: "Glico", name: "Pocky Blueberry", alt: "Que Pocky Blueberry Yogurt" },
      { src: `${P}/newchoice-pink-bear.webp`, brand: "NewChoice", name: "Bear Pink", alt: "Thạch trái cây nhiệt đới NewChoice Bear Pink", feature: true },
      { src: `${P}/newchoice-yellow-bear.webp`, brand: "NewChoice", name: "Bear Yellow", alt: "Thạch trái cây hỗn hợp NewChoice Bear Yellow" },
      { src: `${P}/newchoice-rau-cau-gau-nau-750g-huong-vi-pudding-1579.webp`, brand: "NewChoice", name: "Bear Brown", alt: "Thạch pudding NewChoice Bear Brown" },
      { src: `${P}/newchoice-doraemon.webp`, brand: "NewChoice", name: "Doraemon Jar", alt: "Hũ thạch NewChoice Doraemon" },
      { src: `${P}/newchoice-thach-new-choice-huong-vi-dua-hau-1957.webp`, brand: "NewChoice", name: "Watermelon", alt: "Thạch NewChoice hương dưa hấu" },
      { src: `${P}/newchoice-fruit-jelly.webp`, brand: "NewChoice", name: "Pudding Cup", alt: "Cốc pudding trái cây NewChoice" },
    ],
  },
  {
    id: "beverages",
    label: "Đồ uống",
    descriptor: "Năng lượng và sự sảng khoái cho ngày làm việc.",
    brands: ["Red Bull", "Warrior"],
    banners: [],
    packshots: [
      { src: `${P}/red-bull-classic.webp`, brand: "Red Bull", name: "Red Bull Classic", alt: "Nước tăng lực Red Bull Classic", feature: true },
      { src: `${P}/red-bull-blue.webp`, brand: "Red Bull", name: "Red Bull Bottle", alt: "Chai thủy tinh Red Bull" },
      { src: `${P}/redbull-rb-den.webp`, brand: "Red Bull", name: "RB Black", alt: "Chai Red Bull nhãn đen" },
      { src: `${P}/redbull-rb-extra.webp`, brand: "Red Bull", name: "Red Bull Extra", alt: "Nước tăng lực Red Bull Extra" },
      { src: `${P}/redbull-rb-moi.webp`, brand: "Red Bull", name: "RB New", alt: "Chai Red Bull nhãn mới" },
      { src: `${P}/warrior-grape-can.webp`, brand: "Warrior", name: "Grape Can", alt: "Lon nước tăng lực Warrior vị nho", feature: true },
      { src: `${P}/warrior-strawberry.webp`, brand: "Warrior", name: "Strawberry", alt: "Chai Warrior vị dâu" },
      { src: `${P}/redbull-warrior-nho-chai.webp`, brand: "Warrior", name: "Grape Bottle", alt: "Chai Warrior vị nho" },
      { src: `${P}/redbull-warrior-dau-lon.webp`, brand: "Warrior", name: "Strawberry Can", alt: "Lon Warrior vị dâu" },
    ],
  },
  {
    id: "non-food",
    label: "Phi thực phẩm",
    descriptor: "Nhu yếu phẩm hằng ngày và chăm sóc cá nhân.",
    brands: ["BiC", "Caretex"],
    banners: [
      { src: `${P}/bic-lighters-3.webp`, brand: "BiC", ratio: 1.77, weight: "hero", alt: "Bật lửa BiC — chiến dịch thương hiệu cho mọi gia đình" },
      { src: `${P}/bic-shavers-1.webp`, brand: "BiC", ratio: 1.0, weight: "feature", alt: "Dao cạo BiC — khung cảnh phòng tắm đời thường" },
      { src: `${P}/bic-lighters-4.webp`, brand: "BiC", ratio: 2.28, weight: "wide", alt: "Bật lửa BiC — chất lượng công nghệ Pháp" },
    ],
    packshots: [
      { src: `${P}/bic-shaver-1.webp`, brand: "BiC", name: "Easy Clic", alt: "Dao cạo BiC Easy Clic và lưỡi thay thế" },
      { src: `${P}/bic-shaver-2.webp`, brand: "BiC", name: "Hybrid 3", alt: "Dao cạo 3 lưỡi BiC Hybrid 3" },
      { src: `${P}/bic-shavers-2.webp`, brand: "BiC", name: "Lady 2", alt: "Dao cạo 2 lưỡi BiC Lady" },
      { src: `${P}/care-latex/bao-cao-su-bcs-sieu-mong-tron-carelatex-care-22-co-gai-huong-nuoc-hoa-paris-1.webp`, brand: "Caretex", name: "Care 22", alt: "Bao cao su siêu mỏng Caretex Care 22 — hương nước hoa Paris", feature: true },
      { src: `${P}/care-latex/bao-cao-su-bcs-sieu-mong-tron-carelatex-care-48-co-gai-huong-dau-1.webp`, brand: "Caretex", name: "Care 48", alt: "Bao cao su siêu mỏng Caretex Care 48 — hương dâu" },
      { src: `${P}/care-latex/bao-cao-su-bcs-sieu-mong-tron-carelatex-care-50-co-gai-huong-dua-rung-nhiet-doi-1.webp`, brand: "Caretex", name: "Care 50", alt: "Bao cao su siêu mỏng Caretex Care 50 — hương dừa nhiệt đới" },
      { src: `${P}/care-latex/bao-cao-su-bcs-sieu-mong-tron-keo-dai-thoi-gian-quan-he-carelatex-care-46-co-gai-huong-ba-ha-1.webp`, brand: "Caretex", name: "Care 46", alt: "Bao cao su kéo dài thời gian Caretex Care 46 — hương bạc hà" },
    ],
  },
];
