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
  id: string;
  imageAlt: string;
  imageAssetId: string | null;
  imageStoragePath: string | null;
  imageUrl: string | null;
  inquiryType: string;
  kind: string;
  location: string;
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
  role: string;
  slug: string;
  sortOrder: string;
  status: RichfieldContentStatus;
  submissionStatus: string;
  subtitle: string;
  summary: string;
  shelfWeight: string;
  title: string;
  usageTags: string;
  workMode: string;
  year: string;
};

export type RichfieldContentMutationInput = {
  aboutOnly: boolean;
  accent: string;
  applyEmail: string;
  author: string;
  body: string;
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
  inquiryType: string;
  kind: string;
  location: string;
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

  return (
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

export function normalizeRichfieldContentStatus(value: string | null): RichfieldContentStatus {
  return value && VALID_STATUSES.has(value as RichfieldContentStatus)
    ? (value as RichfieldContentStatus)
    : "draft";
}

export function slugifyRichfieldContent(value: string, fallback = "new-item") {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

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
    .filter((entry) => getEntryCollectionSlug(entry, collectionById) === config.collectionSlug)
    .map<RichfieldAdminContentItem>((entry) => {
      const profileData = readRecord(entry.profile_data ?? entry.profileData);
      const entryId = String(entry.id);
      const imageAsset = imageAssets.find((asset) => getAssetEntryId(asset) === entryId);
      const markdownBlock = markdownBlocks.find((block) => getBlockEntryId(block) === entryId);
      const yearValue = readNumber(profileData, "year");
      const stringList = profileData.inquiryTypes ?? profileData.usageTags;

      return {
        aboutOnly: readBoolean(profileData, "aboutOnly"),
        accent: readString(profileData, "accent") ?? "",
        applyEmail: readString(profileData, "applyEmail") ?? "",
        author: readString(profileData, "author") ?? "",
        blockId: markdownBlock ? String(markdownBlock.id) : null,
        body: getBlockMarkdown(markdownBlock),
        brand: readString(profileData, "brand") ?? readString(entry, "title") ?? "",
        category: readString(profileData, "category") ?? readString(entry, "subtitle") ?? "",
        collectionKey,
        country: readString(profileData, "country") ?? readString(entry, "subtitle") ?? "",
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
        feature: readBoolean(profileData, "feature"),
        featureCaption: readString(profileData, "featureCaption") ?? "",
        href: readString(profileData, "href") ?? "",
        id: entryId,
        imageAlt: readString(imageAsset ?? {}, "alt_text") ?? readString(imageAsset ?? {}, "altText") ?? "",
        imageAssetId: imageAsset ? String(imageAsset.id) : null,
        imageStoragePath: getAssetStoragePath(imageAsset),
        imageUrl: getAssetUrl(imageAsset),
        inquiryType: readString(profileData, "inquiryType") ?? "",
        kind: readString(profileData, "kind") ?? "",
        location: readString(profileData, "location") ?? "",
        mapQuery: readString(profileData, "mapQuery") ?? "",
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
        publishedAt: readString(profileData, "publishedAt") ?? readString(entry, "published_at") ?? "",
        ratio: readNumber(profileData, "ratio") !== null ? String(readNumber(profileData, "ratio")) : "",
        receivedAt: readString(profileData, "receivedAt") ?? "",
        role: readString(profileData, "role") ?? readString(entry, "subtitle") ?? "",
        slug: readString(entry, "slug") ?? slugifyRichfieldContent(readString(entry, "title") ?? entryId),
        sortOrder: readNumber(profileData, "sortOrder") !== null ? String(readNumber(profileData, "sortOrder")) : "",
        status: normalizeRichfieldContentStatus(readString(entry, "status")),
        submissionStatus: readString(profileData, "submissionStatus") ?? "",
        subtitle: readString(entry, "subtitle") ?? "",
        summary: readString(entry, "summary") ?? "",
        shelfWeight: readString(profileData, "shelfWeight") ?? "",
        title: readString(entry, "title") ?? "Untitled",
        usageTags: Array.isArray(stringList)
          ? stringList
              .filter((item: unknown): item is string => typeof item === "string")
              .join(", ")
          : "",
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
      inquiryType: String(formData.get("inquiryType") ?? "").trim(),
      kind: String(formData.get("kind") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
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
      shelfWeight: String(formData.get("shelfWeight") ?? "").trim(),
      title,
      usageTags: String(formData.get("usageTags") ?? "").trim(),
      workMode: String(formData.get("workMode") ?? "").trim(),
      year: Number.isFinite(parsedYear) ? String(parsedYear) : "",
    },
  };
}
