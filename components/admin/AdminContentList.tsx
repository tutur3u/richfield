"use client";

import {
  FunnelSimple,
  ImagesSquare,
  MagnifyingGlass,
  NewspaperClipping,
  Plus,
  SortAscending,
  X,
} from "@phosphor-icons/react";
import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  contentKeys,
  fetchContentPage,
  type RichfieldContentPage,
} from "@/lib/admin/content-queries";
import {
  defaultContentSort,
  isDefaultContentListOptions,
  type ContentCompletenessFilter,
  type ContentFeatureFilter,
  type ContentSort,
  type ContentStatusFilter,
} from "@/lib/admin/content-list-options";
import type { RichfieldAdminCollectionKey } from "@/lib/richfield-admin-content-model";
import { SkeletonBlock, SkeletonLine } from "./RichfieldAdminSkeleton";
import { AdminContentItemCard } from "./AdminContentItemCard";

/** Debounce so typing a search term does not fire a request per keystroke. */
function useDebounced(value: string, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

/**
 * Load the next page when the sentinel scrolls into view.
 *
 * A visible "Load more" button is kept as well rather than relying on the
 * observer alone: keyboard users never scroll the sentinel into view, and an
 * observer that silently fails leaves the list looking truncated with no way
 * forward.
 */
function useInfiniteScroll(
  onLoadMore: () => void,
  { enabled }: { enabled: boolean },
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Kept in a ref so the observer is not torn down and rebuilt every render,
  // but written in an effect rather than during render — mutating a ref while
  // rendering is not safe under React 19's compiler.
  const callbackRef = useRef(onLoadMore);

  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!(enabled && sentinel) || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          callbackRef.current();
        }
      },
      // Start fetching before the sentinel is actually on screen, so the next
      // rows are usually there by the time the reader reaches them.
      { rootMargin: "320px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}

/**
 * Searchable, infinitely-scrolling list for one collection.
 *
 * Replaces rendering an entire collection on tab open: pages arrive as the
 * editor scrolls, and searching narrows server-side so a large collection stays
 * usable rather than becoming a wall of rows.
 */
export function AdminContentList({
  collectionKey,
  emptyHint,
  initialPage,
  onOpen,
  selectedId,
  title,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  emptyHint: string;
  initialPage?: RichfieldContentPage;
  onOpen: (id: string | null) => void;
  selectedId?: string | null;
  title: string;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ContentSort>(() => defaultContentSort(collectionKey));
  const [statusFilter, setStatusFilter] = useState<ContentStatusFilter>("all");
  const [featureFilter, setFeatureFilter] = useState<ContentFeatureFilter>("all");
  const [completenessFilter, setCompletenessFilter] =
    useState<ContentCompletenessFilter>("all");
  const locale = useLocale() === "vi" ? "vi" : "en";
  const t = useTranslations("admin.common");
  const debouncedSearch = useDebounced(search);
  const searchId = useId();
  const isInitialQuery = isDefaultContentListOptions(
    {
      completeness: completenessFilter,
      featured: featureFilter,
      search: debouncedSearch,
      sort,
      status: statusFilter,
    },
    collectionKey,
  );

  // Generics are spelled out: the query key is a readonly tuple, which stops
  // TanStack inferring the page shape and leaves `lastPage` as unknown.
  const query = useInfiniteQuery<
    RichfieldContentPage,
    Error,
    InfiniteData<RichfieldContentPage>,
    ReturnType<typeof contentKeys.list>,
    number
  >({
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    // The server-rendered page only belongs to the default query. Reusing it
    // for a newly selected filter or sort makes that new cache entry look
    // fresh and can leave the old rows visible until the global stale window
    // expires.
    initialData: initialPage && isInitialQuery
      ? { pageParams: [1], pages: [initialPage] }
      : undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchContentPage({
        collectionKey,
        locale,
        page: pageParam,
        search: debouncedSearch,
        sort,
        status: statusFilter,
        featured: featureFilter,
        completeness: completenessFilter,
        signal,
      }),
    queryKey: contentKeys.list(
      collectionKey,
      debouncedSearch,
      locale,
      sort,
      statusFilter,
      featureFilter,
      completenessFilter,
    ),
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );
  const total = query.data?.pages[0]?.total ?? 0;
  const isGallery = collectionKey === "image-library";
  const isNews = collectionKey === "articles";
  const hasFilters =
    statusFilter !== "all" ||
    featureFilter !== "all" ||
    completenessFilter !== "all";

  const sentinelRef = useInfiniteScroll(
    () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        void query.fetchNextPage();
      }
    },
    { enabled: query.hasNextPage && !query.isFetching },
  );

  return (
    <section className="grid min-w-0 gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-admin-ink-soft">
            {query.isPending
              ? t("loading")
              : t(debouncedSearch ? "itemsFound" : "items", { count: total })}
          </p>
        </div>
        <button
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-admin-navy px-4 text-xs font-bold text-white transition hover:bg-admin-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold"
          onClick={() => onOpen(null)}
          type="button"
        >
          <Plus aria-hidden size={15} weight="bold" />
          <span>{t("addNew")}</span>
        </button>
      </header>

      <div className="relative">
        <label className="sr-only" htmlFor={searchId}>
          {t("search", { title })}
        </label>
        <MagnifyingGlass
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-admin-ink-soft"
          size={18}
        />
        <input
          className="min-h-12 w-full rounded-xl border border-admin-rule bg-admin-surface py-3 pl-11 pr-4 text-sm text-admin-ink shadow-[0_1px_0_rgb(12_31_52_/_0.03)] outline-none placeholder:text-admin-ink-soft/65 focus:border-admin-gold focus:ring-3 focus:ring-admin-gold/10"
          id={searchId}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("search", { title })}
          type="search"
          value={search}
        />
      </div>

      {isNews ? (
        <div className="grid gap-3 rounded-2xl border border-admin-rule bg-admin-panel p-3 shadow-[0_1px_0_rgb(12_31_52_/_0.03)] lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.8fr))_auto] lg:items-end">
          <ListSelect
            icon={<SortAscending aria-hidden size={17} />}
            label={t("sortBy")}
            onChange={(value) => setSort(value as ContentSort)}
            options={[
              ["created-desc", t("sortCreatedNewest")],
              ["created-asc", t("sortCreatedOldest")],
              ["published-desc", t("sortPublishedNewest")],
              ["published-asc", t("sortPublishedOldest")],
              ["title-asc", t("sortTitleAsc")],
              ["title-desc", t("sortTitleDesc")],
            ]}
            value={sort}
          />
          <ListSelect
            icon={<FunnelSimple aria-hidden size={17} />}
            label={t("filterStatus")}
            onChange={(value) => setStatusFilter(value as ContentStatusFilter)}
            options={[
              ["all", t("allStatuses")],
              ["published", t("live")],
              ["draft", t("draft")],
              ["scheduled", t("scheduled")],
              ["archived", t("hidden")],
            ]}
            value={statusFilter}
          />
          <ListSelect
            label={t("filterFeature")}
            onChange={(value) => setFeatureFilter(value as ContentFeatureFilter)}
            options={[
              ["all", t("allStories")],
              ["featured", t("featuredOnly")],
              ["standard", t("standardOnly")],
            ]}
            value={featureFilter}
          />
          <ListSelect
            label={t("filterTranslation")}
            onChange={(value) =>
              setCompletenessFilter(value as ContentCompletenessFilter)
            }
            options={[
              ["all", t("allTranslations")],
              ["complete", t("translationComplete")],
              ["missing", t("translationMissing")],
            ]}
            value={completenessFilter}
          />
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-admin-rule px-3 text-xs font-bold text-admin-ink transition hover:border-admin-gold disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!hasFilters}
            onClick={() => {
              setStatusFilter("all");
              setFeatureFilter("all");
              setCompletenessFilter("all");
            }}
            type="button"
          >
            <X aria-hidden size={14} weight="bold" />
            {t("clearFilters")}
          </button>
        </div>
      ) : null}

      {query.isError ? (
        <div className="rounded-xl border border-red-300/60 bg-red-50/60 p-4" role="alert">
          <p className="text-sm text-ink">
            {query.error instanceof Error
              ? query.error.message
              : t("tryAgain")}
          </p>
          <button
            className="button-secondary mt-3"
            onClick={() => void query.refetch()}
            type="button"
          >
            {t("tryAgain")}
          </button>
        </div>
      ) : null}

      {query.isPending ? (
        <div aria-busy="true" className="grid gap-2">
          <span className="sr-only">{t("loading")}</span>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className="grid gap-2 rounded-xl border border-admin-rule bg-admin-surface p-4"
              key={`content-skeleton-${index}`}
            >
              <div className="flex items-center justify-between gap-4">
                <SkeletonLine className="h-4" width="46%" />
                <SkeletonBlock className="h-5 w-14" />
              </div>
              <SkeletonLine width="68%" />
            </div>
          ))}
        </div>
      ) : null}

      {!query.isPending && items.length === 0 && !query.isError ? (
        <div className="grid min-h-52 place-items-center rounded-2xl border border-admin-rule bg-admin-surface px-6 py-9 text-center shadow-[0_1px_0_rgb(12_31_52_/_0.03)]">
          <div className="grid max-w-md justify-items-center">
            <span className="mb-5 grid size-12 place-items-center rounded-full bg-admin-gold/12 text-admin-copper">
              {isGallery ? (
                <ImagesSquare aria-hidden size={24} />
              ) : (
                <NewspaperClipping aria-hidden size={24} />
              )}
            </span>
          <p className="font-display text-2xl text-admin-ink">
            {debouncedSearch ? t("nothingMatches") : t("nothingHere")}
          </p>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-6 text-admin-ink-soft">
            {debouncedSearch
              ? t("searchHelp")
              : emptyHint}
          </p>
          {debouncedSearch ? (
            <button
              className="mt-6 min-h-10 rounded-full border border-admin-rule px-4 text-xs font-bold text-admin-ink transition hover:border-admin-gold"
              onClick={() => setSearch("")}
              type="button"
            >
              {t("clearSearch")}
            </button>
          ) : (
            <button
              className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full bg-admin-navy px-4 text-xs font-bold text-white transition hover:bg-admin-copper"
              onClick={() => onOpen(null)}
              type="button"
            >
              <Plus aria-hidden size={15} weight="bold" />
              <span>{t("addFirst")}</span>
            </button>
          )}
          </div>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div
          className={
            isGallery
              ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              : "grid gap-2"
          }
        >
          {items.map((item) => (
            <AdminContentItemCard
              collectionKey={collectionKey}
              item={item}
              key={item.id}
              onOpen={(id) => onOpen(id)}
              selected={item.id === selectedId}
            />
          ))}
        </div>
      ) : null}

      <div aria-hidden ref={sentinelRef} />

      {query.hasNextPage ? (
        <button
          className="button-secondary w-full"
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
          type="button"
        >
          {query.isFetchingNextPage ? t("loading") : t("loadMore")}
        </button>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {query.isFetchingNextPage ? t("loadingMore") : ""}
      </p>
    </section>
  );
}

function ListSelect({
  icon,
  label,
  onChange,
  options,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  options: Array<readonly [string, string]>;
  value: string;
}) {
  const id = useId();

  return (
    <label className="grid min-w-0 gap-1.5" htmlFor={id}>
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-admin-ink-soft">
        {label}
      </span>
      <span className="relative flex items-center">
        {icon ? (
          <span className="pointer-events-none absolute left-3 text-admin-clay">
            {icon}
          </span>
        ) : null}
        <select
          className={`min-h-11 w-full appearance-none rounded-xl border border-admin-rule bg-admin-surface py-2 pr-8 text-sm font-medium text-admin-ink outline-none transition focus:border-admin-gold focus:ring-3 focus:ring-admin-gold/10 ${icon ? "pl-9" : "pl-3"}`}
          id={id}
          onChange={(event) => onChange(event.currentTarget.value)}
          value={value}
        >
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
