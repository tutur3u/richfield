// Vietnamese content — machine-translated first pass. Needs native review before launch.
// Logistics & warehousing — the two distribution hubs operated by Richfield
// Foods. Figures verbatim from the final content doc. `location` is shown as
// the eyebrow above each hub name; `facts` render as a spec sheet. The racking
// photography is generic (it doesn't identify a hub), so it's assigned for
// visual variety, not as a literal record of each site.
import type { HubFact, HubPhoto, WarehouseHub } from "@/content/en/hubs";

export type { HubFact, HubPhoto, WarehouseHub };

const PHU_TUONG = "/photos/RF Website/Richfield Foods (Phu Tuong)";

export const warehouseHubs: WarehouseHub[] = [
  {
    name: "Trung tâm miền Bắc",
    location: "Khu công nghiệp Sài Đồng B, quận Long Biên, Hà Nội",
    facts: [
      { label: "Diện tích kho", value: "1,500+ m²" },
      { label: "Vị trí pallet", value: "1,050" },
      { label: "Kho mát", value: "250 vị trí (18–25°C)" },
      { label: "Phạm vi phục vụ", value: "Các tỉnh phía Bắc đến Thừa Thiên Huế" },
    ],
    photos: [
      {
        src: `${PHU_TUONG}/warehouse-aisle.webp`,
        alt: "Xe nâng reach truck di chuyển pallet dọc lối đi giữa các dãy kệ cao chất đầy hàng hóa đóng thùng",
      },
    ],
  },
  {
    name: "Trung tâm miền Nam",
    location: "Khu công nghiệp Đức Hòa 1, Long An",
    facts: [
      { label: "Diện tích kho", value: "9,300+ m²" },
      { label: "Vị trí pallet", value: "9,700" },
      { label: "Kho mát", value: "400 vị trí (18–25°C)" },
      { label: "Phạm vi phục vụ", value: "Các tỉnh phía Nam đến Đà Nẵng" },
    ],
    photos: [
      {
        src: `${PHU_TUONG}/warehouse-racking.webp`,
        alt: "Dãy kệ cao chất đầy hàng hóa đóng thùng bên dưới băng rôn chào mừng",
      },
      {
        src: `${PHU_TUONG}/641295288_1384526297020229_6615026566403809628_n.webp`,
        alt: "Đội ngũ nhân viên kho đứng trước dãy kệ cao và một container hàng",
      },
    ],
  },
];
