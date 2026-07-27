"use client";

import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  contentKeys,
  fetchContentPage,
  type RichfieldContentPage,
} from "@/lib/admin/content-queries";
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";
import { SkeletonBlock, SkeletonLine } from "./RichfieldAdminSkeleton";

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

function statusTone(status: string) {
  if (status === "published") return "bg-green/12 text-forest";
  if (status === "archived") return "bg-admin-ink-soft/12 text-admin-ink-soft";
  return "bg-admin-gold/18 text-admin-copper-dark";
}

function statusLabel(status: string) {
  if (status === "published") return "Live";
  if (status === "archived") return "Hidden";
  return "Draft";
}

function ContentRow({
  item,
  onOpen,
  selected,
}: {
  item: RichfieldAdminContentItem;
  onOpen: (id: string) => void;
  selected: boolean;
}) {
  return (
    <button
      aria-current={selected ? "true" : undefined}
      className={`grid w-full gap-1.5 border p-4 text-left transition-colors ${
        selected
          ? "border-admin-clay bg-admin-clay/8"
          : "border-admin-rule bg-white/45 hover:border-admin-rule-strong hover:bg-white/75"
      }`}
      onClick={() => onOpen(item.id)}
      type="button"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-display text-lg leading-tight text-admin-navy">
          {item.title || "Untitled"}
        </span>
        <span
          className={`shrink-0 px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.14em] ${statusTone(
            item.status,
          )}`}
        >
          {statusLabel(item.status)}
        </span>
      </span>
      {item.slug ? (
        <span className="truncate text-xs text-admin-ink-soft">/{item.slug}</span>
      ) : null}
    </button>
  );
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
  onOpen,
  selectedId,
  title,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  emptyHint: string;
  onOpen: (id: string | null) => void;
  selectedId?: string | null;
  title: string;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search);
  const searchId = useId();

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
    queryFn: ({ pageParam, signal }) =>
      fetchContentPage({
        collectionKey,
        page: pageParam,
        search: debouncedSearch,
        signal,
      }),
    queryKey: contentKeys.list(collectionKey, debouncedSearch),
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );
  const total = query.data?.pages[0]?.total ?? 0;

  const sentinelRef = useInfiniteScroll(
    () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        void query.fetchNextPage();
      }
    },
    { enabled: query.hasNextPage && !query.isFetching },
  );

  return (
    <section className="grid min-w-0 gap-4">
      <header className="grid gap-3 sm:flex sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-tight text-admin-navy">
            {title}
          </h2>
          <p className="mt-1 text-sm text-admin-ink-soft">
            {query.isPending
              ? "Loading…"
              : `${total} ${total === 1 ? "item" : "items"}${
                  debouncedSearch ? " found" : ""
                }`}
          </p>
        </div>
        <button
          className="button-primary shrink-0"
          onClick={() => onOpen(null)}
          type="button"
        >
          Add new
        </button>
      </header>

      <div className="grid gap-1.5">
        <label className="sr-only" htmlFor={searchId}>
          Search {title}
        </label>
        <input
          className="min-h-11 w-full border border-admin-rule bg-white/70 px-3 text-sm text-admin-ink placeholder:text-admin-ink-soft/70 focus:border-admin-clay focus:outline-none"
          id={searchId}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          type="search"
          value={search}
        />
      </div>

      {query.isError ? (
        <div className="border border-red-300/60 bg-red-50/60 p-4" role="alert">
          <p className="text-sm text-admin-ink">
            {query.error instanceof Error
              ? query.error.message
              : "Something went wrong."}
          </p>
          <button
            className="button-secondary mt-3"
            onClick={() => void query.refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : null}

      {query.isPending ? (
        <div aria-busy="true" className="grid gap-3">
          <span className="sr-only">Loading {title}…</span>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className="grid gap-2 border border-admin-rule bg-white/45 p-4"
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
        <div className="border border-dashed border-admin-rule-strong bg-white/40 p-8 text-center">
          <p className="font-display text-xl text-admin-navy">
            {debouncedSearch ? "Nothing matches that search" : "Nothing here yet"}
          </p>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-6 text-admin-ink-soft">
            {debouncedSearch
              ? "Try a different word, or clear the search to see everything."
              : emptyHint}
          </p>
          {debouncedSearch ? (
            <button
              className="button-secondary mt-4"
              onClick={() => setSearch("")}
              type="button"
            >
              Clear search
            </button>
          ) : (
            <button
              className="button-primary mt-4"
              onClick={() => onOpen(null)}
              type="button"
            >
              Add the first one
            </button>
          )}
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="grid gap-2.5">
          {items.map((item) => (
            <ContentRow
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
          {query.isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {query.isFetchingNextPage ? "Loading more items" : ""}
      </p>
    </section>
  );
}
