import type { JSONContent } from "@tuturuuu/editor";
import { parseRichfieldJSONContent } from "./richfield-rich-text";

export type RichfieldAdminStudioPayload = {
  assets: Array<Record<string, unknown>>;
  binding?: Record<string, unknown>;
  blocks: Array<Record<string, unknown>>;
  collections: Array<Record<string, unknown>>;
  entries: Array<Record<string, unknown>>;
  importJobs?: unknown[];
  loadingData?: unknown;
  publishEvents?: unknown[];
};

export type RichfieldContentStatus = "archived" | "draft" | "published" | "scheduled";
export type RichfieldContentLocale = "en" | "vi";
export type RichfieldAdminCollectionKey =
  | "articles"
  | "brands"
  | "contact-channels"
  | "contact-form"
  | "contact-page"
  | "contact-submissions"
  | "image-library"
  | "jobs"
  | "leadership"
  | "milestones";

export type RichfieldAdminCollectionConfig = {
  collectionSlug: string;
  key: RichfieldAdminCollectionKey;
  singularLabel: string;
};

export type RichfieldAdminContentItem = {
  aboutOnly: boolean;
  accent: string;
  applyEmail: string;
  author: string;
  blockId: string | null;
  body: string;
  bodyContent: JSONContent | null;
  brand: string;
  category: string;
  collectionKey: RichfieldAdminCollectionKey;
  country: string;
  createdAt: string;
  credit: string;
  cta: string;
  deadline: string;
  department: string;
  email: string;
  emailNotificationStatus: string;
  employmentType: string;
  englishTitle: string;
  feature: boolean;
  featureCaption: string;
  href: string;
  id: string;
  imageAlt: string;
  imageAssetId: string | null;
  imageStoragePath: string | null;
  imageUrl: string | null;
  gallery: RichfieldArticleGalleryItem[];
  inquiryType: string;
  kind: string;
  location: string;
  locale: RichfieldContentLocale;
  localeComplete: boolean;
  localeStatuses: Record<RichfieldContentLocale, RichfieldContentStatus>;
  mapQuery: string;
  metadata: Record<string, unknown>;
  name: string;
  objectPosition: string;
  pageSection: string;
  placement: string;
  positions: string;
  productName: string;
  profileData: Record<string, unknown>;
  publishedAt: string;
  ratio: string;
  receivedAt: string;
  role: string;
  slug: string;
  sortOrder: string;
  status: RichfieldContentStatus;
  submissionStatus: string;
  subtitle: string;
  summary: string;
  summaryContent: JSONContent | null;
  shelfWeight: string;
  title: string;
  usageTags: string;
  updatedAt: string;
  workMode: string;
  year: string;
};

export type RichfieldArticleGalleryItem = {
  alt: string;
  caption: string;
  id: string;
  url: string;
};

export type RichfieldContentMutationInput = {
  aboutOnly: boolean;
  accent: string;
  applyEmail: string;
  author: string;
  body: string;
  bodyContent: JSONContent | null;
  brand: string;
  category: string;
  collectionKey: RichfieldAdminCollectionKey;
  country: string;
  credit: string;
  cta: string;
  deadline: string;
  department: string;
  email: string;
  emailNotificationStatus: string;
  employmentType: string;
  feature: boolean;
  featureCaption: string;
  href: string;
  imageAlt: string;
  imageFile?: File | null;
  gallery: RichfieldArticleGalleryItem[];
  inquiryType: string;
  kind: string;
  location: string;
  locale: RichfieldContentLocale;
  mapQuery: string;
  name: string;
  objectPosition: string;
  pageSection: string;
  placement: string;
  positions: string;
  productName: string;
  publishedAt: string;
  ratio: string;
  receivedAt: string;
  removeImage: boolean;
  role: string;
  slug: string;
  sortOrder: string;
  status: RichfieldContentStatus;
  submissionStatus: string;
  subtitle: string;
  summary: string;
  summaryContent: JSONContent | null;
  shelfWeight: string;
  title: string;
  usageTags: string;
  workMode: string;
  year: string;
};

const MAX_IMAGE_FILE_BYTES = 12 * 1024 * 1024;

const VALID_STATUSES = new Set<RichfieldContentStatus>([
  "archived",
  "draft",
  "published",
  "scheduled",
]);

export const RICHFIELD_ADMIN_COLLECTIONS: Record<
  RichfieldAdminCollectionKey,
  RichfieldAdminCollectionConfig
