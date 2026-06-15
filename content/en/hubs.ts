// Logistics & warehousing — the two distribution hubs operated by Richfield
// Foods. Figures verbatim from the final content doc. `location` is shown as
// the eyebrow above each hub name; `facts` render as a spec sheet. The racking
// photography is generic (it doesn't identify a hub), so it's assigned for
// visual variety, not as a literal record of each site.
export type HubFact = { label: string; value: string };
export type HubPhoto = { src: string; alt: string };

export type WarehouseHub = {
  name: string;
  location: string;
  facts: HubFact[];
  /** Facility photos shown on the sticky media side; they advance as the hub
      scrolls through. The racking imagery is generic (it doesn't identify a
      site), so it's assigned for visual variety. */
  photos: HubPhoto[];
};

const PHU_TUONG = "/photos/RF Website/Richfield Foods (Phu Tuong)";

export const warehouseHubs: WarehouseHub[] = [
  {
    name: "Northern Hub",
    location: "Sai Dong B Industrial Park, Long Bien District, Hanoi",
    facts: [
      { label: "Facility", value: "1,500+ m²" },
      { label: "Pallet positions", value: "1,050" },
      { label: "Cold storage", value: "250 positions (18–25°C)" },
      { label: "Coverage", value: "Northern provinces through Thua Thien Hue" },
    ],
    photos: [
      {
        src: `${PHU_TUONG}/Hình ảnh Phú Tường/6.webp`,
        alt: "High-bay pallet racking and a mezzanine inside the distribution centre",
      },
      {
        src: `${PHU_TUONG}/Hình ảnh Phú Tường/3.webp`,
        alt: "Palletised cases staged on the warehouse floor beside a forklift",
      },
    ],
  },
  {
    name: "Southern Hub",
    location: "Duc Hoa 1 Industrial Park, Long An",
    facts: [
      { label: "Facility", value: "9,300+ m²" },
      { label: "Pallet positions", value: "9,700" },
      { label: "Cold storage", value: "400 positions (18–25°C)" },
      { label: "Coverage", value: "Southern provinces through Da Nang" },
    ],
    photos: [
      {
        src: `${PHU_TUONG}/Hình ảnh Phú Tường/4.webp`,
        alt: "Tall blue and orange pallet racking stacked with cased goods",
      },
      {
        src: `${PHU_TUONG}/641295288_1384526297020229_6615026566403809628_n.webp`,
        alt: "The warehouse team in front of the high-bay racking and a shipping container",
      },
    ],
  },
];
