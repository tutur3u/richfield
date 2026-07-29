import type { ExternalProjectsClient } from "tuturuuu/external-projects";
import {
  RICHFIELD_ADMIN_COLLECTIONS,
  normalizeRichfieldContentStatus,
  readRichfieldAdminContent,
  type RichfieldAdminCollectionKey,
  type RichfieldAdminContentItem,
  type RichfieldAdminStudioPayload,
  type RichfieldContentStatus,
  type RichfieldContentMutationInput,
} from "./richfield-admin-content-model";
import {
  getRichfieldAdminCollectionStudio,
  revalidateRichfieldContent,
} from "./richfield-admin-api";
import { getRichfieldManifestCollectionSchema } from "./richfield-external-project-manifest";

type RichfieldCrudClient = Pick<
  ExternalProjectsClient,
  | "createAsset"
  | "createBlock"
  | "createCollection"
  | "createEntry"
  | "deleteAsset"
  | "deleteEntry"
  | "getStudio"
  | "updateAsset"
  | "updateBlock"
  | "updateEntry"
  | "uploadAssetFile"
>;

type MutationResult = {
  item: RichfieldAdminContentItem | null;
  items: RichfieldAdminContentItem[];
};

export type RichfieldContentMutationProgress = {
  label: string;
  percent: number;
  step: string;
};

type MutationOptions = {
  onProgress?: (progress: RichfieldContentMutationProgress) => Promise<void> | void;
};

async function reportProgress(
  options: MutationOptions | undefined,
  progress: RichfieldContentMutationProgress,
) {
  await options?.onProgress?.(progress);
}

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getCollection(studio: RichfieldAdminStudioPayload, collectionKey: RichfieldAdminCollectionKey) {
  const config = RICHFIELD_ADMIN_COLLECTIONS[collectionKey];

  return (
    studio.collections.find((collection) => {
      return (
        readString(collection, "slug") === config.collectionSlug ||
        readString(collection, "collection_type") === config.collectionSlug
      );
    }) ?? null
  );
}

function readCreatedEntryId(response: unknown) {
  const record = readRecord(response);
  return readString(record, "id") ?? readString(readRecord(record.entry), "id");
}

function findItemById(
  studio: RichfieldAdminStudioPayload,
  collectionKey: RichfieldAdminCollectionKey,
  entryId: string,
) {
  return readRichfieldAdminContent(studio, collectionKey).find((item) => item.id === entryId) ?? null;
}

function findItemBySlug(
  studio: RichfieldAdminStudioPayload,
  collectionKey: RichfieldAdminCollectionKey,
  slug: string,
) {
  return readRichfieldAdminContent(studio, collectionKey).find((item) => item.slug === slug) ?? null;
}

function readEntryId(record: Record<string, unknown>) {
  return readString(record, "entry_id") ?? readString(record, "entryId");
}

