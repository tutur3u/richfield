export type RichfieldGalleryPageSection =
  | "home"
  | "about"
  | "brands"
  | "distribution"
  | "logistics"
  | "careers"
  | "contact"
  | "footer-navigation"
  | "shared";

export type RichfieldGalleryPlacement =
  | "brand-logo"
  | "channel-image"
  | "contact-background"
  | "contact-hero"
  | "cover-portrait"
  | "facility-image"
  | "footprint-map"
  | "gallery-image"
  | "hero-image"
  | "joint-venture-logo"
  | "leader-portrait"
  | "organization-logo"
  | "overview-image"
  | "retailer-logo"
  | "shared-logo"
  | "shelf-banner"
  | "shelf-product"
  | "timeline-image"
  | "video-poster"
  | "what-we-do-card";

export type RichfieldGalleryShelfWeight = "feature" | "hero" | "wide";

export type RichfieldGalleryPlacementOption = {
  categoryRequired?: boolean;
  label: string;
  pageSection: RichfieldGalleryPageSection;
  productFields?: boolean;
  value: RichfieldGalleryPlacement;
  weightOptions?: RichfieldGalleryShelfWeight[];
};

export const richfieldGalleryPages: Array<{
  label: string;
  value: RichfieldGalleryPageSection;
}> = [
  { label: "Home (/)", value: "home" },
  { label: "About", value: "about" },
  { label: "Brands", value: "brands" },
  { label: "Distribution", value: "distribution" },
  { label: "Logistics", value: "logistics" },
  { label: "Careers", value: "careers" },
  { label: "Contact", value: "contact" },
  { label: "Footer / Navigation", value: "footer-navigation" },
  { label: "Shared", value: "shared" },
];

export const richfieldGalleryPlacements: RichfieldGalleryPlacementOption[] = [
  { label: "Cover portrait", pageSection: "home", value: "cover-portrait" },
  { label: "Overview / facility image", pageSection: "home", value: "overview-image" },
  { label: "What-we-do card image", pageSection: "home", value: "what-we-do-card" },
  { label: "Footprint map", pageSection: "home", value: "footprint-map" },
  { label: "Joint-venture logo", pageSection: "home", value: "joint-venture-logo" },
  { label: "Brand logo", pageSection: "home", value: "brand-logo" },
  { label: "Timeline / gallery image", pageSection: "about", value: "timeline-image" },
  { label: "Leadership / founder portrait", pageSection: "about", value: "leader-portrait" },
  { label: "Community image", pageSection: "about", value: "gallery-image" },
  { label: "Organization logo", pageSection: "about", value: "organization-logo" },
  { label: "Brand logo", pageSection: "brands", value: "brand-logo" },
  {
    categoryRequired: true,
    label: "Shelf banner",
    pageSection: "brands",
    productFields: true,
    value: "shelf-banner",
    weightOptions: ["hero", "wide", "feature"],
  },
  {
    categoryRequired: true,
    label: "Shelf product",
    pageSection: "brands",
    productFields: true,
    value: "shelf-product",
  },
  { label: "Distribution channel image", pageSection: "distribution", value: "channel-image" },
  { label: "Retailer logo", pageSection: "distribution", value: "retailer-logo" },
  { label: "Logistics hero / facility image", pageSection: "logistics", value: "facility-image" },
  { label: "Video poster", pageSection: "logistics", value: "video-poster" },
  { label: "Hero people image", pageSection: "careers", value: "hero-image" },
  { label: "Life gallery image", pageSection: "careers", value: "gallery-image" },
  { label: "Leader portrait", pageSection: "careers", value: "leader-portrait" },
  { label: "Contact hero", pageSection: "contact", value: "contact-hero" },
  { label: "Contact background", pageSection: "contact", value: "contact-background" },
  { label: "Logo", pageSection: "footer-navigation", value: "shared-logo" },
  { label: "Reusable image", pageSection: "shared", value: "gallery-image" },
];

export const richfieldGalleryShelfWeightOptions: Array<{
  label: string;
  value: RichfieldGalleryShelfWeight;
}> = [
  { label: "Hero banner", value: "hero" },
  { label: "Wide banner", value: "wide" },
  { label: "Feature tile", value: "feature" },
];

export function getRichfieldGalleryPageLabel(pageSection: string) {
  return (
    richfieldGalleryPages.find((page) => page.value === pageSection)?.label ??
    (pageSection ||
    "Shared"
    )
  );
}

export function getRichfieldGalleryPlacementLabel(placement: string) {
  return (
    richfieldGalleryPlacements.find((item) => item.value === placement)?.label ??
    (placement ||
    "Image"
    )
  );
}

export function getRichfieldGalleryPlacementsForPage(pageSection: string) {
  return richfieldGalleryPlacements.filter(
    (item) => item.pageSection === pageSection,
  );
}

export function getRichfieldGalleryPlacement(value: string) {
  return richfieldGalleryPlacements.find((item) => item.value === value) ?? null;
}
