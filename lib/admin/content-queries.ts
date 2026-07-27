import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";

export type RichfieldContentPage = {
  items: RichfieldAdminContentItem[];
  nextPage: number | null;
  page: number;
  total: number;
};

export const ADMIN_CONTENT_PAGE_SIZE = 20;

/**
 * One key factory for every content query, so a mutation can invalidate a
 * single collection (`contentKeys.collection(key)`) or everything
 * (`contentKeys.all`) without a caller hand-assembling an array and quietly
 * missing the cache.
 */
export const contentKeys = {
  all: ["admin", "content"] as const,
  collection: (collectionKey: RichfieldAdminCollectionKey) =>
    [...contentKeys.all, collectionKey] as const,
  list: (
    collectionKey: RichfieldAdminCollectionKey,
    search: string,
    locale: "en" | "vi" = "en",
  ) => [...contentKeys.collection(collectionKey), { locale, search }] as const,
};

export async function fetchContentPage({
  collectionKey,
  limit = ADMIN_CONTENT_PAGE_SIZE,
  locale = "en",
  page,
  search,
  signal,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  limit?: number;
  locale?: "en" | "vi";
  page: number;
  search: string;
  signal?: AbortSignal;
}): Promise<RichfieldContentPage> {
  const params = new URLSearchParams({
    limit: String(limit),
    locale,
    page: String(page),
  });

  if (search) {
    params.set("search", search);
  }

  const response = await fetch(
    `/api/admin/content/${encodeURIComponent(collectionKey)}?${params}`,
    { cache: "no-store", signal },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(payload?.error ?? `Could not load ${collectionKey}`);
  }

  const payload = (await response.json()) as Partial<RichfieldContentPage>;

  return {
    items: payload.items ?? [],
    nextPage: payload.nextPage ?? null,
    page: payload.page ?? page,
    total: payload.total ?? payload.items?.length ?? 0,
  };
}
