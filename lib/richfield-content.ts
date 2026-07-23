import {
  featuredPartners,
  type Brand,
  type BrandCategory,
} from "@/content/en/brands";
import type { OpenPosition } from "@/content/en/careers";
import type { Leader } from "@/content/en/leadership";
import type { Milestone } from "@/content/en/milestones";
import type { BannerWeight, ShelfCategory } from "@/content/en/shelf";
import { getContent } from "@/content";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import messagesEn from "@/messages/en.json";
import messagesVi from "@/messages/vi.json";
import { getRichfieldContactChannels } from "./richfield-contact-channels";

// The locale-selected content modules — the local fallback when the CMS is
// unreachable or has no published entries for a collection.
type LocaleContent = ReturnType<typeof getContent>;

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
  articles: RichfieldArticle[];
  brands: Brand[];
  homepageBrands: Brand[];
  brandTimeline: Milestone[];
  contactChannels: RichfieldContactChannel[];
  contactForm: RichfieldContactForm;
  contactPage: RichfieldContactPage;
  featuredPartners: typeof featuredPartners;
  imageLibrary: RichfieldImageLibraryItem[];
  leaders: Leader[];
  openPositions: OpenPosition[];
  peopleFirstIntro: string;
  milestones: Milestone[];
  homepageMilestones: Milestone[];
  shelfCategories: ShelfCategory[];
};

export type RichfieldArticle = {
  author: string | null;
  body: string;
  category: string | null;
  featured: boolean;
  imageUrl: string | null;
  publishedAt: string | null;
  slug: string;
  summary: string;
  title: string;
};

export type RichfieldContactPage = {
  backgroundImage: RichfieldImageLibraryItem | null;
  headline: string;
  intro: string;
  mapQuery: string;
};

export type RichfieldContactForm = {
  inquiryTypes: string[];
  maxMessageLength: number;
  recipientEmail: string;
  submitLabel: string;
  successMessage: string;
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
  placement: string | null;
  brand: string | null;
  category: string | null;
  feature: boolean;
  productName: string | null;
  ratio: number | null;
  shelfWeight: string | null;
  sortOrder: number;
  src: string;
  title: string;
  usageTags: string[];
  slug: string;
};

function buildDefaultContactPage(locale: Locale, content: LocaleContent): RichfieldContactPage {
  // Read from the next-intl catalogs directly — this runs outside a request
  // context (module-level defaults, tests), where getTranslations isn't usable.
  const { contactPage } = locale === "vi" ? messagesVi : messagesEn;

  return {
    backgroundImage: {
      alt: contactPage.heroAlt,
      credit: null,
      objectPosition: "center",
      pageSection: "contact",
      placement: "contact-hero",
      brand: null,
      category: null,
      feature: false,
      productName: null,
      ratio: 16 / 9,
      shelfWeight: null,
      slug: "contact-richfield",
      sortOrder: 0,
      src: "/photos/contact-richfield.webp",
      title: "Contact Richfield",
      usageTags: ["background", "contact"],
    },
    headline: contactPage.headline,
    intro: contactPage.intro,
    mapQuery: content.site.address.full,
  };
}

function buildDefaultContactChannels(locale: Locale): RichfieldContactChannel[] {
  return getRichfieldContactChannels(locale).map(({ slug: _slug, ...channel }) => channel);
}

function buildDefaultContactForm(locale: Locale, content: LocaleContent): RichfieldContactForm {
  const labels = locale === "vi" ? messagesVi.contactForm : messagesEn.contactForm;

  return {
    inquiryTypes: [
      "Brand partnership",
      "Distribution opportunity",
      "Careers",
      "Press",
      "Other",
    ],
    maxMessageLength: 1_200,
    recipientEmail: content.site.email,
    submitLabel: labels.send,
    successMessage: labels.success,
  };
}

function buildDefaultImageLibrary(content: LocaleContent): RichfieldImageLibraryItem[] {
  return Object.entries(content.peoplePhotos).map(([slug, photo], index) => ({
    alt: photo.alt,
    credit: null,
    objectPosition: "center",
    pageSection: slug.startsWith("hero") ? "home" : "careers",
    placement: slug.startsWith("hero") ? "cover-portrait" : "gallery-image",
    brand: null,
    category: null,
    feature: false,
    productName: null,
    ratio: photo.ratio,
    shelfWeight: null,
    slug,
    sortOrder: index * 10,
    src: photo.src,
    title: slug.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()),
    usageTags: slug.startsWith("hero") ? ["hero", "people"] : ["gallery", "people"],
  }));
}

