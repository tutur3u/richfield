// Vietnamese content — machine-translated first pass. Needs native review before launch.
import type { Photo, ProductPhoto } from "@/content/en/photography";

export type { Photo, ProductPhoto };

export const peoplePhotos = {
  heroAerial: {
    src: "/photos/people/selected-2026-05-03.webp",
    alt: "Góc nhìn flycam từ trên cao: tập thể Richfield xếp chữ 'RICHFIELD' trên bãi biển",
    ratio: 16 / 9,
  },
  gala: {
    src: "/photos/people/selected-2026-05-01.webp",
    alt: "Tiệc Gala kỷ niệm 30 năm Richfield — ban lãnh đạo chụp ảnh trước phông nền kỷ niệm",
    ratio: 3 / 2,
  },
  galaWide: {
    src: "/photos/people/selected-2026-05-04.webp",
    alt: "Tiệc Gala Richfield Group — toàn thể đội ngũ trên sân khấu",
    ratio: 3 / 2,
  },
  campusGroup: {
    src: "/photos/people/selected-2026-05-05.webp",
    alt: "Ảnh tập thể Richfield trước khuôn viên văn phòng hiện đại",
    ratio: 3 / 2,
  },
  teamBuilding: {
    src: "/photos/people/selected-2026-05-02.webp",
    alt: "Sự kiện team building thường niên tại bãi biển",
    ratio: 3 / 2,
  },
  teamBuildingEnergy: {
    src: "/photos/people/selected-2026-05-06.webp",
    alt: "Năng lượng đội nhóm tại sự kiện team building bãi biển thường niên",
    ratio: 3 / 2,
  },
  teamConga: {
    src: "/photos/people/selected-2026-05-07.webp",
    alt: "Tập thể Richfield nối hàng conga trên bãi biển",
    ratio: 3 / 2,
  },
  groupCompany: {
    src: "/photos/people/group-company-1920.webp",
    alt: "Toàn thể đội ngũ Richfield trong bức ảnh tập thể thường niên của công ty",
    ratio: 3 / 2,
  },
  groupCompanyWide: {
    src: "/photos/people/group-company-1280.webp",
    alt: "Toàn thể đội ngũ Richfield trong bức ảnh tập thể thường niên của công ty",
    ratio: 3 / 2,
  },
  grandOpening: {
    src: "/photos/people/grand-opening-2026-1280.webp",
    alt: "Nghi thức cắt băng khánh thành văn phòng năm 2026",
    ratio: 4 / 3,
  },
  happyTime: {
    src: "/photos/people/happy-time-2025-11-1280.webp",
    alt: "Buổi giao lưu đội ngũ, tháng 11 năm 2025",
    ratio: 4 / 3,
  },
  workshop1: {
    src: "/photos/people/workshop-1-1280.webp",
    alt: "Buổi đào tạo đội ngũ kinh doanh",
    ratio: 4 / 3,
  },
  workshop2: {
    src: "/photos/people/workshop-2-1280.webp",
    alt: "Buổi hội thảo hoạch định liên phòng ban",
    ratio: 4 / 3,
  },
  workshop3: {
    src: "/photos/people/workshop-3-1280.webp",
    alt: "Buổi hội thảo của đội ngũ thị trường đang diễn ra",
    ratio: 4 / 3,
  },
  workshopRoom: {
    src: "/photos/people/workshop-room-1280.webp",
    alt: "Phòng đào tạo được chuẩn bị cho buổi hội thảo",
    ratio: 4 / 3,
  },
  unionCongress: {
    src: "/photos/people/union-congress-2025-1280.webp",
    alt: "Đại hội Công đoàn thường niên, năm 2025",
    ratio: 4 / 3,
  },
  celebration: {
    src: "/photos/people/celebration-1280.webp",
    alt: "Khoảnh khắc ăn mừng của đội ngũ",
    ratio: 4 / 3,
  },
  candid1: {
    src: "/photos/people/candid-1-1280.webp",
    alt: "Một khoảnh khắc đời thường tại văn phòng",
    ratio: 3 / 2,
  },
  candid2: {
    src: "/photos/people/candid-2-1280.webp",
    alt: "Đồng nghiệp trò chuyện giữa các cuộc họp",
    ratio: 3 / 2,
  },
} satisfies Record<string, Photo>;

