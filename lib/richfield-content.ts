import {
  brands,
  featuredPartners,
  homepageBrands,
  brandTimeline,
  type Brand,
  type BrandCategory,
} from "@/content/en/brands";
import { openPositions, type OpenPosition } from "@/content/en/careers";
import {
  leaders,
  peopleFirstIntro,
  type Leader,
} from "@/content/en/leadership";
import {
  homepageMilestones,
  milestones,
  type Milestone,
} from "@/content/en/milestones";
import { peoplePhotos } from "@/content/en/photography";
import { site } from "@/content/en/site";

type JsonObject = Record<string, unknown>;

type DeliveryBlock = {
  block_type: string;
  content: JsonObject | null;
  entry_id?: string | null;
  id: string;
  sort_order: number;
  title: string | null;
};

type DeliveryAsset = {
  alt_text: string | null;
  assetUrl: string | null;
  asset_type: string;
  block_id: string | null;
  entry_id: string | null;
  id: string;
  metadata: JsonObject;
  sort_order: number;
  source_url: string | null;
  storage_path: string | null;
};

type DeliveryEntry = {
  assets: DeliveryAsset[];
  blocks: DeliveryBlock[];
  id: string;
  metadata: JsonObject;
  profile_data: JsonObject;
  published_at: string | null;
  slug: string;
  status: string;
  subtitle: string | null;
  summary: string | null;
  title: string;
};

type DeliveryCollection = {
  collection_type: string;
  config: JsonObject | null;
  description: string | null;
  entries: DeliveryEntry[];
  id: string;
  slug: string;
  title: string;
};

export type RichfieldDeliveryPayload = {
  adapter: string;
  canonicalProjectId: string;
  collections: DeliveryCollection[];
  generatedAt: string;
  loadingData: unknown;
  profileData: JsonObject;
  workspaceId: string;
};

export type RichfieldContent = {
  brands: Brand[];
  homepageBrands: Brand[];
  brandTimeline: Milestone[];
  contactChannels: RichfieldContactChannel[];
  contactPage: RichfieldContactPage;
  featuredPartners: typeof featuredPartners;
  imageLibrary: RichfieldImageLibraryItem[];
  leaders: Leader[];
  openPositions: OpenPosition[];
  peopleFirstIntro: string;
  milestones: Milestone[];
  homepageMilestones: Milestone[];
};

export type RichfieldContactPage = {
  backgroundImage: RichfieldImageLibraryItem | null;
  headline: string;
  intro: string;
  mapQuery: string;
};

export type RichfieldContactChannel = {
  cta: string;
  external: boolean;
  href: string;
  kind: string;
  label: string;
  primary: string;
  secondary: string | null;
  sortOrder: number;
};

export type RichfieldImageLibraryItem = {
  alt: string;
  credit: string | null;
  objectPosition: string | null;
  pageSection: string;
  ratio: number | null;
  sortOrder: number;
  src: string;
  title: string;
  usageTags: string[];
  slug: string;
};

const DEFAULT_CONTACT_PAGE: RichfieldContactPage = {
  backgroundImage: {
    alt: "Richfield team spelling the company name on the beach",
    credit: null,
    objectPosition: "center",
    pageSection: "contact",
    ratio: 16 / 9,
    slug: "contact-richfield",
    sortOrder: 0,
    src: "/photos/contact-richfield.webp",
    title: "Contact Richfield",
    usageTags: ["background", "contact"],
  },
  headline: "Tell us about your *brand*.",
  intro:
    "Brand owner exploring Vietnam, partner considering a joint venture, or journalist on deadline: we'll write back within two business days.",
  mapQuery: site.address.full,
};

const DEFAULT_CONTACT_CHANNELS: RichfieldContactChannel[] = [
  {
    cta: "Open on Maps",
    external: true,
    href: `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}`,
    kind: "office",
    label: "Office",
    primary: site.address.line1,
    secondary: site.address.line2,
    sortOrder: 10,
  },
  {
    cta: "Call hotline",
    external: false,
    href: `tel:${site.phones.hotlineTel}`,
    kind: "phone",
    label: "Hotline",
    primary: site.phones.hotline,
    secondary: site.phones.office,
    sortOrder: 20,
  },
  {
    cta: "Write us",
    external: false,
    href: `mailto:${site.email}`,
    kind: "email",
    label: "Email",
    primary: site.email,
    secondary: "Partnerships team",
    sortOrder: 30,
  },
  {
    cta: "Visit page",
    external: true,
    href: site.socials.facebook,
    kind: "facebook",
    label: "Facebook",
    primary: "RichField Group",
    secondary: "Daily updates",
    sortOrder: 40,
  },
];

