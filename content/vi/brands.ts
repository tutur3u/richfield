// Vietnamese content — machine-translated first pass. Needs native review before launch.
import { partnerLogos } from "./photography";
import type { Milestone } from "./milestones";
import type { Brand, BrandCategory } from "@/content/en/brands";

export type { Brand, BrandCategory };

const brandDetails: Array<Omit<Brand, "logoSrc">> = [
  {
    name: "Mars · Wrigley",
    country: "Hoa Kỳ",
    year: 1994,
    feature: true,
    featureCaption: "Đối tác sáng lập · Từ năm 1994",
    category: "Food",
    accent: "bg-[oklch(0.86_0.12_28/0.18)]",
    story:
      "Đối tác sáng lập của chúng tôi. Wrigley's là thương hiệu nhập khẩu đầu tiên của Richfield ngay trong năm Hoa Kỳ dỡ bỏ lệnh cấm vận thương mại.",
  },
  {
    name: "BiC",
    country: "Pháp",
    year: 2018,
    category: "Non-Food",
    accent: "bg-[oklch(0.55_0.12_258/0.14)]",
    story:
      "Dao cạo và bật lửa BIC giúp mở rộng tầm phủ của Richfield sang các sản phẩm chăm sóc cá nhân và nhu yếu phẩm hằng ngày.",
  },
  {
    name: "Red Bull",
    country: "Thái Lan",
    year: 2016,
    category: "Beverages",
    accent: "bg-[oklch(0.62_0.22_28/0.16)]",
    story:
      "Warrior và Red Bull đưa nước tăng lực vào danh mục — hai trong những thương hiệu đồ uống tăng trưởng nhanh nhất Việt Nam.",
  },
  {
    name: "Glico (Pocky)",
    country: "Nhật Bản",
    year: 2026,
    category: "Food",
    accent: "bg-[oklch(0.82_0.13_15/0.16)]",
    story:
      "Pocky và bánh kẹo; quan hệ hợp tác quốc tế mới nhất của chúng tôi.",
  },
  {
    name: "AMOS",
    country: "Trung Quốc",
    year: 2022,
    category: "Food",
    accent: "bg-[oklch(0.78_0.13_215/0.14)]",
    story:
      "AMOS mang dòng bánh kẹo châu Á được yêu thích vào danh mục, làm phong phú thêm mảng snack và quà vặt của chúng tôi.",
  },
  {
    name: "NewChoice",
    country: "Đài Loan",
    year: 1999,
    category: "Food",
    accent: "bg-[oklch(0.86_0.14_92/0.18)]",
    story:
      "Thạch hũ gấu và rau câu pudding — sản phẩm quen thuộc trong mọi gia đình Việt Nam từ năm 1999.",
  },
  {
    name: "Warrior",
    country: "Thái Lan",
    category: "Beverages",
    accent: "bg-[oklch(0.76_0.18_55/0.16)]",
    story:
      "Dòng nước tăng lực hướng đến giới trẻ của TCP Group — đậm vị trái cây và đang tăng trưởng nhanh.",
  },
  {
    name: "Wei Long",
    country: "Trung Quốc",
    category: "Food",
    accent: "bg-[oklch(0.66_0.2_28/0.14)]",
    story:
      "Snack cay từ bột mì. Món ăn vặt đường phố châu Á đình đám, vừa chính thức có mặt tại Việt Nam.",
  },
  {
    name: "Caretex",
    country: "Việt Nam",
    category: "Non-Food",
    accent: "bg-[oklch(0.65_0.1_148/0.16)]",
    story:
      "Sản phẩm chăm sóc cá nhân được sản xuất trong nước cho thị trường Việt Nam.",
  },
];

export const brands: Brand[] = brandDetails.map((brand) => ({
  ...brand,
  logoSrc: partnerLogos[brand.name],
}));

export const homepageBrands = brands;

// Brand-collaboration timeline — when each partnership began, oldest first.
// Only brands with a known start year appear; mapped to the milestone shape so
// the /brands page can reuse <JourneyTimeline />.
export const brandTimeline: Milestone[] = brands
  .filter((b): b is Brand & { year: number } => typeof b.year === "number")
  .sort((a, b) => a.year - b.year)
  .map((b) => ({
    year: b.year,
    brand: b.name,
    country: b.country,
    body: b.story ?? "",
  }));

export const featuredPartners: Array<{
  name: string;
  logoKey: string;
  country: string;
  year: number;
  story: string;
}> = [
  {
    name: "Mars · Wrigley",
    logoKey: "Mars · Wrigley",
    country: "Hoa Kỳ",
    year: 1994,
    story:
      "Đối tác sáng lập của chúng tôi. Wrigley's là thương hiệu nhập khẩu đầu tiên của Richfield ngay trong năm Hoa Kỳ dỡ bỏ lệnh cấm vận thương mại.",
  },
  {
    name: "Red Bull",
    logoKey: "Red Bull",
    country: "Thái Lan",
    year: 2016,
    story:
      "Warrior và Red Bull đưa nước tăng lực vào danh mục — hai trong những thương hiệu đồ uống tăng trưởng nhanh nhất Việt Nam.",
  },
  {
    name: "Glico",
    logoKey: "Glico (Pocky)",
    country: "Nhật Bản",
    year: 2026,
    story:
      "Pocky và bánh kẹo; quan hệ hợp tác quốc tế mới nhất của chúng tôi.",
  },
];
