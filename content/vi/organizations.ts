// Vietnamese content — machine-translated first pass. Needs native review before launch.
// The three operating companies, as described in the "Who We Are" section of
// the final content doc.
import type { Organization } from "@/content/en/organizations";

export type { Organization };

export const whoWeAreIntro =
  "Richfield cung cấp dịch vụ phân phối FMCG trọn gói — từ lựa chọn nhà cung cấp và nhập khẩu, đến đóng gói, lưu kho, vận chuyển và bán hàng. Chúng tôi đảm nhận toàn bộ hành trình để các đối tác thương hiệu có thể tập trung vào thế mạnh của mình.";

export const organizations: Organization[] = [
  {
    name: "Công ty Cổ phần Phú Trường Quốc Tế (Richfield Worldwide JSC)",
    established: "Thành lập 1994",
    body: "Công ty phân phối cốt lõi của chúng tôi. Phủ khắp các tỉnh thành qua kênh truyền thống, kênh hiện đại, B2B và thương mại điện tử — với 180,000+ điểm bán lẻ trên toàn quốc.",
    href: "/distribution",
    linkLabel: "Các kênh phân phối",
    logo: "/photos/logos/richfield.webp",
  },
  {
    name: "Công Ty Cổ Phần Thực Phẩm Phú Tường (Richfield Foods JSC)",
    established: "Thành lập 2010",
    body: "Cơ sở đóng gói, kho thường và kho mát của chúng tôi. Tọa lạc tại Khu công nghiệp Đức Hòa 1, tỉnh Tây Ninh (Long An cũ) — tổng diện tích 20,000 m² đạt chứng nhận ISO & HACCP, có đầu tư hệ thống kho mát duy trì ở 18–25°C.",
    href: "/logistics",
    linkLabel: "Logistics & kho vận",
  },
  {
    name: "Dory Rich JSC",
    established: "Thành lập tháng 10/2024",
    body: "Công ty phân phối nước tăng lực chuyên biệt của chúng tôi, tập trung hoàn toàn vào Nước tăng lực Warrior và Red Bull.",
    href: "https://doryrich.com.vn",
    linkLabel: "Truy cập Dory Rich",
    external: true,
    logo: "/photos/logos/dory-rich.webp",
  },
];
