import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
  RichfieldContentStatus,
} from "@/lib/richfield-admin-content-model";

export const CONTENT_SORTS = [
  "created-desc",
  "created-asc",
  "published-desc",
  "published-asc",
  "title-asc",
  "title-desc",
] as const;

export const CONTENT_COMPLETENESS_FILTERS = ["all", "complete", "missing"] as const;
export const CONTENT_FEATURE_FILTERS = ["all", "featured", "standard"] as const;
export const CONTENT_STATUS_FILTERS = [
  "all",
  "published",
  "draft",
  "scheduled",
  "archived",
] as const;

export type ContentSort = (typeof CONTENT_SORTS)[number];
export type ContentCompletenessFilter = (typeof CONTENT_COMPLETENESS_FILTERS)[number];
export type ContentFeatureFilter = (typeof CONTENT_FEATURE_FILTERS)[number];
export type ContentStatusFilter = (typeof CONTENT_STATUS_FILTERS)[number];

export type ContentListOptions = {
  completeness: ContentCompletenessFilter;
  featured: ContentFeatureFilter;
  search: string;
  sort: ContentSort;
  status: ContentStatusFilter;
};

export function defaultContentSort(collectionKey: RichfieldAdminCollectionKey): ContentSort {
  return collectionKey === "articles" ? "created-desc" : "title-asc";
}

export function readContentListOptions(
  searchParams: URLSearchParams,
  collectionKey: RichfieldAdminCollectionKey,
): ContentListOptions {
  return {
    completeness: readAllowed(
      searchParams.get("completeness"),
      CONTENT_COMPLETENESS_FILTERS,
      "all",
    ),
    featured: readAllowed(searchParams.get("featured"), CONTENT_FEATURE_FILTERS, "all"),
    search: (searchParams.get("search") ?? "").trim().toLowerCase(),
    sort: readAllowed(
      searchParams.get("sort"),
      CONTENT_SORTS,
      defaultContentSort(collectionKey),
    ),
    status: readAllowed(searchParams.get("status"), CONTENT_STATUS_FILTERS, "all"),
  };
}

export function applyContentListOptions(
  items: RichfieldAdminContentItem[],
  options: ContentListOptions,
) {
  return items
    .filter((item) => matchesSearch(item, options.search))
    .filter((item) => options.status === "all" || item.status === options.status)
    .filter(
      (item) =>
        options.featured === "all" ||
        item.feature === (options.featured === "featured"),
    )
    .filter(
      (item) =>
        options.completeness === "all" ||
        item.localeComplete === (options.completeness === "complete"),
    )
    .sort(contentComparator(options.sort));
}

function readAllowed<const T extends readonly string[]>(
  value: string | null,
  allowed: T,
  fallback: T[number],
): T[number] {
  return value && allowed.includes(value) ? (value as T[number]) : fallback;
}

function matchesSearch(item: RichfieldAdminContentItem, search: string) {
  if (!search) return true;
  return `${item.title} ${item.slug} ${item.author} ${item.category}`
    .toLowerCase()
    .includes(search);
}

function contentComparator(sort: ContentSort) {
  return (left: RichfieldAdminContentItem, right: RichfieldAdminContentItem) => {
    if (sort === "title-asc" || sort === "title-desc") {
      const result = left.title.localeCompare(right.title, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sort === "title-asc" ? result : -result;
    }

    const field = sort.startsWith("published") ? "publishedAt" : "createdAt";
    const direction = sort.endsWith("asc") ? 1 : -1;
    const leftTime = dateValue(left[field]);
    const rightTime = dateValue(right[field]);

    if (leftTime !== rightTime) return (leftTime - rightTime) * direction;
    return left.title.localeCompare(right.title, undefined, { sensitivity: "base" });
  };
}

function dateValue(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isContentStatus(value: string): value is RichfieldContentStatus {
  return CONTENT_STATUS_FILTERS.slice(1).includes(value as RichfieldContentStatus);
}
