// Vietnamese content — machine-translated first pass. Needs native review before launch.
import type { Milestone } from "@/content/en/milestones";

export type { Milestone };

// The company timeline as set out in the final content doc — six milestones
// from the founding partnership to the 30-year mark. `brand` doubles as the
// logo key where a milestone has a mark; company milestones leave it as
// "Group" and simply show no logo.
export const milestones: Milestone[] = [
  {
    year: 1994,
    brand: "Mars",
    country: "Hoa Kỳ",
    body: "Mars Wrigley Việt Nam lựa chọn Richfield làm nhà phân phối — mối quan hệ hợp tác khởi đầu cho tất cả.",
  },
  {
    year: 1999,
    brand: "Group",
    country: "Việt Nam",
    body: "Bill Chua tiếp nhận vai trò lãnh đạo từ nhà sáng lập Chua Eng Siang.",
  },
  {
    year: 2006,
    brand: "Group",
    country: "Việt Nam",
    body: "Chính thức thành lập pháp nhân Công ty Cổ phần Phú Trường Quốc Tế (Richfield Worldwide JSC).",
  },
  {
    year: 2010,
    brand: "Group",
    country: "Việt Nam",
    body: "Thành lập Công Ty Cổ Phần Thực Phẩm Phú Tường (Richfield Foods JSC) tại Long An.",
  },
  {
    year: 2016,
    brand: "Warrior",
    country: "Thái Lan",
    body: "Trở thành nhà phân phối của Nước tăng lực Warrior (Tập đoàn TCP, Thái Lan).",
  },
  {
    year: 2024,
    brand: "Dory Rich JSC",
    country: "Việt Nam",
    body: "Khai trương Trung tâm Phân phối miền Bắc; thành lập Dory Rich JSC.",
  },
];

export const homepageMilestones = milestones.filter((m) => !m.aboutOnly);