> = {
  articles: {
    collectionSlug: "articles",
    key: "articles",
    singularLabel: "article",
  },
  brands: {
    collectionSlug: "brands",
    key: "brands",
    singularLabel: "brand",
  },
  "contact-page": {
    collectionSlug: "contact-page",
    key: "contact-page",
    singularLabel: "contact page",
  },
  "contact-form": {
    collectionSlug: "contact-form",
    key: "contact-form",
    singularLabel: "contact form",
  },
  "contact-channels": {
    collectionSlug: "contact-channels",
    key: "contact-channels",
    singularLabel: "contact channel",
  },
  "contact-submissions": {
    collectionSlug: "contact-submissions",
    key: "contact-submissions",
    singularLabel: "message",
  },
  jobs: {
    collectionSlug: "jobs",
    key: "jobs",
    singularLabel: "job",
  },
  "image-library": {
    collectionSlug: "image-library",
    key: "image-library",
    singularLabel: "image",
  },
  leadership: {
    collectionSlug: "leadership",
    key: "leadership",
    singularLabel: "leader",
  },
  milestones: {
    collectionSlug: "milestones",
    key: "milestones",
    singularLabel: "milestone",
  },
};

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readBoolean(record: Record<string, unknown>, key: string) {
  return record[key] === true;
}

function getSortOrder(record: Record<string, unknown>) {
  return readNumber(record, "sort_order") ?? readNumber(record, "sortOrder") ?? 0;
}

function getEntryCollectionSlug(
  entry: Record<string, unknown>,
  collectionById: Map<string, Record<string, unknown>>,
) {
  const directSlug = readString(entry, "collectionSlug") ?? readString(entry, "collection_slug");
  if (directSlug) return directSlug;

  const collectionId = readString(entry, "collection_id") ?? readString(entry, "collectionId");
  const collection = collectionId ? collectionById.get(collectionId) : null;

  return collection
    ? readString(collection, "slug") ?? readString(collection, "collection_type")
    : null;
}

function getAssetEntryId(asset: Record<string, unknown>) {
  return readString(asset, "entry_id") ?? readString(asset, "entryId");
}

function getBlockEntryId(block: Record<string, unknown>) {
  return readString(block, "entry_id") ?? readString(block, "entryId");
}

function getAssetType(asset: Record<string, unknown>) {
  return readString(asset, "asset_type") ?? readString(asset, "assetType");
}

function getBlockType(block: Record<string, unknown>) {
  return readString(block, "block_type") ?? readString(block, "blockType");
}

function getAssetUrl(asset: Record<string, unknown> | undefined) {
  if (!asset) return null;

  // publicPath first, for the same reason the public site prefers it: the
  // delivery asset endpoint only redirects back to this path, and next/image
  // rejects a remote host absent from remotePatterns — so preferring the
  // endpoint turns a working local image into a broken preview.
  return (
    readString(readRecord(asset.metadata), "publicPath") ??
    readString(asset, "asset_url") ??
    readString(asset, "assetUrl") ??
    readString(asset, "source_url") ??
    readString(asset, "sourceUrl")
  );
}

function getAssetStoragePath(asset: Record<string, unknown> | undefined) {
  if (!asset) return null;
  return readString(asset, "storage_path") ?? readString(asset, "storagePath");
}

function getBlockMarkdown(block: Record<string, unknown> | undefined) {
  const content = readRecord(block?.content);
  return readString(content, "markdown") ?? "";
}

function readGallery(value: unknown): RichfieldArticleGalleryItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const record = readRecord(item);
    const url = readString(record, "url");
    if (!url || (!/^https?:\/\//i.test(url) && !url.startsWith("/"))) return [];

    return [{
      alt: readString(record, "alt") ?? "",
      caption: readString(record, "caption") ?? "",
      id: readString(record, "id") ?? crypto.randomUUID(),
      url,
    }];
  });
}

function readGalleryDetails(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const record = readRecord(item);
    const id = readString(record, "id");
    if (!id) return [];
    return [{
      alt: readString(record, "alt") ?? "",
      caption: readString(record, "caption") ?? "",
      id,
    }];
  });
}

export function normalizeRichfieldContentStatus(value: string | null): RichfieldContentStatus {
  return value && VALID_STATUSES.has(value as RichfieldContentStatus)
    ? (value as RichfieldContentStatus)
    : "draft";
}

export function normalizeRichfieldSlugInput(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/g, "")
    .slice(0, 80);
}

export function slugifyRichfieldContent(value: string, fallback = "new-item") {
  const normalized = normalizeRichfieldSlugInput(value).replace(/-+$/g, "");

  return normalized || fallback;
}

