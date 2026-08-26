"use client";

import { Image as ImageIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";

function statusTone(status: string) {
  if (status === "published") return "admin-status-published";
  if (status === "archived") return "admin-status-archived";
  if (status === "scheduled") return "admin-status-scheduled";
  return "admin-status-draft";
}

function ContentThumbnail({
  compact = false,
  item,
}: {
  compact?: boolean;
  item: RichfieldAdminContentItem;
}) {
  return (
    <span
      className={`relative block overflow-hidden rounded-lg border border-admin-rule bg-admin-parchment ${
        compact ? "aspect-[4/3] w-full sm:w-[7.5rem]" : "aspect-[4/3]"
      }`}
    >
      {item.imageUrl ? (
        <Image
          alt={item.imageAlt || ""}
          className="object-cover transition duration-300 group-hover:scale-[1.025]"
          decoding="async"
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={item.imageUrl}
          unoptimized
        />
      ) : (
        <span className="grid size-full place-items-center text-admin-ink-soft">
          <ImageIcon aria-hidden size={28} />
        </span>
      )}
    </span>
  );
}

export function AdminContentItemCard({
  collectionKey,
  item,
  onOpen,
  selected,
}: {
  collectionKey: RichfieldAdminCollectionKey;
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
  const isGalleryItem = collectionKey === "image-library";
  const showEditorialThumbnail = !isGalleryItem && Boolean(item.imageUrl);
  const galleryMeta = [item.pageSection, item.placement, item.category]
    .filter(Boolean)
    .join(" · ");
  const createdLabel = item.createdAt
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(item.createdAt),
      )
    : null;

  return (
    <button
      aria-current={selected ? "true" : undefined}
      className={`group grid w-full text-left transition-all ${
        isGalleryItem
          ? "gap-3 rounded-2xl p-3"
          : showEditorialThumbnail
            ? "gap-3 rounded-xl p-3 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center"
            : "gap-1.5 rounded-xl p-4"
      } border ${
        selected
          ? "border-admin-gold bg-admin-gold/[0.08] shadow-[0_0_0_3px_rgb(217_167_91_/_0.08)]"
          : "border-admin-rule bg-admin-surface hover:-translate-y-px hover:border-admin-gold hover:shadow-sm"
      }`}
      onClick={() => onOpen(item.id)}
      type="button"
    >
      {isGalleryItem ? <ContentThumbnail item={item} /> : null}
      {showEditorialThumbnail ? <ContentThumbnail compact item={item} /> : null}
      <span className={`grid min-w-0 gap-1.5 ${showEditorialThumbnail ? "px-1 py-1" : "px-1"}`}>
        <span className="flex items-start justify-between gap-3">
          <span
            className={`min-w-0 font-display leading-tight text-admin-ink ${
              isGalleryItem ? "line-clamp-2 text-xl" : "text-lg"
            }`}
          >
            {item.title || t("untitled")}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.14em] ${statusTone(
              item.status,
            )}`}
          >
            {statusLabel}
          </span>
        </span>
        {isGalleryItem && galleryMeta ? (
          <span className="truncate text-xs text-admin-ink-soft">
            {galleryMeta}
          </span>
        ) : item.slug ? (
          <span className="truncate text-xs text-admin-ink-soft">/{item.slug}</span>
        ) : null}
        {collectionKey === "articles" && createdLabel ? (
          <span className="text-xs text-admin-ink-soft">
            {t("createdOn", { date: createdLabel })}
          </span>
        ) : null}
        <span className="mt-1 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-admin-ink-soft">
          <span>
            EN · {item.localeStatuses.en === "published" ? t("live") : t("draft")}
          </span>
          <span>
            VI · {item.localeStatuses.vi === "published" ? t("live") : t("draft")}
          </span>
        </span>
      </span>
    </button>
  );
}
