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

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/**
 * Page the response rather than returning a whole collection at once.
 *
 * The dashboard rendered every entry the moment a tab opened, which is fine at
 * a dozen and unusable at a few hundred. Paging keeps the payload — and the
 * amount of DOM the browser builds up front — bounded, and lets the list fill
 * in as the editor scrolls.
 */
function readPageParams(request: Request) {
  const url = new URL(request.url);
  const page = Number.parseInt(url.searchParams.get("page") ?? "", 10);
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();

  return {
    limit: Number.isFinite(limit)
      ? Math.min(Math.max(limit, 1), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    locale: url.searchParams.get("locale") === "vi" ? "vi" as const : "en" as const,
    search,
  };
}

function matchesSearch(
  item: { slug?: string | null; title?: string | null },
  search: string,
) {
  if (!search) return true;

  return `${item.title ?? ""} ${item.slug ?? ""}`.toLowerCase().includes(search);
}

export async function GET(
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
    const startedAt = performance.now();
    const { limit, locale, page, search } = readPageParams(request);
    const allItems = await refreshRichfieldAdminContent(
      session.accessToken,
      collectionKey,
      locale,
    );
    const filtered = search
      ? allItems.filter((item) => matchesSearch(item, search))
      : allItems;
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);
    const payload = {
      items,
      // Null rather than page + 1 at the end, so the client gets an explicit
      // stop signal instead of inferring one from a short page.
      nextPage: offset + items.length < filtered.length ? page + 1 : null,
      page,
      total: filtered.length,
    };
    const serializedBytes = new TextEncoder().encode(
      JSON.stringify(payload),
    ).byteLength;
    const response = NextResponse.json(payload);
    response.headers.set(
      "Server-Timing",
      [
        `richfield-content-refresh;dur=${Math.max(0, performance.now() - startedAt).toFixed(1)}`,
        `richfield-content-payload;desc="${serializedBytes} bytes"`,
      ].join(", "),
    );
    response.headers.set("X-Richfield-Payload-Bytes", String(serializedBytes));
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