// Memoized per locale so identity is stable — buildRichfieldContent(null, …)
// must return the same object every call (tests and React deps rely on it).
const defaultContentByLocale = new Map<Locale, RichfieldContent>();

export function getDefaultRichfieldContent(locale: Locale = DEFAULT_LOCALE): RichfieldContent {
  const cached = defaultContentByLocale.get(locale);
  if (cached) return cached;

  const content = getContent(locale);
  const built: RichfieldContent = {
    articles: [],
    brands: content.brands,
    homepageBrands: content.homepageBrands,
    brandTimeline: content.brandTimeline,
    contactChannels: buildDefaultContactChannels(locale),
    contactForm: buildDefaultContactForm(locale, content),
    contactPage: buildDefaultContactPage(locale, content),
    featuredPartners: content.featuredPartners,
    imageLibrary: buildDefaultImageLibrary(content),
    leaders: content.leaders,
    openPositions: content.openPositions,
    peopleFirstIntro: content.peopleFirstIntro,
    shelfCategories: content.shelfCategories,
    milestones: content.milestones,
    homepageMilestones: content.homepageMilestones,
  };
  defaultContentByLocale.set(locale, built);
  return built;
}

export const DEFAULT_RICHFIELD_CONTENT: RichfieldContent = getDefaultRichfieldContent(DEFAULT_LOCALE);

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

function slugifyContentKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findByContentSlug<T>(
  items: T[],
  entry: DeliveryEntry,
  getKey: (item: T) => string,
) {
  const slug = entry.slug;
  const titleSlug = slugifyContentKey(entry.title);

  return (
    items.find((item) => slugifyContentKey(getKey(item)) === slug) ??
    items.find((item) => slugifyContentKey(getKey(item)) === titleSlug) ??
    null
  );
}

function isBrandCategory(value: string | null): value is BrandCategory {
  return Boolean(value && ["Food", "Beverages", "Non-Food"].includes(value));
}

function findBrandLogo(images: RichfieldImageLibraryItem[], brandName: string) {
  const normalized = brandName.trim().toLowerCase();
  return (
    images.find(
      (image) =>
        image.placement === "brand-logo" &&
        (image.brand?.trim().toLowerCase() === normalized ||
          image.title.trim().toLowerCase() === `${normalized} logo` ||
          image.title.trim().toLowerCase() === normalized),
    ) ?? null
  );
}

// The CMS delivery is single-language (the default locale). For any other
// locale a CMS text value would be untranslated, so prefer the locally
// translated copy (matched by slug) and use the CMS text only when no
// translation exists for that entry.
function localizedText(
  locale: Locale,
  cmsValue: string | null | undefined,
  translated: string | null | undefined,
) {
  return locale === DEFAULT_LOCALE
    ? (cmsValue ?? translated ?? null)
    : (translated ?? cmsValue ?? null);
}

function buildBrands(
  delivery: RichfieldDeliveryPayload,
  apiBaseUrl: string,
  images: RichfieldImageLibraryItem[],
  brands: Brand[],
  locale: Locale,
) {
  const mapped = getPublishedEntries(delivery, "brands").map<Brand>((entry, index) => {
    const profileData = asRecord(entry.profile_data);
    const matched = findByContentSlug(brands, entry, (brand) => brand.name);
    const fallback = matched ?? brands[index % brands.length] ?? brands[0]!;
    const category = asString(profileData.category);
    const year = asNumber(profileData.year);
    const galleryLogo = findBrandLogo(images, entry.title) ?? findBrandLogo(images, fallback.name);

    return {
      name: entry.title,
      country:
        localizedText(locale, asString(profileData.country), matched?.country) ??
        fallback.country,
      year: year ?? fallback.year,
      logoSrc: galleryLogo?.src ?? getImageUrl(entry, apiBaseUrl) ?? fallback.logoSrc,
      category: isBrandCategory(category) ? category : fallback.category,
      accent: asString(profileData.accent) ?? fallback.accent,
      story: localizedText(locale, entry.summary, matched?.story) ?? fallback.story,
      feature:
        typeof profileData.feature === "boolean"
          ? profileData.feature
          : fallback.feature,
      featureCaption: asString(profileData.featureCaption) ?? fallback.featureCaption,
    };
  });

  return mapped.length > 0
    ? mapped
    : brands.map((brand) => ({
        ...brand,
        logoSrc: findBrandLogo(images, brand.name)?.src ?? brand.logoSrc,
      }));
}