const DEFAULT_IMAGE_LIBRARY: RichfieldImageLibraryItem[] = Object.entries(peoplePhotos).map(
  ([slug, photo], index) => ({
    alt: photo.alt,
    credit: null,
    objectPosition: "center",
    pageSection: slug.startsWith("hero") ? "home" : "careers",
    ratio: photo.ratio,
    slug,
    sortOrder: index * 10,
    src: photo.src,
    title: slug.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()),
    usageTags: slug.startsWith("hero") ? ["hero", "people"] : ["gallery", "people"],
  }),
);

export const DEFAULT_RICHFIELD_CONTENT: RichfieldContent = {
  brands,
  homepageBrands,
  brandTimeline,
  contactChannels: DEFAULT_CONTACT_CHANNELS,
  contactPage: DEFAULT_CONTACT_PAGE,
  featuredPartners,
  imageLibrary: DEFAULT_IMAGE_LIBRARY,
  leaders,
  openPositions,
  peopleFirstIntro,
  milestones,
  homepageMilestones,
};

function asRecord(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function absolutizeUrl(baseUrl: string, value: string | null | undefined) {
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const parsedBaseUrl = new URL(baseUrl);

  if (value.startsWith("/")) {
    return new URL(value, parsedBaseUrl.origin).toString();
  }

  return new URL(value, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

function sourceUrlToImageSrc(value: string | null | undefined) {
  if (!value) return null;

  if (value.startsWith("/photos/") || value.startsWith("/media/")) {
    return value;
  }

  if (!/^https?:\/\//i.test(value)) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.pathname.startsWith("/photos/") || url.pathname.startsWith("/media/")
      ? `${url.pathname}${url.search}`
      : null;
  } catch {
    return null;
  }
}

function getCollection(delivery: RichfieldDeliveryPayload, slug: string) {
  return delivery.collections.find((collection) => collection.slug === slug) ?? null;
}

function getPublishedEntries(delivery: RichfieldDeliveryPayload, slug: string) {
  return (getCollection(delivery, slug)?.entries ?? []).filter(
    (entry) => entry.status === "published",
  );
}

function getMarkdown(entry: DeliveryEntry | null | undefined) {
  const block = entry?.blocks
    .filter((item) => item.block_type === "markdown")
    .sort((left, right) => left.sort_order - right.sort_order)[0];
  const markdown = asRecord(block?.content).markdown;
  return asString(markdown);
}

function getQuoteBlock(entry: DeliveryEntry | null | undefined) {
  const block = entry?.blocks
    .filter((item) => item.block_type === "quote")
    .sort((left, right) => left.sort_order - right.sort_order)[0];
  return asString(asRecord(block?.content).quote);
}

function getLeadImage(entry: DeliveryEntry | null | undefined) {
  return (
    entry?.assets
      .filter((item) => item.asset_type === "image")
      .sort((left, right) => left.sort_order - right.sort_order)[0] ?? null
  );
}

function getImageUrl(entry: DeliveryEntry, apiBaseUrl: string) {
  const image = getLeadImage(entry);
  return (
    sourceUrlToImageSrc(image?.assetUrl) ??
    absolutizeUrl(apiBaseUrl, image?.assetUrl ?? null) ??
    sourceUrlToImageSrc(image?.source_url) ??
    absolutizeUrl(apiBaseUrl, image?.source_url ?? null)
  );
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function isBrandCategory(value: string | null): value is BrandCategory {
  return Boolean(value && ["Food", "Beverages", "Non-Food"].includes(value));
}

function buildBrands(delivery: RichfieldDeliveryPayload, apiBaseUrl: string) {
  const mapped = getPublishedEntries(delivery, "brands").map<Brand>((entry, index) => {
    const profileData = asRecord(entry.profile_data);
    const fallback = brands[index % brands.length] ?? brands[0]!;
    const category = asString(profileData.category);
    const year = asNumber(profileData.year);

    return {
      name: entry.title,
      country: asString(profileData.country) ?? fallback.country,
      year: year ?? fallback.year,
      logoSrc: getImageUrl(entry, apiBaseUrl) ?? fallback.logoSrc,
      category: isBrandCategory(category) ? category : fallback.category,
      accent: asString(profileData.accent) ?? fallback.accent,
      story: entry.summary ?? fallback.story,
      feature:
        typeof profileData.feature === "boolean"
          ? profileData.feature
          : fallback.feature,
      featureCaption: asString(profileData.featureCaption) ?? fallback.featureCaption,
    };
  });

  return mapped.length > 0 ? mapped : brands;
}

function buildLeaders(delivery: RichfieldDeliveryPayload, apiBaseUrl: string) {
  const mapped = getPublishedEntries(delivery, "leadership").map<Leader>((entry, index) => {
    const fallback = leaders[index % leaders.length] ?? leaders[0]!;
    const bio = getMarkdown(entry);

    return {
      name: entry.title,
      role: entry.subtitle ?? fallback.role,
      photo: getImageUrl(entry, apiBaseUrl) ?? fallback.photo,
      bio: bio ?? entry.summary ?? fallback.bio,
      quote: getQuoteBlock(entry) ?? fallback.quote,
    };
  });

  return mapped.length > 0 ? mapped : leaders;
}

function buildMilestones(delivery: RichfieldDeliveryPayload) {
  const mapped = getPublishedEntries(delivery, "milestones").map<Milestone>((entry, index) => {
    const profileData = asRecord(entry.profile_data);
    const fallback = milestones[index % milestones.length] ?? milestones[0]!;
    const year = asNumber(profileData.year);

    return {
      year: year ?? fallback.year,
      brand: asString(profileData.brand) ?? entry.title,
      country: asString(profileData.country) ?? entry.subtitle ?? fallback.country,
      body: entry.summary ?? fallback.body,
      aboutOnly:
        typeof profileData.aboutOnly === "boolean"
          ? profileData.aboutOnly
          : fallback.aboutOnly,
    };
  });

  return mapped.length > 0 ? mapped : milestones;
}

function buildImageLibrary(delivery: RichfieldDeliveryPayload, apiBaseUrl: string) {
  const mapped = getPublishedEntries(delivery, "image-library").map<RichfieldImageLibraryItem | null>(
    (entry) => {
      const profileData = asRecord(entry.profile_data);
      const imageUrl = getImageUrl(entry, apiBaseUrl);

      if (!imageUrl) return null;

      return {
        alt: getLeadImage(entry)?.alt_text ?? entry.summary ?? entry.title,
        credit: asString(profileData.credit),
        objectPosition: asString(profileData.objectPosition),
        pageSection: asString(profileData.pageSection) ?? "shared",
        ratio: asNumber(profileData.ratio),
        slug: entry.slug,
        sortOrder: asNumber(profileData.sortOrder) ?? 0,
        src: imageUrl,
        title: entry.title,
        usageTags: asStringArray(profileData.usageTags),
      };
    },
  ).filter((item): item is RichfieldImageLibraryItem => Boolean(item));

  return mapped.length > 0
    ? mapped.sort((left, right) => left.sortOrder - right.sortOrder)
    : DEFAULT_IMAGE_LIBRARY;
}

function findImageBySlug(images: RichfieldImageLibraryItem[], slug: string | null) {
  return slug ? images.find((image) => image.slug === slug) ?? null : null;
}

function buildContactPage(
  delivery: RichfieldDeliveryPayload,
  apiBaseUrl: string,
  images: RichfieldImageLibraryItem[],
) {
  const entry = getPublishedEntries(delivery, "contact-page")[0];

  if (!entry) return DEFAULT_CONTACT_PAGE;

  const profileData = asRecord(entry.profile_data);
  const fallbackImage =
    findImageBySlug(images, asString(profileData.backgroundImageSlug)) ??
    DEFAULT_CONTACT_PAGE.backgroundImage;
  const entryImage = getImageUrl(entry, apiBaseUrl);

  return {
    backgroundImage: entryImage
      ? {
          alt: getLeadImage(entry)?.alt_text ?? entry.title,
          credit: null,
          objectPosition: "center",
          pageSection: "contact",
          ratio: 16 / 9,
          slug: entry.slug,
          sortOrder: 0,
          src: entryImage,
          title: entry.title,
          usageTags: ["background", "contact"],
        }
      : fallbackImage,
    headline: asString(profileData.headline) ?? entry.title ?? DEFAULT_CONTACT_PAGE.headline,
    intro: getMarkdown(entry) ?? asString(profileData.intro) ?? entry.summary ?? DEFAULT_CONTACT_PAGE.intro,
    mapQuery: asString(profileData.mapQuery) ?? DEFAULT_CONTACT_PAGE.mapQuery,
  };
}

function buildContactChannels(delivery: RichfieldDeliveryPayload) {
  const mapped = getPublishedEntries(delivery, "contact-channels").map<RichfieldContactChannel>(
    (entry, index) => {
      const profileData = asRecord(entry.profile_data);
      const fallback = DEFAULT_CONTACT_CHANNELS[index % DEFAULT_CONTACT_CHANNELS.length]!;

      return {
        cta: asString(profileData.cta) ?? fallback.cta,
        external:
          typeof profileData.external === "boolean"
            ? profileData.external
            : fallback.external,
        href: asString(profileData.href) ?? fallback.href,
        kind: asString(profileData.kind) ?? fallback.kind,
        label: entry.title,
        primary: entry.summary ?? fallback.primary,
        secondary: asString(profileData.secondary) ?? entry.subtitle ?? fallback.secondary,
        sortOrder: asNumber(profileData.sortOrder) ?? index * 10,
      };
    },
  );

  return mapped.length > 0
    ? mapped.sort((left, right) => left.sortOrder - right.sortOrder)
    : DEFAULT_CONTACT_CHANNELS;
}

function buildOpenPositions(delivery: RichfieldDeliveryPayload) {
  const mapped = getPublishedEntries(delivery, "jobs")
    .map((entry) => {
      const profileData = asRecord(entry.profile_data);

      return {
        item: {
          deadline: asString(profileData.deadline) ?? "",
          href: asString(profileData.href) ?? undefined,
          location: asString(profileData.location) ?? entry.subtitle ?? "",
          positions: asNumber(profileData.positions) ?? 1,
          summary: entry.summary ?? undefined,
          title: entry.title,
        } satisfies OpenPosition,
        sortOrder: asNumber(profileData.sortOrder) ?? 0,
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(({ item }) => item);

  return mapped.length > 0 ? mapped : openPositions;
}

// Brand-collaboration timeline — when each partnership began, oldest first.
// Only brands with a known start year appear; mapped to the milestone shape so
// the /brands page can reuse <JourneyTimeline />.
function deriveBrandTimeline(brandList: Brand[]): Milestone[] {
  return brandList
    .filter((b): b is Brand & { year: number } => typeof b.year === "number")
    .sort((a, b) => a.year - b.year)
    .map((b) => ({
      year: b.year,
      brand: b.name,
      country: b.country,
      body: b.story ?? "",
    }));
}

export function buildRichfieldContent(
  delivery: RichfieldDeliveryPayload | null | undefined,
  {
    apiBaseUrl,
  }: {
    apiBaseUrl: string;
  },
): RichfieldContent {
  if (!delivery || delivery.adapter !== "richfield") {
    return DEFAULT_RICHFIELD_CONTENT;
  }

  const nextBrands = buildBrands(delivery, apiBaseUrl);
  const nextMilestones = buildMilestones(delivery);
  const nextImageLibrary = buildImageLibrary(delivery, apiBaseUrl);

  return {
    ...DEFAULT_RICHFIELD_CONTENT,
    brands: nextBrands,
    homepageBrands: nextBrands,
    brandTimeline: deriveBrandTimeline(nextBrands),
    contactChannels: buildContactChannels(delivery),
    contactPage: buildContactPage(delivery, apiBaseUrl, nextImageLibrary),
    imageLibrary: nextImageLibrary,
    leaders: buildLeaders(delivery, apiBaseUrl),
    milestones: nextMilestones,
    homepageMilestones: nextMilestones.filter((m) => !m.aboutOnly),
    openPositions: buildOpenPositions(delivery),
  };
}