function readEditorMediaAssetId(url: string) {
  const match = /\/external-projects\/assets\/([^/?#]+)/u.exec(url);
  if (!match?.[1]) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function collectRichTextImageAssetIds(
  node: unknown,
  assetIds: Set<string>,
) {
  const record = readRecord(node);

  if (record.type === "image") {
    const assetId = readEditorMediaAssetId(
      readString(readRecord(record.attrs), "src") ?? "",
    );
    if (assetId) assetIds.add(assetId);
  }

  const content = Array.isArray(record.content) ? record.content : [];
  for (const child of content) {
    collectRichTextImageAssetIds(child, assetIds);
  }
}

export function findReferencedEditorMediaRecords(
  studio: RichfieldAdminStudioPayload,
  item: Pick<RichfieldAdminContentItem, "bodyContent" | "gallery" | "id">,
) {
  const referencedAssetIds = new Set<string>();
  collectRichTextImageAssetIds(item.bodyContent, referencedAssetIds);

  const entry = studio.entries.find(
    (candidate) => readString(candidate, "id") === item.id,
  );
  const localization = readRecord(
    readRecord(entry?.metadata).richfieldLocalization,
  );
  const locales = readRecord(localization.locales);
  for (const variant of Object.values(locales)) {
    collectRichTextImageAssetIds(
      readRecord(variant).bodyContent,
      referencedAssetIds,
    );
  }

  for (const image of item.gallery) {
    const assetId = readEditorMediaAssetId(image.url);
    if (assetId) referencedAssetIds.add(assetId);
  }

  const editorMediaEntryIds = new Set(
    studio.entries
      .filter(
        (entry) => readRecord(entry.metadata).editorMedia === true,
      )
      .map((entry) => readString(entry, "id"))
      .filter((id): id is string => Boolean(id)),
  );
  const referencedEntryIds = new Set<string>();

  for (const asset of studio.assets) {
    const assetId = readString(asset, "id");
    const entryId = readEntryId(asset);
    if (
      assetId &&
      entryId &&
      referencedAssetIds.has(assetId) &&
      editorMediaEntryIds.has(entryId)
    ) {
      referencedEntryIds.add(entryId);
    }
  }

  return [...referencedEntryIds].map((entryId) => ({
    assetIds: studio.assets
      .filter((asset) => readEntryId(asset) === entryId)
      .map((asset) => readString(asset, "id"))
      .filter((assetId): assetId is string => Boolean(assetId)),
    entryId,
  }));
}

async function ensureContentCollection(
  client: RichfieldCrudClient,
  workspaceId: string,
  collectionKey: RichfieldAdminCollectionKey,
) {
  let studio = (await client.getStudio(workspaceId)) as RichfieldAdminStudioPayload;
  let collection = getCollection(studio, collectionKey);

  if (!collection) {
    const config = RICHFIELD_ADMIN_COLLECTIONS[collectionKey];
    const schema = getRichfieldManifestCollectionSchema(config.collectionSlug);

    await client.createCollection(workspaceId, {
      collection_type: schema?.collection_type ?? config.collectionSlug,
      config: {},
      description: schema?.description ?? null,
      slug: config.collectionSlug,
      title: schema?.title ?? config.singularLabel,
    });

    studio = (await client.getStudio(workspaceId)) as RichfieldAdminStudioPayload;
    collection = getCollection(studio, collectionKey);
  }

  if (!collection) {
    throw new Error("This section is not ready yet.");
  }

  return { collection, studio };
}

function parseYear(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseStringList(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function buildProfileData(input: RichfieldContentMutationInput) {
  if (input.collectionKey === "articles") {
    return {
      author: input.author || null,
      category: input.category || null,
      feature: input.feature,
      publishedAt: input.publishedAt || null,
      sortOrder: parseNumber(input.sortOrder),
    };
  }

  if (input.collectionKey === "brands") {
    return {
      accent: input.accent || null,
      category: input.category || null,
      country: input.country || null,
      feature: input.feature,
      featureCaption: input.featureCaption || null,
      year: parseYear(input.year),
    };
  }

  if (input.collectionKey === "milestones") {
    return {
      aboutOnly: input.aboutOnly,
      brand: input.brand || null,
      country: input.country || null,
      year: parseYear(input.year),
    };
  }

  if (input.collectionKey === "contact-page") {
    return {
      backgroundImageSlug: input.imageAlt ? input.slug : null,
      headline: input.title,
      intro: input.summary || null,
      mapQuery: input.mapQuery || null,
    };
  }

  if (input.collectionKey === "contact-form") {
    return {
      inquiryTypes: parseStringList(input.usageTags),
      maxMessageLength: parseNumber(input.positions),
      recipientEmail: input.email || null,
      submitLabel: input.cta || null,
      successMessage: input.summary || input.body || null,
    };
  }

  if (input.collectionKey === "contact-channels") {
    return {
      cta: input.cta || null,
      external: input.feature,
      href: input.href || null,
      kind: input.kind || null,
      secondary: input.subtitle || null,
      sortOrder: parseNumber(input.sortOrder),
    };
  }

  if (input.collectionKey === "contact-submissions") {
    return {
      company: input.brand || null,
      country: input.country || null,
      email: input.email || null,
      emailNotificationStatus: input.emailNotificationStatus || null,
      inquiryType: input.inquiryType || null,
      name: input.name || null,
      receivedAt: input.receivedAt || null,
      submissionStatus: input.submissionStatus || "new",
    };
  }

  if (input.collectionKey === "jobs") {
    return {
      applyEmail: input.applyEmail || null,
      deadline: input.deadline || null,
      department: input.department || null,
      employmentType: input.employmentType || null,
      href: input.href || null,
      location: input.location || null,
      positions: parseNumber(input.positions),
      sortOrder: parseNumber(input.sortOrder),
      workMode: input.workMode || null,
    };
  }

  if (input.collectionKey === "image-library") {
    return {
      brand: input.brand || null,
      category: input.category || null,
      credit: input.credit || input.country || null,
      feature: input.feature,
      objectPosition: input.objectPosition || null,
      pageSection: input.pageSection || "shared",
      placement: input.placement || null,
      productName: input.productName || null,
      ratio: parseNumber(input.ratio),
      shelfWeight: input.shelfWeight || null,
      sortOrder: parseNumber(input.sortOrder),
      usageTags: parseStringList(input.usageTags),
    };
  }

  return {
    role: input.role || null,
  };
}

function getSubtitle(input: RichfieldContentMutationInput) {
  if (input.collectionKey === "articles") return input.category || null;
  if (input.collectionKey === "brands") return input.category || null;
  if (input.collectionKey === "milestones") return input.country || null;
  if (input.collectionKey === "contact-page") return "Contact";
  if (input.collectionKey === "contact-form") return "External project form";
  if (input.collectionKey === "contact-channels") return input.subtitle || null;
  if (input.collectionKey === "contact-submissions") return input.email || null;
  if (input.collectionKey === "jobs") return input.location || null;
  if (input.collectionKey === "image-library") return input.pageSection || null;
  return input.role || null;
}

const LOCALIZABLE_PROFILE_KEYS: Partial<
  Record<RichfieldAdminCollectionKey, string[]>
> = {
  articles: ["category"],
  brands: ["category", "featureCaption"],
  "contact-channels": ["cta", "secondary"],
  "contact-form": ["inquiryTypes", "submitLabel", "successMessage"],
  "contact-page": ["headline", "intro"],
  "image-library": ["category", "credit", "productName"],
  jobs: ["department", "employmentType", "location", "workMode"],
  leadership: ["role"],
};

function buildLocalizedProfileData(input: RichfieldContentMutationInput) {
  const profileData = buildProfileData(input);
  const keys = LOCALIZABLE_PROFILE_KEYS[input.collectionKey] ?? [];
  return Object.fromEntries(
    keys.map((key) => [key, (profileData as Record<string, unknown>)[key] ?? null]),
  );
}

function buildLocalizationMetadata(
  input: RichfieldContentMutationInput,
  current: RichfieldAdminContentItem | null,
) {
  const existingMetadata = current?.metadata ?? {};
  const existingLocalization = readRecord(
    existingMetadata.richfieldLocalization,
  );
  const existingLocales = readRecord(existingLocalization.locales);
  const sharedGallery =
    input.collectionKey === "articles"
      ? input.gallery.map(({ id, url }) => ({ id, url }))
      : existingMetadata.richfieldGallery;
  const variant = {
    body: input.body,
    bodyContent: input.bodyContent,
    gallery:
      input.collectionKey === "articles"
        ? input.gallery.map(({ alt, caption, id }) => ({ alt, caption, id }))
        : undefined,
    imageAlt: input.imageAlt,
    profileData: buildLocalizedProfileData(input),
    status: input.status,
    subtitle: getSubtitle(input),
    summary: input.summary,
    summaryContent: input.summaryContent,
    title: input.title,
    richTextVersion: 1,
  };

  return {
    ...existingMetadata,
    richfieldGallery: sharedGallery,
    richfieldLocalization: {
      defaultLocale: "en",
      locales: {
        ...existingLocales,
        [input.locale]: variant,
      },
      sourceLocale:
        typeof existingLocalization.sourceLocale === "string"
          ? existingLocalization.sourceLocale
          : input.locale,
      supportedLocales: ["en", "vi"],
      version: 1,
    },
  };
}

function buildSharedProfileData(
  input: RichfieldContentMutationInput,
  current: RichfieldAdminContentItem | null,
) {
  const next = buildProfileData(input) as Record<string, unknown>;

  if (input.locale === "en" || !current) return next;

  for (const key of LOCALIZABLE_PROFILE_KEYS[input.collectionKey] ?? []) {
    next[key] = current.profileData[key] ?? null;
  }

  return next;
}

function buildEntryPayload(
  collectionId: string,
  input: RichfieldContentMutationInput,
  current: RichfieldAdminContentItem | null = null,
) {
  const metadata = buildLocalizationMetadata(input, current);
  const locales = readRecord(
    readRecord(metadata.richfieldLocalization).locales,
  );
  const statuses = Object.values(locales).map((value) =>
    normalizeRichfieldContentStatus(readString(readRecord(value), "status")),
  );
  const aggregateStatus: RichfieldContentStatus = statuses.includes("published")
    ? "published"
    : statuses.includes("scheduled")
      ? "scheduled"
      : statuses.every((status) => status === "archived")
        ? "archived"
        : "draft";
  const preserveCore = input.locale !== "en" && current;

  return {
    collection_id: collectionId,
    metadata: metadata as never,
    profile_data: buildSharedProfileData(input, current) as never,
    slug: input.slug,
    status: aggregateStatus,
    subtitle: preserveCore ? current.subtitle || null : getSubtitle(input),
    summary:
      preserveCore
        ? current.summary || null
        : input.collectionKey === "contact-channels"
        ? input.summary || null
        : input.collectionKey === "jobs"
          ? input.summary || null
          : input.collectionKey === "image-library"
            ? input.imageAlt || input.summary || null
            : input.summary || null,
    title: preserveCore ? current.title || input.title : input.title,
  };
}

function buildBlockPayload(entryId: string, input: RichfieldContentMutationInput) {
  return {
    block_type: "markdown",
    content: {
      json: input.bodyContent,
      markdown: input.body,
      richTextVersion: 1,
    } as never,
    entry_id: entryId,
    sort_order: 0,
    title: "Bio",
  };
}

async function saveBodyBlock({
  client,
  entryId,
  input,
  item,
  workspaceId,
}: {
  client: RichfieldCrudClient;
  entryId: string;
  input: RichfieldContentMutationInput;
  item: RichfieldAdminContentItem | null;
  workspaceId: string;
}) {
  if (
    input.collectionKey !== "articles" &&
    input.collectionKey !== "jobs" &&
    input.collectionKey !== "leadership" &&
    input.collectionKey !== "contact-form" &&
    input.collectionKey !== "contact-page" &&
    input.collectionKey !== "contact-submissions"
  ) return;

  // Non-default locale bodies live in the entry localization envelope. The
  // legacy Markdown block remains the English/backward-compatible mirror.
  if (input.locale !== "en") return;

  const payload =
    input.collectionKey === "leadership"
      ? buildBlockPayload(entryId, input)
      : {
          block_type: "markdown",
          content: {
            json: input.bodyContent ?? input.summaryContent,
            markdown: input.body || input.summary,
            richTextVersion: 1,
          } as never,
          entry_id: entryId,
          sort_order: 0,
          title:
            input.collectionKey === "contact-page"
              ? "Intro"
              : input.collectionKey === "contact-form"
                ? "Success message"
              : input.collectionKey === "contact-submissions"
                ? "Message"
                : "Body",
        };

  if (item?.blockId) {
    await client.updateBlock(workspaceId, item.blockId, payload);
    return;
  }

  if (input.body) {
    await client.createBlock(workspaceId, payload);
  }
}

async function uploadImageFile(
  client: RichfieldCrudClient,
  workspaceId: string,
  input: RichfieldContentMutationInput,
) {
  if (!input.imageFile) return null;

  return client.uploadAssetFile(workspaceId, input.imageFile, {
    collectionType: RICHFIELD_ADMIN_COLLECTIONS[input.collectionKey].collectionSlug,
    entrySlug: input.slug,
    upsert: true,
  });
}

function buildImageAssetPayload({
  entryId,
  input,
  upload,
}: {
  entryId: string;
  input: RichfieldContentMutationInput;
  upload?: { path: string } | null;
}) {
  const metadata: Record<string, string | number | null> = {};
  metadata.placement = "cover";

  if (input.imageFile) {
    metadata.contentType = input.imageFile.type || null;
    metadata.filename = input.imageFile.name;
    metadata.size = input.imageFile.size;
  }

  return {
    alt_text: input.imageAlt || `${input.title} image`,
    asset_type: "image",
    block_id: null,
    entry_id: entryId,
    metadata,
    sort_order: 0,
    source_url: null,
    storage_path: upload?.path ?? null,
  };
}

async function saveImageAsset({
  client,
  entryId,
  input,
  item,
  workspaceId,
}: {
  client: RichfieldCrudClient;
  entryId: string;
  input: RichfieldContentMutationInput;
  item: RichfieldAdminContentItem | null;
  workspaceId: string;
}) {
  if (
    input.collectionKey === "milestones" ||
    input.collectionKey === "contact-channels" ||
    input.collectionKey === "contact-submissions"
  ) return;

  if (input.removeImage && item?.imageAssetId) {
    await client.deleteAsset(workspaceId, item.imageAssetId);
    return;
  }

  if (!input.imageFile) {
    if (item?.imageAssetId && input.imageAlt !== item.imageAlt) {
      await client.updateAsset(workspaceId, item.imageAssetId, {
        ...buildImageAssetPayload({ entryId, input, upload: null }),
        storage_path: item.imageStoragePath,
      });
    }

    return;
  }

  const upload = await uploadImageFile(client, workspaceId, input);
  const payload = buildImageAssetPayload({ entryId, input, upload });

  if (upload) {
    if (item?.imageAssetId) {
      await client.updateAsset(workspaceId, item.imageAssetId, payload);
      return;
    }

    await client.createAsset(workspaceId, payload);
  }
}

async function finalizeMutation(
  client: RichfieldCrudClient,
  workspaceId: string,
  collectionKey: RichfieldAdminCollectionKey,
  entryId: string | null,
): Promise<MutationResult> {
  const studio = (await client.getStudio(workspaceId)) as RichfieldAdminStudioPayload;
  const items = readRichfieldAdminContent(studio, collectionKey);
  revalidateRichfieldContent();

  return {
    item: entryId ? items.find((contentItem) => contentItem.id === entryId) ?? null : null,
    items,
  };
}

export async function createRichfieldContentItem(
  client: RichfieldCrudClient,
  workspaceId: string,
  collectionKey: RichfieldAdminCollectionKey,
  input: RichfieldContentMutationInput,
  options?: MutationOptions,
): Promise<MutationResult> {
  await reportProgress(options, {
    label: "Preparing section",
    percent: 8,
    step: "prepare-section",
  });
  const { collection } = await ensureContentCollection(client, workspaceId, collectionKey);
  await reportProgress(options, {
    label: "Saving details",
    percent: 24,
    step: "save-details",
  });
  const created = await client.createEntry(
    workspaceId,
    buildEntryPayload(String(collection.id), input),
  );
  let entryId = readCreatedEntryId(created);

  if (!entryId) {
    const studio = (await client.getStudio(workspaceId)) as RichfieldAdminStudioPayload;
    entryId = findItemBySlug(studio, collectionKey, input.slug)?.id ?? null;
  }

  if (!entryId) {
    throw new Error("The item was saved, but it could not be opened.");
  }

  await reportProgress(options, {
    label: input.imageFile ? "Uploading image" : "Checking image",
    percent: 52,
    step: "save-image",
  });
  const item = null;
  await saveImageAsset({ client, entryId, input, item, workspaceId });
  await reportProgress(options, {
    label:
      collectionKey === "leadership" ||
      collectionKey === "contact-page" ||
      collectionKey === "contact-submissions"
        ? "Saving words"
        : "Saving page details",
    percent: 68,
    step: "save-copy",
  });
  await saveBodyBlock({ client, entryId, input, item, workspaceId });
  await reportProgress(options, {
    label: "Saving visibility",
    percent: 84,
    step: "save-visibility",
  });

  await reportProgress(options, {
    label: "Refreshing dashboard",
    percent: 94,
    step: "refresh-dashboard",
  });
  return finalizeMutation(client, workspaceId, collectionKey, entryId);
}

export async function updateRichfieldContentItem(
  client: RichfieldCrudClient,
  workspaceId: string,
  collectionKey: RichfieldAdminCollectionKey,
  entryId: string,
  input: RichfieldContentMutationInput,
  options?: MutationOptions,
): Promise<MutationResult> {
  await reportProgress(options, {
    label: "Preparing section",
    percent: 8,
    step: "prepare-section",
  });
  const { collection, studio } = await ensureContentCollection(client, workspaceId, collectionKey);
  const current = findItemById(studio, collectionKey, entryId);

  if (!current) {
    throw new Error("Item not found.");
  }

  await reportProgress(options, {
    label: "Saving details",
    percent: 24,
    step: "save-details",
  });
  await client.updateEntry(
    workspaceId,
    entryId,
    buildEntryPayload(String(collection.id), input, current),
  );
  await reportProgress(options, {
    label: input.imageFile ? "Uploading image" : "Checking image",
    percent: 52,
    step: "save-image",
  });
  await saveImageAsset({ client, entryId, input, item: current, workspaceId });
  await reportProgress(options, {
    label:
      collectionKey === "leadership" ||
      collectionKey === "contact-page" ||
      collectionKey === "contact-submissions"
        ? "Saving words"
        : "Saving page details",
    percent: 68,
    step: "save-copy",
  });
  await saveBodyBlock({ client, entryId, input, item: current, workspaceId });
  await reportProgress(options, {
    label: "Saving visibility",
    percent: 84,
    step: "save-visibility",
  });

  await reportProgress(options, {
    label: "Refreshing dashboard",
    percent: 94,
    step: "refresh-dashboard",
  });
  return finalizeMutation(client, workspaceId, collectionKey, entryId);
}

export async function deleteRichfieldContentItem(
  client: RichfieldCrudClient,
  workspaceId: string,
  collectionKey: RichfieldAdminCollectionKey,
  entryId: string,
): Promise<MutationResult> {
  const studio = (await client.getStudio(workspaceId)) as RichfieldAdminStudioPayload;
  const current = findItemById(studio, collectionKey, entryId);

  if (!current) {
    throw new Error("Item not found.");
  }

  const referencedEditorMedia =
    collectionKey === "articles"
      ? findReferencedEditorMediaRecords(studio, current)
      : [];

  if (current.imageAssetId) {
    await client.deleteAsset(workspaceId, current.imageAssetId);
  }

  await client.deleteEntry(workspaceId, entryId);

  for (const media of referencedEditorMedia) {
    try {
      for (const assetId of media.assetIds) {
        await client.deleteAsset(workspaceId, assetId);
      }
      await client.deleteEntry(workspaceId, media.entryId);
    } catch (error) {
      console.error("Failed to clean up article editor media", {
        entryId: media.entryId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return finalizeMutation(client, workspaceId, collectionKey, null);
}

export async function refreshRichfieldAdminContent(
  accessToken: string,
  collectionKey: RichfieldAdminCollectionKey,
  locale: "en" | "vi" = "en",
) {
  const collectionSlug =
    RICHFIELD_ADMIN_COLLECTIONS[collectionKey].collectionSlug;
  const studio = await getRichfieldAdminCollectionStudio(
    accessToken,
    collectionSlug,
  );
  return readRichfieldAdminContent(studio, collectionKey, locale);
}
