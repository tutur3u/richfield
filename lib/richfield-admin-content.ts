import type { ExternalProjectsClient } from "tuturuuu/external-projects";
import {
  RICHFIELD_ADMIN_COLLECTIONS,
  readRichfieldAdminContent,
  type RichfieldAdminCollectionKey,
  type RichfieldAdminContentItem,
  type RichfieldAdminStudioPayload,
  type RichfieldContentMutationInput,
} from "./richfield-admin-content-model";
import {
  createRichfieldExternalProjectsClient,
  revalidateRichfieldContent,
} from "./richfield-admin-api";
import { getRichfieldWorkspaceId } from "./richfield-config";
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
      deadline: input.deadline || null,
      href: input.href || null,
      location: input.location || null,
      positions: parseNumber(input.positions),
      sortOrder: parseNumber(input.sortOrder),
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
  if (input.collectionKey === "brands") return input.category || null;
  if (input.collectionKey === "milestones") return input.country || null;
  if (input.collectionKey === "contact-page") return "Contact";
  if (input.collectionKey === "contact-channels") return input.subtitle || null;
  if (input.collectionKey === "contact-submissions") return input.email || null;
  if (input.collectionKey === "jobs") return input.location || null;
  if (input.collectionKey === "image-library") return input.pageSection || null;
  return input.role || null;
}

function buildEntryPayload(collectionId: string, input: RichfieldContentMutationInput) {
  return {
    collection_id: collectionId,
    metadata: {},
    profile_data: buildProfileData(input),
    slug: input.slug,
    status: input.status,
    subtitle: getSubtitle(input),
    summary:
      input.collectionKey === "contact-channels"
        ? input.summary || null
        : input.collectionKey === "jobs"
          ? input.summary || null
          : input.collectionKey === "image-library"
            ? input.imageAlt || input.summary || null
            : input.summary || null,
    title: input.title,
  };
}

function buildBlockPayload(entryId: string, input: RichfieldContentMutationInput) {
  return {
    block_type: "markdown",
    content: {
      markdown: input.body,
    },
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
    input.collectionKey !== "leadership" &&
    input.collectionKey !== "contact-page" &&
    input.collectionKey !== "contact-submissions"
  ) return;

  const payload =
    input.collectionKey === "leadership"
      ? buildBlockPayload(entryId, input)
      : {
          block_type: "markdown",
          content: {
            markdown: input.body || input.summary,
          },
          entry_id: entryId,
          sort_order: 0,
          title: input.collectionKey === "contact-page" ? "Intro" : "Message",
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
    input.collectionKey === "contact-submissions" ||
    input.collectionKey === "jobs"
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
  await client.updateEntry(workspaceId, entryId, buildEntryPayload(String(collection.id), input));
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

  if (current.imageAssetId) {
    await client.deleteAsset(workspaceId, current.imageAssetId);
  }

  await client.deleteEntry(workspaceId, entryId);
  return finalizeMutation(client, workspaceId, collectionKey, null);
}

export async function refreshRichfieldAdminContent(
  accessToken: string,
  collectionKey: RichfieldAdminCollectionKey,
) {
  const workspaceId = getRichfieldWorkspaceId();
  const client = createRichfieldExternalProjectsClient(accessToken);
  const studio = await client.getStudio(workspaceId);
  revalidateRichfieldContent();
  return readRichfieldAdminContent(studio as RichfieldAdminStudioPayload, collectionKey);
}