function buildLeaders(
  delivery: RichfieldDeliveryPayload,
  apiBaseUrl: string,
  leaders: Leader[],
  locale: Locale,
) {
  const mapped = getPublishedEntries(delivery, "leadership").map<Leader>((entry, index) => {
    const matched = findByContentSlug(leaders, entry, (leader) => leader.name);
    const fallback = matched ?? leaders[index % leaders.length] ?? leaders[0]!;
    const bio = getMarkdown(entry);

    return {
      name: entry.title,
      role: localizedText(locale, entry.subtitle, matched?.role) ?? fallback.role,
      photo: getImageUrl(entry, apiBaseUrl) ?? fallback.photo,
      bio: localizedText(locale, bio ?? entry.summary, matched?.bio) ?? fallback.bio,
      quote: localizedText(locale, getQuoteBlock(entry), matched?.quote) ?? fallback.quote,
    };
  });

  return mapped.length > 0 ? mapped : leaders;
}

function buildMilestones(
  delivery: RichfieldDeliveryPayload,
  milestones: Milestone[],
  locale: Locale,
) {
  const mapped = getPublishedEntries(delivery, "milestones").map<Milestone>((entry, index) => {
    const profileData = asRecord(entry.profile_data);
    const matched =
      findByContentSlug(
        milestones,
        entry,
        (milestone) => `${milestone.year}-${milestone.brand}`,
      ) ?? findByContentSlug(milestones, entry, (milestone) => milestone.brand);
    const fallback = matched ?? milestones[index % milestones.length] ?? milestones[0]!;
    const year = asNumber(profileData.year);

    return {
      year: year ?? fallback.year,
      brand: asString(profileData.brand) ?? entry.title,
      country:
        localizedText(locale, asString(profileData.country) ?? entry.subtitle, matched?.country) ??
        fallback.country,
      body: localizedText(locale, entry.summary, matched?.body) ?? fallback.body,
      aboutOnly:
        typeof profileData.aboutOnly === "boolean"
          ? profileData.aboutOnly
          : fallback.aboutOnly,
    };
  });

  return mapped.length > 0 ? mapped : milestones;
}

