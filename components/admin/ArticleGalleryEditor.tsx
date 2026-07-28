"use client";

import {
  ArrowDown,
  ArrowUp,
  ImageSquare,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { RichfieldArticleGalleryItem } from "@/lib/richfield-admin-content-model";
import {
  convertImageToWebp,
  MAX_ADMIN_IMAGE_UPLOAD_BYTES,
} from "./AdminContentHelpers";
import { adminFetch } from "./richfield-admin-session-client";

function parseGallery(value: string) {
  try {
    const parsed = JSON.parse(value) as RichfieldArticleGalleryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ArticleGalleryEditor({
  disabled,
  onChange,
  value,
}: {
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  const t = useTranslations("admin.form.gallery");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const items = useMemo(() => parseGallery(value), [value]);
  const [uploading, setUploading] = useState(false);

  const commit = (next: RichfieldArticleGalleryItem[]) => {
    onChange(JSON.stringify(next));
  };

  const update = (
    id: string,
    field: "alt" | "caption",
    nextValue: string,
  ) => {
    commit(
      items.map((item) =>
        item.id === id ? { ...item, [field]: nextValue } : item,
      ),
    );
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    if (!item) return;
    next.splice(target, 0, item);
    commit(next);
  };

  const upload = async (file: File) => {
    if (file.size > MAX_ADMIN_IMAGE_UPLOAD_BYTES) {
      throw new Error(t("tooLarge", { name: file.name }));
    }
    const optimized = await convertImageToWebp(file);
    const body = new FormData();
    body.set("file", optimized);
    const response = await adminFetch("/api/admin/editor-media", {
      body,
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as {
      id?: string;
      error?: string;
      url?: string;
    } | null;
    if (!response.ok || !payload?.url) {
      throw new Error(payload?.error || t("uploadError"));
    }
    return {
      alt: file.name.replace(/\.[^.]+$/, ""),
      caption: "",
      id: payload.id ?? crypto.randomUUID(),
      url: payload.url,
    } satisfies RichfieldArticleGalleryItem;
  };

  const selectImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) uploaded.push(await upload(file));
      commit([...items, ...uploaded]);
      toast.success(t("uploaded", { count: uploaded.length }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("uploadError"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-4 rounded-xl border border-admin-rule bg-admin-panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-admin-ink">{t("title")}</h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-admin-ink-soft">
            {t("description")}
          </p>
        </div>
        <Button
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus aria-hidden data-icon="inline-start" />
          {uploading ? t("uploading") : t("add")}
        </Button>
        <input
          accept="image/*"
          className="hidden"
          disabled={disabled || uploading}
          multiple
          onChange={(event) => void selectImages(event)}
          ref={inputRef}
          type="file"
        />
      </div>

      {items.length === 0 ? (
        <button
          className="grid min-h-40 place-items-center rounded-lg border border-dashed border-admin-rule-strong bg-admin-surface px-6 text-center transition hover:border-admin-accent disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <span>
            <ImageSquare
              aria-hidden
              className="mx-auto text-admin-accent"
              size={28}
            />
            <span className="mt-3 block text-sm font-semibold text-admin-ink">
              {t("empty")}
            </span>
            <span className="mt-1 block text-xs text-admin-ink-soft">
              {t("emptyHint")}
            </span>
          </span>
        </button>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <div
              className="grid gap-3 rounded-lg border border-admin-rule bg-admin-surface p-3 sm:grid-cols-[8rem_minmax(0,1fr)_auto]"
              key={item.id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={item.alt || ""}
                className="aspect-[4/3] w-full rounded-md object-cover"
                src={item.url}
              />
              <div className="grid min-w-0 gap-2">
                <input
                  aria-label={t("alt")}
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-admin-ink outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50"
                  disabled={disabled}
                  onChange={(event) =>
                    update(item.id, "alt", event.currentTarget.value)
                  }
                  placeholder={t("alt")}
                  value={item.alt}
                />
                <input
                  aria-label={t("caption")}
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-admin-ink outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50"
                  disabled={disabled}
                  onChange={(event) =>
                    update(item.id, "caption", event.currentTarget.value)
                  }
                  placeholder={t("caption")}
                  value={item.caption}
                />
              </div>
              <div className="flex items-start gap-1 sm:flex-col">
                <Button
                  aria-label={t("moveUp")}
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <ArrowUp aria-hidden />
                </Button>
                <Button
                  aria-label={t("moveDown")}
                  disabled={disabled || index === items.length - 1}
                  onClick={() => move(index, 1)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <ArrowDown aria-hidden />
                </Button>
                <Button
                  aria-label={t("remove")}
                  className="text-destructive"
                  disabled={disabled}
                  onClick={() =>
                    commit(items.filter((entry) => entry.id !== item.id))
                  }
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash aria-hidden />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
