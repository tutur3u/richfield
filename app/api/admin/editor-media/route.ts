import {
  createRichfieldExternalProjectsClient,
  getRichfieldAdminCollectionStudio,
  getRichfieldAdminSession,
} from "@/lib/richfield-admin-api";
import { getRichfieldWorkspaceId } from "@/lib/richfield-config";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 12 * 1024 * 1024;

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readId(value: unknown) {
  const record = readRecord(value);
  const id = record.id ?? readRecord(record.entry).id ?? readRecord(record.asset).id;
  return typeof id === "string" && id ? id : null;
}

export async function POST(request: Request) {
  const session = await getRichfieldAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image." }, { status: 400 });
  }
  if (
    !file.type.startsWith("image/") &&
    !/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file.name)
  ) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "Choose an image smaller than 12 MB." },
      { status: 400 },
    );
  }

  try {
    const client = createRichfieldExternalProjectsClient(session.accessToken);
    const workspaceId = getRichfieldWorkspaceId();
    const studio = await getRichfieldAdminCollectionStudio(
      session.accessToken,
      "image-library",
    );
    const collection = studio.collections.find(
      (item) =>
        item.slug === "image-library" ||
        item.collection_type === "image-library",
    );
    if (!collection?.id) {
      throw new Error("The media library is not ready.");
    }

    const mediaKey = crypto.randomUUID();
    const slug = `editor-media-${mediaKey}`;
    const createdEntry = await client.createEntry(workspaceId, {
      collection_id: String(collection.id),
      metadata: { editorMedia: true, richfieldMediaVersion: 1 },
      profile_data: { pageSection: "article", placement: "editor-media" },
      slug,
      status: "published",
      subtitle: "Article media",
      summary: null,
      title: file.name.replace(/\.[^.]+$/, "") || "Article image",
    });
    let entryId = readId(createdEntry);
    if (!entryId) {
      const refreshed = await getRichfieldAdminCollectionStudio(
        session.accessToken,
        "image-library",
      );
      entryId =
        refreshed.entries.find((entry) => entry.slug === slug)?.id?.toString() ??
        null;
    }
    if (!entryId) throw new Error("The media record could not be created.");

    const upload = await client.uploadAssetFile(workspaceId, file, {
      collectionType: "image-library",
      entrySlug: slug,
      upsert: true,
    });
    const createdAsset = await client.createAsset(workspaceId, {
      alt_text: file.name.replace(/\.[^.]+$/, ""),
      asset_type: "image",
      block_id: null,
      entry_id: entryId,
      metadata: {
        contentType: file.type || null,
        filename: file.name,
        placement: "editor-media",
        size: file.size,
      },
      sort_order: 0,
      source_url: null,
      storage_path: upload.path,
    });
    let assetId = readId(createdAsset);
    if (!assetId) {
      const refreshed = await getRichfieldAdminCollectionStudio(
        session.accessToken,
        "image-library",
      );
      assetId =
        refreshed.assets.find(
          (asset) =>
            (asset.entry_id === entryId || asset.entryId === entryId) &&
            (asset.storage_path === upload.path ||
              asset.storagePath === upload.path),
        )?.id?.toString() ?? null;
    }
    if (!assetId) throw new Error("The uploaded image could not be linked.");

    return NextResponse.json({
      id: mediaKey,
      url: client.getAssetUrl(workspaceId, assetId),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The image could not be uploaded.",
      },
      { status: 500 },
    );
  }
}