function buildImageLibrary(
  delivery: RichfieldDeliveryPayload,
  apiBaseUrl: string,
  defaultImageLibrary: RichfieldImageLibraryItem[],
) {
  const mapped = getPublishedEntries(delivery, "image-library").map<RichfieldImageLibraryItem | null>(
    (entry) => {
      const profileData = asRecord(entry.profile_data);
      const imageUrl = getImageUrl(entry, apiBaseUrl);

      if (!imageUrl) return null;

      return {
        alt: getLeadImage(entry)?.alt_text ?? entry.summary ?? entry.title,
        brand: asString(profileData.brand),
        category: asString(profileData.category),
        credit: asString(profileData.credit),
        feature: profileData.feature === true,
        objectPosition: asString(profileData.objectPosition),
        pageSection: asString(profileData.pageSection) ?? "shared",
        placement: asString(profileData.placement),
        productName: asString(profileData.productName),
        ratio: asNumber(profileData.ratio),
        shelfWeight: asString(profileData.shelfWeight),
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
    : defaultImageLibrary;
}

function isShelfWeight(value: string | null): value is BannerWeight {
  return value === "hero" || value === "wide" || value === "feature";
}

function buildShelfCategoriesFromImages(
  images: RichfieldImageLibraryItem[],
  shelfCategories: ShelfCategory[],
) {
  const brandImages = images.filter((image) => image.pageSection === "brands");

  return shelfCategories.map<ShelfCategory>((fallbackCategory) => {
    const categoryImages = brandImages.filter(
      (image) => image.category === fallbackCategory.label,
    );
    const banners = categoryImages
      .filter((image) => image.placement === "shelf-banner")
      .map((image) => ({
        alt: image.alt,
        brand: image.brand ?? image.title,
        ratio: image.ratio ?? 16 / 9,
        src: image.src,
        weight: isShelfWeight(image.shelfWeight) ? image.shelfWeight : "wide",
      }));
    const packshots = categoryImages
      .filter((image) => image.placement === "shelf-product")
      .map((image) => ({
        alt: image.alt,
        brand: image.brand ?? image.title,
        feature: image.feature || undefined,
        name: image.productName ?? image.title,
        src: image.src,
      }));

    if (banners.length === 0 && packshots.length === 0) {
      return fallbackCategory;
    }

    const brandsFromImages = [
      ...new Set(
        [...banners.map((item) => item.brand), ...packshots.map((item) => item.brand)]
          .map((brand) => brand.trim())
          .filter(Boolean),
      ),
    ];

    return {
      ...fallbackCategory,
      banners,
      brands: brandsFromImages.length > 0 ? brandsFromImages : fallbackCategory.brands,
      packshots,
    };
  });
}

function findImageBySlug(images: RichfieldImageLibraryItem[], slug: string | null) {
  return slug ? images.find((image) => image.slug === slug) ?? null : null;
}

function buildContactPage(
  delivery: RichfieldDeliveryPayload,
  apiBaseUrl: string,
  images: RichfieldImageLibraryItem[],
  defaultContactPage: RichfieldContactPage,
  locale: Locale,
) {
  const entry = getPublishedEntries(delivery, "contact-page")[0];

  if (!entry) return defaultContactPage;

  const profileData = asRecord(entry.profile_data);
  const fallbackImage =
    findImageBySlug(images, asString(profileData.backgroundImageSlug)) ??
    defaultContactPage.backgroundImage;
  const entryImage = getImageUrl(entry, apiBaseUrl);

  return {
    backgroundImage: entryImage
      ? {
          alt: getLeadImage(entry)?.alt_text ?? entry.title,
          credit: null,
          objectPosition: "center",
          pageSection: "contact",
          placement: "contact-hero",
          brand: null,
          category: null,
          feature: false,
          productName: null,
          ratio: 16 / 9,
          shelfWeight: null,
          slug: entry.slug,
          sortOrder: 0,
          src: entryImage,
          title: entry.title,
          usageTags: ["background", "contact"],
        }
      : fallbackImage,
    headline:
      localizedText(locale, asString(profileData.headline) ?? entry.title, defaultContactPage.headline) ??
      defaultContactPage.headline,
    intro:
      localizedText(
        locale,
        getMarkdown(entry) ?? asString(profileData.intro) ?? entry.summary,
        defaultContactPage.intro,
      ) ?? defaultContactPage.intro,
    mapQuery: asString(profileData.mapQuery) ?? defaultContactPage.mapQuery,
  };
}

function buildContactChannels(delivery: RichfieldDeliveryPayload, locale: Locale) {
  const channelSeeds = getRichfieldContactChannels(locale);
  const defaultChannels = buildDefaultContactChannels(locale);
  const mapped = getPublishedEntries(delivery, "contact-channels").map<RichfieldContactChannel>(
    (entry, index) => {
      const profileData = asRecord(entry.profile_data);
      const fallback =
        channelSeeds.find((channel) => channel.slug === entry.slug) ??
        findByContentSlug(defaultChannels, entry, (channel) => channel.label) ??
        defaultChannels[index % defaultChannels.length]!;

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
    : defaultChannels;
}

function buildContactForm(
  delivery: RichfieldDeliveryPayload,
  defaultContactForm: RichfieldContactForm,
) {
  const entry = getPublishedEntries(delivery, "contact-form")[0];
  if (!entry) return defaultContactForm;

  const profileData = asRecord(entry.profile_data);
  const inquiryTypes = Array.isArray(profileData.inquiryTypes)
    ? profileData.inquiryTypes.filter(
        (value): value is string => typeof value === "string" && value.trim().length > 0,
      )
    : [];
  const maxMessageLength = asNumber(profileData.maxMessageLength);

  return {
    inquiryTypes:
      inquiryTypes.length > 0 ? [...new Set(inquiryTypes)] : defaultContactForm.inquiryTypes,
    maxMessageLength:
      maxMessageLength && maxMessageLength >= 100 && maxMessageLength <= 5_000
        ? Math.floor(maxMessageLength)
        : defaultContactForm.maxMessageLength,
    recipientEmail:
      asString(profileData.recipientEmail) ?? defaultContactForm.recipientEmail,
    submitLabel: asString(profileData.submitLabel) ?? defaultContactForm.submitLabel,
    successMessage:
      getMarkdown(entry) ??
      asString(profileData.successMessage) ??
      entry.summary ??
      defaultContactForm.successMessage,
  } satisfies RichfieldContactForm;
}

function buildOpenPositions(
  delivery: RichfieldDeliveryPayload,
  openPositions: OpenPosition[],
) {
  const mapped = getPublishedEntries(delivery, "jobs")
    .map((entry) => {
      const profileData = asRecord(entry.profile_data);

      return {
        item: {
          applyEmail: asString(profileData.applyEmail) ?? undefined,
          body: getMarkdown(entry) ?? undefined,
          deadline: asString(profileData.deadline) ?? "",
          department: asString(profileData.department) ?? undefined,
          employmentType: asString(profileData.employmentType) ?? undefined,
          href: asString(profileData.href) ?? undefined,
          location: asString(profileData.location) ?? entry.subtitle ?? "",
          positions: asNumber(profileData.positions) ?? 1,
          slug: entry.slug,
          summary: entry.summary ?? undefined,
          title: entry.title,
          workMode: asString(profileData.workMode) ?? undefined,
        } satisfies OpenPosition,
        sortOrder: asNumber(profileData.sortOrder) ?? 0,
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(({ item }) => item);

  return mapped.length > 0 ? mapped : openPositions;
}

function buildArticles(
  delivery: RichfieldDeliveryPayload,
  apiBaseUrl: string,
) {
  return getPublishedEntries(delivery, "articles")
    .map<RichfieldArticle>((entry) => {
      const profileData = asRecord(entry.profile_data);
      return {
        author: asString(profileData.author),
        body: getMarkdown(entry) ?? entry.summary ?? "",
        category: asString(profileData.category) ?? entry.subtitle,
        featured: profileData.feature === true,
        imageUrl: getImageUrl(entry, apiBaseUrl),
        publishedAt: asString(profileData.publishedAt) ?? entry.published_at,
        slug: entry.slug,
        summary: entry.summary ?? "",
        title: entry.title,
      };
    })
    .sort((left, right) => {
      if (left.featured !== right.featured) return left.featured ? -1 : 1;
      return (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "");
    });
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
    locale = DEFAULT_LOCALE,
  }: {
    apiBaseUrl: string;
    locale?: Locale;
  },
): RichfieldContent {
  const defaults = getDefaultRichfieldContent(locale);

  if (!delivery || delivery.adapter !== "richfield") {
    return defaults;
  }

  const nextImageLibrary = buildImageLibrary(delivery, apiBaseUrl, defaults.imageLibrary);
  const nextBrands = buildBrands(delivery, apiBaseUrl, nextImageLibrary, defaults.brands, locale);
  const nextMilestones = buildMilestones(delivery, defaults.milestones, locale);

  return {
    ...defaults,
    articles: buildArticles(delivery, apiBaseUrl),
    brands: nextBrands,
    homepageBrands: nextBrands,
    brandTimeline: deriveBrandTimeline(nextBrands),
    contactChannels: buildContactChannels(delivery, locale),
    contactForm: buildContactForm(delivery, defaults.contactForm),
    contactPage: buildContactPage(delivery, apiBaseUrl, nextImageLibrary, defaults.contactPage, locale),
    imageLibrary: nextImageLibrary,
    leaders: buildLeaders(delivery, apiBaseUrl, defaults.leaders, locale),
    milestones: nextMilestones,
    homepageMilestones: nextMilestones.filter((m) => !m.aboutOnly),
    openPositions: buildOpenPositions(delivery, defaults.openPositions),
    shelfCategories: buildShelfCategoriesFromImages(nextImageLibrary, defaults.shelfCategories),
  };
}
