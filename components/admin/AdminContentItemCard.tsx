"use client";

import { Image as ImageIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";

function statusTone(status: string) {
  if (status === "published") {
    return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
  }
  if (status === "archived") {
    return "bg-admin-ink/8 text-admin-ink-soft";
  }
  if (status === "scheduled") {
    return "bg-sky-500/12 text-sky-700 dark:text-sky-300";
  }
  return "bg-amber-500/12 text-amber-700 dark:text-amber-300";
}

function GalleryThumbnail({ item }: { item: RichfieldAdminContentItem }) {
  return (
    <span className="relative block aspect-[4/3] overflow-hidden rounded-lg border border-admin-rule bg-admin-parchment">
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
  const galleryMeta = [item.pageSection, item.placement, item.category]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      aria-current={selected ? "true" : undefined}
      className={`group grid w-full text-left transition-all ${
        isGalleryItem ? "gap-3 rounded-2xl p-3" : "gap-1.5 rounded-xl p-4"
      } border ${
        selected
          ? "border-admin-gold bg-admin-gold/[0.08] shadow-[0_0_0_3px_rgb(217_167_91_/_0.08)]"
          : "border-admin-rule bg-admin-surface hover:-translate-y-px hover:border-admin-gold hover:shadow-sm"
      }`}
      onClick={() => onOpen(item.id)}
      type="button"
    >
      {isGalleryItem ? <GalleryThumbnail item={item} /> : null}
      <span className="grid min-w-0 gap-1.5 px-1">
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
          <span className="truncate text-xs text-muted">/{item.slug}</span>
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
