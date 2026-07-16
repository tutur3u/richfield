import { communityPrograms } from "@/content/en/community";
import { founder } from "@/content/en/founder";
import { leaders } from "@/content/en/leadership";
import { organizations } from "@/content/en/organizations";
import { partnerLogos, peoplePhotos } from "@/content/en/photography";
import { shelfCategories } from "@/content/en/shelf";
import { warehouseHubs } from "@/content/en/hubs";

export type GallerySeed = {
  alt: string;
  brand?: string;
  category?: string;
  feature?: boolean;
  objectPosition?: string;
  pageSection: string;
  placement: string;
  productName?: string;
  ratio?: number;
  shelfWeight?: string;
  slug: string;
  sortOrder: number;
  src: string;
  title: string;
  usageTags: string[];
};

type SiteImage = {
  alt: string;
  brand?: string;
  objectPosition?: string;
  ratio?: number;
  src: string;
  title: string;
};

function slugifySeed(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleFromKey(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function seed({
  alt,
  brand,
  category,
  feature,
  objectPosition,
  pageSection,
  placement,
  productName,
  ratio,
  shelfWeight,
  slug,
  sortOrder,
  src,
  title,
  usageTags,
}: GallerySeed): GallerySeed {
  return {
    alt,
    brand,
    category,
    feature,
    objectPosition,
    pageSection,
    placement,
    productName,
    ratio,
    shelfWeight,
    slug,
    sortOrder,
    src,
    title,
    usageTags,
  };
}

const homeCoverPortraits: SiteImage[] = [
  {
    alt: "The Richfield team in a conga line on the beach at dusk",
    objectPosition: "center 45%",
    ratio: 16 / 9,
    src: "/photos/people/richfield.webp",
    title: "Beach conga line",
  },
  {
    alt: "The Richfield team in a conga line on the beach at dusk",
    objectPosition: "center 45%",
    ratio: 3 / 2,
    src: "/photos/people/selected-2026-05-07.webp",
    title: "Team conga line",
  },
  {
    alt: "The Richfield Worldwide team arranged in a heart formation",
    objectPosition: "center 40%",
    ratio: 3 / 2,
    src: "/photos/people/group-company-1920.webp",
    title: "Heart formation",
  },
  {
    alt: "Aerial drone view of the Richfield team spelling out RICHFIELD on the beach",
    objectPosition: "center 50%",
    ratio: 16 / 9,
    src: "/photos/people/selected-2026-05-03.webp",
    title: "Aerial Richfield letters",
  },
  {
    alt: "The Richfield team on stage at the 30-year anniversary Gala Dinner",
    objectPosition: "center 38%",
    ratio: 3 / 2,
    src: "/photos/people/selected-2026-05-04.webp",
    title: "Gala stage team",
  },
];

const homeOverviewImages: SiteImage[] = [
  {
    alt: "Richfield staff loading a delivery truck at the distribution centre.",
    objectPosition: "center 55%",
    ratio: 4 / 3,
    src: "/photos/people/facility/warehouse-dock-1600.webp",
    title: "Distribution centre dock",
  },
  {
    alt: "A traditional-trade neighbourhood store stocked with Richfield-distributed brands.",
    objectPosition: "center 50%",
    ratio: 4 / 3,
    src: "/photos/people/facility/general-trade-store.webp",
    title: "General trade store",
  },
  {
    alt: "Shoppers in a modern-trade supermarket aisle served by Richfield.",
    objectPosition: "center 50%",
    ratio: 4 / 3,
    src: "/photos/people/facility/modern-trade-aisle.webp",
    title: "Modern trade aisle",
  },
  {
    alt: "The grand opening of a new Richfield facility in 2026.",
    objectPosition: "center 50%",
    ratio: 4 / 3,
    src: "/photos/people/grand-opening-2026-1280.webp",
    title: "Facility grand opening",
  },
];

const homeWhatWeDoImages: SiteImage[] = [
  {
    alt: "Loading pallets at a Richfield distribution centre.",
    objectPosition: "center 55%",
    ratio: 16 / 10,
    src: "/photos/people/facility/warehouse-dock.webp",
    title: "Warehouse and logistics card",
  },
  {
    alt: "A traditional-trade neighbourhood store stocked with brands.",
    objectPosition: "center 50%",
    ratio: 16 / 10,
    src: "/photos/people/facility/general-trade-store.webp",
    title: "General trade card",
  },
  {
    alt: "Shoppers in a modern-trade supermarket aisle.",
    objectPosition: "center 50%",
    ratio: 16 / 10,
    src: "/photos/people/facility/modern-trade-aisle.webp",
    title: "Modern trade card",
  },
];

const aboutTimelineImages: SiteImage[] = [
  {
    alt: "Richfield staff spell out RICHFIELD on the Nha Trang beach, seen from above, for the 30th anniversary.",
    objectPosition: "center 55%",
    ratio: 16 / 10,
    src: "/photos/people/anniv-beach-1600.webp",
    title: "30th anniversary beach",
  },
  {
    alt: "The Richfield team on stage at the 30th-anniversary gala dinner in Nha Trang.",
    objectPosition: "center 45%",
    ratio: 16 / 10,
    src: "/photos/people/anniv-gala-1600.webp",
    title: "30th anniversary gala",
  },
  {
    alt: "Colleagues lined up with bicycles during the 30th-anniversary team activities.",
    objectPosition: "center 60%",
    ratio: 16 / 10,
    src: "/photos/people/anniv-cycle-1600.webp",
    title: "30th anniversary cycling",
  },
  {
    alt: "The Richfield team at the Po Nagar Cham towers during the Nha Trang anniversary trip.",
    objectPosition: "center 50%",
    ratio: 16 / 10,
    src: "/photos/people/anniv-towers-1600.webp",
    title: "30th anniversary towers",
  },
];

const aboutLeadGalleryImages: SiteImage[] = [
  {
    alt: "The Richfield team in front of the modern campus, 2026.",
    objectPosition: "center 50%",
    ratio: 3 / 2,
    src: "/photos/people/selected-2026-05-05.webp",
    title: "Campus group",
  },
  {
    alt: "A Richfield team gathering, late 2025.",
    objectPosition: "center 45%",
    ratio: 3 / 2,
    src: "/photos/people/happy-time-2025-11-1280.webp",
    title: "Team gathering",
  },
  {
    alt: "A Richfield training workshop in session.",
    objectPosition: "center 45%",
    ratio: 3 / 2,
    src: "/photos/people/workshop-1-1280.webp",
    title: "Training workshop",
  },
  {
    alt: "A Richfield celebration moment.",
    objectPosition: "center 45%",
    ratio: 3 / 2,
    src: "/photos/people/celebration-1280.webp",
    title: "Celebration moment",
  },
];

const distributionChannelImages: SiteImage[] = [
  {
    alt: "A traditional tap hoa grocery store stocked with packaged goods.",
    ratio: 4 / 3,
    src: "/photos/RF Website/Distribution Channels/General Trade/Tap-hoa-2.webp",
    title: "Tap hoa grocery store",
  },
  {
    alt: "A wholesaler market aisle lined with cased products.",
    ratio: 3 / 2,
    src: "/photos/RF Website/Distribution Channels/General Trade/Wholesaler Market.webp",
    title: "Wholesaler market",
  },
  {
    alt: "An independent pharmacy counter and shelving.",
    ratio: 3 / 2,
    src: "/photos/RF Website/Distribution Channels/General Trade/Independent Pharmacies.webp",
    title: "Independent pharmacy",
  },
];

const retailerLogoGroups: Array<{ category: string; logos: SiteImage[] }> = [
  {
    category: "E-commerce",
    logos: [
      { alt: "Shopee logo", brand: "Shopee", src: "/photos/retailers/shopee.svg", title: "Shopee logo" },
      { alt: "TikTok Shop logo", brand: "TikTok Shop", src: "/photos/retailers/tiktok.webp", title: "TikTok Shop logo" },
    ],
  },
  {
    category: "Convenience",
    logos: [
      { alt: "7-Eleven logo", brand: "7-Eleven", src: "/photos/retailers/7-eleven-logo-svg.webp", title: "7-Eleven logo" },
      { alt: "Circle K logo", brand: "Circle K", src: "/photos/retailers/circle-k-logo-2015-svg.webp", title: "Circle K logo" },
      { alt: "FamilyMart logo", brand: "FamilyMart", src: "/photos/retailers/logo-familymart.webp", title: "FamilyMart logo" },
      { alt: "GS25 logo", brand: "GS25", src: "/photos/retailers/gs25-logo.webp", title: "GS25 logo" },
      { alt: "Ministop logo", brand: "Ministop", src: "/photos/retailers/logo-ministop.webp", title: "Ministop logo" },
      { alt: "Cheers logo", brand: "Cheers", src: "/photos/retailers/logo-cheers.webp", title: "Cheers logo" },
      { alt: "B's Mart logo", brand: "B's Mart", src: "/photos/retailers/bs-mart.webp", title: "B's Mart logo" },
    ],
  },
  {
    category: "Supermarket & Hypermarket",
    logos: [
      { alt: "AEON logo", brand: "AEON", src: "/photos/retailers/aeon-logo-svg.webp", title: "AEON logo" },
      { alt: "AEON Citimart logo", brand: "AEON Citimart", src: "/photos/retailers/aeon-citimart.webp", title: "AEON Citimart logo" },
      { alt: "AEON Maxvalu logo", brand: "AEON Maxvalu", src: "/photos/retailers/aeon-maxvalu.webp", title: "AEON Maxvalu logo" },
      { alt: "BigC logo", brand: "BigC", src: "/photos/retailers/bigclogo2022-svg.webp", title: "BigC logo" },
      { alt: "Go! logo", brand: "Go!", src: "/photos/retailers/logo-go.webp", title: "Go! logo" },
      { alt: "Top Market logo", brand: "Top Market", src: "/photos/retailers/top-market.webp", title: "Top Market logo" },
      { alt: "Tops Market logo", brand: "Tops Market", src: "/photos/retailers/tops-market-logo-vector-svg.webp", title: "Tops Market logo" },
      { alt: "Lotte Mart logo", brand: "Lotte Mart", src: "/photos/retailers/logo-lotte-mart-vector-thumbnail.webp", title: "Lotte Mart logo" },
      { alt: "WinMart logo", brand: "WinMart", src: "/photos/retailers/winmart-logo.webp", title: "WinMart logo" },
      { alt: "WinMart+ logo", brand: "WinMart+", src: "/photos/retailers/logo-winmart-plus.webp", title: "WinMart+ logo" },
      { alt: "Co.opmart logo", brand: "Co.opmart", src: "/photos/retailers/coop-mart.webp", title: "Co.opmart logo" },
      { alt: "Co.op Extra logo", brand: "Co.op Extra", src: "/photos/retailers/logo-co-op-extra.webp", title: "Co.op Extra logo" },
      { alt: "Co.opFood logo", brand: "Co.opFood", src: "/photos/retailers/logo-co-opfood.webp", title: "Co.opFood logo" },
      { alt: "Co.opSmile logo", brand: "Co.opSmile", src: "/photos/retailers/logo-co-opsmile.webp", title: "Co.opSmile logo" },
      { alt: "Satramart logo", brand: "Satramart", src: "/photos/retailers/satramart.webp", title: "Satramart logo" },
      { alt: "Satrafood logo", brand: "Satrafood", src: "/photos/retailers/logo-satrafood.webp", title: "Satrafood logo" },
      { alt: "Bach Hoa Xanh logo", brand: "Bach Hoa Xanh", src: "/photos/retailers/logo-bach-hoa-xanh-11.webp", title: "Bach Hoa Xanh logo" },
      { alt: "Kingfoodmart logo", brand: "Kingfoodmart", src: "/photos/retailers/kingfoodmart.webp", title: "Kingfoodmart logo" },
      { alt: "HaproFood / BRGMart logo", brand: "HaproFood / BRGMart", src: "/photos/retailers/haprofood-brgmart.webp", title: "HaproFood / BRGMart logo" },
      { alt: "Finelife logo", brand: "Finelife", src: "/photos/retailers/finelife.webp", title: "Finelife logo" },
      { alt: "Nam An Market logo", brand: "Nam An Market", src: "/photos/retailers/nam-an-market.webp", title: "Nam An Market logo" },
      { alt: "Annam Gourmet logo", brand: "Annam Gourmet", src: "/photos/retailers/annam-gourmet-logo-rgb.webp", title: "Annam Gourmet logo" },
    ],
  },
  {
    category: "Health & Beauty",
    logos: [
      { alt: "Pharmacity logo", brand: "Pharmacity", src: "/photos/retailers/pharmacity.webp", title: "Pharmacity logo" },
      { alt: "Guardian logo", brand: "Guardian", src: "/photos/retailers/guardian-logo.webp", title: "Guardian logo" },
      { alt: "Watsons logo", brand: "Watsons", src: "/photos/retailers/logo-watsons.webp", title: "Watsons logo" },
      { alt: "Medicare logo", brand: "Medicare", src: "/photos/retailers/medicare.webp", title: "Medicare logo" },
      { alt: "Long Chau logo", brand: "Long Chau", src: "/photos/retailers/nha-thuoc-long-chau.webp", title: "Long Chau logo" },
      { alt: "An Khang logo", brand: "An Khang", src: "/photos/retailers/nha-thuoc-an-khang.webp", title: "An Khang logo" },
      { alt: "Trung Son logo", brand: "Trung Son", src: "/photos/retailers/logo-nha-thuoc-trung-son.webp", title: "Trung Son logo" },
      { alt: "AEON Wellness logo", brand: "AEON Wellness", src: "/photos/retailers/aeon-wellness.webp", title: "AEON Wellness logo" },
      { alt: "Glam Beautique logo", brand: "Glam Beautique", src: "/photos/retailers/logo-glam-beautique.webp", title: "Glam Beautique logo" },
      { alt: "Sociolla logo", brand: "Sociolla", src: "/photos/retailers/sociolla.webp", title: "Sociolla logo" },
    ],
  },
  {
    category: "Mom, Baby & Specialty",
    logos: [
      { alt: "Kids Plaza logo", brand: "Kids Plaza", src: "/photos/retailers/logo-kids-plaza.webp", title: "Kids Plaza logo" },
      { alt: "Bibo Mart logo", brand: "Bibo Mart", src: "/photos/retailers/logo-bibo-mart-compressed.webp", title: "Bibo Mart logo" },
      { alt: "Con Cung logo", brand: "Con Cung", src: "/photos/retailers/logo-con-cung.webp", title: "Con Cung logo" },
      { alt: "Avakids logo", brand: "Avakids", src: "/photos/retailers/avakids-logo.webp", title: "Avakids logo" },
      { alt: "Kohnan logo", brand: "Kohnan", src: "/photos/retailers/logo-kohnan.webp", title: "Kohnan logo" },
    ],
  },
];

const logisticsHeroImages: SiteImage[] = [
  {
    alt: "A container truck at the Richfield Foods warehouse loading bay",
    objectPosition: "center 55%",
    ratio: 16 / 9,
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0832.webp",
    title: "Container truck loading bay",
  },
  {
    alt: "A forklift loading pallets beside a delivery truck at the distribution centre",
    objectPosition: "center 50%",
    ratio: 16 / 9,
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0892.webp",
    title: "Forklift loading pallets",
  },
  {
    alt: "Workers loading product onto a truck on the warehouse dock",
    objectPosition: "center 50%",
    ratio: 16 / 9,
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0781.webp",
    title: "Warehouse dock loading",
  },
  {
    alt: "Cases being loaded into a truck at the Richfield Foods dock",
    objectPosition: "center 45%",
    ratio: 16 / 9,
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0844.webp",
    title: "Dock cases loading",
  },
];

const sharedLogoImages: SiteImage[] = [
  {
    alt: "Richfield Group logo",
    brand: "Richfield Group",
    ratio: 120 / 110,
    src: "/photos/logos/richfield.webp",
    title: "Richfield Group logo",
  },
];

export const richfieldGallerySeeds: GallerySeed[] = [
  ...homeCoverPortraits.map((image, index) =>
    seed({
      ...image,
      pageSection: "home",
      placement: "cover-portrait",
      slug: slugifySeed(`home-cover-${image.title}`),
      sortOrder: 100 + index * 10,
      usageTags: ["hero", "cover", "people"],
    }),
  ),
  ...homeOverviewImages.map((image, index) =>
    seed({
      ...image,
      pageSection: "home",
      placement: "overview-image",
      slug: slugifySeed(`home-overview-${image.title}`),
      sortOrder: 300 + index * 10,
      usageTags: ["overview", "facility"],
    }),
  ),
  ...homeWhatWeDoImages.map((image, index) =>
    seed({
      ...image,
      pageSection: "home",
      placement: "what-we-do-card",
      slug: slugifySeed(`home-what-we-do-${image.title}`),
      sortOrder: 500 + index * 10,
      usageTags: ["what-we-do", "card", "facility"],
    }),
  ),
  seed({
    alt: "Richfield operating footprint across China, Vietnam, and Malaysia.",
    objectPosition: "center",
    pageSection: "home",
    placement: "footprint-map",
    ratio: 1210 / 1300,
    slug: "home-footprint-map",
    sortOrder: 700,
    src: "/photos/map/footprint.webp",
    title: "Operating footprint map",
    usageTags: ["map", "footprint"],
  }),
  ...[
    { brand: "TCP Group", src: partnerLogos.TCP, title: "TCP Group logo" },
    { brand: "Richfield Group", src: "/photos/logos/richfield.webp", title: "Richfield Group logo" },
    { brand: "Dory Rich", src: partnerLogos["Dory Rich"], title: "Dory Rich logo" },
  ].map((image, index) =>
    seed({
      alt: `${image.brand} logo`,
      brand: image.brand,
      pageSection: "home",
      placement: "joint-venture-logo",
      ratio: 2,
      slug: slugifySeed(`home-joint-venture-${image.brand}`),
      sortOrder: 800 + index * 10,
      src: image.src,
      title: image.title,
      usageTags: ["joint-venture", "logo"],
    }),
  ),
  ...aboutLeadGalleryImages.map((image, index) =>
    seed({
      ...image,
      pageSection: "about",
      placement: "gallery-image",
      slug: slugifySeed(`about-lead-gallery-${image.title}`),
      sortOrder: 1000 + index * 10,
      usageTags: ["story", "gallery", "people"],
    }),
  ),
  seed({
    alt: `${founder.name}, ${founder.role} of Richfield Group.`,
    pageSection: "about",
    placement: "leader-portrait",
    ratio: 2 / 3,
    slug: "about-founder-chua-eng-siang",
    sortOrder: 1100,
    src: founder.photo,
    title: `${founder.name} portrait`,
    usageTags: ["founder", "portrait"],
  }),
  ...aboutTimelineImages.map((image, index) =>
    seed({
      ...image,
      pageSection: "about",
      placement: "timeline-image",
      slug: slugifySeed(`about-timeline-${image.title}`),
      sortOrder: 1200 + index * 10,
      usageTags: ["timeline", "anniversary", "gallery"],
    }),
  ),
  ...communityPrograms.map((program, index) =>
    seed({
      alt: `${program.title} community program image`,
      pageSection: "about",
      placement: "gallery-image",
      ratio: 4 / 3,
      slug: slugifySeed(`about-community-${program.title}`),
      sortOrder: 1400 + index * 10,
      src: program.photo,
      title: program.title,
      usageTags: ["community", "impact"],
    }),
  ),
  ...organizations
    .filter((organization) => organization.logo)
    .map((organization, index) =>
      seed({
        alt: `${organization.name} logo`,
        brand: organization.name,
        pageSection: "about",
        placement: "organization-logo",
        ratio: 2,
        slug: slugifySeed(`about-organization-${organization.name}`),
        sortOrder: 1500 + index * 10,
        src: organization.logo ?? "",
        title: `${organization.name} logo`,
        usageTags: ["organization", "logo"],
      }),
    ),
  ...Object.entries(partnerLogos).map(([name, src], index) =>
    seed({
      alt: `${name} logo`,
      brand: name,
      pageSection: "brands",
      placement: "brand-logo",
      slug: slugifySeed(`brands-logo-${name}`),
      sortOrder: 2000 + index * 10,
      src,
      title: `${name} logo`,
      usageTags: ["logo", "brand"],
    }),
  ),
  ...shelfCategories.flatMap((category, categoryIndex) =>
    [
      ...category.banners.map((banner, index) =>
        seed({
          alt: banner.alt,
          brand: banner.brand,
          category: category.label,
          pageSection: "brands",
          placement: "shelf-banner",
          ratio: banner.ratio,
          shelfWeight: banner.weight,
          slug: slugifySeed(`shelf-banner-${category.id}-${banner.brand}-${index}`),
          sortOrder: 2400 + categoryIndex * 1000 + index * 10,
          src: banner.src,
          title: `${banner.brand} banner`,
          usageTags: ["shelf", "banner", category.id, banner.brand],
        }),
      ),
      ...category.packshots.map((photo, index) =>
        seed({
          alt: photo.alt,
          brand: photo.brand,
          category: category.label,
          feature: photo.feature ?? false,
          pageSection: "brands",
          placement: "shelf-product",
          productName: photo.name,
          slug: slugifySeed(`shelf-product-${category.id}-${photo.brand}-${photo.name}`),
          sortOrder: 2800 + categoryIndex * 1000 + index * 10,
          src: photo.src,
          title: photo.name,
          usageTags: ["shelf", "product", category.id, photo.brand],
        }),
      ),
    ],
  ),
  ...distributionChannelImages.map((image, index) =>
    seed({
      ...image,
      pageSection: "distribution",
      placement: "channel-image",
      slug: slugifySeed(`distribution-channel-${image.title}`),
      sortOrder: 6000 + index * 10,
      usageTags: ["distribution", "channel"],
    }),
  ),
  ...retailerLogoGroups.flatMap((group, groupIndex) =>
    group.logos.map((image, index) =>
      seed({
        ...image,
        category: group.category,
        pageSection: "distribution",
        placement: "retailer-logo",
        ratio: 200 / 88,
        slug: slugifySeed(`distribution-retailer-${group.category}-${image.brand ?? image.title}`),
        sortOrder: 6200 + groupIndex * 100 + index * 10,
        usageTags: ["modern-trade", "retailer", "logo", group.category],
      }),
    ),
  ),
  ...logisticsHeroImages.map((image, index) =>
    seed({
      ...image,
      pageSection: "logistics",
      placement: "facility-image",
      slug: slugifySeed(`logistics-hero-${image.title}`),
      sortOrder: 8000 + index * 10,
      usageTags: ["logistics", "hero", "facility"],
    }),
  ),
  ...warehouseHubs.flatMap((hub, hubIndex) =>
    hub.photos.map((photo, index) =>
      seed({
        alt: photo.alt,
        pageSection: "logistics",
        placement: "facility-image",
        ratio: 4 / 3,
        slug: slugifySeed(`logistics-hub-${hub.name}-${index + 1}`),
        sortOrder: 8200 + hubIndex * 100 + index * 10,
        src: photo.src,
        title: `${hub.name} photo ${index + 1}`,
        usageTags: ["logistics", "hub", "facility"],
      }),
    ),
  ),
  seed({
    alt: "Workers loading product onto a truck on the warehouse dock",
    objectPosition: "center 50%",
    pageSection: "logistics",
    placement: "video-poster",
    ratio: 16 / 9,
    slug: "logistics-video-poster",
    sortOrder: 8400,
    src: "/photos/RF Website/Richfield Foods (Phu Tuong)/DSC_0781.webp",
    title: "Warehouse tour video poster",
    usageTags: ["logistics", "video", "poster"],
  }),
  ...Object.entries(peoplePhotos)
    .filter(([key]) => !key.startsWith("hero"))
    .map(([key, photo], index) =>
      seed({
        alt: photo.alt,
        pageSection: "careers",
        placement: "gallery-image",
        ratio: photo.ratio,
        slug: slugifySeed(`careers-life-${key}`),
        sortOrder: 9000 + index * 10,
        src: photo.src,
        title: titleFromKey(key),
        usageTags: ["gallery", "people"],
      }),
    ),
  ...Array.from({ length: 25 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return seed({
      alt: `Richfield careers life gallery image ${num}`,
      pageSection: "careers",
      placement: "gallery-image",
      ratio: 1.333,
      slug: `careers-life-${num}`,
      sortOrder: 9200 + i * 10,
      src: `/photos/careers-life/${num}.webp`,
      title: `Careers Life ${num}`,
      usageTags: ["gallery", "people"],
    });
  }),
  ...leaders.map((leader, index) =>
    seed({
      alt: `${leader.name}, ${leader.role} of Richfield Group.`,
      pageSection: "careers",
      placement: "leader-portrait",
      ratio: 2 / 3,
      slug: slugifySeed(`careers-leader-${leader.name}`),
      sortOrder: 9600 + index * 10,
      src: leader.photo,
      title: `${leader.name} portrait`,
      usageTags: ["leader", "portrait"],
    }),
  ),
  seed({
    alt: "Richfield team spelling the company name on the beach",
    pageSection: "contact",
    placement: "contact-hero",
    ratio: 16 / 9,
    slug: "contact-richfield",
    sortOrder: 10000,
    src: "/photos/contact-richfield.webp",
    title: "Contact Richfield",
    usageTags: ["background", "contact"],
  }),
  seed({
    alt: "Richfield contact background",
    pageSection: "contact",
    placement: "contact-background",
    ratio: 16 / 9,
    slug: "contact-background",
    sortOrder: 10010,
    src: "/photos/contact-bg.webp",
    title: "Contact Background",
    usageTags: ["background", "contact"],
  }),
  ...sharedLogoImages.map((image, index) =>
    seed({
      ...image,
      pageSection: "footer-navigation",
      placement: "shared-logo",
      slug: slugifySeed(`footer-navigation-${image.title}`),
      sortOrder: 11000 + index * 10,
      usageTags: ["footer", "navigation", "logo"],
    }),
  ),
  ...sharedLogoImages.map((image, index) =>
    seed({
      ...image,
      pageSection: "shared",
      placement: "shared-logo",
      slug: slugifySeed(`shared-${image.title}`),
      sortOrder: 12000 + index * 10,
      usageTags: ["shared", "logo"],
    }),
  ),
];
