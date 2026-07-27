"use client";

import {
  MagnifyingGlass,
  NewspaperClipping,
  Plus,
} from "@phosphor-icons/react";
import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
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
  if (status === "archived") return "bg-ink/8 text-muted";
  return "bg-gold/18 text-gold-strong";
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
  const t = useTranslations("admin.common");
  const statusLabel =
    item.status === "published"
      ? t("live")
      : item.status === "archived"
        ? t("hidden")
        : item.status === "scheduled"
          ? t("scheduled")
          : t("draft");

  return (
    <button
      aria-current={selected ? "true" : undefined}
      className={`grid w-full gap-1.5 rounded-xl border p-4 text-left transition-all ${
        selected
          ? "border-admin-gold bg-admin-gold/[0.08] shadow-[0_0_0_3px_rgb(217_167_91_/_0.08)]"
          : "border-admin-rule bg-admin-surface hover:-translate-y-px hover:border-admin-gold hover:shadow-sm"
      }`}
      onClick={() => onOpen(item.id)}
      type="button"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-display text-lg leading-tight text-admin-ink">
          {item.title || t("untitled")}
        </span>
        <span
          className={`shrink-0 px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.14em] ${statusTone(
            item.status,
          )}`}
        >
          {statusLabel}
        </span>
      </span>
      {item.slug ? (
        <span className="truncate text-xs text-muted">/{item.slug}</span>
      ) : null}
      <span className="mt-1 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-admin-ink-soft">
        <span>EN · {item.localeStatuses.en === "published" ? t("live") : t("draft")}</span>
        <span>VI · {item.localeStatuses.vi === "published" ? t("live") : t("draft")}</span>
      </span>
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
  const locale = useLocale() === "vi" ? "vi" : "en";
  const t = useTranslations("admin.common");
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
    initialData: initialPage
      ? { pageParams: [1], pages: [initialPage] }
      : undefined,
    queryFn: ({ pageParam, signal }) =>
      fetchContentPage({
        collectionKey,
        locale,
        page: pageParam,
        search: debouncedSearch,
        signal,
      }),
    queryKey: contentKeys.list(collectionKey, debouncedSearch, locale),
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
        <div className="grid min-h-64 place-items-center rounded-2xl border border-admin-rule bg-admin-surface px-6 py-10 text-center shadow-[0_1px_0_rgb(12_31_52_/_0.03)]">
          <div className="grid max-w-md justify-items-center">
            <span className="mb-5 grid size-12 place-items-center rounded-full bg-admin-gold/12 text-admin-copper">
              <NewspaperClipping aria-hidden size={24} />
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
        <div className="grid gap-2">
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
          {query.isFetchingNextPage ? t("loading") : t("loadMore")}
        </button>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {query.isFetchingNextPage ? t("loadingMore") : ""}
      </p>
    </section>
  );
}