export const productPhotos: Record<string, ProductPhoto[]> = {
  "Mars · Wrigley": [
    { src: "/photos/products/mars-snickers.webp", name: "Snickers", alt: "Thanh sô-cô-la Snickers" },
    { src: "/photos/products/mars-m-m.webp", name: "M&M's", alt: "Kẹo sô-cô-la M&M's" },
    { src: "/photos/products/mars-doublemint.webp", name: "Doublemint", alt: "Kẹo cao su Doublemint" },
    { src: "/photos/products/mars-cool-air.webp", name: "Cool Air", alt: "Kẹo cao su bạc hà Cool Air" },
    { src: "/photos/products/mars-mars-wrigley.webp", name: "Mars · Wrigley", alt: "Bộ sản phẩm Mars và Wrigley" },
  ],
  "Glico (Pocky)": [
    { src: "/photos/products/glico-pocky-pocky-chocolate.webp", name: "Pocky Chocolate", alt: "Que Pocky Chocolate" },
    { src: "/photos/products/glico-pocky-pocky-strawberry.webp", name: "Pocky Strawberry", alt: "Que Pocky Strawberry" },
    { src: "/photos/products/glico-pocky-pocky-matcha.webp", name: "Pocky Matcha", alt: "Que Pocky Matcha" },
    { src: "/photos/products/glico-pocky-pocky-milk.webp", name: "Pocky Milk", alt: "Que Pocky Milk" },
    { src: "/photos/products/glico-pocky-pocky-cookie.webp", name: "Pocky Cookie", alt: "Que Pocky Cookie" },
    { src: "/photos/products/glico-pocky-pocky-double-chocolate.webp", name: "Pocky Double Chocolate", alt: "Que Pocky Double Chocolate" },
    { src: "/photos/products/glico-pocky-pocky-passion-fruit.webp", name: "Pocky Passion Fruit", alt: "Que Pocky Passion Fruit" },
    { src: "/photos/products/glico-pocky-pocky-blueberry-yogurt.webp", name: "Pocky Blueberry Yogurt", alt: "Que Pocky Blueberry Yogurt" },
  ],
  NewChoice: [
    { src: "/photos/products/newchoice-pink-bear.webp", name: "Bear Pink 750g", alt: "Thạch trái cây nhiệt đới NewChoice Bear Pink" },
    { src: "/photos/products/newchoice-yellow-bear.webp", name: "Bear Yellow 750g", alt: "Thạch trái cây hỗn hợp NewChoice Bear Yellow" },
    { src: "/photos/products/newchoice-rau-cau-gau-nau-750g-huong-vi-pudding-1579.webp", name: "Bear Brown 750g", alt: "Thạch pudding NewChoice Bear Brown" },
    { src: "/photos/products/newchoice-thach-rau-cau-doraemon-hu-7264.webp", name: "Doraemon Jar", alt: "Hũ thạch NewChoice Doraemon" },
    { src: "/photos/products/newchoice-thach-new-choice-huong-vi-dua-hau-1957.webp", name: "Watermelon", alt: "Thạch NewChoice hương dưa hấu" },
    { src: "/photos/products/newchoice-fruit-jelly.webp", name: "Fruit Pudding Cup", alt: "Cốc pudding trái cây NewChoice" },
  ],
  AMOS: [
    { src: "/photos/products/amos/amos-amos.webp", name: "AMOS Crayons", alt: "Bộ bút sáp AMOS" },
    { src: "/photos/products/amos/amos-bunny.webp", name: "Bunny Edition", alt: "AMOS phiên bản Bunny" },
    { src: "/photos/products/amos/amos-hero.webp", name: "AMOS Studio Pack", alt: "Bộ AMOS Studio Pack" },
  ],
  "Red Bull": [
    { src: "/photos/products/red-bull-classic.webp", name: "Red Bull Classic", alt: "Nước tăng lực Red Bull Classic" },
    { src: "/photos/products/red-bull-blue.webp", name: "Red Bull Blue", alt: "Chai Red Bull Blue" },
    { src: "/photos/products/redbull-rb-extra.webp", name: "Red Bull Extra", alt: "Nước tăng lực Red Bull Extra" },
  ],
  Warrior: [
    { src: "/photos/products/warrior-grape-can.webp", name: "Warrior Grape Can", alt: "Lon nước tăng lực Warrior vị nho" },
    { src: "/photos/products/warrior-strawberry.webp", name: "Warrior Strawberry", alt: "Chai Warrior vị dâu" },
    { src: "/photos/products/redbull-warrior-nho-chai.webp", name: "Warrior Grape Bottle", alt: "Chai Warrior vị nho" },
    { src: "/photos/products/redbull-warrior-dau-lon.webp", name: "Warrior Strawberry Can", alt: "Lon Warrior vị dâu" },
  ],
  BiC: [
    { src: "/photos/products/bic-lighters-1.webp", name: "BiC Lighter", alt: "Bật lửa bỏ túi BiC" },
    { src: "/photos/products/bic-lighters-2.webp", name: "BiC Mini Lighter", alt: "Bật lửa mini BiC" },
    { src: "/photos/products/bic-lighters-3.webp", name: "BiC J3 Slim", alt: "Bật lửa BiC J3 slim" },
    { src: "/photos/products/bic-shavers-1.webp", name: "BiC Easy Clic", alt: "Dao cạo BiC Easy Clic" },
    { src: "/photos/products/bic-shavers-2.webp", name: "BiC Hybrid 3", alt: "Dao cạo 3 lưỡi BiC Hybrid 3" },
    { src: "/photos/products/bic-shavers-3.webp", name: "BiC Lady 2", alt: "Dao cạo 2 lưỡi BiC Lady 2" },
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
