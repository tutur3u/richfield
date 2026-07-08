import {
  createRichfieldExternalProjectsClient,
  getRichfieldAdminSession,
} from "@/lib/richfield-admin-api";
import { createRichfieldContentItem, refreshRichfieldAdminContent } from "@/lib/richfield-admin-content";
import { createRichfieldContentMutationStream } from "@/lib/richfield-admin-content-stream";
import {
  parseRichfieldContentFormData,
  resolveRichfieldAdminCollectionKey,
} from "@/lib/richfield-admin-content-model";
import { getRichfieldWorkspaceId } from "@/lib/richfield-config";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function readErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed";
}

async function readCollectionKey(context: { params: Promise<{ collection: string }> }) {
  const { collection } = await context.params;
  return resolveRichfieldAdminCollectionKey(collection);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const session = await getRichfieldAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collectionKey = await readCollectionKey(context);

  if (!collectionKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const startedAt = performance.now();
    const items = await refreshRichfieldAdminContent(session.accessToken, collectionKey);
    const response = NextResponse.json({ items });
    response.headers.set(
      "Server-Timing",
      `richfield-content-refresh;dur=${Math.max(0, performance.now() - startedAt).toFixed(1)}`,
    );
    return response;
  } catch (error) {
    return NextResponse.json({ error: readErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const session = await getRichfieldAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collectionKey = await readCollectionKey(context);

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

    return createRichfieldContentMutationStream({
      fallback: "Content request failed",
      run: (onProgress) =>
        createRichfieldContentItem(client, workspaceId, collectionKey, input, {
          onProgress,
        }),
    });
  } catch (error) {
    return NextResponse.json({ error: readErrorMessage(error) }, { status: 500 });
  }
}
