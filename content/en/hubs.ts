// Logistics & warehousing — the two distribution hubs operated by Richfield
// Foods. Figures verbatim from the final content doc.
export type WarehouseHub = {
  name: string;
  location: string;
  facility: string;
  pallets: string;
  cold: string;
  coverage: string;
};

export const logisticsIntro =
  "Two strategically located hubs serve the full length of the country:";

export const warehouseHubs: WarehouseHub[] = [
  {
    name: "Northern Hub",
    location: "Sai Dong B Industrial Park, Long Bien District, Hanoi",
    facility: "1,500+ m² facility",
    pallets: "1,050 pallet positions",
    cold: "250 cold storage positions (18–25°C)",
    coverage: "Northern provinces through Thua Thien Hue",
  },
  {
    name: "Southern Hub",
    location: "Duc Hoa 1 Industrial Park, Long An",
    facility: "9,300+ m² facility",
    pallets: "9,700 pallet positions",
    cold: "400 cold storage positions (18–25°C)",
    coverage: "Southern provinces through Da Nang",
  },
];