export function resolveRichfieldAdminCollectionKey(
  value: string | null | undefined,
): RichfieldAdminCollectionKey | null {
  if (!value) return null;

  if (value in RICHFIELD_ADMIN_COLLECTIONS) {
    return value as RichfieldAdminCollectionKey;
  }

  return (
    Object.values(RICHFIELD_ADMIN_COLLECTIONS).find(
      (collection) => collection.collectionSlug === value,
    )?.key ?? null
  );
}

export function readRichfieldAdminContent(
  studio: RichfieldAdminStudioPayload,
  collectionKey: RichfieldAdminCollectionKey,
  locale: RichfieldContentLocale = "en",
) {
  const config = RICHFIELD_ADMIN_COLLECTIONS[collectionKey];
  const collectionById = new Map(
    studio.collections.map((collection) => [String(collection.id), collection]),
  );
  const imageAssets = studio.assets
    .filter((asset) => getAssetType(asset) === "image")
    .sort((left, right) => getSortOrder(left) - getSortOrder(right));
  const markdownBlocks = studio.blocks
    .filter((block) => getBlockType(block) === "markdown")
    .sort((left, right) => getSortOrder(left) - getSortOrder(right));

  return studio.entries
    .filter(
      (entry) =>
        getEntryCollectionSlug(entry, collectionById) ===
          config.collectionSlug &&
        !(
          collectionKey === "image-library" &&
          readRecord(entry.metadata).editorMedia === true
        ),
    )
    .map<RichfieldAdminContentItem>((entry) => {
      const metadata = readRecord(entry.metadata);
      const localization = readRecord(metadata.richfieldLocalization);
      const localeVariants = readRecord(localization.locales);
      const requestedVariant = readRecord(localeVariants[locale]);
      const englishVariant = readRecord(localeVariants.en);
      const vietnameseVariant = readRecord(localeVariants.vi);
      const sourceLocale = localization.sourceLocale === "vi" ? "vi" : "en";
      const hasLocalization = Object.keys(localization).length > 0;
      const mayUseLegacy = !hasLocalization || sourceLocale === locale;
      const baseProfileData = readRecord(entry.profile_data ?? entry.profileData);
      const localizedProfileData = readRecord(requestedVariant.profileData);
      const profileData = {
        ...baseProfileData,
        ...localizedProfileData,
      };
      const entryId = String(entry.id);
      const imageAsset = imageAssets.find((asset) => getAssetEntryId(asset) === entryId);
      const markdownBlock = markdownBlocks.find((block) => getBlockEntryId(block) === entryId);
      const yearValue = readNumber(profileData, "year");
      const stringList = profileData.inquiryTypes ?? profileData.usageTags;
      const sharedGallery = readGallery(metadata.richfieldGallery);
      const legacyLocalizedGallery = readGallery(requestedVariant.gallery);
      const localizedGalleryDetails = readGalleryDetails(
        requestedVariant.gallery,
      );
      const gallery = (
        sharedGallery.length > 0 ? sharedGallery : legacyLocalizedGallery
      ).map((image) => {
        const details = localizedGalleryDetails.find(
          (item) => item.id === image.id,
        );
        return details ? { ...image, ...details } : image;
      });

      const englishTitle =
        readString(englishVariant, "title") ??
        (!hasLocalization || sourceLocale === "en"
          ? readString(entry, "title")
          : null) ??
        "";
      const title =
        readString(requestedVariant, "title") ??
        (mayUseLegacy ? readString(entry, "title") : null) ??
        "";
      const summary =
        readString(requestedVariant, "summary") ??
        (mayUseLegacy ? readString(entry, "summary") : null) ??
        "";
      const body =
        readString(requestedVariant, "body") ??
        (collectionKey === "contact-submissions"
          ? readString(profileData, "message")
          : null) ??
        (mayUseLegacy ? getBlockMarkdown(markdownBlock) : "");
      const bodyContent =
        parseRichfieldJSONContent(requestedVariant.bodyContent) ??
        (mayUseLegacy
          ? parseRichfieldJSONContent(readRecord(markdownBlock?.content).json)
          : null);
      const summaryContent = parseRichfieldJSONContent(
        requestedVariant.summaryContent,
      );
      const requestedStatus = normalizeRichfieldContentStatus(
        readString(requestedVariant, "status") ??
          (mayUseLegacy ? readString(entry, "status") : null),
      );
      const localeStatuses = {
        en: normalizeRichfieldContentStatus(
          readString(englishVariant, "status") ??
            (!hasLocalization || sourceLocale === "en"
              ? readString(entry, "status")
              : null),
        ),
        vi: normalizeRichfieldContentStatus(
          readString(vietnameseVariant, "status") ??
            (sourceLocale === "vi" ? readString(entry, "status") : null),
        ),
      };

      return {
        aboutOnly: readBoolean(profileData, "aboutOnly"),
        accent: readString(profileData, "accent") ?? "",
        applyEmail: readString(profileData, "applyEmail") ?? "",
        author: readString(profileData, "author") ?? "",
        blockId: markdownBlock ? String(markdownBlock.id) : null,
        body,
        bodyContent,
        brand: readString(profileData, "brand") ?? readString(entry, "title") ?? "",
        category: readString(profileData, "category") ?? readString(entry, "subtitle") ?? "",
        collectionKey,
        country: readString(profileData, "country") ?? readString(entry, "subtitle") ?? "",
        createdAt:
          readString(entry, "created_at") ?? readString(entry, "createdAt") ?? "",
        credit: readString(profileData, "credit") ?? readString(profileData, "country") ?? "",
        cta: readString(profileData, "cta") ?? "",
        deadline: readString(profileData, "deadline") ?? "",
        department: readString(profileData, "department") ?? "",
        email:
          readString(profileData, "recipientEmail") ??
          readString(profileData, "email") ??
          "",
        emailNotificationStatus: readString(profileData, "emailNotificationStatus") ?? readString(readRecord(entry.metadata), "emailNotificationStatus") ?? "",
        employmentType: readString(profileData, "employmentType") ?? "",
        englishTitle,
        feature: readBoolean(profileData, "feature"),
        featureCaption: readString(profileData, "featureCaption") ?? "",
        href: readString(profileData, "href") ?? "",
        id: entryId,
        imageAlt:
          readString(requestedVariant, "imageAlt") ??
          (mayUseLegacy
            ? readString(imageAsset ?? {}, "alt_text") ??
              readString(imageAsset ?? {}, "altText")
            : null) ??
          "",
        imageAssetId: imageAsset ? String(imageAsset.id) : null,
        imageStoragePath: getAssetStoragePath(imageAsset),
        imageUrl:
          getAssetUrl(imageAsset) ??
          readString(profileData, "imageUrl") ??
          readString(profileData, "coverImage") ??
          readString(metadata, "imageUrl") ??
          readString(metadata, "coverImage"),
        gallery,
        inquiryType: readString(profileData, "inquiryType") ?? "",
        kind: readString(profileData, "kind") ?? "",
        location: readString(profileData, "location") ?? "",
        locale,
        localeComplete: Boolean(title && (body || summary || collectionKey === "image-library")),
        localeStatuses,
        mapQuery: readString(profileData, "mapQuery") ?? "",
        metadata,
        name: readString(profileData, "name") ?? "",
        objectPosition: readString(profileData, "objectPosition") ?? "",
        pageSection: readString(profileData, "pageSection") ?? "",
        placement: readString(profileData, "placement") ?? readString(profileData, "usage") ?? "",
        positions:
          readNumber(profileData, "maxMessageLength") !== null
            ? String(readNumber(profileData, "maxMessageLength"))
            : readNumber(profileData, "positions") !== null
              ? String(readNumber(profileData, "positions"))
              : "",
        productName: readString(profileData, "productName") ?? "",
        profileData: baseProfileData,
        publishedAt: readString(profileData, "publishedAt") ?? readString(entry, "published_at") ?? "",
        ratio: readNumber(profileData, "ratio") !== null ? String(readNumber(profileData, "ratio")) : "",
        receivedAt: readString(profileData, "receivedAt") ?? "",
        role: readString(profileData, "role") ?? readString(entry, "subtitle") ?? "",
        slug: readString(entry, "slug") ?? slugifyRichfieldContent(readString(entry, "title") ?? entryId),
        sortOrder: readNumber(profileData, "sortOrder") !== null ? String(readNumber(profileData, "sortOrder")) : "",
        status: requestedStatus,
        submissionStatus: readString(profileData, "submissionStatus") ?? "",
        subtitle: readString(entry, "subtitle") ?? "",
        summary,
        summaryContent,
        shelfWeight: readString(profileData, "shelfWeight") ?? "",
        title,
        usageTags: Array.isArray(stringList)
          ? stringList
              .filter((item: unknown): item is string => typeof item === "string")
              .join(", ")
          : "",
        updatedAt:
          readString(entry, "updated_at") ?? readString(entry, "updatedAt") ?? "",
        workMode: readString(profileData, "workMode") ?? "",
        year: yearValue !== null ? String(yearValue) : "",
      };
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

function isImageFile(file: File) {
  return (
    file.type.startsWith("image/") ||
    /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file.name)
  );
}

export function parseRichfieldContentFormData(
  collectionKey: RichfieldAdminCollectionKey,
  formData: FormData,
): {
  errors: Record<string, string>;
  input: RichfieldContentMutationInput | null;
} {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugifyRichfieldContent(String(formData.get("slug") ?? title));
  const rawStatus = String(formData.get("status") ?? "draft").trim();
  const status = normalizeRichfieldContentStatus(rawStatus);
  const uploadedImage = formData.get("imageFile");
  const imageFile = uploadedImage instanceof File && uploadedImage.size > 0 ? uploadedImage : null;
  const errors: Record<string, string> = {};
  const bodyContent = parseRichfieldJSONContent(formData.get("bodyContent"));
  const summaryContent = parseRichfieldJSONContent(
    formData.get("summaryContent"),
  );
  let gallery: RichfieldArticleGalleryItem[] = [];

  try {
    gallery = readGallery(
      JSON.parse(String(formData.get("gallery") ?? "[]")),
    );
  } catch {
    errors.gallery = "Check the article gallery and try again.";
  }

  if (!title) {
    errors.title = "Add a title.";
  }

  if (rawStatus && !VALID_STATUSES.has(rawStatus as RichfieldContentStatus)) {
    errors.status = "Choose a valid visibility option.";
  }

  if (imageFile) {
    if (!isImageFile(imageFile)) {
      errors.imageFile = "Choose an image file.";
    } else if (imageFile.size > MAX_IMAGE_FILE_BYTES) {
      errors.imageFile = "Choose an image under 12 MB.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, input: null };
  }

  const rawYear = String(formData.get("year") ?? "").trim();
  const parsedYear = Number.parseInt(rawYear, 10);

  return {
    errors: {},
    input: {
      aboutOnly: formData.get("aboutOnly") === "true" || formData.get("aboutOnly") === "on",
      accent: String(formData.get("accent") ?? "").trim(),
      applyEmail: String(formData.get("applyEmail") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      body: String(formData.get("body") ?? "").trim(),
      bodyContent,
      brand: String(formData.get("brand") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      collectionKey,
      country: String(formData.get("country") ?? "").trim(),
      credit: String(formData.get("credit") ?? "").trim(),
      cta: String(formData.get("cta") ?? "").trim(),
      deadline: String(formData.get("deadline") ?? "").trim(),
      department: String(formData.get("department") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      emailNotificationStatus: String(formData.get("emailNotificationStatus") ?? "").trim(),
      employmentType: String(formData.get("employmentType") ?? "").trim(),
      feature: formData.get("feature") === "true" || formData.get("feature") === "on",
      featureCaption: String(formData.get("featureCaption") ?? "").trim(),
      href: String(formData.get("href") ?? "").trim(),
      imageAlt: String(formData.get("imageAlt") ?? "").trim(),
      imageFile,
      gallery: collectionKey === "articles" ? gallery : [],
      inquiryType: String(formData.get("inquiryType") ?? "").trim(),
      kind: String(formData.get("kind") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      locale: formData.get("locale") === "vi" ? "vi" : "en",
      mapQuery: String(formData.get("mapQuery") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      objectPosition: String(formData.get("objectPosition") ?? "").trim(),
      pageSection: String(formData.get("pageSection") ?? "").trim(),
      placement: String(formData.get("placement") ?? "").trim(),
      positions: String(formData.get("positions") ?? "").trim(),
      productName: String(formData.get("productName") ?? "").trim(),
      publishedAt: String(formData.get("publishedAt") ?? "").trim(),
      ratio: String(formData.get("ratio") ?? "").trim(),
      receivedAt: String(formData.get("receivedAt") ?? "").trim(),
      removeImage: formData.get("removeImage") === "true" || formData.get("removeImage") === "on",
      role: String(formData.get("role") ?? "").trim(),
      slug,
      sortOrder: String(formData.get("sortOrder") ?? "").trim(),
      status,
      submissionStatus: String(formData.get("submissionStatus") ?? "").trim(),
      subtitle: String(formData.get("subtitle") ?? "").trim(),
      summary: String(formData.get("summary") ?? "").trim(),
      summaryContent,
      shelfWeight: String(formData.get("shelfWeight") ?? "").trim(),
      title,
      usageTags: String(formData.get("usageTags") ?? "").trim(),
      workMode: String(formData.get("workMode") ?? "").trim(),
      year: Number.isFinite(parsedYear) ? String(parsedYear) : "",
    },
  };
}
