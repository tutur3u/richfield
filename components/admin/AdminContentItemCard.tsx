"use client";

import { Image as ImageIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
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

function responseTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "sent" || normalized === "closed") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (normalized === "failed") return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300";
  if (normalized === "read") return "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
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
  const locale = useLocale() === "vi" ? "vi-VN" : "en-US";
  const statusLabel =
    item.status === "published"
      ? t("live")
      : item.status === "archived"
        ? t("hidden")
        : item.status === "scheduled"
          ? t("scheduled")
          : t("draft");
  const isGalleryItem = collectionKey === "image-library";
  const isResponse = collectionKey === "contact-submissions";
  const showEditorialThumbnail = !isGalleryItem && Boolean(item.imageUrl);
  const galleryMeta = [item.pageSection, item.placement, item.category]
    .filter(Boolean)
    .join(" · ");
  const createdLabel = (isResponse ? item.receivedAt || item.createdAt : item.createdAt)
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(new Date(isResponse ? item.receivedAt || item.createdAt : item.createdAt))
    : null;

  if (isResponse) {
    const sender = item.name || item.email || t("untitled");
    const meta = [item.brand, item.email, item.inquiryType].filter(Boolean).join(" · ");
    return (
      <button
        aria-current={selected ? "true" : undefined}
        className={`group grid w-full gap-3 rounded-2xl border p-4 text-left transition-all sm:grid-cols-[minmax(0,1fr)_auto] ${selected ? "border-admin-gold bg-admin-gold/[0.08] shadow-[0_0_0_3px_rgb(217_167_91_/_0.08)]" : "border-admin-rule bg-admin-surface hover:-translate-y-px hover:border-admin-gold hover:shadow-sm"}`}
        onClick={() => onOpen(item.id)}
        type="button"
      >
        <span className="grid min-w-0 gap-2">
          <span className="font-display text-xl leading-tight text-admin-ink">{sender}</span>
          {meta ? <span className="truncate text-sm text-admin-ink-soft">{meta}</span> : null}
          {item.body ? <span className="line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-admin-ink-soft">{item.body}</span> : null}
        </span>
        <span className="flex flex-wrap items-start gap-2 sm:max-w-52 sm:justify-end">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${responseTone(item.submissionStatus)}`}>{item.submissionStatus || t("responseNew")}</span>
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${responseTone(item.emailNotificationStatus)}`}>{item.emailNotificationStatus || t("deliveryPending")}</span>
          {createdLabel ? <span className="basis-full text-right text-xs text-admin-ink-soft">{createdLabel}</span> : null}
        </span>
      </button>
    );
  }

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
