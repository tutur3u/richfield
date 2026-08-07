import {
  createRichfieldExternalProjectsClient,
  getRichfieldAdminSession,
} from "@/lib/richfield-admin-api";
import { deleteRichfieldContentItem, updateRichfieldContentItem } from "@/lib/richfield-admin-content";
import { createRichfieldContentMutationStream } from "@/lib/richfield-admin-content-stream";
import {
  parseRichfieldContentFormData,
  resolveRichfieldAdminCollectionKey,
} from "@/lib/richfield-admin-content-model";
import { getRichfieldWorkspaceId } from "@/lib/richfield-config";
import { richfieldPublicPathsFor } from "@/lib/richfield-public-routes";
import { revalidateAndWarmRichfieldContent } from "@/lib/richfield-revalidation";
import { after, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function readErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed";
}

async function readParams(context: { params: Promise<{ collection: string; entryId: string }> }) {
  const { collection, entryId } = await context.params;

  return {
    collectionKey: resolveRichfieldAdminCollectionKey(collection),
    entryId,
  };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ collection: string; entryId: string }> },
) {
  const session = await getRichfieldAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionKey, entryId } = await readParams(context);

  if (!collectionKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { errors, input } = parseRichfieldContentFormData(collectionKey, await request.formData());

    if (!input) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const client = createRichfieldExternalProjectsClient(session.accessToken);
    const workspaceId = getRichfieldWorkspaceId();

    // Scheduled from the handler itself rather than from deep inside the
    // mutation: `after` guarantees the invalidation runs in a request scope
    // Next still owns, once the save response is done.
    after(() =>
      revalidateAndWarmRichfieldContent(
        richfieldPublicPathsFor(collectionKey, input.slug),
      ),
    );

    return createRichfieldContentMutationStream({
      fallback: "Content request failed",
      run: (onProgress) =>
        updateRichfieldContentItem(client, workspaceId, collectionKey, entryId, input, {
          onProgress,
        }),
    });
  } catch (error) {
    return NextResponse.json({ error: readErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ collection: string; entryId: string }> },
) {
  const session = await getRichfieldAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionKey, entryId } = await readParams(context);

  if (!collectionKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const result = await deleteRichfieldContentItem(
      createRichfieldExternalProjectsClient(session.accessToken),
      getRichfieldWorkspaceId(),
      collectionKey,
      entryId,
    );

    // The entry's own page is gone, so only the index routes are warmed.
    after(() =>
      revalidateAndWarmRichfieldContent(richfieldPublicPathsFor(collectionKey)),
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: readErrorMessage(error) }, { status: 500 });
  }
}
